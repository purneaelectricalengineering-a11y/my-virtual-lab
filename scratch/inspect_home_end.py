# scratch/inspect_home_end.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1150, min(1250, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')
