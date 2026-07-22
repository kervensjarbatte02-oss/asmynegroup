import { getMongoDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getMongoDb();
    const cols = await db.collection("collections").find().toArray();
    const collections = cols
      .map((item: any) => String(item.title || item.name || item.collection || item || "").trim())
      .filter((value: string) => value.length > 0)
      .map((title: string) => ({ title }));

    return NextResponse.json({ collections });
  } catch (err) {
    console.error("marketplace collections route error:", err);
    return NextResponse.json({ error: "failed to load collections" }, { status: 500 });
  }
}
