# Hospitable Dashboard

An interactive web dashboard for managing Hospitable vacation rentals, built with Next.js 14 and shadcn/ui components.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` if your backend is not running on `localhost:8000`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Dashboard Overview**: Quick stats for properties, reservations, messages, and reviews
- **Properties Management**: View and manage all vacation rental properties
- **Reservations**: Track bookings with guest information and status
- **Messages**: (Coming soon) Send and receive guest messages
- **Reviews**: (Coming soon) Manage property reviews
- **Settings**: View user info and token permissions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Client**: Custom fetch-based client

## Project Structure

```
dashboard/
├── app/                    # App router pages
│   ├── page.tsx           # Dashboard home
│   ├── properties/        # Properties page
│   ├── reservations/      # Reservations page
│   ├── messages/          # Messages page
│   ├── reviews/           # Reviews page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── dashboard-nav.tsx  # Navigation component
└── lib/
    ├── api.ts             # API client
    └── utils.ts           # Utilities

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Authentication

The dashboard uses token-based authentication. On first visit, you'll be prompted to enter your Hospitable API token.

**Getting Your Token:**
1. Go to [my.hospitable.com](https://my.hospitable.com)
2. Navigate to Apps → API access → Access tokens
3. Click + Add new and select permissions
4. Copy and paste the token

The token is stored in browser localStorage for subsequent visits.

## Development

### Adding New Components

shadcn/ui components are located in `components/ui/`. To add a new component, create a new file in this directory following the existing pattern.

### Adding New Pages

1. Create a new directory in `app/` (e.g., `app/analytics/`)
2. Add a `page.tsx` file in that directory
3. Update `components/dashboard-nav.tsx` to add navigation

### API Integration

The API client is in `lib/api.ts`. To add new endpoints:

1. Add the method to the `HospitableAPI` class
2. Use it in your page components with `import { api } from '@/lib/api'`

## Customization

### Theming

Colors and design tokens are defined in `app/globals.css` using CSS variables. Modify these to change the look and feel:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... more variables */
}
```

### Navigation

Edit `components/dashboard-nav.tsx` to modify the sidebar navigation.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Build Manually

```bash
npm run build
npm start
```

The built app will be in the `.next` directory.

## Troubleshooting

**Problem**: Can't connect to API
- **Solution**: Make sure the backend is running on `http://localhost:8000`

**Problem**: Authentication fails
- **Solution**: Check that your Hospitable token is valid

**Problem**: Styles not loading
- **Solution**: Clear `.next` cache: `rm -rf .next && npm run dev`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Hospitable API Documentation](https://developer.hospitable.com/docs/public-api-docs/)

## License

MIT
