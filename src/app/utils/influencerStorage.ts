const LEGACY_ANALYTICS_KEY = 'influencer_analytics';
const LEGACY_ANALYTICS_SAVED_KEY = 'influencer_analytics_user_saved';

type InfluencerIdentity = {
  id?: string | number;
  email?: string;
  name?: string;
};

function getInfluencerIdentity(): InfluencerIdentity | null {
  try {
    const raw = localStorage.getItem('influencer_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      id: parsed.id ?? parsed.user_id ?? parsed.influencer_id,
      email: parsed.email,
      name: parsed.name,
    };
  } catch {
    return null;
  }
}

function getInfluencerScope() {
  const identity = getInfluencerIdentity();
  const scope = identity?.id ?? identity?.email ?? identity?.name ?? 'anonymous';
  return String(scope).trim().toLowerCase() || 'anonymous';
}

export function getInfluencerAnalyticsStorageKey() {
  return `${LEGACY_ANALYTICS_KEY}:${getInfluencerScope()}`;
}

export function getInfluencerAnalyticsSavedKey() {
  return `${LEGACY_ANALYTICS_SAVED_KEY}:${getInfluencerScope()}`;
}

// Set right after signup so the dashboard greets a brand-new influencer differently.
// Session-scoped: it lasts until the tab closes or the influencer logs out.
const NEW_SIGNUP_KEY = 'influencer_new_signup';

export function markInfluencerNewSignup() {
  try {
    sessionStorage.setItem(NEW_SIGNUP_KEY, '1');
  } catch {
    // Storage unavailable (e.g. private mode); the dashboard falls back to "Welcome back"
  }
}

export function isInfluencerNewSignup() {
  try {
    return sessionStorage.getItem(NEW_SIGNUP_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearInfluencerClientData() {
  try {
    sessionStorage.removeItem(NEW_SIGNUP_KEY);
  } catch {
    // ignore
  }
  localStorage.removeItem('influencer_token');
  localStorage.removeItem('influencer_user');
  localStorage.removeItem(LEGACY_ANALYTICS_KEY);
  localStorage.removeItem(LEGACY_ANALYTICS_SAVED_KEY);

  // Remove all scoped analytics keys for influencer users.
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (
      key.startsWith(`${LEGACY_ANALYTICS_KEY}:`) ||
      key.startsWith(`${LEGACY_ANALYTICS_SAVED_KEY}:`)
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
