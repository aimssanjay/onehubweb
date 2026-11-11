import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, ExternalLink, FileText, Image as ImageIcon, Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../services/api';
import { compressImage } from '../utils/compressImage';

type SavedMediaKitFile = { id: string; url: string; serverId: string | null };
type PendingMediaKitFile = { id: string; file: File; preview: string | null };

const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
// The live server (nginx) currently refuses request bodies over ~1 MB. All files go up
// together in one request (the API saves the set as a whole), so images are compressed
// to share what is left of that 1 MB after the PDFs. PDFs go up as they are.
const SERVER_LIMIT_BYTES = 950 * 1024;
const MIN_IMAGE_BUDGET_BYTES = 120 * 1024;

// Shrink an image step by step until it fits the given size
const fitImageToBudget = async (file: File, budget: number): Promise<File> => {
  if (file.size <= budget) return file;
  let smallest = file;
  for (const [maxDim, quality] of [[2000, 0.85], [1600, 0.78], [1400, 0.72], [1200, 0.66], [1000, 0.6], [800, 0.55]] as const) {
    const compressed = await compressImage(file, maxDim, quality);
    if (compressed.size < smallest.size) smallest = compressed;
    if (compressed.size <= budget) return compressed;
  }
  return smallest;
};

const formatMb = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
const ACCEPT = 'application/pdf,image/*';

// Find the media kit anywhere in the profile: any key like media_kit, mediaKits,
// influencer_media_kits... (also inside nested records such as influencer_profile)
const MEDIA_KIT_KEY = /media[_-]?kits?$/i;
const findMediaKitSource = (node: any, depth = 0): any => {
  if (!node || typeof node !== 'object' || depth > 3) return undefined;
  for (const [key, value] of Object.entries(node)) {
    if (MEDIA_KIT_KEY.test(key) && value != null && value !== '') return value;
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const found = findMediaKitSource(value, depth + 1);
      if (found !== undefined) return found;
    }
  }
  return undefined;
};

// Media kit entries come as {id, file_path} objects or plain URLs (sometimes a JSON string)
const extractMediaKitFiles = (profile: any): SavedMediaKitFile[] => {
  let source = findMediaKitSource(profile);
  if (typeof source === 'string' && source.trim().startsWith('[')) {
    try {
      source = JSON.parse(source);
    } catch {
      // keep as a single URL string
    }
  }
  const list = Array.isArray(source) ? source : source ? [source] : [];
  return list
    .map((item: any, index: number) => {
      const url =
        typeof item === 'string'
          ? item
          : item?.file_path ?? item?.url ?? item?.file_url ?? item?.media_kit ?? item?.path ?? '';
      const serverId = item?.id ?? item?.media_kit_id ?? null;
      return { id: String(serverId ?? `kit-${index}`), url: String(url).trim(), serverId: serverId != null ? String(serverId) : null };
    })
    .filter((item) => item.url);
};

const isPdf = (nameOrUrl: string) => /\.pdf($|\?)/i.test(nameOrUrl);


interface MediaKitCardProps {
  profile: any;
}

