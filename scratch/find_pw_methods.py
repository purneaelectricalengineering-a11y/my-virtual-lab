with open('js/admin-panel.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [l for l in text.splitlines() if 'password' in l.lower() or 'pass' in l.lower()]
for l in matches[:25]:
    print(l.strip())
