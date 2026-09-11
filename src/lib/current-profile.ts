const STORAGE_KEY = "contas-casa:profile-id";

export function getStoredProfileId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredProfileId(id: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // localStorage indisponível (modo privado, etc.) — sem problema, só perde a lembrança
  }
}

export function clearStoredProfileId() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}
