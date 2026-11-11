import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cwd = os.getcwd().replace('\\', '/')
url = f"file:///{cwd}/index.html"

res = subprocess.run(
    [chrome_path, "--headless=new", "--disable-gpu", "--virtual-time-budget=3000", "--dump-dom", url],
    capture_output=True,
    text=True,
    timeout=15
)
print("Return code:", res.returncode)
print("Stdout length:", len(res.stdout))
if "main-page-content" in res.stdout:
    idx = res.stdout.find('id="main-page-content"')
    print("Found main-page-content:")
    print(res.stdout[idx:idx+800])
else:
    print("main-page-content NOT found in stdout!")
