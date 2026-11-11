# scratch/update_index_remove_dashboard.py
import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove student-dashboard.js script tag
c = re.sub(r'\s*<script src="js/student-dashboard\.js"></script>', '', c)

# 2. In footer, ensure no dashboard link exists
c = re.sub(r'<button onclick="window\.app\.navigateTo\(\'dashboard\'\)"[^>]*>.*?</button>', '', c)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated index.html: removed dashboard script tag and references!")
