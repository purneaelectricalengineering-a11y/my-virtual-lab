# scratch/build_master_app.py

with open('js/app.js', 'r', encoding='utf-8') as f:
    orig = f.read()

# Let's inspect everything before renderHomePage and after renderContributorsPage
idx_nav_start = orig.find('  renderNavigation() {')
idx_home_start = orig.find('  /* =========================================================================\n     7-8 SECONDS OPENING CINEMATIC LABORATORY ANIMATION')
if idx_home_start == -1:
    idx_home_start = orig.find('  initOpeningAnimation() {')

idx_labhub = orig.find('  /* =========================================================================\n     PAGE 2: LAB HUB')

print("idx_nav_start:", idx_nav_start)
print("idx_home_start:", idx_home_start)
print("idx_labhub:", idx_labhub)
