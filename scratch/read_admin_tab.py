with open('js/admin-panel.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('renderExperimentsTab() {')
print(text[start:start+1800])
