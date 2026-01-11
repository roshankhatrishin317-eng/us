# Roshan & Alisha 💕

A beautiful, private digital space to celebrate and preserve your relationship memories. Built with love using Next.js 16.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## ✨ Features

### For You & Your Partner
- **Timeline** - Document your relationship milestones with photos and stories
- **Gallery** - Store and showcase your favorite memories together
- **Interactive Map** - Pin locations that are special to you
- **Quiz** - Test how well you know each other
- **Bucket List** - Track adventures and dreams together
- **Time Capsule** - Write messages to your future selves
- **Secret Vault** - A password-protected space for special messages

### Admin Panel
- Full content management system at `/admin`
- Add, edit, and delete all content types
- Upload images and videos directly (via Vercel Blob)
- Configure site settings (names, dates, passcodes)

### Design
- Romantic Rose & Digital Lavender color palette
- Glassmorphism UI with soft animations
- Floating hearts and elegant typography
- Fully responsive for mobile and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/roshankhatrishin317-eng/us.git
cd us

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## 🔐 Default Passwords

| Area | Password |
|------|----------|
| Site Access | `143143` |
| Admin Panel | `admin123` |
| Secret Vault | `143143` |

> ⚠️ Change these in the admin panel before deploying!

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Deploy!

### Enable Image Uploads

After deploying to Vercel:

1. Go to your project dashboard
2. Click **Storage** → **Create** → **Blob**
3. Follow the setup wizard
4. The `BLOB_READ_WRITE_TOKEN` is auto-added to your environment
5. Redeploy to enable uploads

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with localStorage persistence)
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **Storage**: Vercel Blob
- **UI Components**: shadcn/ui patterns

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel (settings, timeline, gallery, locations, quiz, bucket-list, capsule, vault)
│   ├── api/upload/     # File upload API (Vercel Blob)
│   ├── bucket-list/    # Bucket list page
│   ├── capsule/        # Time capsule page
│   ├── gallery/        # Photo gallery
│   ├── map/            # Interactive map
│   ├── quiz/           # Relationship quiz
│   ├── timeline/       # Timeline of events
│   ├── vault/          # Secret vault
│   └── page.tsx        # Home page with 3D portal experience
├── components/
│   ├── ui/             # Shadcn-style UI primitives (button, card, dialog, input, switch, etc.)
│   ├── audio-player.tsx
│   ├── image-upload.tsx
│   ├── magical-particles.tsx
│   ├── map-component.tsx
│   ├── map-view.tsx
│   ├── portal-3d.tsx
│   └── scroll-sections.tsx
└── lib/
    ├── store.ts        # Zustand state management (with localStorage persistence)
    ├── data.ts         # Static data
    ├── use-hydrated.ts # Hydration hook for SSR
    └── utils.ts        # cn() utility for className merging
```

## 🎨 Customization

### Change Colors
Edit `src/app/globals.css` to modify the color palette:

```css
:root {
  --primary: 0.65 0.15 10;      /* Romantic Rose */
  --secondary: 0.85 0.08 280;   /* Digital Lavender */
  --accent: 0.75 0.12 25;       /* Warm accent */
}
```

### Update Content
1. Go to `/admin` and login
2. Use the sidebar to navigate to different sections
3. Add, edit, or delete content as needed

## 📝 Environment Variables

Create a `.env.local` file for local development:

```env
# Required for image uploads (get from Vercel Blob)
BLOB_READ_WRITE_TOKEN=your_token_here
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own relationship!

## 📄 License

MIT License - Use it however you'd like.

---

Made with 💕 for Roshan & Alisha
