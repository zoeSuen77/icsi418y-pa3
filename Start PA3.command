#!/bin/zsh
cd "$(dirname "$0")" || exit 1
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
if [[ ! -d node_modules ]]; then
  npm ci || exit 1
fi
print 'Open http://localhost:5173 after Vite starts. Press Control+C to stop.'
npm run demo -- --seed
