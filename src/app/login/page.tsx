"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export default function LoginPage() {
  const { settings } = useAppStore();
  const hydrated = useStoreHydrated();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === settings.passcode) {
      document.cookie = "amoria_auth=true; path=/; max-age=31536000"; // 1 year
      router.push("/");
    } else {
      setError("That's not our secret code...");
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      <div className="paper-texture" />

      <Card className="w-full max-w-md border-none shadow-2xl shadow-primary/10 relative z-10">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
             <CardTitle className="font-serif text-4xl text-primary">Our Private World</CardTitle>
             <CardDescription className="text-muted-foreground font-sans text-base">
                Enter our secret passcode to enter.
             </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                className="text-center text-xl tracking-[0.5em] placeholder:tracking-normal h-14"
              />
              {error && <p className="text-destructive text-sm text-center animate-pulse font-medium">{error}</p>}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-7"
            >
              Enter <Heart className="w-5 h-5 ml-2 fill-current" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
