# scratch/print_render_home.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx1 = c.find('renderHomePage(container) {')
idx2 = c.find('/* =========================================================================\n     PAGE 2: LAB HUB')

print("Length of renderHomePage:", idx2 - idx1)
print(c[idx1:idx1+2000])
