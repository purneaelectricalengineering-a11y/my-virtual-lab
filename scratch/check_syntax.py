# scratch/check_syntax.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('renderHomePage(container) {')
idx_end = c.find('/* =========================================================================\n     PAGE 2: LAB HUB')
home_body = c[idx:idx_end]

print('Backticks in renderHomePage:', home_body.count('`'))
print('Dollar braces in renderHomePage:', home_body.count('${'))

# Check if there are escaped quotes like \' or \\' that break template literals
import re
print("Escaped backslashes count:", home_body.count('\\\\'))
print("Escaped single quotes count:", home_body.count("\\'"))

# Let's inspect where \\' or \' appears
for m in re.finditer(r'\\+[\'\"`]', home_body):
    start = max(0, m.start() - 30)
    end = min(len(home_body), m.end() + 30)
    print("Match at", m.start(), ":", repr(home_body[start:end]))
