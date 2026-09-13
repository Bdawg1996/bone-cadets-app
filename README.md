# Bone Cadets Tracker — private web app

A passcode-gated income tracker. Frontend on Vercel, data in Supabase Postgres.
Your passcode and database keys live in Vercel environment variables — never in the code.

Everything here runs on free tiers.

---

## What you'll set up (≈20 min, one time)

1. A **Supabase** project (the cloud database)
2. A **Vercel** project (hosts the app)
3. Three **environment variables** wiring them together

---

## Step 1 — Supabase (database)

1. Go to supabase.com, sign up, **New project**. Pick a name + a strong database password (you won't need it again). Region: closest to you.
2. Wait ~2 min for it to spin up.
3. Left sidebar → **SQL Editor** → **New query**. Paste the entire contents of `schema.sql`, click **Run**. You should see "Success".
4. Left sidebar → **Project Settings** (gear) → **API**. Copy these two values, you'll need them:
   - **Project URL**  → this is `SUPABASE_URL`
   - **service_role key** (under "Project API keys", click reveal) → this is `SUPABASE_SERVICE_KEY`
   - ⚠️ The service_role key is powerful. It only ever lives in Vercel's env vars, never in the app. Don't paste it anywhere public.

## Step 2 — Put the code on GitHub

1. Create a new **private** repo on github.com.
2. Upload this whole `bonecadets-app` folder to it (drag-drop in the GitHub web UI works, or use git).

## Step 3 — Vercel (hosting)

1. Go to vercel.com, sign up **with your GitHub account**.
2. **Add New → Project** → import your `bonecadets-app` repo.
3. Before clicking Deploy, open **Environment Variables** and add three:

   | Name | Value |
   |------|-------|
   | `APP_PASSCODE` | whatever passcode you want (e.g. a number or word only you know) |
   | `SUPABASE_URL` | the Project URL from Step 1 |
   | `SUPABASE_SERVICE_KEY` | the service_role key from Step 1 |

4. Click **Deploy**. Wait ~1 min.
5. Vercel gives you a URL like `bonecadets-app-xxxx.vercel.app`. Open it.
6. Enter your passcode → you're in.

## Step 4 — Make it feel like an app

On your phone, open the Vercel URL in Safari/Chrome → **Share → Add to Home Screen**.
Now it's an icon. It syncs to the cloud, so you can open it on your laptop too with the same passcode.

---

## Changing your passcode later

Vercel dashboard → your project → **Settings → Environment Variables** → edit `APP_PASSCODE` →
then **Deployments → ⋯ → Redeploy** so the change takes effect. (Anyone already logged in on a
device stays logged in until they log out, since the passcode is cached locally.)

## Notes

- **Offline:** the app caches your data on the device and keeps working with no signal. Entries sync
  when you're back online. The cloud dot (top right) shows status.
- **Backup:** your data lives in Supabase (cloud). The **Export CSV** button in Settings gives you a
  download anytime — good to grab before tax season.
- **Security model:** the passcode is checked server-side on every API call. The database key never
  reaches the browser. This is "one strong passcode" security — good for a personal tool. Don't share
  the passcode and you're the only one who can read or write.
