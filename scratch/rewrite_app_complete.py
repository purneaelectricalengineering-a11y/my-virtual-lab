# scratch/rewrite_app_complete.py

with open('js/app.js', 'r', encoding='utf-8') as f:
    orig = f.read()

# Let's inspect parts to keep:
# We keep from LabHub onwards:
idx_labhub = orig.find('  /* =========================================================================\n     PAGE 2: LAB HUB')
labhub_and_rest = orig[idx_labhub:]

# We also need to remove renderDashboardPage from labhub_and_rest:
idx_dash = labhub_and_rest.find('  /* =========================================================================\n     PAGE 7: DASHBOARD')
idx_contrib = labhub_and_rest.find('  /* =========================================================================\n     PAGE 8: CONTRIBUTORS')

if idx_dash != -1 and idx_contrib != -1:
    labhub_and_rest = labhub_and_rest[:idx_dash] + labhub_and_rest[idx_contrib:]
    print("Removed dashboard page method from router and pages!")
else:
    print(f"Indices for dashboard removal: {idx_dash}, {idx_contrib}")

# In labhub_and_rest, let's update renderAdminPage to call window.adminPanel
# Let's check renderAdminPage in labhub_and_rest
print("Contains renderAdminPage in rest:", 'renderAdminPage' in labhub_and_rest)

with open('scratch/labhub_part.js', 'w', encoding='utf-8') as f:
    f.write(labhub_and_rest)

print("Saved labhub_part.js!")
