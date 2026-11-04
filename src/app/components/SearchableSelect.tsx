import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  /** Extra search words per option, e.g. { UAE: 'united arab emirates' } */
  searchAliases?: Record<string, string>;
  /** Let the user use what they typed when it isn't in the list */
  allowCustom?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  emptyText?: string;
  className?: string;
  'aria-label'?: string;
}

// Dark-themed searchable dropdown used in the influencer dashboard (country, city, nationality)
export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  searchAliases = {},
  allowCustom = false,
  disabled = false,
  invalid = false,
  emptyText = 'No matches',
  className = '',
  'aria-label': ariaLabel,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return options;
    return options.filter((option) => `${option} ${searchAliases[option] ?? ''}`.toLowerCase().includes(q));
  }, [options, searchAliases, trimmedQuery]);

  const showCustom =
    allowCustom && trimmedQuery !== '' && !options.some((option) => option.toLowerCase() === trimmedQuery.toLowerCase());
  const items = showCustom ? [...filtered, trimmedQuery] : filtered;

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Fresh search and focus each time it opens; start on the current value
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(Math.max(0, options.indexOf(value)));
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (items[activeIndex] !== undefined) choose(items[activeIndex]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-gray-800 px-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${
          invalid ? 'border-red-500' : open ? 'border-primary' : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <span className={`truncate ${value ? 'text-white' : 'text-gray-500'}`}>{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
          <div className="relative border-b border-gray-700">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              role="combobox"
              aria-controls={listId}
              aria-expanded
              aria-autocomplete="list"
              className="h-10 w-full bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          <ul ref={listRef} id={listId} role="listbox" className="max-h-56 overflow-y-auto py-1">
            {items.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">{emptyText}</li>}
            {items.map((option, index) => {
              const isCustom = showCustom && index === items.length - 1;
              const selected = !isCustom && option === value;
              return (
                <li
                  key={`${isCustom ? 'custom:' : ''}${option}`}
                  data-index={index}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(option)}
                  className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm ${
                    index === activeIndex ? 'bg-gray-700 text-white' : 'text-gray-200'
                  }`}
                >
                  <span className="truncate">{isCustom ? <>Use “<strong>{option}</strong>”</> : option}</span>
                  {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
