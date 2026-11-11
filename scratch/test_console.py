import urllib.request
import json
import subprocess
import time
import os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_path = os.path.abspath('index.html').replace('\\', '/')

# Launch Edge with remote debugging
proc = subprocess.Popen([
    edge_path,
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    f'file:///{html_path}'
])

time.sleep(2)

try:
    with urllib.request.urlopen('http://localhost:9222/json') as resp:
        tabs = json.loads(resp.read().decode())
        print("Edge tabs:", len(tabs))
        for t in tabs:
            print("Tab:", t.get('title'), t.get('url'))
except Exception as e:
    print("Error connecting to Edge debugging port:", e)

proc.terminate()
