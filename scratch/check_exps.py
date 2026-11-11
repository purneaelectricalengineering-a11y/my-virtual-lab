with open('js/experiments-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*["\']([^"\']+)["\']', text)
print('Experiment IDs:', matches)
