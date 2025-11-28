# LimosPro Admin Panel - Quick Reference

## 🚀 Quick Start
# Ensure Bun version >= 1.3.x (`bun -v`)
```

## 🔑 Environment Variables

```env
VITE_GOOGLE_MAP_KEY=your_google_maps_api_key
VITE_API_USER_SERVICE_URL=https://user-service-url
VITE_API_ADMIN_SERVICE_URL=https://admin-service-url
VITE_API_BOOKING_SERVICE_URL=https://booking-service-url
```

## 📋 Feature Modules Overview

| Module | Routes | Key Features |
|--------|--------|--------------|
| **Dashboard** | `/dashboard` | Analytics, KPIs, Charts |
| **Users** | `/users`, `/users/create`, `/users/edit/:id` | User CRUD, Role assignment |
| **Fleet** | `/fleets`, `/fleets/create`, `/fleets/edit/:id` | Vehicle management |
| **Chauffeur** | `/chauffeur`, `/chauffeur/create` | Driver management |
| **Bookings** | `/bookings`, `/bookings/:id` | Booking management |
| **Trips** | `/trips`, `/trips/:id`, `/trips/map/:id` | Trip tracking, Live map |
| **Payments** | `/payments`, `/refund`, `/refund-requests` | Financial transactions |
| **Regional** | `/region`, `/region-admin` | Multi-region support |
| **Affiliates** | `/affiliate` | Partner management |
| **Crew/Staff** | `/crew-members`, `/staff-members` | Staff management |
| **Content** | `/content_management/pages` | CMS |
| **Blogs** | `/blog-posts` | Blog management |
| **News** | `/news` | News articles |
| **FAQs** | `/faq` | FAQ management |
| **Testimonials** | `/testimonials` | Customer reviews |
| **Partners** | `/our-partners` | Business partners |
| **Contact** | `/contact-requests` | Customer inquiries |
| **IP Whitelist** | `/ip-whitelist` | Security |
| **Reports** | `/reports` | Analytics reports |
| **Settings** | `/settings` | Configuration |
| **SEO** | `/seo` | SEO optimization |

## 🔐 Common User Roles

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Super Admin** | `accessAllFeatures` | Full access |
| **Regional Admin** | `manageRegion*` | Regional operations |
| **SEO Agent** | `optimizeContent` | Content & SEO |
| **Fleet Manager** | `manageFleet`, `manageChauffeurs` | Fleet operations |
| **Affiliate Manager** | `manageAffiliates` | Affiliates only |

## 🛠 Common Commands

```bash
# Development (npm / bun)
npm run dev    / bun run dev         # Start dev server
npm run build  / bun run build       # Build for production
npm run preview / bun run preview    # Preview production build

# Code Quality (npm / bun)
npm run lint      / bun run lint         # Run linter
npm run lint:fix  / bun run lint:fix     # Fix linting issues
npm run format    / bun run format       # Format code
npm run check     / bun run check        # Check code quality
npm run check:fix / bun run check:fix    # Fix all issues

# Analysis (npm / bun)
npm run analyze  / bun run analyze       # Build bundle analysis
npm run checkDep / bun run checkDep      # Check dependencies
```

## 🎨 UI Components Quick Reference

### Form Components
`button`, `input`, `textarea`, `select`, `multi-select`, `checkbox`, `switch`, `calendar`, `field`

### File Upload
`image-upload`, `multiple-image-upload`, `upload-files`, `upload-with-url`, `upload-inline-file`

### Data Display
`table`, `card`, `badge`, `avatar`, `chart`

### Navigation
`sidebar`, `breadcrumb`, `tabs`, `pagination`

### Feedback
`alert`, `toast`, `sonner`, `dialog`, `drawer`, `popover`, `hover-card`, `tooltip`

### Layout
`accordion`, `collapsible`, `separator`, `sheet`, `skeleton`

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.1.0 | UI Framework |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 7.0.4 | Build Tool |
| TailwindCSS | 4.1.11 | Styling |
| TanStack Query | 5.83.0 | Server State |
| Zustand | 5.0.6 | Client State |
| React Router | 7.7.0 | Routing |
| React Hook Form | 7.60.0 | Forms |
| Zod | 4.0.5 | Validation |
| Chart.js | 4.5.1 | Charts |
| Leaflet | 1.9.4 | Maps |

## 🔗 API Services

### User Service
`login`, `users`, `roles`, `permissions`

### Admin Service  
`chauffeur`, `fleet`, `crew`, `staff`, `region`, `content`, `faq`, `news`, `testimonials`, `partners`, `ipWhiteList`, `seo`

### Booking Service
`bookings`, `trips`, `payments`, `refunds`, `contactRequests`

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Environment error on startup | Check `.env` file and variables |
| API calls failing | Verify backend is running and URLs are correct |
| Permission denied | Re-login or check permission mappings |
| Build failures | Clear cache: `rm -rf node_modules dist && npm install` (or `bun install`) |
| Maps not loading | Verify `VITE_GOOGLE_MAP_KEY` |

## 📚 Documentation Files

- `ADMIN_PANEL_DOCUMENTATION.md` - Complete documentation
- `DYNAMIC_PERMISSIONS_GUIDE.md` - Permission system
- `LOGIN_TESTING_GUIDE.md` - Login testing
- `src/components/pagination/USAGE_GUIDE.md` - Pagination usage

## 🎯 Project Structure

```
src/
├── api/                # 41+ API modules
├── components/         # UI components
│   ├── ui/            # 46 base components
│   └── [features]/    # Feature components
├── pages/             # 28+ page modules
├── routes/            # Route config
├── hooks/             # Custom hooks
├── lib/               # Libraries
└── utils/             # Utilities
```

## 🚢 Deployment

```bash
# Build (choose one)
npm run build
# or with bun (faster)
bun run build

# Deploy to Vercel
vercel --prod

# Output
dist/
```

## 📞 Need Help?

1. Check `ADMIN_PANEL_DOCUMENTATION.md`
2. Review troubleshooting section
3. Check existing guides
4. Contact development team
