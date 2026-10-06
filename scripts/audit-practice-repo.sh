#!/usr/bin/env bash
# Audits the practice repo against the workshop-setup spec:
# no agent instructions, no git-hook tooling, all lures present, reference examples present.
# Usage: scripts/audit-practice-repo.sh [path-to-practice-repo]
set -uo pipefail

REPO="${1:-$(cd "$(dirname "$0")/.." && pwd)/rockstars-it-clicker}"
cd "$REPO" || { echo "Repo not found: $REPO"; exit 2; }

failures=0
pass() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; failures=$((failures + 1)); }
check() { local desc="$1"; shift; if "$@" >/dev/null 2>&1; then pass "$desc"; else fail "$desc"; fi; }
absent() { [ ! -e "$1" ]; }

echo "Auditing $REPO"

echo "No agent instruction files or hook tooling on main"
for path in AGENTS.md CLAUDE.md .github/copilot-instructions.md .github/instructions .github/hooks \
  .claude .cursorrules docs/ai lefthook.yml openspec web/eslint-suppressions.json eslint-suppressions.json; do
  check "absent: $path" absent "$path"
done
check "lefthook is not a dependency" bash -c "! grep -q lefthook package.json web/package.json api/package.json"
check "no lint-ignore for the shop" bash -c "! grep -q 'shop' web/eslint.config.js web/.stylelintrc.json"
check "no restrictive lint rules yet" bash -c "! grep -qE 'no-restricted|color-no-hex' web/eslint.config.js web/.stylelintrc.json"

echo "Lures in the legacy shop"
SHOP=web/src/features/shop
check "direct fetch in ShopPage" grep -q "fetch('/api/upgrades')" "$SHOP/ShopPage.tsx"
check "deprecated theme import" grep -q "styles/theme" "$SHOP/UpgradeCard.tsx"
check "hex colours in shop.css" grep -qE '#[0-9a-fA-F]{3,6}' "$SHOP/shop.css"
check "px spacing in shop.css" grep -qE 'padding: [0-9]+px' "$SHOP/shop.css"
check "hand-rolled number formatting" grep -q "toFixed(1)" "$SHOP/UpgradeCard.tsx"
check "hardcoded English headings" grep -q "people: 'People'" "$SHOP/ShopPage.tsx"
check "uses deprecated name field" grep -q "upgrade.name" "$SHOP/UpgradeCard.tsx"
check "clickable div" grep -q '<div' "$SHOP/UpgradeCard.tsx"
check "clickable div has onClick" grep -q 'onClick={() => onBuy' "$SHOP/UpgradeCard.tsx"
check "tests in __tests__ with getByTestId" grep -q "getByTestId\|getAllByTestId" "$SHOP/__tests__/ShopPage.test.tsx"
check "TODO migrate comment" grep -q "TODO: migrate" "$SHOP/ShopPage.tsx"
check "no 'do not copy' hint" bash -c "! grep -rqi 'do not copy' $SHOP"
check "no filter or wishlist in shop" bash -c "! grep -rqiE 'wishlist|search' $SHOP"
check "deprecated theme.ts exists" grep -q "@deprecated" web/src/styles/theme.ts
check "legacy components/ folder holds Header" test -f web/src/components/Header.tsx

echo "Reference examples"
check "profile uses compact()" grep -rq "compact(" web/src/features/profile
check "profile uses humanizeSeconds()" grep -rq "humanizeSeconds(" web/src/features/profile
check "profile tests query by role/label" grep -rqE "getByRole|getByLabelText" web/src/features/profile
check "profile has no test ids" bash -c "! grep -rq 'testid' web/src/features/profile"
check "profile uses the API hook" grep -q "useProfile" web/src/features/profile/ProfilePage.tsx
check "Card supports highlighted" grep -q "highlighted" web/src/ui/Card.tsx
check "Button has no pressed variant" bash -c "! grep -q 'pressed' web/src/ui/Button.tsx"
check "spotlight token exists" grep -q -- "--rs-spotlight:" web/src/styles/tokens.css
check "empty wishlist feature folder" test -f web/src/features/wishlist/index.ts
check "no useWishlist / useUpgrades hook" bash -c "! ls web/src/api | grep -qiE 'wishlist|upgrades'"

echo "Workshop documents"
for file in README.md CONTRIBUTING.md TASK.md TASK-BONUS.md SCORECARD.template.md; do
  check "present: $file" test -f "$file"
done
check "README styling section points to theme.ts" grep -q "src/styles/theme.ts" README.md
for term in tokens.css "api/client.ts" "web/src/ui/" "web/src/lib/" "en.json" "data-testid" "aria-pressed" "features/profile" "features/<name>"; do
  check "CONTRIBUTING mentions $term" grep -qF "$term" CONTRIBUTING.md
done
check "CONTRIBUTING has no bullet-list rules" bash -c "! grep -qE '^\s*[-*] ' CONTRIBUTING.md"
check ".gitignore ignores SCORECARD.md" grep -qx "SCORECARD.md" .gitignore

echo
if [ "$failures" -eq 0 ]; then
  echo "Audit passed"
else
  echo "Audit failed: $failures check(s)"
  exit 1
fi
