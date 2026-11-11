import subprocess
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

custom_html = html.replace('href="css/', 'href="../css/').replace('src="js/', 'src="../js/')
custom_html = custom_html.replace(
    "window.app.init();",
    """
    window.app.init();
    window.app.dismissOpeningAnimation();
    window.app.navigateTo('admin');
    window.adminPanel.authenticate('govind2026');
    """
)
with open('scratch/test_admin.html', 'w', encoding='utf-8') as f:
    f.write(custom_html)

screenshot_path = os.path.abspath("scratch/admin_unlocked.png")
cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    f'--screenshot={screenshot_path}',
    '--window-size=1280,1200',
    '--virtual-time-budget=2000',
    f'file:///{os.path.abspath("scratch/test_admin.html").replace(chr(92), "/")}'
]
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
stdout, stderr = p.communicate(timeout=10)
print('Screenshot exists:', os.path.exists(screenshot_path))
if os.path.exists(screenshot_path):
    print('Size:', os.path.getsize(screenshot_path))
