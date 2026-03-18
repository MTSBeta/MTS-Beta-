import { Router, type IRouter } from "express";
import multer from "multer";
import { uploadToDrive, isDriveConfigured } from "../lib/googleDrive.js";
import { registerImageAsset } from "../lib/googleSheets.js";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

// Store uploads in memory — files go straight to Drive, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max (audio can be larger)
  fileFilter(_req, file, cb) {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image, video, and audio files are allowed"));
    }
  },
});

/**
 * POST /api/images/upload
 *
 * Multipart form-data fields:
 *   file            — the image, video, or audio file (required)
 *   player_id       — UUID of the player
 *   player_code     — e.g. PLY-DEMO-001
 *   player_name     — full name
 *   academy_name    — e.g. Arsenal
 *   contributor_role — e.g. player, education, psychology …
 *   contributor_name — name of the uploader
 *   image_type      — e.g. likeness_face, likeness_action, journey_media
 *   upload_source   — e.g. welcome_screen, journey, staff_upload
 *   notes           — optional freeform notes
 *
 * Authentication: staff JWT (optional — omit for player uploads)
 */
router.post(
  "/images/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      if (!isDriveConfigured()) {
        res.status(503).json({ error: "Google Drive is not configured on this server." });
        return;
      }

      const {
        player_id = "",
        player_code = "unknown",
        player_name = "Unknown Player",
        academy_name = "Unknown Academy",
        contributor_role = "player",
        contributor_name = "",
        image_type = "general",
        upload_source = "portal",
        notes = "",
      } = req.body as Record<string, string>;

      const { originalname, mimetype, buffer } = req.file;

      // Timestamp-prefix the filename to avoid collisions
      const timestamp = Date.now();
      const safeName = originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${image_type}_${timestamp}_${safeName}`;

      // Upload to Google Drive
      const driveResult = await uploadToDrive({
        fileBuffer: buffer,
        fileName,
        mimeType: mimetype,
        academyName: academy_name,
        playerCode: player_code,
      });

      // Log metadata to Google Sheets (fire-and-forget)
      registerImageAsset({
        playerId: player_id,
        playerCode: player_code,
        playerName: player_name,
        academyName: academy_name,
        contributorRole: contributor_role,
        contributorName: contributor_name,
        imageType: image_type,
        originalFileName: originalname,
        mimeType: mimetype,
        driveFileId: driveResult.fileId,
        driveFileLink: driveResult.fileLink,
        driveFolderId: driveResult.folderId,
        uploadSource: upload_source,
        notes,
      }).catch(err => {
        console.error("[imageUpload] Sheets log failed (non-fatal):", err?.message);
      });

      res.json({
        ok: true,
        driveFileId: driveResult.fileId,
        driveFileLink: driveResult.fileLink,
        driveFolderId: driveResult.folderId,
        fileName,
      });
    } catch (err: any) {
      console.error("[imageUpload] Upload failed:", err?.message ?? err);
      res.status(500).json({ error: err?.message ?? "Upload failed" });
    }
  }
);

export default router;
