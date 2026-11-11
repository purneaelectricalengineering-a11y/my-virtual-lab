# scratch/print_render_home_2.py
with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx1 = c.find('renderHomePage(container) {')
idx2 = c.find('/* =========================================================================\n     PAGE 2: LAB HUB')

print("Part 2:")
print(c[idx1+15000:idx1+22000])
