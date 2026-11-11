# scratch/check_router.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(180, 240):
    print(f"{i+1}: {lines[i]}", end='')
