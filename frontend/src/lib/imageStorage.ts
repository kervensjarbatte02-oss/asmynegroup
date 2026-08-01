import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

type ImageValidationOptions = {
  maxBytes: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
};

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

function getExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function clampQuality(value: number | undefined): number {
  if (!value) {
    return 82;
  }
  return Math.max(50, Math.min(95, Math.round(value)));
}

async function transformImageIfNeeded(
  mimeType: string,
  buffer: Buffer,
  options: ImageValidationOptions,
): Promise<{ mimeType: string; buffer: Buffer }> {
  // Preserve GIFs as-is to avoid breaking animations.
  if (mimeType === "image/gif") {
    return { mimeType, buffer };
  }

  const maxWidth = options.maxWidth ?? 1400;
  const maxHeight = options.maxHeight ?? 1400;
  const quality = clampQuality(options.quality);

  const transformed = await sharp(buffer)
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  return { mimeType: "image/webp", buffer: transformed };
}

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\n\r]+)$/);
  if (!match) {
    throw new Error("Invalid image format");
  }

  const mimeType = match[1].toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error("Unsupported image type");
  }

  const base64Payload = match[2].replace(/\s+/g, "");
  const buffer = Buffer.from(base64Payload, "base64");
  if (!buffer.length) {
    throw new Error("Empty image");
  }

  return { mimeType, buffer };
}

function resolvePublicUploadsRoot(): string {
  const cwd = process.cwd();
  // Handles both running from /frontend and workspace root.
  const frontendPublic = path.join(/* turbopackIgnore: true */ cwd, "public", "uploads");
  const workspacePublic = path.join(/* turbopackIgnore: true */ cwd, "frontend", "public", "uploads");
  return cwd.endsWith("frontend") ? frontendPublic : workspacePublic;
}

function isManagedUploadPath(value: string): boolean {
  return value.startsWith("/uploads/profile/") || value.startsWith("/uploads/cover/");
}

export async function deleteManagedUploadIfExists(value: string | undefined): Promise<void> {
  if (!value || !isManagedUploadPath(value)) {
    return;
  }

  const uploadsRoot = resolvePublicUploadsRoot();
  const relativePath = value.replace(/^\//, "");
  const absolutePath = path.resolve(/* turbopackIgnore: true */ path.join(process.cwd(), "public"), relativePath);
  const workspaceAbsolutePath = path.resolve(/* turbopackIgnore: true */ path.join(process.cwd(), "frontend", "public"), relativePath);

  const candidates = [absolutePath, workspaceAbsolutePath];
  for (const candidate of candidates) {
    const normalizedUploadsRoot = path.resolve(/* turbopackIgnore: true */ uploadsRoot);
    const normalizedCandidate = path.resolve(/* turbopackIgnore: true */ candidate);

    if (!normalizedCandidate.startsWith(normalizedUploadsRoot)) {
      continue;
    }

    try {
      await unlink(normalizedCandidate);
      return;
    } catch {
      // Ignore missing files and keep trying fallback candidates.
    }
  }
}

export function validateImageReference(value: string, options: ImageValidationOptions): void {
  if (!value) {
    return;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
    if (value.length > 2048) {
      throw new Error("Image URL too long");
    }
    return;
  }

  const { buffer } = parseDataUrl(value);
  if (buffer.length > options.maxBytes) {
    throw new Error("Image is too large");
  }
}

export async function persistImageIfNeeded(
  value: string,
  folder: "profile" | "cover" | "products",
  options: ImageValidationOptions,
): Promise<string> {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
    if (value.length > 2048) {
      throw new Error("Image URL too long");
    }
    return value;
  }

  const { mimeType, buffer } = parseDataUrl(value);
  if (buffer.length > options.maxBytes) {
    throw new Error("Image is too large");
  }

  const processed = await transformImageIfNeeded(mimeType, buffer, options);
  if (processed.buffer.length > options.maxBytes) {
    throw new Error("Processed image is too large");
  }

  const ext = getExtension(processed.mimeType);
  const uploadsRoot = resolvePublicUploadsRoot();
  const targetDir = path.join(/* turbopackIgnore: true */ uploadsRoot, folder);
  await mkdir(targetDir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  const filePath = path.join(/* turbopackIgnore: true */ targetDir, filename);
  await writeFile(filePath, processed.buffer);

  return `/uploads/${folder}/${filename}`;
}
