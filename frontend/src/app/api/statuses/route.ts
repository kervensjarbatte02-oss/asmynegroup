import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

type StatusUser = {
  _id: { toString: () => string };
  name?: string;
  photoDataUrl?: string;
  statusText?: string;
  searchLocation?: string;
  lastActiveAt?: Date | string;
  createdAt?: Date | string;
};

function asDate(value: Date | string | undefined) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isOnline(lastActiveAt: Date | null) {
  if (!lastActiveAt) {
    return false;
  }

  const now = Date.now();
  const deltaMs = now - lastActiveAt.getTime();
  return deltaMs <= 10 * 60 * 1000;
}

export async function GET() {
  try {
    const db = await getMongoDb();
    const users = db.collection("users");

    const rows = await users
      .find<StatusUser>({}, {
        projection: {
          name: 1,
          photoDataUrl: 1,
          statusText: 1,
          searchLocation: 1,
          lastActiveAt: 1,
          createdAt: 1,
        },
      })
      .sort({ lastActiveAt: -1, createdAt: -1 })
      .limit(20)
      .toArray();

    const statuses = rows.map((row) => {
      const lastActive = asDate(row.lastActiveAt) ?? asDate(row.createdAt);
      const online = isOnline(lastActive);
      const safePhoto = row.photoDataUrl && row.photoDataUrl.length <= 120000 ? row.photoDataUrl : "";
      const location = row.searchLocation?.trim();

      return {
        id: row._id.toString(),
        name: row.name?.trim() || "Client",
        avatar: safePhoto,
        online,
        statusText:
          row.statusText?.trim() ||
          (online
            ? "En ligne maintenant"
            : location
              ? `Actif recemment - ${location}`
              : "Actif recemment"),
        lastActiveAt: lastActive ? lastActive.toISOString() : null,
      };
    });

    return NextResponse.json({ statuses });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Impossible de charger les statuts.",
        detail,
      },
      { status: 500 },
    );
  }
}
