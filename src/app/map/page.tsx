"use client";

import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground animate-pulse">
      Loading World...
    </div>
  ),
});

export default function MapPage() {
  return (
    <main className="h-screen w-full relative flex flex-col">
       {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-6 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto max-w-7xl mx-auto">
             <Button
                asChild
                variant="secondary"
                className="bg-white/80 backdrop-blur-md shadow-lg hover:bg-white text-foreground rounded-full px-6"
            >
                <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Link>
            </Button>
            
            <div className="bg-white/80 backdrop-blur-md shadow-lg px-8 py-4 rounded-[2rem] text-center hidden md:block">
                <h1 className="font-serif text-2xl text-foreground">Global Footprint</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Where we&apos;ve been</p>
            </div>
            
            <div className="w-[100px]" /> {/* Spacer for balance */}
        </div>
      </div>

      <div className="flex-1 w-full h-full relative z-0">
         <MapComponent />
      </div>
    </main>
  );
}
