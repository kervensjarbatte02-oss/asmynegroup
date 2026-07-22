import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { deleteManagedUploadIfExists, persistImageIfNeeded, validateImageReference } from "@/lib/imageStorage";

export async function PATCH(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rate = checkRateLimit(`profile-update:${clientIp}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("asmyne_auth")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyAuthToken(token);
    if (!decoded || typeof decoded === "string" || !decoded.sub) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, location, website, photoDataUrl, coverImageUrl } = body;

    const userObjectId = new ObjectId(decoded.sub);

    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (bio !== undefined && (typeof bio !== "string" || bio.length > 160)) {
      return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
    }

    if (location !== undefined && (typeof location !== "string" || location.length > 80)) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    if (website !== undefined) {
      if (typeof website !== "string" || website.length > 300) {
        return NextResponse.json({ error: "Invalid website" }, { status: 400 });
      }
      if (website.trim()) {
        try {
          const parsed = new URL(website);
          if (!["http:", "https:"].includes(parsed.protocol)) {
            return NextResponse.json({ error: "Invalid website protocol" }, { status: 400 });
          }
        } catch {
          return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });
        }
      }
    }

    try {
      if (photoDataUrl !== undefined) {
        validateImageReference(String(photoDataUrl), { maxBytes: 2_000_000 });
      }
      if (coverImageUrl !== undefined) {
        validateImageReference(String(coverImageUrl), { maxBytes: 2_500_000 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid image payload" }, { status: 400 });
    }

    const db = await getMongoDb();
    const usersCollection = db.collection<{ photoDataUrl?: string; coverImageUrl?: string }>("users");

    const existingUser = await usersCollection.findOne(
      { _id: userObjectId },
      { projection: { photoDataUrl: 1, coverImageUrl: 1 } }
    );

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const storedPhotoPath = photoDataUrl !== undefined
      ? await persistImageIfNeeded(String(photoDataUrl), "profile", {
        maxBytes: 2_000_000,
        maxWidth: 900,
        maxHeight: 900,
        quality: 82,
      })
      : undefined;

    const storedCoverPath = coverImageUrl !== undefined
      ? await persistImageIfNeeded(String(coverImageUrl), "cover", {
        maxBytes: 2_500_000,
        maxWidth: 1800,
        maxHeight: 900,
        quality: 84,
      })
      : undefined;

    // Update only the provided fields
    const updateData: Record<string, string> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.statusText = bio.trim();
    if (location !== undefined) updateData.searchLocation = location.trim();
    if (website !== undefined) updateData.website = website.trim();
    if (storedPhotoPath !== undefined) updateData.photoDataUrl = storedPhotoPath;
    if (storedCoverPath !== undefined) updateData.coverImageUrl = storedCoverPath;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const result = await usersCollection.updateOne(
      { _id: userObjectId },
      { $set: updateData }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (storedPhotoPath !== undefined && existingUser.photoDataUrl && existingUser.photoDataUrl !== storedPhotoPath) {
      await deleteManagedUploadIfExists(existingUser.photoDataUrl);
    }

    if (storedCoverPath !== undefined && existingUser.coverImageUrl && existingUser.coverImageUrl !== storedCoverPath) {
      await deleteManagedUploadIfExists(existingUser.coverImageUrl);
    }

    return NextResponse.json(
      { success: true, message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
