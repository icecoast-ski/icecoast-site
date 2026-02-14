#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
RESORTS_JS="$ROOT_DIR/resorts.js"
ADMIN_HTML="$ROOT_DIR/admin.html"

if [[ ! -f "$RESORTS_JS" || ! -f "$ADMIN_HTML" ]]; then
  echo "Missing resorts.js or admin.html in $ROOT_DIR"
  exit 1
fi

typeset -A RESORT_NAME
typeset -A RESORT_LIFTIE

while IFS=$'\t' read -r resort_id resort_name resort_liftie; do
  [[ -z "${resort_id:-}" ]] && continue
  RESORT_NAME["$resort_id"]="$resort_name"
  RESORT_LIFTIE["$resort_id"]="$resort_liftie"
done < <(
  perl -ne '
    if (/id:\s*'\''([^'\'']+)'\''/) { $id = $1; }
    if (/name:\s*["'\'']([^"'\'']+)["'\'']/) { $name = $1; }
    if (/liftie:\s*'\''([^'\'']+)'\''/) {
      $lift = $1;
      if (defined $id && defined $name && $id ne "" && $name ne "") {
        print "$id\t$name\t$lift\n";
      }
      $id = "";
      $name = "";
    }
  ' "$RESORTS_JS"
)

ordered_ids=()
while IFS= read -r id; do
  ordered_ids+=("$id")
done < <(
  sed -n '/const tierGroups = \[/,/const overrides =/p' "$ADMIN_HTML" \
    | grep -oE "'[a-z0-9-]+'" \
    | tr -d "'"
)

if [[ ${#ordered_ids[@]} -eq 0 ]]; then
  echo "No resort IDs found in admin tier groups."
  exit 1
fi

urls=()
seen=""
for id in "${ordered_ids[@]}"; do
  if [[ " $seen " == *" $id "* ]]; then
    continue
  fi
  seen="$seen $id"

  name="${RESORT_NAME[$id]:-$id}"
  liftie="${RESORT_LIFTIE[$id]:-null}"

  if [[ "$liftie" != "null" && -n "$liftie" ]]; then
    url="https://liftie.info/resort/$liftie"
  else
    query="${name} snow report"
    encoded="${query// /+}"
    url="https://www.google.com/search?q=${encoded}"
  fi
  urls+=("$url")
done

if [[ ${#urls[@]} -eq 0 ]]; then
  echo "No URLs generated."
  exit 1
fi

echo "Opening ${#urls[@]} resort tabs in Brave (admin order)..."
BRAVE_APP="/Applications/Brave Browser.app"
if [[ ! -d "$BRAVE_APP" ]]; then
  BRAVE_APP="/Applications/Brave Browser 2.app"
fi
if [[ ! -d "$BRAVE_APP" ]]; then
  echo "Could not find Brave in /Applications."
  exit 1
fi

open_url() {
  local url="$1"
  local attempt=1
  while [[ $attempt -le 3 ]]; do
    if open -a "$BRAVE_APP" "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.45
    attempt=$((attempt + 1))
  done
  echo "Warning: failed to open $url"
  return 1
}

open_url "${urls[1]}" || true
sleep 1.2
for ((i = 2; i <= ${#urls[@]}; i++)); do
  open_url "${urls[$i]}" || true
  sleep 0.18
done

echo "Done. You can now select all tabs and group them as \"Conditions\" in Brave."
