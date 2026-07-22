import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/jwt";

export default async function ProfileMePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    redirect("/connexion");
  }

  const session = verifyAuthToken(token);
  if (!session) {
    redirect("/connexion");
  }

  redirect(`/profile/${session.sub}`);
}
