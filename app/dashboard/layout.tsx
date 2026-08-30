import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

// loading.tsx wraps page.tsx (and nested layouts) in a Suspense boundary, but
// NOT this layout — so this redirect still resolves before any streaming
// starts, giving a clean server-side 307 instead of a client-side redirect
// injected after the loading skeleton has already streamed with a 200.
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  return children;
}
