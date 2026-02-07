# Ecosphere - Tech Stack

## 🏗️ Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with SSR, routing, API routes |
| **React** | 19 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |

---

## 🎨 Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.1.9 | Utility-first CSS framework |
| **Radix UI** | Various | Accessible, unstyled UI primitives |
| **Lucide React** | 0.454.0 | Icon library |
| **class-variance-authority** | 0.7.1 | Component variant management |
| **tailwind-merge** | 2.5.5 | Merge Tailwind classes intelligently |
| **tailwindcss-animate** | 1.0.7 | Animation utilities |

### Radix UI Components Used
- Accordion, Alert Dialog, Avatar, Checkbox
- Dialog, Dropdown Menu, Popover, Progress
- Select, Slider, Switch, Tabs, Toast, Tooltip

---

## 📊 Data & State Management

| Technology | Purpose |
|------------|---------|
| **React Context API** | Global state (EcosphereProvider) |
| **React Hook Form** | Form handling & validation |
| **Zod** | Schema validation |
| **date-fns** | Date manipulation |

---

## 🔌 External APIs

| API | Purpose |
|-----|---------|
| **GNews API** | Environmental news fetching |
| **Open Food Facts API** | Product barcode lookup & data |

---

## 📦 Key Features & Libraries

| Library | Purpose |
|---------|---------|
| **react-qr-barcode-scanner** | Camera barcode scanning |
| **Recharts** | Data visualization & charts |
| **Embla Carousel** | Image/content carousels |
| **Sonner** | Toast notifications |
| **Vaul** | Drawer components |
| **next-themes** | Dark/light mode support |
| **cmdk** | Command palette |

---

## 🛠️ Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 8.57.1 | Code linting |
| **PostCSS** | 8.5 | CSS processing |
| **Turbopack** | Built-in | Fast bundler (Next.js) |

---

## 🚀 Deployment

| Platform | Purpose |
|----------|---------|
| **Vercel** | Hosting & CI/CD |
| **GitHub** | Version control |

---

## 📁 Project Structure

```
Ecosphere/
├── app/                    # Next.js App Router pages
│   ├── events/            # Community events
│   ├── learn/             # Educational content & news
│   ├── login/             # Authentication
│   ├── profile/           # User profile
│   ├── scanner/           # Barcode product scanner
│   ├── services/          # Recycling locator, calculators
│   ├── store/             # Eco-friendly products
│   ├── tracker/           # Habit tracking
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── eco-chatbot.tsx    # AI Eco-Assistant
│   ├── ecosphere-provider.tsx  # Global state
│   └── auth-provider.tsx  # Authentication context
└── public/                # Static assets
```

---

## ✨ Key Features

1. **Product Scanner** - Scan barcodes for eco-scores with API fallback
2. **AI Eco-Assistant** - Chatbot for sustainability questions & waste classification
3. **Carbon Calculator** - Calculate personal carbon footprint
4. **Recycling Locator** - Find recycling centers in Mumbai
5. **Habit Tracker** - Track eco-friendly daily habits
6. **Environmental News** - Real-time news from GNews API
7. **Eco Store** - Browse sustainable products
8. **Community Events** - Join local environmental events
