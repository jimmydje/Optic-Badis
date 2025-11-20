import { cookies } from "next/headers";

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === "secret_token_123"; // doit matcher ton token
}
