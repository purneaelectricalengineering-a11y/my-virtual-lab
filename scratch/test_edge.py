import subprocess
import os

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cwd = os.getcwd().replace('\\', '/')
url = f"file:///{cwd}/index.html"
screenshot_path = os.path.abspath("scratch/edge_screen.png")

cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    f"--screenshot={screenshot_path}",
    "--window-size=1280,900",
    "--virtual-time-budget=2000",
    url
]
res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
print("Return code:", res.returncode)
print("Screenshot exists:", os.path.exists(screenshot_path))
if os.path.exists(screenshot_path):
    print("Screenshot size:", os.path.getsize(screenshot_path))
