# scratch/test_eval.py
import re

# Read all JS files in load order and check for any syntax/name issues
files = [
    'js/audio.js',
    'js/experiments-data.js',
    'js/circuit-engine.js',
    'js/settings.js',
    'js/blogs.js',
    'js/simulator.js',
    'js/pdf-generator.js',
    'js/instrument-library.js',
    'js/viva-quiz.js',
    'js/admin-panel.js',
    'js/app.js'
]

total_len = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as fl:
        c = fl.read()
        total_len += len(c)
        print(f"File {f}: {len(c)} bytes, curly={c.count('{') - c.count('}')}")

print("Total codebase JS bytes:", total_len)
