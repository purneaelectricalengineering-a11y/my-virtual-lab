# scratch/search_contributors_in_app.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'contributors' in line.lower():
        print(f"Line {i+1}: {line.strip()[:100]}")
