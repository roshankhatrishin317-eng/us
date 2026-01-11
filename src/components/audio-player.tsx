"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/data";

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  hasInteracted: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(SITE_CONFIG.music.src);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
      setHasInteracted(true);
    }
    setIsPlaying(!isPlaying);
  };

  // Attempt auto-play on first user interaction if not already playing
  const handleInteraction = () => {
    if (!hasInteracted && !isPlaying && audioRef.current) {
        // We don't auto-play aggressively to avoid browser blocking,
        // but we flag that interaction occurred.
        setHasInteracted(true);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, volume, setVolume, hasInteracted }}>
      <div onClick={handleInteraction} onKeyDown={handleInteraction} className="contents">
        {children}
        <div className="fixed bottom-4 right-4 z-50">
           <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 transition-all duration-300 shadow-lg"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
