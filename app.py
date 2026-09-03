"""Steady - a student stress and workload manager."""

from flask import Flask, render_template

app = Flask(__name__)
app.config["SECRET_KEY"] = "steady-hackathon-demo-key"


@app.route("/")
def index():
    """Serve the single-page Steady dashboard."""
    return render_template("index.html")


@app.route("/health")
def health():
    """Simple deployment health check."""
    return {"status": "ok", "app": "steady"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)
