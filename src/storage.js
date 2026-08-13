// Drop-in replacement for the Claude-artifact-only `window.storage` API.
//
// - shared = true  -> goes to the Netlify Function, backed by Netlify Blobs,
//                      so every visitor to the site reads/writes the SAME data.
// - shared = false  -> stays in this browser's localStorage (used only for
//                      "which email is signed in on this device").
//
// Call signatures match window.storage exactly, so the rest of the app
// (App.jsx) barely had to change.

const FUNCTION_URL = "/.netlify/functions/storage";

async function callFunction(action, key, value) {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, key, value }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Storage request failed (${res.status}): ${text}`);
  }
  return res.json();
}

export const storage = {
  async get(key, shared = false) {
    if (!shared) {
      const value = window.localStorage.getItem(key);
      return value === null ? null : { key, value, shared: false };
    }
    const data = await callFunction("get", key);
    if (!data.found) return null;
    return { key, value: data.value, shared: true };
  },

  async set(key, value, shared = false) {
    if (!shared) {
      window.localStorage.setItem(key, value);
      return { key, value, shared: false };
    }
    await callFunction("set", key, value);
    return { key, value, shared: true };
  },

  async delete(key, shared = false) {
    if (!shared) {
      window.localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    }
    await callFunction("delete", key);
    return { key, deleted: true, shared: true };
  },

  async list(prefix = "", shared = false) {
    if (!shared) {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      return { keys, prefix, shared: false };
    }
    const data = await callFunction("list", prefix);
    return { keys: data.keys || [], prefix, shared: true };
  },
};
