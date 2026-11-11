import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add opening animation slot after body tag
if '<div id="opening-animation-slot"></div>' not in c:
    c = c.replace('<body class="bg-[#070B19] text-slate-100 min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-black">',
                  '<body class="bg-[#070B19] text-slate-100 min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-black">\n\n  <!-- Cinematic 7-8s Opening Animation Slot -->\n  <div id="opening-animation-slot"></div>')
    print("Added opening animation slot!")

# 2. Update Curated by text
c = re.sub(r'Curated by <strong>Govind Kumar</strong> \(Founder\) & Contributor Team',
           r'Created & Developed by <strong>Govind Kumar</strong> (Founder & Chief Architect, Electrical Branch 2025-2029)',
           c)

# 3. Replace footer links
old_footer = re.search(r'<div class="flex items-center space-x-4">[\s\S]*?</div>\s*</div>\s*</div>\s*</footer>', c)
if old_footer:
    new_footer_inner = """<div class="flex flex-wrap items-center gap-3 text-xs">
          <button onclick="window.app.navigateTo('blogs')" class="hover:text-cyan-400 transition">Engineering Guides</button>
          <span>•</span>
          <button onclick="window.app.navigateTo('contributors')" class="hover:text-cyan-400 transition">Verification Contributors</button>
          <span>•</span>
          <a href="mailto:myvirtuallablive@gmail.com" class="text-cyan-400 hover:underline transition">myvirtuallablive@gmail.com</a>
          <span>•</span>
          <button onclick="window.app.playOpeningAnimation()" class="text-amber-400 hover:text-amber-300 transition flex items-center space-x-1">
            <span>🎬</span>
            <span>Replay Intro</span>
          </button>
        </div>
      </div>
    </div>
  </footer>"""
    c = c[:old_footer.start()] + new_footer_inner + c[old_footer.end():]
    print("Updated footer links successfully!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Saved index.html successfully!")
