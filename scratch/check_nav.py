# scratch/check_nav.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('navigateTo(page, param = null) {')
print(c[idx:idx+1500])
