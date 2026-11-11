import subprocess

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--dump-dom',
    '--virtual-time-budget=3000',
    'file:///c:/Users/vijay/OneDrive/Desktop/my vitual lab/index.html'
]
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
stdout, stderr = p.communicate(timeout=10)
print('DOM Output length:', len(stdout))
idx = stdout.find('id="main-page-content"')
if idx != -1:
    print('Found main-page-content! Snippet:')
    print(stdout[idx:idx+1000])
else:
    print('main-page-content not found in DOM!')
