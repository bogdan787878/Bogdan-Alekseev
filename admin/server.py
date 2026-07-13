#!/usr/bin/env python3
"""
Админка персонализированного "Обо мне" для портфолио.
Запуск: python3 admin/server.py
Открыть: http://localhost:8092/

Вставляешь текст под конкретную вакансию/компанию — получаешь ссылку вида
https://alekseevdesign.ru/?for=<slug>, которая на лету подменяет блок
"Кто я такой?" на главной странице (js/about-override.js).

Ничего не пушится, пока не нажмёшь "Опубликовать".
"""

import json
import os
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

PORT = 8092
SITE_URL = 'https://alekseevdesign.ru'

ADMIN_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.dirname(ADMIN_DIR)
DATA_FILE = os.path.join(REPO_DIR, 'data', 'about-overrides.json')


def load_overrides():
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, encoding='utf-8') as f:
        return json.load(f)


def save_overrides(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def slugify(text):
    text = text.strip().lower()
    out = []
    for ch in text:
        if ch.isalnum():
            out.append(ch)
        elif ch in (' ', '-', '_'):
            out.append('-')
    slug = ''.join(out)
    while '--' in slug:
        slug = slug.replace('--', '-')
    return slug.strip('-') or 'company'


def git(*args):
    return subprocess.run(['git', '-C', REPO_DIR] + list(args), capture_output=True, text=True)


def git_pending_count():
    r = git('status', '--porcelain', '--',
            'data/about-overrides.json', 'index.html', 'js/about-override.js')
    return len([l for l in r.stdout.splitlines() if l.strip()])


def git_release():
    log = []
    r = git('add', 'data/about-overrides.json', 'index.html', 'js/about-override.js')
    log.append('$ git add ...\n' + r.stdout + r.stderr)

    r = git('commit', '-m', 'Update personalized About text')
    log.append('$ git commit\n' + r.stdout + r.stderr)
    if r.returncode != 0 and 'nothing to commit' not in (r.stdout + r.stderr):
        return False, '\n'.join(log)

    r = git('push', 'origin', 'main')
    log.append('$ git push origin main\n' + r.stdout + r.stderr)
    if r.returncode != 0:
        return False, '\n'.join(log)

    return True, '\n'.join(log)


PAGE = """<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Персонализация "Обо мне"</title>
<style>
  body {{ font-family: -apple-system, sans-serif; background:#EFEAE6; color:#222; margin:0; padding:32px; }}
  h1 {{ font-size: 22px; margin-bottom: 24px; }}
  .card {{ background:#fff; border-radius:16px; padding:24px; margin-bottom:24px; max-width:640px; }}
  label {{ display:block; font-size:13px; opacity:0.6; margin-bottom:4px; margin-top:14px; }}
  input, textarea {{ width:100%; padding:10px 12px; border-radius:8px; border:1px solid #ddd; font-size:15px; box-sizing:border-box; font-family:inherit; }}
  textarea {{ min-height: 160px; resize: vertical; }}
  button {{ margin-top:16px; background:#3A4951; color:#fff; border:none; border-radius:100px; padding:10px 20px; font-size:14px; cursor:pointer; }}
  button.secondary {{ background:#748C74; }}
  .row {{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-top:1px solid #eee; }}
  .row a {{ font-size:13px; }}
  .row-actions button {{ margin-top:0; padding:6px 14px; font-size:12px; }}
  .status {{ margin-top:12px; font-size:13px; opacity:0.7; }}
</style>
</head>
<body>
<h1>Персонализация блока "Обо мне"</h1>

<div class="card">
  <label>Компания / вакансия (для ссылки)</label>
  <input id="slug" placeholder="например: yandex">
  <label>Заголовок в хиро (необязательно, HTML с &lt;br&gt; можно)</label>
  <input id="heroTitle" placeholder="Дизайн-директор&lt;br&gt;с 9+ лет в AI, fintech&lt;br&gt;и digital products">
  <label>Заголовок блока "Обо мне" (необязательно, по умолчанию "Кто я такой?")</label>
  <input id="title" placeholder="Кто я такой?">
  <label>Текст (абзацы — через пустую строку)</label>
  <textarea id="text" placeholder="Первый абзац...\\n\\nВторой абзац..."></textarea>
  <button onclick="save()">Сохранить</button>
  <button class="secondary" onclick="publish()">Опубликовать</button>
  <div class="status" id="status"></div>
</div>

<div class="card">
  <div id="list">Загрузка…</div>
</div>

<script>
var SITE_URL = "{site_url}";

function loadList() {{
  fetch('/api/list').then(r => r.json()).then(data => {{
    var el = document.getElementById('list');
    var keys = Object.keys(data);
    if (!keys.length) {{ el.innerHTML = '<p style="opacity:0.5">Пока пусто</p>'; return; }}
    el.innerHTML = keys.map(function (slug) {{
      var link = SITE_URL + '/?for=' + slug;
      return '<div class="row"><div><strong>' + slug + '</strong><br><a href="' + link + '" target="_blank">' + link + '</a></div>' +
        '<div class="row-actions"><button onclick="edit(\\'' + slug + '\\')">Редактировать</button> ' +
        '<button onclick="remove(\\'' + slug + '\\')">Удалить</button></div></div>';
    }}).join('');
  }});
}}

function edit(slug) {{
  fetch('/api/list').then(r => r.json()).then(data => {{
    var entry = data[slug];
    document.getElementById('slug').value = slug;
    document.getElementById('heroTitle').value = entry.heroTitle || '';
    document.getElementById('title').value = entry.title || '';
    document.getElementById('text').value = (entry.paragraphs || []).join('\\n\\n');
  }});
}}

function remove(slug) {{
  fetch('/api/delete', {{ method: 'POST', headers: {{'Content-Type':'application/json'}}, body: JSON.stringify({{slug: slug}}) }})
    .then(() => loadList());
}}

function save() {{
  var slug = document.getElementById('slug').value.trim();
  var heroTitle = document.getElementById('heroTitle').value.trim();
  var title = document.getElementById('title').value.trim();
  var text = document.getElementById('text').value;
  if (!slug || !text.trim()) {{ setStatus('Заполни slug и текст'); return; }}
  fetch('/api/save', {{ method: 'POST', headers: {{'Content-Type':'application/json'}}, body: JSON.stringify({{slug: slug, heroTitle: heroTitle, title: title, text: text}}) }})
    .then(r => r.json()).then(data => {{
      setStatus(data.ok ? ('Сохранено. Ссылка: ' + SITE_URL + '/?for=' + data.slug) : 'Ошибка сохранения');
      loadList();
    }});
}}

function publish() {{
  setStatus('Публикую…');
  fetch('/api/publish', {{ method: 'POST' }}).then(r => r.json()).then(data => {{
    setStatus(data.ok ? 'Опубликовано ✓' : 'Ошибка публикации — см. терминал');
  }});
}}

function setStatus(text) {{ document.getElementById('status').textContent = text; }}

loadList();
</script>
</body>
</html>"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/':
            body = PAGE.format(site_url=SITE_URL).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif path == '/api/list':
            self._json(load_overrides())
        elif path == '/api/status':
            self._json({'pending': git_pending_count()})
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length) if length else b'{}'
        try:
            payload = json.loads(raw or b'{}')
        except json.JSONDecodeError:
            payload = {}

        if path == '/api/save':
            slug = slugify(payload.get('slug', ''))
            hero_title = (payload.get('heroTitle') or '').strip()
            title = (payload.get('title') or '').strip()
            text = payload.get('text', '')
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            data = load_overrides()
            data[slug] = {'heroTitle': hero_title, 'title': title, 'paragraphs': paragraphs}
            save_overrides(data)
            self._json({'ok': True, 'slug': slug})
        elif path == '/api/delete':
            slug = payload.get('slug', '')
            data = load_overrides()
            data.pop(slug, None)
            save_overrides(data)
            self._json({'ok': True})
        elif path == '/api/publish':
            ok, log = git_release()
            print(log)
            self._json({'ok': ok})
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == '__main__':
    print('Админка "Обо мне": http://localhost:%d/' % PORT)
    print('Репозиторий: %s' % REPO_DIR)
    HTTPServer(('', PORT), Handler).serve_forever()
