# scratch/check_index_lines.py
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'script' in line.lower() or 'main-page' in line or 'opening' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")
