"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  date?: string;
  category?: string;
  images?: string[];
  notes?: string;
}

export interface BucketListItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export interface SiteSettings {
  coupleName: string;
  relationshipStartDate: string;
  passcode: string;
  adminPassword: string;
}

export interface VaultSecret {
  hiddenMessage: string;
  subMessage: string;
  code: string;
}

export interface TimeCapsule {
  unlockDate: string;
  message: string;
  image?: string;
}

interface AppStore {
  settings: SiteSettings;
  timeline: TimelineEvent[];
  gallery: GalleryImage[];
  locations: MapLocation[];
  bucketList: BucketListItem[];
  quiz: QuizQuestion[];
  vault: VaultSecret;
  capsule: TimeCapsule;

  updateSettings: (settings: Partial<SiteSettings>) => void;
  
  addTimelineEvent: (event: Omit<TimelineEvent, "id">) => void;
  updateTimelineEvent: (id: string, event: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;

  addGalleryImage: (image: Omit<GalleryImage, "id">) => void;
  updateGalleryImage: (id: string, image: Partial<GalleryImage>) => void;
  deleteGalleryImage: (id: string) => void;

  addLocation: (location: Omit<MapLocation, "id">) => void;
  updateLocation: (id: string, location: Partial<MapLocation>) => void;
  deleteLocation: (id: string) => void;

  addBucketListItem: (item: Omit<BucketListItem, "id">) => void;
  updateBucketListItem: (id: string, item: Partial<BucketListItem>) => void;
  deleteBucketListItem: (id: string) => void;

  addQuizQuestion: (question: Omit<QuizQuestion, "id">) => void;
  updateQuizQuestion: (id: string, question: Partial<QuizQuestion>) => void;
  deleteQuizQuestion: (id: string) => void;

  updateVault: (vault: Partial<VaultSecret>) => void;
  updateCapsule: (capsule: Partial<TimeCapsule>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      settings: {
        coupleName: "Roshan & Alisha",
        relationshipStartDate: "2022-06-15T18:30:00",
        passcode: "",
        adminPassword: "admin123",
      },
      timeline: [],
      gallery: [],
      locations: [
        { id: "1", lat: 40.7128, lng: -74.0060, title: "Where We Met", description: "The Coffee Bean, NYC. The latte incident." },
        { id: "2", lat: 35.6762, lng: 139.6503, title: "Our Favorite Trip", description: "Tokyo, Japan. Cherry blossoms everywhere." },
        { id: "3", lat: 48.8566, lng: 2.3522, title: "Future Plans", description: "Paris. One day." },
      ],
      bucketList: [
        { id: "1", text: "Visit Japan for Cherry Blossom season", completed: true },
        { id: "2", text: "Learn to cook a 3-course Italian meal together", completed: false },
        { id: "3", text: "Go hot air ballooning in Cappadocia", completed: false },
        { id: "4", text: "Adopt a golden retriever", completed: false },
        { id: "5", text: "Watch the sunrise at the Grand Canyon", completed: false },
        { id: "6", text: "Take a pottery class", completed: true },
      ],
      quiz: [
        { id: "1", question: "Where was our first date?", options: ["The Coffee Bean", "Central Park", "Movie Theater", "Italian Restaurant"], answer: "The Coffee Bean" },
        { id: "2", question: "Who said 'I love you' first?", options: ["Roshan", "Alisha", "It was a tie", "Nobody yet"], answer: "Alisha" },
        { id: "3", question: "What is our song?", options: ["Perfect", "All of Me", "Lover", "Can't Help Falling in Love"], answer: "Lover" },
        { id: "4", question: "What is our dream travel destination?", options: ["Paris", "Tokyo", "Maldives", "New York"], answer: "Tokyo" },
      ],
      vault: {
        hiddenMessage: "Pack your bags!",
        subMessage: "We're going to Italy this summer!",
        code: "AMORE-2025",
      },
      capsule: {
        unlockDate: "2026-06-15T00:00:00",
        message: "If you're reading this, we've made it another year. Remember that fight about the dishwasher? Funny now, right? I love you more than ever.",
      },

      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      addTimelineEvent: (event) =>
        set((state) => ({ timeline: [...state.timeline, { ...event, id: generateId() }] })),
      updateTimelineEvent: (id, event) =>
        set((state) => ({
          timeline: state.timeline.map((e) => (e.id === id ? { ...e, ...event } : e)),
        })),
      deleteTimelineEvent: (id) =>
        set((state) => ({ timeline: state.timeline.filter((e) => e.id !== id) })),

      addGalleryImage: (image) =>
        set((state) => ({ gallery: [...state.gallery, { ...image, id: generateId() }] })),
      updateGalleryImage: (id, image) =>
        set((state) => ({
          gallery: state.gallery.map((i) => (i.id === id ? { ...i, ...image } : i)),
        })),
      deleteGalleryImage: (id) =>
        set((state) => ({ gallery: state.gallery.filter((i) => i.id !== id) })),

      addLocation: (location) =>
        set((state) => ({ locations: [...state.locations, { ...location, id: generateId() }] })),
      updateLocation: (id, location) =>
        set((state) => ({
          locations: state.locations.map((l) => (l.id === id ? { ...l, ...location } : l)),
        })),
      deleteLocation: (id) =>
        set((state) => ({ locations: state.locations.filter((l) => l.id !== id) })),

      addBucketListItem: (item) =>
        set((state) => ({ bucketList: [...state.bucketList, { ...item, id: generateId() }] })),
      updateBucketListItem: (id, item) =>
        set((state) => ({
          bucketList: state.bucketList.map((i) => (i.id === id ? { ...i, ...item } : i)),
        })),
      deleteBucketListItem: (id) =>
        set((state) => ({ bucketList: state.bucketList.filter((i) => i.id !== id) })),

      addQuizQuestion: (question) =>
        set((state) => ({ quiz: [...state.quiz, { ...question, id: generateId() }] })),
      updateQuizQuestion: (id, question) =>
        set((state) => ({
          quiz: state.quiz.map((q) => (q.id === id ? { ...q, ...question } : q)),
        })),
      deleteQuizQuestion: (id) =>
        set((state) => ({ quiz: state.quiz.filter((q) => q.id !== id) })),

      updateVault: (vault) =>
        set((state) => ({ vault: { ...state.vault, ...vault } })),
      updateCapsule: (capsule) =>
        set((state) => ({ capsule: { ...state.capsule, ...capsule } })),
    }),
    {
      name: "roshan-alisha-store",
    }
  )
);
