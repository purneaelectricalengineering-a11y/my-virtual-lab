import subprocess
import os

screenshot_path = os.path.abspath("scratch/home_after_intro.png")
script = """
setTimeout(() => {
  if (window.app) window.app.dismissOpeningAnimation();
}, 500);
"""
# We can tell Chrome to run a script or wait 8.5 seconds
cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    f'--screenshot={screenshot_path}',
    '--window-size=1280,1800',
    '--virtual-time-budget=9000',
    'file:///c:/Users/vijay/OneDrive/Desktop/my vitual lab/index.html'
]
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
stdout, stderr = p.communicate(timeout=15)
print('Screenshot exists:', os.path.exists(screenshot_path))
if os.path.exists(screenshot_path):
    print('Size:', os.path.getsize(screenshot_path))
