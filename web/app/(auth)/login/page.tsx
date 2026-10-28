"use client";

import { useRouter } from "next/navigation";
import Login from "@/components/pages/Login";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Login
      onRegistered={() => {
        localStorage.setItem("pharma360_onboarding_pending", "true");
        router.push("/onboarding");
      }}
    />
  );
}
