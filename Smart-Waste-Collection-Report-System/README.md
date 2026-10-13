# WasteWise — Smart Waste Collection Report System

A web app for municipal waste management in Sri Lanka and similar councils.

- **Citizens** report garbage problems with a map pin and photos, track each complaint's status, get notifications, and view collection schedules for their zone.
- **Municipal admins** see every report on a live map, triage and assign work, update statuses, manage collection zones and weekly schedules, manage users, and analyse waste data (volumes, resolution times, zone and worker performance, CSV export).
- **Workers** see the tasks assigned to them, start jobs, and mark them complete with completion photos.

Stack: React 19 + TypeScript + Vite, React Router, react-hook-form, Tailwind CSS v4, Leaflet (OpenStreetMap tiles), Firebase Authentication, Cloud Firestore and Cloud Storage.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests + app smoke test
npm run lint
npm run build
```

## Roles and routes

| Role | Sign-in page | Home | Pages |
| --- | --- | --- | --- |
| `citizen` | `/login` · register at `/register` | `/citizen/dashboard` | New report `/citizen/report/new`, report detail `/citizen/reports/:id`, schedules `/citizen/schedules`, notifications `/citizen/notifications` |
| `worker` | `/worker/login` · register at `/worker/register` | `/worker/dashboard` | My tasks `/worker/tasks`, task detail `/worker/tasks/:id` |
| `admin` | `/admin/login` (no public sign-up) | `/admin/dashboard` | Reports `/admin/reports`, map `/admin/map`, zones `/admin/zones`, schedules `/admin/schedules`, analytics `/admin/analytics`, users & workers `/admin/users` |

Route guards (`src/components/RequireRole.tsx`) check the signed-in user's role from Firestore. Signing in on the wrong portal is rejected with a clear message.

### Report lifecycle

`pending` → `assigned` (admin picks a worker) → `in_progress` (worker starts) → `resolved` (worker uploads completion photos). Admins can also set `rejected`. Every change is appended to the report's timeline, and the citizen is notified of meaningful changes; a worker is notified when assigned.

## Firebase setup (one-time)

The project is wired to the Firebase project `waste-collection-report-system` in `src/services/firebase.ts`.

1. **Authentication** → Sign-in method → enable **Email/Password**.
2. **Firestore Database** → create a database (production mode).
3. **Storage** → get started (for report and completion photos).
4. **Deploy the security rules** (they enforce the role model on the server, not just in the UI):
   ```bash
   npx firebase-tools login
   npx firebase-tools use waste-collection-report-system
   npx firebase-tools deploy --only firestore:rules,storage
   ```
   The rules are in `firestore.rules` and `storage.rules`; `firebase.json` points at them.
5. **Create the first admin.** Public sign-up cannot create admins. Register one account at `/register`, then in the Firebase console open **Firestore → users → {uid}** (the uid is shown under Authentication) and set `role` to `admin`. That admin can promote other users from **Users & workers**.
6. As admin, create **zones** (centre + radius on the map) and **schedules** (weekly pickups per zone). Citizens choose their zone on their dashboard.

Firestore data model:

| Collection | Purpose |
| --- | --- |
| `users/{uid}` | name, email, `role`, `zoneId` |
| `reports/{id}` | report fields, status, priority, assignment, photo URLs |
| `reports/{id}/events/{id}` | append-only timeline |
| `zones/{id}` | name, centre `{lat,lng}`, `radiusM` |
| `schedules/{id}` | zone, waste type, day of week, `HH:MM`, active flag |
| `notifications/{id}` | per-user in-app notifications |

Photos are stored under `reports/{reportId}/…` in Cloud Storage.

## Notes and limitations

- Notifications are **in-app** (bell/notification pages). Email or push notifications need Cloud Functions, which require the Firebase Blaze plan.
- Addresses are typed by the citizen alongside the map pin; there is no reverse geocoding.
- Public worker registration creates a worker account immediately. Workers can only see tasks assigned to them, but if you want council approval first, add an `approved` flag and check it in the rules.
- The map uses public OpenStreetMap tiles, which need internet access in the browser.
- The Firebase web config is public by design. Access is controlled by the security rules, which should be reviewed before production use.
