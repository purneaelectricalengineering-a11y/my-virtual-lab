with open('js/experiments-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"thevenin-norton-theorem"')
print(text[idx-20:idx+600])
