# scratch/check_backticks.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('renderHomePage(container) {')
idx_end = c.find('/* =========================================================================\n     PAGE 2: LAB HUB')
home_body = c[idx:idx_end]

lines = home_body.split('\n')
for line_no, line in enumerate(lines, 1):
    if '`' in line:
        print(f"Line {line_no}: {line.strip()[:100]}")
