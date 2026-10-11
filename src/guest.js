// Who is reading the invitation, from their personal link (…/?d=k7m2).
// The code is remembered for the visit so it survives page changes.
import { useSyncExternalStore } from "react";
import { apiEnabled, apiGet } from "./api.js";
import { WEDDING } from "./content.js";

const KEY = "davet-kodu";

function readCode() {
  const fromUrl = new URLSearchParams(location.search).get("d");
  try {
    if (fromUrl) sessionStorage.setItem(KEY, fromUrl);
    return fromUrl || sessionStorage.getItem(KEY) || "";
  } catch {
    return fromUrl || "";
  }
}

let state = { code: readCode(), info: null, loading: false };
const listeners = new Set();
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export async function loadGuest() {
  if (!apiEnabled || !state.code) return;
  set({ loading: true });
  try {
    const info = await apiGet("guest", { code: state.code });
    set({ info: info.error ? null : info, loading: false });
  } catch {
    set({ loading: false });
  }
}
loadGuest();

export const refreshGuest = loadGuest;

export function useGuest() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state
  );
}

// Name to greet: the invite's name, or the older ?misafir=… link.
export const greetingName = (s) => s.info?.isim || WEDDING.guest;

// "sen" for personal invites, "siz" for families (can be overridden per invite).
export const isSen = (s) => s.info?.hitap === "sen";
