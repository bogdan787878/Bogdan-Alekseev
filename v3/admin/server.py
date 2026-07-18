#!/usr/bin/env python3
"""
Локальная админка "Портфолио v3".
Запуск: python3 admin/server.py
Открыть:
  http://localhost:8093/        — сайт в режиме редактирования
                                   (клик по областям с пунктирной рамкой грузит картинку)

Всё, что вы загружаете, сохраняется локально и ставится в git (git add).
Ничего не пушится, пока вы не нажмёте "Опубликовать" — тогда одним разом
делается commit + push всех накопленных изменений.
"""

import cgi
import json
import mimetypes
import os
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

PORT = 8093

ADMIN_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(ADMIN_DIR)          # .../v3
REPO_DIR = os.path.dirname(PROJECT_DIR)           # git-репозиторий portfolio
IMAGES_DIR = os.path.join(PROJECT_DIR, 'images')
IMAGES_MANIFEST = os.path.join(PROJECT_DIR, 'data', 'images.json')

os.makedirs(IMAGES_DIR, exist_ok=True)


# ── Работа с данными ──────────────────────────────────────────

def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


# ── Git ────────────────────────────────────────────────────────

def git(*args):
    return subprocess.run(['git', '-C', REPO_DIR] + list(args), capture_output=True, text=True)


def git_pending_count():
    r = git('status', '--porcelain', '--', 'v3')
    lines = [l for l in r.stdout.splitlines() if l.strip()]
    return len(lines)


def git_release():
    log = []
    r = git('add', 'v3')
    log.append('$ git add v3\n' + r.stdout + r.stderr)

    r = git('commit', '-m', 'Update v3 content (images)')
    log.append('$ git commit\n' + r.stdout + r.stderr)
    if r.returncode != 0 and 'nothing to commit' not in (r.stdout + r.stderr):
        return False, '\n'.join(log)

    r = git('push', 'origin', 'main')
    log.append('$ git push origin main\n' + r.stdout + r.stderr)
    if r.returncode != 0:
        return False, '\n'.join(log)

    return True, '\n'.join(log)


class Handler(BaseHTTPRequestHandler):
    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def _file(self, rel_path):
        fpath = os.path.join(PROJECT_DIR, rel_path)
        if not os.path.abspath(fpath).startswith(PROJECT_DIR) or not os.path.isfile(fpath):
            self.send_response(404)
            self.end_headers()
            return
        ctype = mimetypes.guess_type(fpath)[0] or 'application/octet-stream'
        with open(fpath, 'rb') as f:
            body = f.read()
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/ping':
            self._json({'ok': True})
            return
        if path == '/api/status':
            self._json({'pending': git_pending_count()})
            return

        rel = path.lstrip('/') or 'index.html'
        self._file(rel)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)

        if path == '/api/upload-slot':
            slot = (qs.get('slot') or [''])[0]
            if not slot:
                self._json({'ok': False, 'error': 'no slot'}, 400)
                return

            ctype, pdict = cgi.parse_header(self.headers.get('Content-Type', ''))
            if ctype != 'multipart/form-data':
                self._json({'ok': False, 'error': 'bad content type'}, 400)
                return
            pdict['boundary'] = bytes(pdict['boundary'], 'utf-8')
            pdict['CONTENT-LENGTH'] = int(self.headers.get('Content-Length', 0))
            fields = cgi.parse_multipart(self.rfile, pdict)
            image_data = fields.get('image')
            if not image_data:
                self._json({'ok': False, 'error': 'no image'}, 400)
                return
            image_bytes = image_data[0]

            ext = '.webp'
            for magic, e in ((b'\x89PNG', '.png'), (b'\xff\xd8\xff', '.jpg'), (b'GIF8', '.gif'),
                             (b'\x1a\x45\xdf\xa3', '.webm')):
                if image_bytes[:4].startswith(magic[:len(magic)]):
                    ext = e
                    break
            else:
                head = image_bytes[:256].lstrip()
                if head.startswith(b'<?xml') or head.startswith(b'<svg'):
                    ext = '.svg'

            filename = slot + ext
            fpath = os.path.join(IMAGES_DIR, filename)
            with open(fpath, 'wb') as f:
                f.write(image_bytes)

            manifest = load_json(IMAGES_MANIFEST, {})
            manifest[slot] = 'images/' + filename
            save_json(IMAGES_MANIFEST, manifest)

            git_stage = git('add',
                             os.path.relpath(fpath, REPO_DIR),
                             os.path.relpath(IMAGES_MANIFEST, REPO_DIR))

            self._json({'ok': True, 'path': 'images/' + filename})
            return

        if path == '/api/release':
            ok, log = git_release()
            print(log)
            self._json({'ok': ok})
            return

        self._json({'ok': False, 'error': 'not found'}, 404)

    def log_message(self, format, *args):
        pass


if __name__ == '__main__':
    print('Админка v3: http://localhost:%d/' % PORT)
    print('Репозиторий: %s' % REPO_DIR)
    HTTPServer(('', PORT), Handler).serve_forever()
