from flask import Flask, render_template, request, send_file
import requests, tempfile

app = Flask(__name__)

def fetch_tikwm(url):
    api = "https://tikwm.com/api/"
    res = requests.post(api, data={"url": url}).json()

    if res.get("code") != 0:
        return None

    data = res["data"]

    return {
        "no_watermark": data["play"],
        "wm": data["wmplay"],
        "music": data["music"],
        "author": data["author"]["unique_id"],
        "title": data["title"],
        "date": data["create_time"]
    }

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    url = request.form.get("url")
    video = fetch_tikwm(url)
    return render_template("index.html", video=video)

@app.route("/download_video")
def download_video():
    url = request.args.get("url")
    file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    file.write(requests.get(url).content)
    file.seek(0)
    return send_file(file.name, as_attachment=True, download_name="video.mp4")

@app.route("/download_audio")
def download_audio():
    url = request.args.get("url")
    file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    file.write(requests.get(url).content)
    file.seek(0)
    return send_file(file.name, as_attachment=True, download_name="audio.mp3")


def handler(event, context):
    return app(event, context)
