import { getStore } from "@netlify/blobs";

function store() {
  return getStore("bcdl-it-requisition");
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { action, key, value } = body || {};

  try {
    if (action === "get") {
      if (!key) throw new Error("Missing key");
      const val = await store().get(key);
      return json({ found: val !== null && val !== undefined, value: val ?? null });
    }

    if (action === "set") {
      if (!key) throw new Error("Missing key");
      await store().set(key, value ?? "");
      return json({ ok: true });
    }

    if (action === "delete") {
      if (!key) throw new Error("Missing key");
      await store().delete(key);
      return json({ ok: true });
    }

    if (action === "list") {
      const prefix = key || "";
      const { blobs } = await store().list({ prefix });
      return json({ keys: blobs.map((b) => b.key) });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: String(err && err.message ? err.message : err) }, 500);
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/.netlify/functions/storage" };
