// The heartbeat of Amoria.
// All personal data is stored here to allow for easy updating without touching component logic.

export const SITE_CONFIG = {
  coupleName: "Roshan & Alisha",
  relationshipStartDate: "2022-06-15T18:30:00", // ISO String
  passcode: "forever2025",
  music: {
    title: "Our Song",
    src: "/audio/bg-music.mp3",
  }
};

export const TIMELINE_EVENTS = [
  {
    date: "2022-06-15",
    title: "The First Hello",
    description: "We met at that tiny coffee shop on 4th street. You spilled your latte. I laughed.",
    image: "/placeholder/first-meet.jpg",
  },
  {
    date: "2022-08-01",
    title: "Making it Official",
    description: "A sunset walk by the pier. You asked, I said yes.",
    image: "/placeholder/official.jpg",
  },
  {
    date: "2022-12-25",
    title: "Our First Christmas",
    description: "Snowed in at the cabin. The worst hot cocoa ever, but the best company.",
    image: "/placeholder/christmas.jpg",
  },
  {
    date: "2023-06-15",
    title: "One Year",
    description: "Dinner at the place where we had our first date. No spilled lattes this time.",
    image: "/placeholder/anniversary.jpg",
  },
  {
    date: "2024-03-10",
    title: "The Big Trip",
    description: "Two weeks in Japan. Cherry blossoms, sushi, and getting lost in Tokyo station.",
    image: "/placeholder/japan.jpg",
  }
];

export const MAP_LOCATIONS = [
  {
    id: 1,
    lat: 40.7128,
    lng: -74.0060,
    title: "Where We Met",
    description: "The Coffee Bean, NYC. The latte incident.",
  },
  {
    id: 2,
    lat: 35.6762,
    lng: 139.6503,
    title: "Our Favorite Trip",
    description: "Tokyo, Japan. Cherry blossoms everywhere.",
  },
  {
    id: 3,
    lat: 48.8566,
    lng: 2.3522,
    title: "Future Plans",
    description: "Paris. One day.",
  }
];

export const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/placeholder/gallery-1.jpg",
    alt: "Smiling in the rain",
    category: "Candid"
  },
  {
    id: 2,
    src: "/placeholder/gallery-2.jpg",
    alt: "Sunset at the beach",
    category: "Nature"
  },
  {
    id: 3,
    src: "/placeholder/gallery-3.jpg",
    alt: "Coffee date",
    category: "Food"
  },
  {
    id: 4,
    src: "/placeholder/gallery-4.jpg",
    alt: "Holding hands",
    category: "Details"
  },
  {
    id: 5,
    src: "/placeholder/gallery-5.jpg",
    alt: "Road trip vibes",
    category: "Travel"
  },
  {
    id: 6,
    src: "/placeholder/gallery-6.jpg",
    alt: "Lazy Sunday",
    category: "Home"
  }
];

export const VAULT_SECRET = {
  hiddenMessage: "Pack your bags!",
  subMessage: "We're going to Italy this summer! 🇮🇹",
  code: "AMORE-2025"
};

export const QUIZ_QUESTIONS = [
  {
    question: "Where was our first date?",
    options: ["The Coffee Bean", "Central Park", "Movie Theater", "Italian Restaurant"],
    answer: "The Coffee Bean"
  },
  {
    question: "Who said 'I love you' first?",
    options: ["Roshan", "Alisha", "It was a tie", "Nobody yet"],
    answer: "Alisha"
  },
  {
    question: "What is our song?",
    options: ["Perfect", "All of Me", "Lover", "Can't Help Falling in Love"],
    answer: "Lover"
  },
  {
    question: "What is our dream travel destination?",
    options: ["Paris", "Tokyo", "Maldives", "New York"],
    answer: "Tokyo"
  }
];

export const BUCKET_LIST = [
  { id: 1, text: "Visit Japan for Cherry Blossom season", completed: true },
  { id: 2, text: "Learn to cook a 3-course Italian meal together", completed: false },
  { id: 3, text: "Go hot air ballooning in Cappadocia", completed: false },
  { id: 4, text: "Adopt a golden retriever", completed: false },
  { id: 5, text: "Watch the sunrise at the Grand Canyon", completed: false },
  { id: 6, text: "Take a pottery class", completed: true },
];

export const TIME_CAPSULE = {
  unlockDate: "2026-06-15T00:00:00", // Future date
  message: "If you're reading this, we've made it another year. Remember that fight about the dishwasher? Funny now, right? I love you more than ever.",
  image: "/placeholder/capsule-memory.jpg"
};
