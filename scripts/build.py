"""Build the publishable site into dist/.

Copies site/ plus learn/ and survey/, then removes everything that is only for
review: <span class="todo"> notes and any element marked data-pending. The
source keeps them (and ?review still shows them locally); the published HTML
never contains them, so crawlers and AI summaries can't quote them.
"""
import hashlib
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'dist')
SKIP = {'styleguide', 'concept'}  # internal pages, never published
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class Finder(HTMLParser):
    """Find [start, end) character ranges of review-only elements."""

    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.lines = [0]
        for line in text.splitlines(keepends=True):
            self.lines.append(self.lines[-1] + len(line))
        self.stack = []      # (tag, start offset, is_review_only)
        self.ranges = []

    def here(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        a = dict(attrs)
        review = 'data-pending' in a or 'todo' in (a.get('class') or '').split()
        self.stack.append((tag, self.here(), review))

    def handle_endtag(self, tag):
        while self.stack:
            t, start, review = self.stack.pop()
            if t == tag:
                if review:
                    end = self.text.index('>', self.here()) + 1
                    self.ranges.append((start, end))
                return


def strip(text):
    f = Finder(text)
    f.feed(text)
    # Remove outermost ranges only, from the end so offsets stay valid.
    ranges = sorted(f.ranges)
    outer = []
    for r in ranges:
        if outer and r[0] < outer[-1][1]:
            continue
        outer.append(r)
    for start, end in reversed(outer):
        text = text[:start] + text[end:]
    return text


def fingerprint(text, page):
    """Append ?v=<content hash> to local CSS/JS links so a deploy is never masked by a cached copy."""
    def sub(m):
        attr, url = m.group(1), m.group(2)
        target = (page.parent / url).resolve()
        if not target.exists():
            return m.group(0)
        digest = hashlib.sha256(target.read_bytes()).hexdigest()[:10]
        return f'{attr}="{url}?v={digest}"'
    return re.sub(r'(href|src)="((?!https?:|/)[^"?#]+\.(?:css|js))"', sub, text)


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(ROOT / 'site', DIST, ignore=lambda d, names: [n for n in names if Path(d) == ROOT / 'site' and n in SKIP])
    for extra in ('learn', 'survey'):
        if (ROOT / extra).exists():
            shutil.copytree(ROOT / extra, DIST / extra)
    left = 0
    for page in (DIST).rglob('*.html'):
        if page.relative_to(DIST).parts[0] in ('learn', 'survey'):
            continue
        out = fingerprint(strip(page.read_text()), page)
        page.write_text(out)
        left += out.count('class="todo"') + out.count('data-pending')
    if left:
        sys.exit(f'build: {left} review-only markers survived')
    print(f'build: wrote {DIST}')


if __name__ == '__main__':
    main()
