"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_vite = require("vite");
var import_path = __toESM(require("path"), 1);
var import_promises = __toESM(require("fs/promises"), 1);
var import_fs = require("fs");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var DB_PATH = import_path.default.resolve("data/db.json");
var UPLOADS_DIR = import_path.default.resolve("data/uploads");
async function ensureDirs() {
  try {
    await import_promises.default.mkdir(import_path.default.dirname(DB_PATH), { recursive: true });
    await import_promises.default.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating data directories:", err);
  }
}
async function readDb() {
  try {
    if (!(0, import_fs.existsSync)(DB_PATH)) {
      return null;
    }
    const data = await import_promises.default.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database, using fallback:", err);
    return null;
  }
}
async function writeDb(data) {
  try {
    await import_promises.default.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}
async function startServer() {
  await ensureDirs();
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  app.use("/uploads", import_express.default.static(UPLOADS_DIR));
  const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];
    if (token !== "admin-session-sbce-coding-club") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    next();
  };
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const db = await readDb();
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }
    if (email === db.admin.email && password === db.admin.password) {
      return res.json({
        success: true,
        token: "admin-session-sbce-coding-club",
        email: db.admin.email
      });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  });
  app.get("/api/auth/check", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader === "Bearer admin-session-sbce-coding-club") {
      const db = await readDb();
      return res.json({ authenticated: true, email: db?.admin?.email });
    }
    return res.json({ authenticated: false });
  });
  app.get("/api/events", async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    res.json(db.events || []);
  });
  app.post("/api/events", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const newEvent = {
      id: "e" + Date.now(),
      title: req.body.title || "Untitled Event",
      description: req.body.description || "",
      banner: req.body.banner || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=80",
      venue: req.body.venue || "",
      date: req.body.date || "",
      time: req.body.time || "",
      speaker: req.body.speaker || "",
      status: req.body.status || "Upcoming",
      registration_link: req.body.registration_link || "",
      certificate_link: req.body.certificate_link || "",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.events = db.events || [];
    db.events.push(newEvent);
    await writeDb(db);
    res.status(201).json(newEvent);
  });
  app.put("/api/events/:id", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const { id } = req.params;
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Event not found" });
    }
    const updatedEvent = {
      ...db.events[index],
      ...req.body,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.events[index] = updatedEvent;
    await writeDb(db);
    res.json(updatedEvent);
  });
  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const { id } = req.params;
    db.events = db.events.filter((e) => e.id !== id);
    await writeDb(db);
    res.json({ success: true, id });
  });
  app.get("/api/members", async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const members = db.members || [];
    members.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
    res.json(members);
  });
  app.post("/api/members", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const newMember = {
      id: "m" + Date.now(),
      name: req.body.name || "Anonymous",
      position: req.body.position || "Member",
      bio: req.body.bio || "",
      image: req.body.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80",
      linkedin: req.body.linkedin || "",
      github: req.body.github || "",
      instagram: req.body.instagram || "",
      email: req.body.email || "",
      display_order: req.body.display_order ? parseInt(req.body.display_order, 10) : 99
    };
    db.members = db.members || [];
    db.members.push(newMember);
    await writeDb(db);
    res.status(201).json(newMember);
  });
  app.put("/api/members/:id", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const { id } = req.params;
    const index = db.members.findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
    const updatedMember = {
      ...db.members[index],
      ...req.body,
      display_order: req.body.display_order ? parseInt(req.body.display_order, 10) : db.members[index].display_order
    };
    db.members[index] = updatedMember;
    await writeDb(db);
    res.json(updatedMember);
  });
  app.delete("/api/members/:id", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const { id } = req.params;
    db.members = db.members.filter((m) => m.id !== id);
    await writeDb(db);
    res.json({ success: true, id });
  });
  app.get("/api/gallery", async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    res.json(db.gallery || []);
  });
  app.post("/api/gallery", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const newPhoto = {
      id: "g" + Date.now(),
      event_id: req.body.event_id || "all",
      image_url: req.body.image_url || "",
      caption: req.body.caption || ""
    };
    db.gallery = db.gallery || [];
    db.gallery.push(newPhoto);
    await writeDb(db);
    res.status(201).json(newPhoto);
  });
  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    const { id } = req.params;
    db.gallery = db.gallery.filter((g) => g.id !== id);
    await writeDb(db);
    res.json({ success: true, id });
  });
  app.get("/api/settings", async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    res.json(db.settings || {});
  });
  app.put("/api/settings", requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: "DB error" });
    db.settings = {
      ...db.settings,
      ...req.body
    };
    await writeDb(db);
    res.json(db.settings);
  });
  app.post("/api/upload", requireAdmin, async (req, res) => {
    try {
      const { name, type, data } = req.body;
      if (!name || !data) {
        return res.status(400).json({ error: "Missing name or content data" });
      }
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = import_path.default.join(UPLOADS_DIR, fileName);
      await import_promises.default.writeFile(filePath, buffer);
      const fileUrl = `/uploads/${fileName}`;
      res.json({ url: fileUrl });
    } catch (err) {
      console.error("Upload handling error:", err);
      res.status(500).json({ error: "Upload failed: " + err.message });
    }
  });
  app.get("/api/db/export", requireAdmin, async (req, res) => {
    const db = await readDb();
    res.json(db);
  });
  app.post("/api/db/import", requireAdmin, async (req, res) => {
    try {
      const { backupData } = req.body;
      if (!backupData || !backupData.admin || !backupData.events) {
        return res.status(400).json({ error: "Invalid database backup data structure" });
      }
      await writeDb(backupData);
      res.json({ success: true, message: "Database imported successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Import failed: " + err.message });
    }
  });
  if (process.env.NODE_ENV === "production") {
    app.use(import_express.default.static(import_path.default.resolve("dist")));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.resolve("dist/index.html"));
    });
  } else {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  const PORT = 3e3;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CSE SBCE Coding Club platform server is active on port ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server boot failure:", err);
});
//# sourceMappingURL=server.cjs.map
