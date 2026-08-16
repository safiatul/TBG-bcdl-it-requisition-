import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import { storage } from "./storage.js";
import {
  Plus,
  Settings2,
  Search,
  X,
  Pencil,
  Trash2,
  Check,
  Loader2,
  XCircle,
  CheckCircle2,
  UploadCloud,
  Download,
} from "lucide-react";

const STORAGE_ENTRIES_KEY = "bcdl-itr:entries";
const STORAGE_CONFIG_KEY = "bcdl-itr:config";
const STORAGE_ACCESS_KEY = "bcdl-itr:access";

const DEFAULT_ITEMS = [
  "PC",
  "Laptop",
  "Mouse",
  "Wireless Mouse",
  "Mouse Pad",
  "Tonner",
  "SSD",
  "Keyboard",
  "Graphics Card",
  "HDMI Cable",
  "RAM",
  "LED Monitor",
  "Hard Drive",
  "Portable Hard Disk",
  "Router",
  "Face Machine",
];

const DEFAULT_DEPTS = ["HR", "IT", "Accounts", "Electrical", "Cafe Amazon", "Brand & Marketing", "Golds Gym", "SCD", "Customer Service", "Car parking", "Operation", "Mechanical", "Civil", "Audit"];

const DEFAULT_ALLOWED_EMAILS = [
  { email: "safiatul.islam@bga-bd.com", role: "member" },
  { email: "nasim_ahmed@bga-bd.com", role: "member" },
  { email: "mshahrier.islam@bga-bd.com", role: "member" },
  { email: "rubel-islam@bga-bd.com", role: "member" },
  { email: "sujan-biswas@bga-bd.com", role: "member" },
  { email: "khairul-hasan@bga-bd.com", role: "member" },
  { email: "hasan_ali@bga-bd.com", role: "member" },
];

