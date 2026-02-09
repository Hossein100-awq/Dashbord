"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (pathname === "/") {
      setIsAuthorized(true);
      return;
    }

    if (token) {
      setIsAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
