# Sathi — Memory Companion

An AI-based cognitive gaming and memory assistance platform for elderly dementia
patients, built for the North Eastern Region (NER) context — offline-friendly,
voice-first, and personalized using real family photos and daily routines.

## Project structure

```
sathi-app/
├── index.html          # Main HTML file (structure of the site)
├── css/
│   └── style.css       # All styling
├── js/
│   └── script.js       # All app logic (games, reminders, TTS, data storage)
├── app.py              # Optional Flask server, for local dev
├── requirements.txt    # Python dependency (Flask) for app.py
└── README.md           # This file
```

## How it works (quick technical summary)

- **No external backend or database required.** All patient/caretaker data is
  stored in the browser via `localStorage`.
- **Text-to-speech** uses the browser-native Web Speech API — no API key,
  no cost, works offline once the page has loaded.
- **Photos** are uploaded and stored as Base64 strings directly in the browser.
- **Reminders** use a `setInterval` polling loop that checks the current time
  against saved medicine schedules every 15 seconds.

## Running it locally

### Option A — Just open it (simplest)
Double-click `index.html` — it opens directly in your browser. No server needed.

### Option B — Run via the Python (Flask) server
This is closer to how a real deployed app would work, and is a nice thing to
show a jury if they ask about your backend.

```bash
# 1. Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# 2. Install Flask
pip install -r requirements.txt

# 3. Run the server
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

## Setting up VS Code

1. Open the `sathi-app` folder in VS Code (`File → Open Folder`)
2. Install the **Live Server** extension if you want auto-reload while editing
   HTML/CSS/JS (right-click `index.html` → "Open with Live Server")
3. For the Python server, open a terminal in VS Code (`` Ctrl+` ``) and run the
   commands from Option B above

## Pushing to GitHub

```bash
cd sathi-app
git init
git add .
git commit -m "Initial commit - Sathi memory companion MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

(Create the empty repository on GitHub first — github.com → New repository —
then copy the URL it gives you into the `git remote add origin` line above.)

## Making it live (free hosting)

Since this is a static site (HTML/CSS/JS only, no server-side logic actually
required to run it), **GitHub Pages** is the easiest and free way to host it:

1. Push your code to GitHub (steps above)
2. On your repository page, go to **Settings → Pages**
3. Under "Source", choose the `main` branch and `/ (root)` folder
4. Click **Save** — GitHub will give you a live URL like:
   `https://<your-username>.github.io/<your-repo-name>/`
5. It usually takes 1-2 minutes to go live after saving

> **Note on `app.py`:** GitHub Pages only hosts static files — it will ignore
> `app.py` since it can't run Python. That's fine, since the website doesn't
> need it to function. If you specifically want the Flask server itself to be
> live (e.g. to demonstrate a real backend to the jury), you'd deploy it on a
> platform like **Render** or **PythonAnywhere** instead — ask if you want
> step-by-step instructions for that.

## ⚠️ Before your demo: verify the Bodo translations

The app now supports three languages on the patient dashboard — **English**,
**Hindi**, and **Bodo** (a Tibeto-Burman language widely spoken in Assam).

The Bodo text lives in `js/script.js` inside the `TRANSLATIONS.brx` object.
Lines marked `// [VERIFY]` are best-effort placeholders — **not confirmed by
a native speaker** — while `khulumbai` (the greeting) is a confirmed, correct
word. Please get someone who speaks Bodo (a teammate, family member, or
faculty advisor) to check and correct the `[VERIFY]` lines before presenting
to the jury. Showing an incorrect translation on stage would undercut the
feature more than simply not having it.

Also note: most phones and browsers do not currently ship a Bodo text-to-
speech voice. The app detects this and shows a small honest note on screen
("voice not available on this device, showing text only") instead of
pretending to speak it — this is a real, explainable platform limitation
worth mentioning proactively if a jury member asks.

## Known limitations (good to mention proactively to the jury)

- Data is stored per-browser (`localStorage`), not synced across devices —
  a production version would need a real backend + database
- Browser text-to-speech does not support most North Eastern languages well;
  pre-recorded audio clips would be the practical fix for regional languages
- Question generation is rule-based, not machine-learning based — this was a
  deliberate scope decision to keep the MVP reliable and demoable within the
  hackathon timeframe
