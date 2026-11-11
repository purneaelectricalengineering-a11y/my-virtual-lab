# scratch/check_index_middle.py
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(45, 65):
    print(f"{i+1}: {lines[i]}", end='')
