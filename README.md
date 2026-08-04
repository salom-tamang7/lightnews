# Light News

A bilingual (Nepali / English) news website with a built-in admin panel, built with Next.js, Drizzle ORM, and SQLite.

## What's included

- **Public site** — homepage, category pages, article pages, search, author pages. Every reader can switch between Nepali and English with a toggle in the header (saved as a cookie).
- **Admin panel** at `/admin` — login, dashboard, create/edit/delete articles (with bilingual fields and image upload), and category management.
- **Security** — hashed passwords (bcrypt), signed session cookies (not stored server-side), protected admin routes, brute-force login protection, and parameterized database queries (no SQL injection).

## 1. Local setup

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `SESSION_SECRET` — generate one with `openssl rand -base64 48`. This signs admin login sessions; keep it secret and never commit it.
- `SEED_ADMIN_PASSWORD` — the password for your first admin account (used only once, by the seed script below).
- `SEED_ADMIN_EMAIL` — the email for that first admin account (defaults to admin@lightnews.com if left blank).

Then set up the database:

```bash
npm run db:migrate   # creates the SQLite database and tables
npm run db:seed       # creates your first admin user + the default categories
```

Run it:

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin/login` to sign in with the admin email/password you set above.

**Important:** After seeding, consider removing `SEED_ADMIN_PASSWORD` from your `.env` (or just don't run `db:seed` again) — it's only read once, when there are no existing users.

## 2. Using the admin panel

- **Add categories first** (Categories → Add category) if you want anything beyond the 7 defaults: News, Sports, Technology, Agriculture, Opinion, Entertainment, Editorial.
- **Write an article**: New article → fill in both the English and Nepali title/excerpt/content, pick a category, upload a cover image, and set status to "Published" (or leave as "Draft" to work on it privately first).
- Paragraphs in the content box are separated by a blank line — that's how the article page decides where to break paragraphs.
- Each article gets a URL slug automatically from the English title (e.g. `/article/my-headline`).

## 3. Adding more admin/editor accounts

There's no "invite user" UI yet (kept out of scope for v1). To add a second account, run a one-off script, for example:

```bash
npx tsx -e "
import { db, schema } from './src/lib/db';
import { hashPassword } from './src/lib/auth/password';
const passwordHash = await hashPassword('choose-a-strong-password');
await db.insert(schema.users).values({ name: 'Reporter Name', email: 'reporter@yourdomain.com', passwordHash, role: 'editor' });
console.log('done');
"
```

## 4. Deploying to production

This app needs a **persistent Node.js server** (not a static host) because it writes to a SQLite file and to `public/uploads/`. Two straightforward options:

### Option A — A VPS (DigitalOcean, Linode, Hetzner, etc.) — recommended for SQLite

1. Provision a small Ubuntu server, install Node.js 20+, and clone your code onto it.
2. `npm install && npm run build`
3. Create `.env` on the server with a **freshly generated** `SESSION_SECRET` (don't reuse your local dev one) and run `npm run db:migrate && npm run db:seed`.
4. Run the app with a process manager so it restarts on crash/reboot:
   ```bash
   npm install -g pm2
   pm2 start "npm run start" --name lightnews
   pm2 save
   pm2 startup
   ```
5. Put Nginx in front of it as a reverse proxy to `localhost:3000`, and use **Certbot** (Let's Encrypt) for a free HTTPS certificate. HTTPS is essential — never run the admin login over plain HTTP.
6. Point your domain's DNS A record at the server's IP.
7. **Back up `data/lightnews.db` and `public/uploads/` regularly** (a simple cron job copying them somewhere off-server is enough at this scale).

### Option B — A managed platform (Vercel, Railway, Render, etc.)

These platforms are easiest for the Next.js app itself, but most don't offer persistent local disk storage, which SQLite and local image uploads both need. If you go this route:
- Swap SQLite for a hosted Postgres/MySQL database (Drizzle supports both — the schema in `src/lib/db/schema.ts` would need its column types adjusted slightly, and `src/lib/db/index.ts` would point at the new database instead of a file).
- Swap local image uploads (`src/lib/actions/upload.ts`) for an object storage service (e.g. Cloudflare R2, AWS S3, or the platform's built-in blob storage).
- I'm happy to make either of these swaps if you tell me which platform you'd like to deploy to.

### Either way, before going live:
- [ ] Generate a new `SESSION_SECRET` for production (don't reuse the dev one)
- [ ] Change the seeded admin password to something you actually want to keep using
- [ ] Set up HTTPS
- [ ] Set up a backup routine for `data/lightnews.db` and `public/uploads/`

## 5. Project structure

```
src/app/(public)/      Public site pages (homepage, category, article, search, author)
src/app/admin/         Admin panel pages
src/lib/db/            Database schema and connection
src/lib/queries/       Read-only database queries
src/lib/actions/       Server actions (create/edit/delete/login — all the "write" operations)
src/lib/auth/          Password hashing, session tokens, login rate-limiting
src/lib/i18n/          Nepali/English text dictionary and locale detection
src/components/        Shared UI (header, footer, article cards, admin forms)
```

## 6. Changing the design

Colors, fonts, and the flame logo mark live in:
- `src/app/globals.css` — color tokens and fonts
- `src/components/FlameMark.tsx` — the logo/signature mark
- `src/app/layout.tsx` — font `<link>` tags (currently: Fraunces, Source Serif 4, Noto Serif/Sans Devanagari, IBM Plex Mono, all from Google Fonts)

If you want a different name, tagline, or color scheme, just let me know and I can update it directly.
