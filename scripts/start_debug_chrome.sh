#!/usr/bin/env bash
# Launches Google Chrome with remote debugging enabled on port 9222
echo "Launching Google Chrome with remote debugging on http://127.0.0.1:9222 ..."
exec flatpak run com.google.Chrome --remote-debugging-port=9222 "$@"
