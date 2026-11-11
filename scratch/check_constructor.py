# scratch/check_constructor.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('class AppController {')
print(c[idx:idx+800])
