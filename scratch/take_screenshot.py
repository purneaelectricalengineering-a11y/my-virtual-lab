import subprocess
import os

screenshot_path = os.path.abspath("scratch/home_rendered.png")
cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    f'--screenshot={screenshot_path}',
    '--window-size=1280,1600',
    '--virtual-time-budget=4000',
    'file:///c:/Users/vijay/OneDrive/Desktop/my vitual lab/index.html'
]
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
stdout, stderr = p.communicate(timeout=10)
print('Screenshot generated:', os.path.exists(screenshot_path))
if os.path.exists(screenshot_path):
    print('Screenshot size:', os.path.getsize(screenshot_path), 'bytes')
