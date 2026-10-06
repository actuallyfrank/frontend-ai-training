#!/usr/bin/env bash
# Builds the standalone practice repo `rockstars-it-clicker` with checkpoint branches.
#
#   scripts/export-practice-repo.sh <empty-target-dir>
#
# main             = rockstars-it-clicker/
# stap-1-agents-md = main + checkpoints/stap-1-agents-md/
# stap-2-rules     = stap-1 + checkpoints/stap-2-rules/
# stap-3-enforce   = stap-2 + checkpoints/stap-3-enforce/
#
# An overlay copies (adds or replaces) files. To delete files, list their paths in
# `<overlay>/.delete` (one per line). Set SKIP_CHECKS=1 to skip lint/typecheck/test per branch.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/rockstars-it-clicker"
CHECKPOINTS="$ROOT/checkpoints"
STEPS=(stap-1-agents-md stap-2-rules stap-3-enforce)

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "Usage: $0 <empty-target-dir>" >&2
  exit 2
fi
if [ -e "$TARGET" ] && [ -n "$(ls -A "$TARGET" 2>/dev/null)" ]; then
  echo "Refusing to export: $TARGET is not empty" >&2
  exit 2
fi
case "$(cd "$(dirname "$TARGET")" 2>/dev/null && pwd)/" in
  "$ROOT"/*)
    echo "Refusing to export inside the workshop repo (agent context would leak in)" >&2
    exit 2
    ;;
esac

mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"

copy_tree() {
  rsync -a --exclude node_modules --exclude dist --exclude coverage --exclude SCORECARD.md \
    --exclude .delete "$1/" "$2/"
}

commit() {
  git add -A
  git -c user.name="${GIT_AUTHOR_NAME:-Rockstars IT Clicker}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-workshop@rockstars.invalid}" \
    commit -q -m "$1"
}

echo "→ main"
copy_tree "$SOURCE" "$TARGET"
cd "$TARGET"
git init -q -b main
commit "Rockstars IT Clicker"

branches=(main)
previous=main
for step in "${STEPS[@]}"; do
  overlay="$CHECKPOINTS/$step"
  if [ ! -d "$overlay" ]; then
    echo "⚠ checkpoint $step not found, skipping" >&2
    continue
  fi
  echo "→ $step"
  git switch -q -c "$step" "$previous"
  copy_tree "$overlay" "$TARGET"
  if [ -f "$overlay/.delete" ]; then
    while IFS= read -r path; do
      [ -n "$path" ] && git rm -rq --ignore-unmatch "$path"
    done < "$overlay/.delete"
  fi
  commit "Checkpoint: $step"
  branches+=("$step")
  previous="$step"
done
git switch -q main

if [ "${SKIP_CHECKS:-0}" != "1" ]; then
  last_lock=""
  for branch in "${branches[@]}"; do
    echo "→ checking $branch"
    git switch -q "$branch"
    lock="$(shasum package-lock.json | cut -d' ' -f1)"
    if [ "$lock" != "$last_lock" ]; then
      # CI=true keeps lefthook's postinstall from installing hooks in the exported repo.
      CI=true npm ci --silent --no-audit --no-fund
      last_lock="$lock"
    fi
    npm run --silent lint
    npm run --silent lint:css
    npm run --silent typecheck
    npm test --silent >/dev/null
    echo "  ✓ $branch is green"
  done
  git switch -q main
  rm -rf node_modules web/node_modules api/node_modules
fi

echo "Exported to $TARGET with branches: ${branches[*]}"
