# scratch/inspect_app_lines_2.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(600, min(680, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')
