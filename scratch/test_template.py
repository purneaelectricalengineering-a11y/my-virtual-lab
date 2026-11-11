# scratch/test_template.py
import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx1 = c.find('renderHomePage(container) {')
idx2 = c.find('/* =========================================================================\n     PAGE 2: LAB HUB')
home_body = c[idx1:idx2]

# Let's check for any expressions inside ${...}
dollar_expressions = re.findall(r'\$\{([^{}]+)\}', home_body)
print(f"Total dollar expressions: {len(dollar_expressions)}")
for expr in dollar_expressions:
    # Check if there is an unclosed quote, backtick, or undefined syntax
    if any(err in expr for err in ['`', 'undefined', '\\']):
        print("Potential error in expr:", expr[:80])
