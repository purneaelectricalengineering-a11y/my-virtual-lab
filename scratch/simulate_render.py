# scratch/simulate_render.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect navigateTo('home') definition
idx = code.find('navigateTo(pageId, expId = null) {')
print(code[idx:idx+1000])
