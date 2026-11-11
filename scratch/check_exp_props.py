with open('js/experiments-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
exps = text.split('{')
for exp in exps[1:]:
    lines = [l.strip() for l in exp.splitlines() if ':' in l and not l.strip().startswith('//')]
    prop_dict = {}
    for l in lines[:10]:
        k = l.split(':')[0].strip()
        v = l.split(':')[1].strip().strip('",\'')
        prop_dict[k] = v
    if 'id' in prop_dict:
        print('ID:', prop_dict.get('id'), '| Category:', prop_dict.get('category'), '| Title:', prop_dict.get('en'))
