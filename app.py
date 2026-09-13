"""
Sathi - Memory Companion
-------------------------
A lightweight Flask server that serves the website locally.

This is the "backend" for local development and demoing on your laptop.
The website itself (HTML/CSS/JS) is fully self-contained and stores all
data in the browser's localStorage - no database is required for the MVP.

Run it with:
    pip install -r requirements.txt
    python app.py

Then open: http://127.0.0.1:5000
"""

from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder=".", static_url_path="")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.route("/")
def index():
    """Serve the main website."""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    """Serve CSS, JS, and any other static assets."""
    return send_from_directory(BASE_DIR, path)


if __name__ == "__main__":
    # debug=True auto-reloads the server when you edit files - handy while coding.
    # Turn it off (debug=False) if you ever deploy this Flask server publicly.
    app.run(debug=True, port=5000)
