import subprocess
import os

screenshot_path = os.path.abspath("scratch/admin_locked.png")
cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    f'--screenshot={screenshot_path}',
    '--window-size=1280,1000',
    '--virtual-time-budget=2000',
    'file:///c:/Users/vijay/OneDrive/Desktop/my vitual lab/index.html'
]
# We want to navigate to admin panel:
# Let's write a small script that opens admin
script = """
setTimeout(() => {
  if (window.app) {
    window.app.dismissOpeningAnimation();
    window.app.navigateTo('admin');
  }
}, 500);
"""
