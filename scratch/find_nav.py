# scratch/find_nav.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'navigateTo\s*\(', c)]
for m in matches:
    print(c[m:m+300])
    print('---')
