"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  const isMissingEnv = error.message?.includes("Missing NEXT_PUBLIC_SUPABASE");

  return (
    <html>
      <body className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center px-6">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold mb-2">
            {isMissingEnv ? "Configuration Error" : "Something went wrong"}
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            {isMissingEnv
              ? "Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your hosting provider."
              : error.message || "An unexpected server error occurred."}
          </p>
          {error.digest && (
            <p className="text-zinc-600 text-xs mb-4">Digest: {error.digest}</p>
          )}
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
