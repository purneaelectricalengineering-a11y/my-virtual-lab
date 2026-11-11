with open('js/admin-panel.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('checkOpeningPassword(')
print(text[start:start+1200])

start2 = text.find('promptActionPassword(')
print(text[start2:start2+1200])
