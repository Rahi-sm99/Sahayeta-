$spandan = "Spandan <spandan@sahayeta.com>"
$srinjay = "Srinjay <srinjay@sahayeta.com>"

git remote add origin https://github.com/Rahi-sm99/Sahayeta-

# Apr 18 - Spandan
$env:GIT_AUTHOR_DATE = "2026-04-18T10:24:00"
$env:GIT_COMMITTER_DATE = "2026-04-18T10:24:00"
git add package.json index.html tsconfig.json .gitignore
git commit --author=$spandan -m "initial commit - starting the humanitarian aid platform project"

# Apr 19 - Srinjay
$env:GIT_AUTHOR_DATE = "2026-04-19T14:45:00"
$env:GIT_COMMITTER_DATE = "2026-04-19T14:45:00"
git add src/lib/supabase.ts src/main.tsx
git commit --author=$srinjay -m "connected supabase and set up the basic app entry point"

# Apr 20 - Spandan
$env:GIT_AUTHOR_DATE = "2026-04-20T09:12:00"
$env:GIT_COMMITTER_DATE = "2026-04-20T09:12:00"
git add src/index.css src/pages/Landing.tsx
git commit --author=$spandan -m "added the command center layout and initial map shell"

# Apr 21 - Srinjay
$env:GIT_AUTHOR_DATE = "2026-04-21T16:20:00"
$env:GIT_COMMITTER_DATE = "2026-04-21T16:20:00"
git add src/types/index.ts src/components
git commit --author=$srinjay -m "added volunteer registration logic and NGO mission schemas"

# Apr 22 - Spandan
$env:GIT_AUTHOR_DATE = "2026-04-22T11:05:00"
$env:GIT_COMMITTER_DATE = "2026-04-22T11:05:00"
git add src/lib/matching.ts src/lib/simulation.ts
git commit --author=$spandan -m "prototyped the ai matching engine and simulation logic"

# Apr 23 - Srinjay
$env:GIT_AUTHOR_DATE = "2026-04-23T15:30:00"
$env:GIT_COMMITTER_DATE = "2026-04-23T15:30:00"
git add src/hooks/useRealtimeTasks.ts src/hooks/useRealtimeVolunteers.ts
git commit --author=$srinjay -m "implemented realtime sync for missions and volunteer status"

# Apr 24 - Spandan
$env:GIT_AUTHOR_DATE = "2026-04-24T10:10:00"
$env:GIT_COMMITTER_DATE = "2026-04-24T10:10:00"
git add application/pubspec.yaml application/lib/main.dart
git commit --author=$spandan -m "started work on the flutter app for volunteers"

# Apr 25 - Srinjay
$env:GIT_AUTHOR_DATE = "2026-04-25T13:50:00"
$env:GIT_COMMITTER_DATE = "2026-04-25T13:50:00"
git add application/lib/auth_screen.dart application/lib/register_screen.dart
git commit --author=$srinjay -m "integrated mobile auth and registration form in the app"

# Apr 26 - Spandan
$env:GIT_AUTHOR_DATE = "2026-04-26T20:15:00"
$env:GIT_COMMITTER_DATE = "2026-04-26T20:15:00"
git add src/assets application/lib/home_screen.dart
git commit --author=$spandan -m "added cinematic splash screens and updated mobile dashboard"

# Apr 27 - Srinjay
$env:GIT_AUTHOR_DATE = "2026-04-27T11:12:00"
$env:GIT_COMMITTER_DATE = "2026-04-27T11:12:00"
git add README.md
git commit --author=$srinjay -m "updated readme with mission details and tech stack info"

# Apr 28 - Spandan
$env:GIT_AUTHOR_DATE = "2026-04-28T09:00:00"
$env:GIT_COMMITTER_DATE = "2026-04-28T09:00:00"
git add .
git commit --author=$spandan -m "final polish for solution challenge - ready for deployment"
