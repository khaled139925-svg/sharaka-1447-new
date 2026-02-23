// server/_core/index.ts
import express from "express";
import path2 from "path";
import fs2 from "fs";

// server/_core/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
var uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});
var fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("\u0646\u0648\u0639 \u0627\u0644\u0645\u0644\u0641 \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645. \u064A\u0631\u062C\u0649 \u062A\u062D\u0645\u064A\u0644 \u0635\u0648\u0631\u0629 \u0641\u0642\u0637."));
  }
};
var upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB
  }
});
function setupUploadRoutes(app2) {
  app2.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0623\u064A \u0645\u0644\u0641" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
  app2.post("/api/upload-multiple", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0623\u064A \u0645\u0644\u0641\u0627\u062A" });
    }
    const files = req.files;
    const uploadedFiles = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));
    res.json({
      success: true,
      files: uploadedFiles
    });
  });
  app2.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "\u062D\u062C\u0645 \u0627\u0644\u0645\u0644\u0641 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627\u064B. \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 5MB" });
      }
      return res.status(400).json({ error: error.message });
    }
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  });
}

// server/_core/scrapeStore.ts
import axios from "axios";
import * as cheerio from "cheerio";
async function scrapeStoreFromUrl(url) {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    const response = await axios.get(url, {
      timeout: 1e4,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    let title = $("title").text() || $("h1").first().text() || "\u0645\u062A\u062C\u0631 \u062C\u062F\u064A\u062F";
    title = title.replace(/مستنسخ|cloned|clone/gi, "").trim();
    if (!title) title = "\u0645\u062A\u062C\u0631 \u062C\u062F\u064A\u062F";
    let description = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || $("p").first().text() || "\u0648\u0635\u0641 \u0627\u0644\u0645\u062A\u062C\u0631";
    description = description.replace(/مستنسخ|cloned|clone/gi, "").trim();
    if (!description) description = "\u0648\u0635\u0641 \u0627\u0644\u0645\u062A\u062C\u0631";
    let logoUrl = $('meta[property="og:image"]').attr("content") || $("img").first().attr("src") || "";
    if (logoUrl && !logoUrl.startsWith("http")) {
      try {
        const baseUrl = new URL(url);
        logoUrl = new URL(logoUrl, baseUrl.origin).href;
      } catch (e) {
        logoUrl = "";
      }
    }
    if (!logoUrl || logoUrl.includes("placeholder")) {
      logoUrl = "";
    }
    const products = [];
    $("[data-product], .product, .item, .card").each((index, element) => {
      if (index >= 5) return;
      const $el = $(element);
      const productName = $el.find("[data-name], .name, .title, h3, h2").first().text() || $el.text().substring(0, 50);
      const productPrice = parseFloat(
        $el.find("[data-price], .price, .cost").first().text().replace(/[^\d.]/g, "")
      ) || Math.random() * 500 + 50;
      const productImage = $el.find("img").first().attr("src") || $el.find("[data-image]").first().attr("data-image") || logoUrl;
      const productDescription = $el.find("[data-description], .description, p").first().text() || productName;
      if (productName.trim()) {
        products.push({
          id: Date.now().toString() + index,
          name: productName.trim(),
          price: productPrice,
          image: productImage.startsWith("http") ? productImage : new URL(productImage, new URL(url).origin).href,
          description: productDescription.trim(),
          points: Math.floor(productPrice * 0.1),
          quantity: Math.floor(Math.random() * 20) + 5
        });
      }
    });
    if (products.length === 0) {
      products.push({
        id: "1",
        name: "\u0645\u0646\u062A\u062C \u0645\u0646 " + title,
        price: 99.99,
        image: logoUrl,
        description,
        points: 10,
        quantity: 10
      });
    }
    const store = {
      id: Date.now().toString(),
      name: title.trim(),
      description: description.trim(),
      category: "",
      // المستخدم سيختار الفئة بنفسه
      logo: logoUrl,
      ownerName: "\u0645\u0627\u0644\u0643 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0623\u0635\u0644\u064A",
      ownerEmail: "contact@example.com",
      ownerPhone: "+966501234567",
      pointsRatio: 0.1,
      products
    };
    return store;
  } catch (error) {
    console.error("\u062E\u0637\u0623 \u0641\u064A \u0627\u0633\u062A\u0646\u0633\u0627\u062E \u0627\u0644\u0645\u0648\u0642\u0639:", error);
    throw new Error(
      "\u0641\u0634\u0644 \u0627\u0633\u062A\u0646\u0633\u0627\u062E \u0627\u0644\u0645\u0648\u0642\u0639. \u062A\u0623\u0643\u062F \u0645\u0646 \u0623\u0646 \u0627\u0644\u0631\u0627\u0628\u0637 \u0635\u062D\u064A\u062D \u0648\u0627\u0644\u0645\u0648\u0642\u0639 \u0645\u062A\u0627\u062D: " + (error instanceof Error ? error.message : "\u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")
    );
  }
}

// server/_core/fullSiteClone.ts
import axios2 from "axios";
import * as cheerio2 from "cheerio";

// server/storage.ts
var storagePut = async (key, data, contentType) => {
  return { url: "", key };
};

// server/_core/fullSiteClone.ts
var clonedSites = /* @__PURE__ */ new Map();
async function cloneFullWebsite(url) {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    const response = await axios2.get(url, {
      timeout: 3e4,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    const html = response.data;
    const $ = cheerio2.load(html);
    const images = /* @__PURE__ */ new Map();
    const title = $("title").text() || $("h1").first().text() || "Cloned Site";
    const description = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || $("p").first().text() || "";
    const imgElements = $("img");
    for (let i = 0; i < imgElements.length; i++) {
      const img = $(imgElements[i]);
      const src = img.attr("src");
      if (src) {
        try {
          let absoluteUrl = src;
          if (!src.startsWith("http")) {
            const baseUrl = new URL(url);
            absoluteUrl = new URL(src, baseUrl).href;
          }
          const imageResponse = await axios2.get(absoluteUrl, {
            responseType: "arraybuffer",
            timeout: 1e4
          });
          const contentType = imageResponse.headers["content-type"] || "image/jpeg";
          const fileName = `cloned-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
          const fileKey = `cloned-sites/${fileName}`;
          const { url: storedUrl } = await storagePut(fileKey, imageResponse.data, contentType);
          images.set(src, storedUrl);
          img.attr("src", storedUrl);
        } catch (err) {
          console.error(`Failed to clone image: ${src}`, err);
        }
      }
    }
    const linkElements = $('link[rel="stylesheet"]');
    for (let i = 0; i < linkElements.length; i++) {
      const link = $(linkElements[i]);
      const href = link.attr("href");
      if (href && href.startsWith("http")) {
        try {
          const cssResponse = await axios2.get(href, { timeout: 1e4 });
          const cssContent = cssResponse.data;
          const styleTag = `<style>${cssContent}</style>`;
          $("head").append(styleTag);
          link.remove();
        } catch (err) {
          console.error(`Failed to clone CSS: ${href}`, err);
        }
      }
    }
    $("script[src]").remove();
    $('link[rel="icon"]').remove();
    $("meta[http-equiv]").remove();
    const siteId = `cloned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const clonedSite = {
      id: siteId,
      originalUrl: url,
      title: cleanText(title),
      description: cleanText(description),
      html: $.html(),
      images,
      clonedAt: Date.now()
    };
    clonedSites.set(siteId, clonedSite);
    return clonedSite;
  } catch (error) {
    console.error("Error cloning website:", error);
    throw new Error(`Failed to clone website: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function getClonedSite(siteId) {
  return clonedSites.get(siteId);
}
function cleanText(text) {
  return text.trim().replace(/\s+/g, " ").substring(0, 500);
}

// server/_core/index.ts
var app = express();
var PORT = process.env.PORT || 3e3;
var DIST_DIR = path2.join(process.cwd(), "dist");
app.use(express.json());
app.use(express.static(DIST_DIR));
app.use(express.static(path2.join(process.cwd(), "public")));
setupUploadRoutes(app);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.post("/api/scrape-store", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0648\u0642\u0639" });
    }
    const store = await scrapeStoreFromUrl(url);
    res.json({ success: true, store });
  } catch (error) {
    console.error("\u062E\u0637\u0623 \u0641\u064A \u0627\u0633\u062A\u0646\u0633\u0627\u062E \u0627\u0644\u0645\u0648\u0642\u0639:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "\u062E\u0637\u0623 \u0641\u064A \u0627\u0633\u062A\u0646\u0633\u0627\u062E \u0627\u0644\u0645\u0648\u0642\u0639"
    });
  }
});
app.post("/api/clone-full-site", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0648\u0642\u0639" });
    }
    const clonedSite = await cloneFullWebsite(url);
    res.json({ success: true, siteId: clonedSite.id, site: clonedSite });
  } catch (error) {
    console.error("\u062E\u0637\u0623 \u0641\u064A \u0646\u0633\u062E \u0627\u0644\u0645\u0648\u0642\u0639:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "\u062E\u0637\u0623 \u0641\u064A \u0646\u0633\u062E \u0627\u0644\u0645\u0648\u0642\u0639"
    });
  }
});
app.get("/api/cloned-site/:siteId", (req, res) => {
  const { siteId } = req.params;
  const site = getClonedSite(siteId);
  if (!site) {
    return res.status(404).json({ error: "\u0627\u0644\u0645\u0648\u0642\u0639 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
  }
  res.json({ success: true, site });
});
app.get("/", (req, res) => {
  const indexPath = path2.join(DIST_DIR, "index.html");
  if (fs2.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found");
  }
});
app.use((req, res) => {
  const indexPath = path2.join(DIST_DIR, "index.html");
  if (fs2.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});
var server = app.listen(PORT, () => {
  console.log(`[OAuth] Initialized with baseURL: https://api.manus.im`);
  console.log(`Server running on http://localhost:${PORT}/`);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