// Imported from the "BCDL, IT Requisition List" Google Sheet
const DEFAULT_ENTRIES = [
  {
    id: "seed-01",
    prNo: "PR/202606/00002",
    items: ["Tonner"],
    dept: "HR",
    userName: "HR",
    status: "Pending",
    remarks: "A toner can be used for approximately 35 days in a photocopy machine of the Admin department.",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "seed-02",
    prNo: "PR/202606/00024",
    items: ["Hard Drive"],
    dept: "IT",
    userName: "IT",
    status: "Pending",
    remarks: "2TB USB portable HDD for CCTV video footage archive.",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "seed-03",
    prNo: "PR/202606/00043",
    items: ["Tonner"],
    dept: "Accounts",
    userName: "Accounts",
    status: "Pending",
    remarks: "A toner can be used for approximately 35 days in a photocopy machine of the Accounts department.",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "seed-04",
    prNo: "PR/202606/00076",
    items: ["LED Monitor"],
    dept: "IT",
    userName: "IT",
    status: "Pending",
    remarks: "28-inch LED monitor for CIO & DGM, IT dept. Gigabyte KVM M28U 28\" UHD 4K (3840x2160) gaming monitor.",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "seed-05",
    prNo: "PR/202607/00026",
    items: ["Mouse Pad"],
    dept: "IT",
    userName: "IT",
    status: "Pending",
    remarks: "",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-06",
    prNo: "PR/202607/00027",
    items: ["Mouse"],
    dept: "IT",
    userName: "IT",
    status: "Pending",
    remarks: "",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-07",
    prNo: "PR/202607/00028",
    items: ["Mouse", "Laptop"],
    dept: "HR",
    userName: "Admin",
    status: "Pending",
    remarks: "16 GB RAM, 512 GB SSD",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-08",
    prNo: "PR/202607/00040",
    items: ["Wireless Mouse"],
    dept: "HR",
    userName: "Shadat",
    status: "Pending",
    remarks: "",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-09",
    prNo: "PR/202607/00051",
    items: ["Portable Hard Disk"],
    dept: "IT",
    userName: "Hon'ble Chairman's Coordination Team",
    status: "Pending",
    remarks: "6TB capacity.",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-10",
    prNo: "PR/202607/00055",
    items: ["Tonner"],
    dept: "HR",
    userName: "Admin",
    status: "Pending",
    remarks: "Toner Cartridge Canon NPG-59 (Black).",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-11",
    prNo: "PR/202607/00062",
    items: ["Tonner"],
    dept: "Accounts",
    userName: "Accounts",
    status: "Pending",
    remarks: "",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-12",
    prNo: "PR/202608/00004",
    items: ["Tonner"],
    dept: "Electrical",
    userName: "Toner for Electrical, CVC, Transport, Food Court & Mechanical departments",
    status: "Pending",
    remarks: "A toner can be used for approximately 35 days in the printer machines of those departments.",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-13",
    prNo: "PR/202608/00005",
    items: ["Tonner"],
    dept: "Accounts",
    userName: "Accounts",
    status: "Pending",
    remarks:
      "HP Toner 279A x3, HP Toner 76A x4, HP Toner 87A, Toshiba Toner 5018C. A toner can be used for approximately 35 days in a photocopy machine of the Accounts department.",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-14",
    prNo: "PR/202608/00021",
    items: ["Router"],
    dept: "Cafe Amazon",
    userName: "4G Pocket Router for Cafe Amazon",
    status: "Approved",
    remarks: "GP co-branded 4G pocket router, ZTE U10S Pro.",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-15",
    prNo: "PR/202608/00022",
    items: ["PC"],
    dept: "Brand & Marketing",
    userName: "Yasir",
    status: "Pending",
    remarks:
      "Motherboard: Gigabyte Z790 AORUS Elite AX ATX; CPU: Intel Core i7 (14th Gen); RAM: 32GB 6000MHz (16GBx2); GPU: NVIDIA RTX 4060 Ti 16GB; Storage: Samsung 990 Pro 1TB M.2; Cooler: 240/360mm liquid CPU cooler; PSU: 750-850W 80+ Gold.",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-16",
    prNo: "PR/202608/00024",
    items: ["Mouse"],
    dept: "Accounts",
    userName: "Sr. GM Akram",
    status: "Pending",
    remarks: "",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-17",
    prNo: "PR/202607/00014",
    items: ["Face Machine"],
    dept: "Golds Gym",
    userName: "Golds Gym",
    status: "Pending",
    remarks: "ZKTeco Speedface V5L multi-biometric access control terminal with video intercom capability.",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "seed-18",
    prNo: "PR/202608/00009",
    items: ["LED Monitor", "PC", "HDMI Cable", "Graphics Card", "Keyboard", "Mouse", "SSD"],
    dept: "Golds Gym",
    userName: "Golds Gym",
    status: "Pending",
    remarks: "Core i7, 16GB RAM, 512GB SSD.",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-19",
    prNo: "PR/202608/00010",
    items: ["Laptop"],
    dept: "Golds Gym",
    userName: "Golds Gym",
    status: "Pending",
    remarks: "16GB RAM, 512GB SSD.",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
];

const DEFAULT_STATUSES = ["Pending", "Approved", "Handover Done"];

const STATUS_STYLES = {
  Pending: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  Approved: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  "Handover Done": { bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
};

// Cycle of colors for custom statuses an admin adds later (not in STATUS_STYLES above).
const CUSTOM_STATUS_PALETTE = [
  { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500" },
  { bg: "bg-rose-100", text: "text-rose-800", dot: "bg-rose-500" },
  { bg: "bg-cyan-100", text: "text-cyan-800", dot: "bg-cyan-500" },
  { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-500" },
  { bg: "bg-lime-100", text: "text-lime-800", dot: "bg-lime-500" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-800", dot: "bg-fuchsia-500" },
];

function getStatusStyle(status, allStatuses) {
  if (STATUS_STYLES[status]) return STATUS_STYLES[status];
  const idx = Math.max(0, (allStatuses || []).indexOf(status));
  return CUSTOM_STATUS_PALETTE[idx % CUSTOM_STATUS_PALETTE.length];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Permanent owner admin — always has full access, not shown in the Employee Access list,
// and cannot be locked out no matter what the manageable list looks like.
const OWNER_EMAIL = "safiatul.islam@bga-bd.com";

const displayFont = { fontFamily: "'Space Grotesk', sans-serif" };
const monoFont = { fontFamily: "'IBM Plex Mono', monospace" };

function uid() {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return "";
  }
}

function emptyForm() {
  return { prNo: "", items: [], itemModels: {}, dept: "", userName: "", status: "Pending", remarks: "" };
}

function formatItemsDisplay(items, itemModels) {
  const models = itemModels || {};
  return items.map((i) => (models[i] ? `${i} (${models[i]})` : i)).join(", ");
}

function mergeUnique(base, extra) {
  const seen = new Set(base.map((x) => x.toLowerCase()));
  const out = [...base];
  extra.forEach((x) => {
    if (!seen.has(x.toLowerCase())) {
      out.push(x);
      seen.add(x.toLowerCase());
    }
  });
  return out;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [depts, setDepts] = useState(DEFAULT_DEPTS);
  const [statuses, setStatuses] = useState(DEFAULT_STATUSES);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [granted, setGranted] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [gateEmail, setGateEmail] = useState("");
  const [gateError, setGateError] = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterItem, setFilterItem] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [showManage, setShowManage] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      let cfg = null;
      let ent = null;
      let access = null;
      try {
        const res = await storage.get(STORAGE_CONFIG_KEY, true);
        cfg = res ? JSON.parse(res.value) : null;
      } catch (e) {
        cfg = null;
      }
      try {
        const res = await storage.get(STORAGE_ENTRIES_KEY, true);
        ent = res ? JSON.parse(res.value) : null;
      } catch (e) {
        ent = null;
      }
      try {
        const res = await storage.get(STORAGE_ACCESS_KEY, false);
        access = res ? JSON.parse(res.value) : null;
      } catch (e) {
        access = null;
      }
      if (!mounted) return;

      let finalItems, finalDepts, finalEmails, finalStatuses;
      if (cfg && cfg.items && cfg.depts) {
        finalItems = cfg.items;
        finalDepts = cfg.depts;
        finalStatuses = cfg.statuses && cfg.statuses.length ? cfg.statuses : DEFAULT_STATUSES;
        const rawEmails = cfg.allowedEmails || [];
        let migrated = false;
        finalEmails = rawEmails.map((e) => {
          if (typeof e === "string") {
            migrated = true;
            return { email: e, role: "admin" };
          }
          return e;
        });
        if (migrated || !cfg.statuses) {
          try {
            await storage.set(
              STORAGE_CONFIG_KEY,
              JSON.stringify({ items: finalItems, depts: finalDepts, allowedEmails: finalEmails, statuses: finalStatuses }),
              true
            );
          } catch (e) {}
        }
      } else {
        finalItems = DEFAULT_ITEMS;
        finalDepts = DEFAULT_DEPTS;
        finalEmails = DEFAULT_ALLOWED_EMAILS;
        finalStatuses = DEFAULT_STATUSES;
        try {
          await storage.set(
            STORAGE_CONFIG_KEY,
            JSON.stringify({ items: finalItems, depts: finalDepts, allowedEmails: finalEmails, statuses: finalStatuses }),
            true
          );
        } catch (e) {}
      }
      setItems(finalItems);
      setDepts(finalDepts);
      setAllowedEmails(finalEmails);
      setStatuses(finalStatuses);

      let finalEntries;
      if (ent) {
        finalEntries = ent;
      } else {
        finalEntries = DEFAULT_ENTRIES;
        try {
          await storage.set(STORAGE_ENTRIES_KEY, JSON.stringify(finalEntries), true);
        } catch (e) {}
      }
      setEntries(finalEntries);

      if (access && access.email) {
        if (access.email.toLowerCase() === OWNER_EMAIL) {
          setGranted(true);
          setCurrentEmail(access.email);
          setCurrentRole("admin");
        } else if (finalEmails.length === 0) {
          setGranted(true);
          setCurrentEmail(access.email);
          setCurrentRole("admin");
        } else {
          const match = finalEmails.find((e) => e.email === access.email.toLowerCase());
          if (match) {
            setGranted(true);
            setCurrentEmail(access.email);
            setCurrentRole(match.role === "admin" ? "admin" : "member");
          }
        }
      }

      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const persistEntries = useCallback(async (next) => {
    setEntries(next);
    setSaving(true);
    try {
      await storage.set(STORAGE_ENTRIES_KEY, JSON.stringify(next), true);
    } catch (e) {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, []);

  const persistConfig = useCallback(async (nextItems, nextDepts, nextEmails, nextStatuses) => {
    setItems(nextItems);
    setDepts(nextDepts);
    setAllowedEmails(nextEmails);
    setStatuses(nextStatuses);
    setSaving(true);
    try {
      await storage.set(
        STORAGE_CONFIG_KEY,
        JSON.stringify({ items: nextItems, depts: nextDepts, allowedEmails: nextEmails, statuses: nextStatuses }),
        true
      );
    } catch (e) {
      setError("Could not save options. Please try again.");
    } finally {
      setSaving(false);
    }
  }, []);

  async function handleGateSubmit(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const email = gateEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setGateError("Enter a valid work email.");
      return;
    }
    let role = "admin";
    if (email !== OWNER_EMAIL && allowedEmails.length > 0) {
      const match = allowedEmails.find((e) => e.email === email);
      if (!match) {
        setGateError("This email doesn't have access yet. Ask your admin to add it under Manage Options → Employee Access.");
        return;
      }
      role = match.role === "admin" ? "admin" : "member";
    }
    setGateError("");
    setGateSubmitting(true);
    try {
      await storage.set(STORAGE_ACCESS_KEY, JSON.stringify({ email, role, grantedAt: new Date().toISOString() }), false);
    } catch (err) {
      // Non-fatal: access still granted for this session even if the "remember me" write fails.
    }
    setCurrentEmail(email);
    setCurrentRole(role);
    setGranted(true);
    setGateSubmitting(false);
  }

  async function handleSwitchEmail() {
    try {
      await storage.delete(STORAGE_ACCESS_KEY, false);
    } catch (e) {}
    setGranted(false);
    setCurrentEmail(null);
    setCurrentRole(null);
    setGateEmail("");
  }

  function openNew() {
    setFormData(emptyForm());
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(entry) {
    setFormData({
      prNo: entry.prNo,
      items: [...entry.items],
      itemModels: { ...(entry.itemModels || {}) },
      dept: entry.dept,
      userName: entry.userName,
      status: entry.status,
      remarks: entry.remarks || "",
    });
    setEditingId(entry.id);
    setShowForm(true);
  }

  function handleFormChange(field, value) {
    setFormData((f) => ({ ...f, [field]: value }));
  }

  function toggleFormItem(name) {
    setFormData((f) => ({
      ...f,
      items: f.items.includes(name) ? f.items.filter((i) => i !== name) : [...f.items, name],
    }));
  }

  function updateItemModel(name, model) {
    setFormData((f) => ({ ...f, itemModels: { ...f.itemModels, [name]: model } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.prNo.trim() || formData.items.length === 0 || !formData.dept || !formData.userName.trim()) {
      setError("Fill in PR No, at least one Item, Department and User Name.");
      return;
    }
    setError("");
    const prNoLabel = formData.prNo.trim();
    if (editingId) {
      const next = entries.map((en) =>
        en.id === editingId
          ? { ...en, ...formData, prNo: prNoLabel, userName: formData.userName.trim(), updatedAt: new Date().toISOString() }
          : en
      );
      await persistEntries(next);
      setToast(`Request ${prNoLabel} updated`);
    } else {
      const newEntry = {
        id: uid(),
        prNo: prNoLabel,
        items: formData.items,
        itemModels: formData.itemModels,
        dept: formData.dept,
        userName: formData.userName.trim(),
        status: formData.status,
        remarks: formData.remarks.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await persistEntries([newEntry, ...entries]);
      setToast(`Request ${prNoLabel} added`);
    }
    setShowForm(false);
    setFormData(emptyForm());
    setEditingId(null);
  }

  async function handleStatusChange(id, status) {
    const next = entries.map((en) => (en.id === id ? { ...en, status, updatedAt: new Date().toISOString() } : en));
    await persistEntries(next);
  }

  async function handleDelete(id) {
    const next = entries.filter((en) => en.id !== id);
    await persistEntries(next);
    setConfirmDeleteId(null);
  }

  async function addItem(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (items.some((i) => i.toLowerCase() === trimmed.toLowerCase())) return;
    await persistConfig([...items, trimmed], depts, allowedEmails, statuses);
  }

  async function removeItem(name) {
    const inUse = entries.some((en) => en.items.includes(name));
    if (inUse) return;
    await persistConfig(
      items.filter((i) => i !== name),
      depts,
      allowedEmails,
      statuses
    );
  }

  async function addDept(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (depts.some((d) => d.toLowerCase() === trimmed.toLowerCase())) return;
    await persistConfig(items, [...depts, trimmed], allowedEmails, statuses);
  }

  async function removeDept(name) {
    const inUse = entries.some((en) => en.dept === name);
    if (inUse) return;
    await persistConfig(
      items,
      depts.filter((d) => d !== name),
      allowedEmails,
      statuses
    );
  }

  async function addStatus(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (statuses.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    await persistConfig(items, depts, allowedEmails, [...statuses, trimmed]);
  }

  async function removeStatus(name) {
    const inUse = entries.some((en) => en.status === name);
    if (inUse) return;
    if (statuses.length <= 1) return;
    await persistConfig(
      items,
      depts,
      allowedEmails,
      statuses.filter((s) => s !== name)
    );
  }

  async function addAllowedEmail(email, role) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (allowedEmails.some((e) => e.email === trimmed)) return;
    await persistConfig(items, depts, [...allowedEmails, { email: trimmed, role: role === "admin" ? "admin" : "member" }], statuses);
  }

  async function removeAllowedEmail(email) {
    await persistConfig(
      items,
      depts,
      allowedEmails.filter((e) => e.email !== email),
      statuses
    );
  }

  async function toggleAllowedEmailRole(email) {
    const next = allowedEmails.map((e) => (e.email === email ? { ...e, role: e.role === "admin" ? "member" : "admin" } : e));
    await persistConfig(items, depts, next, statuses);
  }

  async function importSheetData() {
    const existingPrNos = new Set(entries.map((en) => en.prNo));
    const toAdd = DEFAULT_ENTRIES.filter((en) => !existingPrNos.has(en.prNo));
    if (toAdd.length === 0) {
      setToast("Sheet data is already imported");
      return;
    }
    let neededItems = [];
    let neededDepts = [];
    toAdd.forEach((en) => {
      neededItems.push(...en.items);
      neededDepts.push(en.dept);
    });
    const nextItems = mergeUnique(items, mergeUnique(DEFAULT_ITEMS, neededItems));
    const nextDepts = mergeUnique(depts, mergeUnique(DEFAULT_DEPTS, neededDepts));
    await persistConfig(nextItems, nextDepts, allowedEmails, statuses);
    await persistEntries([...toAdd, ...entries]);
    setToast(`Imported ${toAdd.length} request${toAdd.length > 1 ? "s" : ""} from the sheet`);
  }

  function exportToExcel(rows, label) {
    if (rows.length === 0) {
      setToast("Nothing to export yet");
      return;
    }
    const data = rows.map((en) => ({
      "PR No": en.prNo,
      Item: formatItemsDisplay(en.items, en.itemModels),
      Department: en.dept,
      "User Name": en.userName,
      Status: en.status,
      Remarks: en.remarks,
      Date: formatDate(en.createdAt),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 20 }, { wch: 28 }, { wch: 16 }, { wch: 22 }, { wch: 14 }, { wch: 50 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "IT Requests");
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `BCDL-IT-Requisition-${stamp}.xlsx`);
    setToast(`Downloaded ${rows.length} ${label || "request"}${rows.length > 1 ? "s" : ""} as Excel`);
  }

  const filtered = useMemo(() => {
    return entries.filter((en) => {
      if (filterDept && en.dept !== filterDept) return false;
      if (filterStatus && en.status !== filterStatus) return false;
      if (filterItem && !en.items.includes(filterItem)) return false;
      if (search) {
        const q = search.toLowerCase();
        const modelText = Object.values(en.itemModels || {}).join(" ");
        const hay = (en.prNo + " " + en.userName + " " + en.remarks + " " + en.items.join(" ") + " " + modelText).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [entries, filterDept, filterStatus, filterItem, search]);

  const stats = useMemo(() => {
    return {
      total: entries.length,
      pending: entries.filter((e) => e.status === "Pending").length,
      approved: entries.filter((e) => e.status === "Approved").length,
      handover: entries.filter((e) => e.status === "Handover Done").length,
    };
  }, [entries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading registry…</span>
        </div>
      </div>
    );
  }

  if (!granted) {
    return (
      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>
          {"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');"}
        </style>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded bg-teal-700 flex items-center justify-center text-white text-xs font-bold" style={monoFont}>
                IT
              </div>
              <h1 className="text-lg font-semibold text-slate-900" style={displayFont}>
                BCDL IT Requisition
              </h1>
            </div>
            <p className="text-sm text-slate-500 mb-5">Sign in with your work email to continue.</p>
            <div className="space-y-3">
              <input
                type="text"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="email"
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGateSubmit(e);
                }}
                placeholder="you@company.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              {gateError && <p className="text-xs text-red-600">{gateError}</p>}
              <button
                type="button"
                onClick={handleGateSubmit}
                disabled={gateSubmitting}
                className="w-full px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {gateSubmitting && <Loader2 size={15} className="animate-spin" />}
                {gateSubmitting ? "Checking…" : "Continue"}
              </button>
              <p className="text-center text-xs text-slate-400">
                {allowedEmails.length === 0
                  ? "Open access — no employee list set yet"
                  : `${allowedEmails.length} employee${allowedEmails.length > 1 ? "s" : ""} currently listed`}
              </p>
            </div>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-400 py-6">© 2026 All rights reserved by BCDL IT</footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>
        {"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');"}
      </style>

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-teal-700 flex items-center justify-center text-white text-xs font-bold" style={monoFont}>
                IT
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight" style={displayFont}>
                BCDL IT Requisition
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Equipment request &amp; handover register · Signed in as{" "}
              <span className="font-medium text-slate-700">{currentEmail}</span>{" "}
              <span
                className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${
                  currentRole === "admin" ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-500"
                }`}
              >
                {currentRole === "admin" ? "Admin" : "Member"}
              </span>{" "}
              <button onClick={handleSwitchEmail} className="text-slate-400 hover:text-teal-700 underline">
                Switch
              </button>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentRole === "admin" && (
              <button
                onClick={() => setShowManage(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                <Settings2 size={16} /> Manage Options
              </button>
            )}
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition"
            >
              <Plus size={16} /> New Request
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Requests" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} accent="amber" />
          <StatCard label="Approved" value={stats.approved} accent="blue" />
          <StatCard label="Handover Done" value={stats.handover} accent="emerald" />
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PR No, user, item, remarks…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">All Departments</option>
            {depts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={filterItem}
            onChange={(e) => setFilterItem(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">All Items</option>
            {items.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {(search || filterDept || filterItem || filterStatus) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterDept("");
                setFilterItem("");
                setFilterStatus("");
              }}
              className="text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
          <button
            onClick={() => exportToExcel(filtered, "request")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 whitespace-nowrap"
            title="Downloads the requests currently shown (respects filters/search)"
          >
            <Download size={15} /> Export to Excel
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-slate-500 text-sm">No requests yet.</p>
                  {currentRole === "admin" && (
                    <button
                      onClick={importSheetData}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-800"
                    >
                      <UploadCloud size={16} /> Import from BCDL IT Requisition sheet
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No requests match your filters.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-medium">PR No</th>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Remarks</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((en) => {
                    const st = getStatusStyle(en.status, statuses);
                    return (
                      <tr key={en.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <span
                            className="inline-block border border-dashed border-slate-300 rounded px-2 py-1 text-xs text-slate-700"
                            style={monoFont}
                          >
                            {en.prNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-xs truncate" title={formatItemsDisplay(en.items, en.itemModels)}>
                          {formatItemsDisplay(en.items, en.itemModels)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{en.dept}</td>
                        <td className="px-4 py-3 text-slate-700">{en.userName}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                            {currentRole === "admin" ? (
                              <select
                                value={en.status}
                                onChange={(e) => handleStatusChange(en.id, e.target.value)}
                                className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-teal-600 ${st.bg} ${st.text}`}
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`text-xs font-medium rounded-full px-2 py-1 ${st.bg} ${st.text}`}>{en.status}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={en.remarks}>
                          {en.remarks || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap" style={monoFont}>
                          {formatDate(en.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {confirmDeleteId === en.id ? (
                              <>
                                <button
                                  onClick={() => handleDelete(en.id)}
                                  className="p-1.5 rounded text-red-600 hover:bg-red-50"
                                  title="Confirm delete"
                                >
                                  <Check size={15} />
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="p-1.5 rounded text-slate-500 hover:bg-slate-100"
                                  title="Cancel"
                                >
                                  <XCircle size={15} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => openEdit(en)} className="p-1.5 rounded text-slate-500 hover:bg-slate-100" title="Edit">
                                  <Pencil size={15} />
                                </button>
                                {currentRole === "admin" && (
                                  <button
                                    onClick={() => setConfirmDeleteId(en.id)}
                                    className="p-1.5 rounded text-slate-500 hover:bg-red-50 hover:text-red-600"
                                    title="Delete"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
          {saving && (
            <>
              <Loader2 size={12} className="animate-spin" /> Saving…
            </>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-6">© 2026 All rights reserved by BCDL IT</footer>

      {showForm && (
        <RequestModal
          formData={formData}
          items={items}
          depts={depts}
          statuses={statuses}
          editingId={editingId}
          currentRole={currentRole}
          onChange={handleFormChange}
          onToggleItem={toggleFormItem}
          onModelChange={updateItemModel}
          onSubmit={handleSubmit}
          error={error}
          onDismissError={() => setError("")}
          onClose={() => {
            setShowForm(false);
            setError("");
          }}
        />
      )}

      {showManage && (
        <ManageModal
          items={items}
          depts={depts}
          statuses={statuses}
          allowedEmails={allowedEmails}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onAddDept={addDept}
          onRemoveDept={removeDept}
          onAddStatus={addStatus}
          onRemoveStatus={removeStatus}
          onAddEmail={addAllowedEmail}
          onRemoveEmail={removeAllowedEmail}
          onToggleRole={toggleAllowedEmailRole}
          onImport={importSheetData}
          error={error}
          onDismissError={() => setError("")}
          onClose={() => setShowManage(false)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentMap = {
    amber: "text-amber-700",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent ? accentMap[accent] : "text-slate-900"}`} style={displayFont}>
        {value}
      </p>
    </div>
  );
}

function RequestModal({ formData, items, depts, statuses, editingId, currentRole, onChange, onToggleItem, onModelChange, onSubmit, onClose, error, onDismissError }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}>
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <h2 className="font-semibold text-slate-900" style={displayFont}>
            {editingId ? "Edit Request" : "New Request"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            {error && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs px-3 py-2">
                <span>{error}</span>
                <button type="button" onClick={onDismissError}>
                  <X size={14} />
                </button>
              </div>
            )}
            <Field label="PR No">
              <input
                value={formData.prNo}
                onChange={(e) => onChange("prNo", e.target.value)}
                placeholder="e.g. PR/202608/00030"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                style={monoFont}
              />
            </Field>
            <Field label={`Item${formData.items.length ? ` (${formData.items.length} selected)` : ""}`}>
              <div className="flex flex-wrap gap-1.5 border border-slate-200 rounded-lg p-2 max-h-32 overflow-y-auto">
                {items.map((i) => {
                  const active = formData.items.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onToggleItem(i)}
                      className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                        active ? "bg-teal-700 border-teal-700 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-teal-400"
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </Field>
            {formData.items.length > 0 && (
              <Field label="Model Name">
                <div className="space-y-2">
                  {formData.items.map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-28 shrink-0 truncate" title={i}>
                        {i}
                      </span>
                      <input
                        value={(formData.itemModels && formData.itemModels[i]) || ""}
                        onChange={(e) => onModelChange(i, e.target.value)}
                        placeholder="e.g. Gigabyte Z790 AORUS Elite"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  ))}
                </div>
              </Field>
            )}
            <Field label="Department">
              <select
                value={formData.dept}
                onChange={(e) => onChange("dept", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="">Select department</option>
                {depts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="User Name">
              <input
                value={formData.userName}
                onChange={(e) => onChange("userName", e.target.value)}
                placeholder="Requester's name"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            {currentRole === "admin" && (
              <Field label="Status">
                <select
                  value={formData.status}
                  onChange={(e) => onChange("status", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Remarks">
              <textarea
                value={formData.remarks}
                onChange={(e) => onChange("remarks", e.target.value)}
                rows={3}
                placeholder="Optional notes"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              />
            </Field>
          </div>
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 shrink-0 bg-white">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button type="button" onClick={onSubmit} className="px-4 py-2 rounded-lg text-sm bg-teal-700 text-white hover:bg-teal-800">
              {editingId ? "Save Changes" : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function ManageModal({
  items,
  depts,
  statuses,
  allowedEmails,
  onAddItem,
  onRemoveItem,
  onAddDept,
  onRemoveDept,
  onAddStatus,
  onRemoveStatus,
  onAddEmail,
  onRemoveEmail,
  onToggleRole,
  onImport,
  onClose,
  error,
  onDismissError,
}) {
  const [newItem, setNewItem] = useState("");
  const [newDept, setNewDept] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmailRole, setNewEmailRole] = useState("member");

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}>
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-y-auto" style={{ maxHeight: "85vh" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="font-semibold text-slate-900" style={displayFont}>
            Manage Options
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        {error && (
          <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs px-3 py-2">
            <span>{error}</span>
            <button onClick={onDismissError}>
              <X size={14} />
            </button>
          </div>
        )}
        <div className="px-5 py-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">Sheet Import</h3>
            <p className="text-xs text-slate-400 mb-2">Re-run this any time — it skips PR numbers already in the register.</p>
            <button
              onClick={onImport}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              <UploadCloud size={15} /> Import from BCDL IT Requisition sheet
            </button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Item Types</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {items.map((i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                  {i}
                  <button onClick={() => onRemoveItem(i)} className="text-slate-400 hover:text-red-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new item, e.g. Monitor"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                onClick={() => {
                  onAddItem(newItem);
                  setNewItem("");
                }}
                className="px-3 py-2 rounded-lg bg-teal-700 text-white text-sm hover:bg-teal-800"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Departments</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {depts.map((d) => (
                <span key={d} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                  {d}
                  <button onClick={() => onRemoveDept(d)} className="text-slate-400 hover:text-red-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="Add new department"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                onClick={() => {
                  onAddDept(newDept);
                  setNewDept("");
                }}
                className="px-3 py-2 rounded-lg bg-teal-700 text-white text-sm hover:bg-teal-800"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">Status Options</h3>
            <p className="text-xs text-slate-400 mb-2">
              These appear in the Status dropdown on every request, e.g. "Waiting for SCD". A status that's currently
              used on a request can't be removed — change those requests first.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {statuses.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                  {s}
                  <button onClick={() => onRemoveStatus(s)} className="text-slate-400 hover:text-red-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Add new status, e.g. Waiting for SCD"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                onClick={() => {
                  onAddStatus(newStatus);
                  setNewStatus("");
                }}
                className="px-3 py-2 rounded-lg bg-teal-700 text-white text-sm hover:bg-teal-800"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">Employee Access</h3>
            <p className="text-xs text-slate-400 mb-2">
              Only these emails can sign in. <span className="font-medium text-slate-500">Admin</span> can manage everything;{" "}
              <span className="font-medium text-slate-500">Member</span> can view and submit requests only. Tap the role badge to switch it.
              Leave the list empty to allow anyone with the link in as Admin.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {allowedEmails.map((em) => (
                <span key={em.email} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs pl-2.5 pr-1.5 py-1 rounded-full">
                  {em.email}
                  <button
                    onClick={() => onToggleRole(em.email)}
                    title="Tap to switch role"
                    className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      em.role === "admin" ? "bg-teal-700 text-white" : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {em.role === "admin" ? "Admin" : "Member"}
                  </button>
                  <button onClick={() => onRemoveEmail(em.email)} className="text-slate-400 hover:text-red-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {allowedEmails.length === 0 && <span className="text-xs text-slate-400 italic">Open access — anyone with the link can sign in</span>}
            </div>
            <div className="flex gap-2">
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="employee@company.com"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <div className="flex rounded-lg border border-slate-200 overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setNewEmailRole("member")}
                  className={`px-2.5 py-2 text-xs font-medium ${newEmailRole === "member" ? "bg-slate-700 text-white" : "bg-white text-slate-500"}`}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => setNewEmailRole("admin")}
                  className={`px-2.5 py-2 text-xs font-medium ${newEmailRole === "admin" ? "bg-teal-700 text-white" : "bg-white text-slate-500"}`}
                >
                  Admin
                </button>
              </div>
              <button
                onClick={() => {
                  onAddEmail(newEmail, newEmailRole);
                  setNewEmail("");
                }}
                className="px-3 py-2 rounded-lg bg-teal-700 text-white text-sm hover:bg-teal-800 shrink-0"
              >
                Add
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">Removing an item or department that's still used on a request isn't allowed — change those requests first.</p>
        </div>
      </div>
    </div>
  );
}
