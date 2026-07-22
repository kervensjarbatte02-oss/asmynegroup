import { getMongoDb } from "./mongodb";

export type AnalyticsEvent = {
  type: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  productId?: string;
  orderId?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
};

export async function logAnalyticsEvent(event: AnalyticsEvent) {
  const db = await getMongoDb();
  await db.collection("analytics_events").insertOne({
    ...event,
    createdAt: new Date(),
  });
}
