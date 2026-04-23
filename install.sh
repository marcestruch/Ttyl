#!/bin/bash
set -e

echo "🚀 Installing Ttyl..."

# GitHub repository
REPO="marcestruch/ttyl"

# Get the latest release URL for the AppImage
echo "🔍 Finding latest release..."
LATEST_RELEASE_URL=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" | grep "browser_download_url.*AppImage" | cut -d '"' -f 4 | head -n 1)

if [ -z "$LATEST_RELEASE_URL" ]; then
    echo "❌ Could not find a valid AppImage release for $REPO."
    echo "This might mean there are no published releases yet."
    echo "Please check https://github.com/$REPO/releases"
    exit 1
fi

# Download the AppImage
INSTALL_DIR="$HOME/.local/bin"
APP_IMAGE_PATH="$INSTALL_DIR/ttyl.AppImage"

echo "⬇️ Downloading Ttyl to $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
curl -L -o "$APP_IMAGE_PATH" "$LATEST_RELEASE_URL"

# Make it executable
chmod +x "$APP_IMAGE_PATH"

# Create a symlink
ln -sf "$APP_IMAGE_PATH" "$INSTALL_DIR/ttyl"

# Download the app icon
ICON_DIR="$HOME/.local/share/icons/hicolor/scalable/apps"
ICON_PATH="$ICON_DIR/ttyl.svg"

echo "🖼️ Downloading application icon..."
mkdir -p "$ICON_DIR"
curl -sSL -o "$ICON_PATH" "https://raw.githubusercontent.com/$REPO/main/app-icon.svg"

# Set up desktop entry
DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE="$DESKTOP_DIR/ttyl.desktop"

mkdir -p "$DESKTOP_DIR"

echo "📝 Creating desktop entry..."
cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=Ttyl
Comment=A minimalist workspace and productivity timer
Exec=$APP_IMAGE_PATH
Icon=ttyl
Terminal=false
Type=Application
Categories=Productivity;Utility;
EOF

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR" || true
fi

echo "✅ Ttyl installed successfully!"
echo "You can now run 'ttyl' from your terminal or find it in your application launcher."