export function MediaKitCard({ profile }: MediaKitCardProps) {
  const [saved, setSaved] = useState<SavedMediaKitFile[]>([]);
  const [pending, setPending] = useState<PendingMediaKitFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pendingPdfBytes = pending
    .filter((p) => !p.file.type.startsWith('image/'))
    .reduce((sum, p) => sum + p.file.size, 0);

  // Sync from the profile only when its media kit actually changes. The dashboard
  // re-renders the profile after unrelated saves with an older media kit, which
  // must not overwrite files that were just uploaded.
  const profileFiles = useMemo(() => extractMediaKitFiles(profile), [profile]);
  const profileFilesKey = profileFiles.map((f) => f.url).join('|');
  useEffect(() => {
    setSaved(profileFiles);
  }, [profileFilesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [preview, setPreview] = useState<{ url: string; pdf: boolean; revoke: boolean } | null>(null);
  // 'checking' while we confirm a saved PDF still exists on Cloudinary, 'missing' if it does not
  const [previewState, setPreviewState] = useState<'ready' | 'checking' | 'missing'>('ready');
  const openPreview = (url: string, pdf: boolean, revoke = false) => {
    setPreview({ url, pdf, revoke });
    if (!pdf || url.startsWith('blob:')) {
      setPreviewState('ready');
      return;
    }
    // An iframe cannot report a 404, so check the file first (Cloudinary allows CORS)
    setPreviewState('checking');
    fetch(url, { method: 'HEAD' })
      .then((res) => setPreviewState(res.ok ? 'ready' : 'missing'))
      .catch(() => setPreviewState('ready'));
  };
  const closePreview = () => {
    if (preview?.revoke) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };
  useEffect(() => {
    if (!preview) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [preview]); // eslint-disable-line react-hooks/exhaustive-deps

  // Free image previews when they leave the pending list
  useEffect(() => () => pending.forEach((item) => item.preview && URL.revokeObjectURL(item.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const addFiles = (files: FileList | File[]) => {
    const accepted: PendingMediaKitFile[] = [];
    Array.from(files).forEach((file) => {
      const allowed = file.type === 'application/pdf' || file.type.startsWith('image/');
      if (!allowed) {
        toast.error(`${file.name}: only PDF or image files are allowed`);
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} is larger than ${MAX_FILE_MB} MB`);
        return;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      });
    });
    setPending((prev) => [...prev, ...accepted.filter((a) => !prev.some((p) => p.id === a.id))]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  // Re-read the saved media kit so the list matches the database after an upload
  const reloadSavedFromProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/influencers/get-profile`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setSaved(extractMediaKitFiles(result.data));
        return true;
      }
    } catch {
      // fall back to the upload response
    }
    return false;
  };

  // Remove one saved file. Endpoint name to be confirmed by the API developer:
  // DELETE /influencers/delete-mediakit/:id, falling back to POST /influencers/delete-mediakit { id, file_path }
  const handleRemoveSaved = async (item: SavedMediaKitFile) => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }
    setRemovingId(item.id);
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
      let response: Response | null = null;
      if (item.serverId) {
        response = await fetch(`${API_BASE_URL}/influencers/delete-mediakit/${encodeURIComponent(item.serverId)}`, {
          method: 'DELETE',
          headers,
        });
      }
      if (!response || response.status === 404 || response.status === 405) {
        response = await fetch(`${API_BASE_URL}/influencers/delete-mediakit`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ id: item.serverId, media_kit_id: item.serverId, file_path: item.url }),
        });
      }
      const result = await response.json().catch(() => ({}));
      if (response.status === 404 || response.status === 405) {
        toast.error('Removing media kit files is not available on the server yet.');
        return;
      }
      if (!(result.success || response.ok)) {
        toast.error(result.message || `Failed to remove file (${response.status})`);
        return;
      }
      const reloaded = await reloadSavedFromProfile(token);
      if (!reloaded) setSaved((prev) => prev.filter((p) => p.id !== item.id));
      window.dispatchEvent(new Event('influencer-profile-updated'));
      toast.success(result.message || 'File removed from media kit');
    } catch {
      toast.error('Failed to remove file. Please try again.');
    } finally {
      setRemovingId(null);
      setConfirmRemoveId(null);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('influencer_token');
    if (!token) {
      toast.error('Please login again');
      return;
    }
    if (pending.length === 0) return;

    setUploading(true);
    try {
      // Share the request size between files: PDFs as they are, images compressed to fit the rest
      const pdfBytes = pending.filter((p) => !p.file.type.startsWith('image/')).reduce((sum, p) => sum + p.file.size, 0);
      const imageCount = pending.filter((p) => p.file.type.startsWith('image/')).length;
      const imageBudget = imageCount
        ? Math.max(MIN_IMAGE_BUDGET_BYTES, Math.floor((SERVER_LIMIT_BYTES - pdfBytes) / imageCount))
        : 0;
      const files = await Promise.all(
        pending.map((p) => (p.file.type.startsWith('image/') ? fitImageToBudget(p.file, imageBudget) : p.file))
      );
      const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

      const send = (method: 'PUT' | 'POST') => {
        const fd = new FormData();
        files.forEach((file) => fd.append('media_kit', file));
        return fetch(`${API_BASE_URL}/influencers/update-mediakit`, {
          method,
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      };

      let response: Response;
      try {
        response = await send('PUT');
        // Fall back if the route is registered for POST only
        if (response.status === 404 || response.status === 405) response = await send('POST');
      } catch {
        // The server's size rejection has no CORS headers, so it surfaces as a network error
        toast.error(
          totalBytes > SERVER_LIMIT_BYTES
            ? `These files total ${formatMb(totalBytes)}, but the server currently accepts up to 1 MB per upload. Remove a file or use a smaller PDF.`
            : 'Upload failed. Please check your connection and try again.'
        );
        return;
      }

      const result = await response.json().catch(() => ({}));
      if (!(result.success || response.ok)) {
        toast.error(
          response.status === 413
            ? `These files total ${formatMb(totalBytes)}, which is too large for the server right now.`
            : result.message || `Failed to upload media kit (${response.status})`
        );
        return;
      }

      // The response lists the files just saved ({id, file_path}[]). Merge them with the
      // fresh profile so every uploaded file shows even if get-profile lags behind.
      const uploaded = extractMediaKitFiles({ media_kit: result.data });
      await reloadSavedFromProfile(token);
      setSaved((prev) => [
        ...prev,
        ...uploaded.filter((u) => !prev.some((p) => p.url === u.url || (p.serverId && p.serverId === u.serverId))),
      ]);
      pending.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));
      setPending([]);
      window.dispatchEvent(new Event('influencer-profile-updated'));
      toast.success(result.message || `Media kit saved (${files.length} file${files.length > 1 ? 's' : ''})`);
    } catch {
      toast.error('Failed to upload media kit');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col">
      <h3 className="font-bold text-white">Media Kit</h3>
      <p className="text-xs text-gray-400 mt-1">PDF or images · max {MAX_FILE_MB} MB per file</p>

      {(saved.length > 0 || pending.length > 0) && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {saved.map((item, index) => {
            const pdf = isPdf(item.url);
            const confirming = confirmRemoveId === item.id;
            return (
              <div key={item.id} className="group relative h-24 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                <button
                  type="button"
                  onClick={() => openPreview(item.url, pdf)}
                  aria-label={`View media kit ${pdf ? 'PDF' : 'image'} ${index + 1}`}
                  className="flex h-full w-full items-center justify-center"
                >
                  {pdf ? (
                    <span className="flex flex-col items-center gap-1">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500/15">
                        <FileText className="h-5 w-5 text-red-400" />
                      </span>
                      <span className="text-[10px] font-semibold tracking-wide text-gray-400">PDF</span>
                    </span>
                  ) : (
                    <img src={item.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  )}
                </button>

                {!confirming && (
                  <button
                    type="button"
                    onClick={() => setConfirmRemoveId(item.id)}
                    disabled={uploading || removingId !== null}
                    aria-label={`Remove media kit file ${index + 1}`}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/70 text-gray-300 transition-opacity hover:text-red-400 disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {confirming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/80 p-1">
                    <span className="text-[11px] text-white">Remove?</span>
                    <span className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setConfirmRemoveId(null)}
                        disabled={removingId === item.id}
                        className="rounded px-1.5 py-0.5 text-[11px] text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSaved(item)}
                        disabled={removingId === item.id}
                        className="flex items-center gap-1 rounded bg-red-500/80 px-1.5 py-0.5 text-[11px] font-medium text-white hover:bg-red-500 disabled:opacity-60"
                      >
                        {removingId === item.id && <Loader2 className="h-3 w-3 animate-spin" />}
                        Yes
                      </button>
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {pending.map((item, index) => (
            <div key={item.id} className="relative h-24 overflow-hidden rounded-lg border-2 border-dashed border-primary/50 bg-primary/5">
              <button
                type="button"
                onClick={() =>
                  item.preview ? openPreview(item.preview, false) : openPreview(URL.createObjectURL(item.file), true, true)
                }
                aria-label={`View new file ${index + 1}`}
                className="flex h-full w-full items-center justify-center"
              >
                {item.preview ? (
                  <img src={item.preview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500/15">
                      <FileText className="h-5 w-5 text-red-400" />
                    </span>
                    <span className="text-[10px] font-semibold tracking-wide text-gray-400">PDF</span>
                  </span>
                )}
              </button>
              <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                New
              </span>
              <button
                type="button"
                onClick={() => removePending(item.id)}
                disabled={uploading}
                aria-label={`Remove new file ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/70 text-gray-300 hover:text-white disabled:opacity-40"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={`mt-3 flex-1 rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'
        }`}
      >
        <UploadCloud className="mx-auto h-6 w-6 text-gray-500" />
        <p className="mt-1 text-sm text-gray-300">Drag & drop your media kit here</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <FileText className="h-3 w-3" /> PDF <span className="text-gray-600">·</span> <ImageIcon className="h-3 w-3" /> JPG, PNG
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-700 text-white hover:bg-gray-600"
        >
          Choose Files
        </button>
        <input ref={inputRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={handleFileChange} />
      </div>

      {pendingPdfBytes > SERVER_LIMIT_BYTES && (
        <p role="alert" className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          The PDFs selected total {formatMb(pendingPdfBytes)}. The server currently accepts only about 1 MB per upload, so this
          upload will fail until the server limit is raised.
        </p>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || pending.length === 0}
        className={`mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors ${
          uploading || pending.length === 0
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-secondary text-black'
        }`}
      >
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        {uploading ? 'Uploading...' : pending.length > 0 ? `Upload Media Kit (${pending.length})` : 'Upload Media Kit'}
      </button>
      {preview &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Media kit preview"
            onClick={closePreview}
          >
            <div
              className={`relative flex max-h-full w-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl ${
                preview.pdf && previewState === 'ready' ? 'h-[85vh] max-w-4xl' : 'max-w-3xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b border-gray-800 px-4 py-2.5">
                <span className="text-sm font-semibold text-white">Media Kit</span>
                <span className="flex items-center gap-1">
                  {!preview.url.startsWith('blob:') && (
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open in new tab"
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={closePreview}
                    aria-label="Close preview"
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </span>
              </div>
              {previewState === 'checking' ? (
                <div className="flex flex-1 items-center justify-center p-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : previewState === 'missing' ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  </span>
                  <p className="text-sm font-medium text-white">This file is no longer available</p>
                  <p className="max-w-sm text-xs text-gray-400">
                    It could not be found on the file server. Please remove it and upload it again.
                  </p>
                </div>
              ) : preview.pdf ? (
                <iframe src={preview.url} title="Media kit PDF" className="w-full flex-1 bg-white" />
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-2">
                  <img
                    src={preview.url}
                    alt="Media kit"
                    onError={() => setPreviewState('missing')}
                    className="max-h-[78vh] max-w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
