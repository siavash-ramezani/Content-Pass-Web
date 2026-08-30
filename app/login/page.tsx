import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const token = await getAuthToken();

  if (token) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
