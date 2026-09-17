#!/usr/bin/env python3
"""Web-Use HTTP Bridge Server for isshereal.com

Lightweight local HTTP bridge that accepts scrape requests and runs
the Playwright Chrome scraper to return live Instagram/TikTok/YouTube data.
"""

import argparse
import json
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


class WebUseHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"status": "ok", "service": "web-use-bridge"}')
            return

        if parsed.path == "/scrape":
            params = parse_qs(parsed.query)
            handle = params.get("handle", [""])[0]
            platform = params.get("platform", ["instagram"])[0]

            if not handle:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"error": "Missing handle query param"}')
                return

            script_path = Path(__file__).parent / "scrape_profile.py"
            cmd = [sys.executable, str(script_path), "--handle", handle, "--platform", platform, "--json"]

            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode != 0:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                err = json.dumps({"success": False, "error": proc.stderr.strip() or "Scraper execution failed"})
                self.wfile.write(err.encode("utf-8"))
                return

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(proc.stdout.encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # Concise logging
        sys.stderr.write(f"[web-use-server] {format % args}\n")


def main():
    parser = argparse.ArgumentParser(description="Web-Use local bridge server")
    parser.add_argument("--port", type=int, default=8088, help="Port to listen on (default: 8088)")
    parser.add_argument("--host", default="127.0.0.1", help="Host interface")
    args = parser.parse_args()

    server = HTTPServer((args.host, args.port), WebUseHandler)
    print(f"Web-Use Bridge Server listening on http://{args.host}:{args.port}")
    print(f"Endpoint: http://{args.host}:{args.port}/scrape?platform=instagram&handle=<username>")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Web-Use Bridge Server.")
        server.server_close()


if __name__ == "__main__":
    main()
