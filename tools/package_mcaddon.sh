#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACK_DIR="$ROOT_DIR/behavior_packs/pixel_menu"
RELEASE_DIR="$ROOT_DIR/releases"
VERSION="1.0.0"
OUT_FILE="$RELEASE_DIR/pixel-realm-menu-v${VERSION}.mcaddon"
ZIP_FILE="$RELEASE_DIR/pixel-realm-menu-v${VERSION}.zip"

if [[ ! -f "$PACK_DIR/manifest.json" ]]; then
  echo "Missing behavior pack manifest: $PACK_DIR/manifest.json" >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR"
rm -f "$OUT_FILE" "$ZIP_FILE"

cd "$ROOT_DIR/behavior_packs"
zip -qr "$OUT_FILE" "pixel_menu" -x '*.DS_Store' '__MACOSX/*'

cd "$ROOT_DIR"
zip -qr "$ZIP_FILE" \
  "behavior_packs/pixel_menu" \
  "preview" \
  "README.md" \
  "tools/package_mcaddon.sh" \
  -x '*.DS_Store' '__MACOSX/*'

echo "Created $OUT_FILE"
echo "Created $ZIP_FILE"
