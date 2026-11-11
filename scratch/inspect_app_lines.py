# scratch/inspect_app_lines.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(440, min(530, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')
