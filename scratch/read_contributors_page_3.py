with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('renderContributorsPage(container) {')
print(text[idx+4800:idx+8500])
