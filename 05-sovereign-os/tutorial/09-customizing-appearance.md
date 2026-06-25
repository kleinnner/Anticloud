# Customizing Appearance

01s Sovereign comes with a unique look out of the box, but you can customize every visual aspect to match your preferences.

## Theme Components

| Component | Default | Customizable To |
|-----------|---------|-----------------|
| **GNOME Shell Theme** | Obsidian-flow | Any GNOME Shell theme |
| **GTK Theme** | Obsidian-flow (GTK3/4) | Any GTK3/4 theme |
| **Icon Theme** | Pebble (custom) | Any icon theme |
| **Cursor Theme** | WhiteSur-cursors | Any cursor theme |
| **Font** | Cantarell 11 | Any installed font |
| **Wallpaper** | 01s Sovereign branding | Any image |
| **GRUB Theme** | Particle-circle-window | Any GRUB theme |
| **Plymouth Theme** | 01s custom | Any Plymouth theme |

## Changing Themes

### Using GNOME Tweaks

```bash
# Install GNOME Tweaks if not present
sudo pacman -S gnome-tweaks
```

Open Tweaks from the applications menu, navigate to **Appearance**.

### Using the Command Line

```bash
# Set GTK theme
gsettings set org.gnome.desktop.interface gtk-theme "Obsidian-flow"

# Set icon theme
gsettings set org.gnome.desktop.interface icon-theme "Pebble"

# Set cursor theme
gsettings set org.gnome.desktop.interface cursor-theme "WhiteSur-cursors"

# Set font
gsettings set org.gnome.desktop.interface font-name "Cantarell 11"

# Set shell theme (requires User Themes extension)
gsettings set org.gnome.shell.extensions.user-theme name "Obsidian-flow"
```

### Theme Previews

```bash
# List available themes
ls /usr/share/themes/
ls ~/.local/share/themes/ 2>/dev/null || echo "No user themes"

# List available icons
ls /usr/share/icons/

# List available cursors
ls /usr/share/icons/ | grep -i cursor
```

## Installing New Themes

### From GNOME Look

1. Download themes from [GNOME Look](https://www.gnome-look.org/)
2. Extract to the correct directories:

```bash
# System-wide (affects all users)
sudo cp -r theme-name /usr/share/themes/
sudo cp -r icon-theme /usr/share/icons/

# User-specific (affects only you)
cp -r theme-name ~/.local/share/themes/
cp -r icon-theme ~/.local/share/icons/
```

3. Apply via GNOME Tweaks or gsettings

### Installing from AUR

```bash
# Popular theme collections
yay -S whitesur-gtk-theme
yay -S orchis-theme
yay -S tokyo-night-gtk
yay -S catppuccin-gtk-theme
yay -S tela-circle-icon-theme
```

## Customizing Wallpaper

### GUI Method
1. Right-click the desktop
2. Select **Change Background**
3. Choose from built-in wallpapers or click **Add Picture**

### CLI Method

```bash
gsettings set org.gnome.desktop.background picture-uri \
  "file:///usr/share/backgrounds/01s/wallpaper.png"

gsettings set org.gnome.desktop.screensaver picture-uri \
  "file:///usr/share/backgrounds/01s/login.png"
```

### Wallpaper Locations

| Directory | Purpose |
|-----------|---------|
| `/usr/share/backgrounds/01s/` | System wallpapers |
| `~/Pictures/Wallpapers/` | User wallpapers |
| `/usr/share/backgrounds/gnome/` | Stock GNOME wallpapers |

## Customizing GTK CSS

01s Sovereign includes custom GTK CSS for both GTK3 and GTK4:

```bash
# User GTK3 CSS
~/.config/gtk-3.0/gtk.css

# User GTK4 CSS
~/.config/gtk-4.0/gtk.css
```

### Example GTK CSS Customizations

```css
/* Change window button layout */
button.titlebutton {
    min-width: 20px;
    min-height: 20px;
}

/* Custom scrollbar width */
scrollbar slider {
    min-width: 8px;
    border-radius: 4px;
}

/* Dark titlebar colors */
headerbar {
    background: #1a1a2e;
    color: #ffffff;
}

/* Custom button styles */
button {
    border-radius: 8px;
    padding: 6px 12px;
}
```

## Customizing Fonts

### Install New Fonts

```bash
# User fonts (no root needed)
mkdir -p ~/.local/share/fonts
cp MyFont.ttf ~/.local/share/fonts/
fc-cache -f -v

# System fonts
sudo cp MyFont.ttf /usr/share/fonts/
sudo fc-cache -f -v

# Install font packages
sudo pacman -S ttf-dejavu ttf-liberation noto-fonts
sudo pacman -S adobe-source-code-pro-fonts
```

### Font Configuration

```bash
# List available fonts
fc-list | grep -i "name-of-font"

# Set font rendering preferences
gsettings set org.gnome.desktop.interface font-antialiasing "rgba"
gsettings set org.gnome.desktop.interface font-hinting "slight"

# Font scaling
gsettings set org.gnome.desktop.interface text-scaling-factor 1.25
```

## Customizing GRUB

```bash
sudo nano /etc/default/grub
# Example: GRUB_TIMEOUT=3
# GRUB_THEME="/usr/share/grub/themes/Particle-circle-window/theme.txt"

sudo grub-mkconfig -o /boot/grub/grub.cfg
```

### GRUB Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `GRUB_TIMEOUT` | Menu timeout in seconds | 5 |
| `GRUB_DEFAULT` | Default boot entry | 0 |
| `GRUB_CMDLINE_LINUX` | Kernel parameters | `quiet splash` |
| `GRUB_GFXMODE` | Display resolution | `auto` |
| `GRUB_THEME` | Theme path | `/boot/grub/themes/...` |
| `GRUB_BACKGROUND` | Background image | None |
| `GRUB_DISABLE_OS_PROBER` | OS detection | `false` |

### Installing Custom GRUB Themes

```bash
# Create directory for themes
sudo mkdir -p /boot/grub/themes/

# Install theme
sudo cp -r my-theme /boot/grub/themes/

# Edit /etc/default/grub
GRUB_THEME="/boot/grub/themes/my-theme/theme.txt"

# Regenerate
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## Customizing Plymouth

```bash
# List available themes
sudo plymouth-set-default-theme -l

# Set theme
sudo plymouth-set-default-theme 01s

# Rebuild initramfs
sudo mkinitcpio -P
```

### Plymouth Theme Details

```
/usr/share/plymouth/themes/01s/
â”œâ”€â”€ 01s.plymouth     # Theme definition
â”œâ”€â”€ 01s.script       # Animation script
â”œâ”€â”€ logo.png         # Static logo
â”œâ”€â”€ progress-bar.png # Progress bar
â”œâ”€â”€ throbber-*.png   # Spinner frames
â””â”€â”€ box.png         # Background box
```

## Customizing Conky

The desktop system monitor configuration is at `~/.config/conky/01s.conf`.

```bash
# Edit Conky config
nano ~/.config/conky/01s.conf

# Restart Conky
killall conky
conky -c ~/.config/conky/01s.conf &

# Disable Conky
killall conky
```

## Color Palette

01s Sovereign uses a consistent color palette:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Cyan | `#00c8ff` | Accents, highlights |
| Background Dark | `#0a0a0e` | Shell, panels |
| Text Primary | `#ffffff` | Main text |
| Success Green | `#00ff88` | Success states |
| Error Red | `#ff3355` | Error states |
| Warning Yellow | `#ffaa00` | Warnings |
| Surface Dark | `#1a1a2e` | Widget backgrounds |
| Surface Lighter | `#2a2a3e` | Hover states |

## System-Wide Theme Script

```bash
#!/bin/bash
# apply-theme.sh - Apply a complete theme configuration

THEME_NAME="${1:-Obsidian-flow}"
ICON_THEME="${2:-Pebble}"
FONT="${3:-Cantarell 11}"

echo "Applying theme: $THEME_NAME"
echo "Icon theme: $ICON_THEME"
echo "Font: $FONT"

# GTK Theme
gsettings set org.gnome.desktop.interface gtk-theme "$THEME_NAME"
gsettings set org.gnome.desktop.wm.preferences theme "$THEME_NAME"

# Icons
gsettings set org.gnome.desktop.interface icon-theme "$ICON_THEME"

# Font
gsettings set org.gnome.desktop.interface font-name "$FONT"
gsettings set org.gnome.desktop.interface document-font-name "$FONT"
gsettings set org.gnome.desktop.interface monospace-font-name "Cascadia Code 10"

# Shell theme (if User Themes enabled)
gsettings set org.gnome.shell.extensions.user-theme name "$THEME_NAME" 2>/dev/null

echo "Theme applied successfully"
```

---

## See Also

- [Desktop Tour](08-desktop-tour.md)
- [Configuring Firefox](15-configuring-firefox.md)
- [Theming and Branding System](../features/15-theming-and-branding-system.md)
- [Desktop FAQ](../faq/05-desktop-faq.md)

---



## Detailed Walkthrough

### Step-by-Step Guide

Follow these steps to complete the task described in this guide:

1. Open a terminal (Ctrl+Alt+T or Super+T)
2. Verify you are in the correct environment
3. Follow each instruction in sequence
4. Check the expected output at each step
5. If something goes wrong, refer to the troubleshooting section below

### Expected Outputs at Each Step

| Step | Expected Output | If Different |
|------|----------------|--------------|
| Command check | Command executes without error | Check PATH and permissions |
| Configuration apply | Setting is updated | Check for error messages |
| Verification | Pass / Success message | Re-check previous steps |
| Completion | Process completes | Check system logs |

### Common Error Messages

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Permission denied" | Need sudo/root | Prepend sudo to the command |
| "Command not found" | Tool not installed | Install with sudo pacman -S |
| "File not found" | Wrong path | Check path with ls or ind |
| "Connection refused" | Service not running | Start with systemctl start |
| "Invalid argument" | Wrong syntax | Check command syntax in docs |

### Verification Commands

After completing the guide steps, verify with:

`ash
# Check tool is accessible
which <tool-name>

# Check version
<tool-name> --version

# Check service status
systemctl status <service-name>

# View logs
journalctl -u <service-name> --no-pager -n 20
`

### Alternative Approaches

If the primary method doesn't work for your setup:

1. **Manual method**: Perform each step manually instead of using automation
2. **GUI method**: Use graphical tools instead of command line
3. **Container method**: Run in a Docker/Podman container
4. **VM method**: Set up in a virtual machine first

### Performance Considerations

| Factor | Impact | Recommendation |
|--------|--------|---------------|
| Disk I/O | Slow on HDD | Use SSD for better performance |
| Network speed | Affects downloads | Use wired connection |
| RAM | Affects compilation | Close other applications |
| CPU cores | Affects parallel tasks | Use -j flag for parallel builds |

### Next Steps

Once you've completed this guide, move to the next tutorial, practice on a test system, or explore the feature documentation for advanced options.


## Reference Information

### Related Commands
| Command | Purpose | Example |
|---------|---------|---------|
| man <topic> | View manual page | man ls |
| <command> --help | Show help | zerocli --help |
| info <topic> | GNU info page | info bash |

### Configuration Files
| File | Purpose | Location |
|------|---------|----------|
| System config | Global settings | /etc/ |
| User config | Per-user settings | ~/.config/ |
| Service config | Service definitions | /etc/systemd/system/ |
| Application data | Persistent data | ~/.local/share/ |

### Log Files Reference
| Log | Command | Location |
|-----|---------|----------|
| System journal | journalctl -xe | /var/log/journal/ |
| Boot log | dmesg | Kernel ring buffer |
| Auth log | journalctl -u sshd | /var/log/ |
| Ledger | 01s-ledger tail | ~/ledger/ |
| Health | 01s-ledger health status | logs/health/ |

### Environment Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| HOME | User home directory | /home/username |
| PATH | Executable search paths | /usr/local/bin:/usr/bin:/bin |
| LANG | System locale | en_US.UTF-8 |
| TERM | Terminal type | xterm-256color |
| EDITOR | Default text editor | nano |
| SHELL | Default shell | /bin/bash |
| USER | Current username | (login name) |

### Service Management Quick Reference
| Action | System Service | User Service |
|--------|---------------|--------------|
| View status | systemctl status <name> | systemctl --user status <name> |
| Start | sudo systemctl start <name> | systemctl --user start <name> |
| Stop | sudo systemctl stop <name> | systemctl --user stop <name> |
| Enable at boot | sudo systemctl enable <name> | systemctl --user enable <name> |
| Disable | sudo systemctl disable <name> | systemctl --user disable <name> |
| View logs | journalctl -u <name> | journalctl --user -u <name> |

### File System Hierarchy
| Directory | Purpose |
|-----------|---------|
| /bin | Essential user binaries |
| /boot | Boot loader files |
| /dev | Device files |
| /etc | System configuration |
| /home | User home directories |
| /proc | Process information |
| /root | Root user home |
| /run | Runtime variable data |
| /tmp | Temporary files |
| /usr | User system resources |
| /var | Variable data (logs, spools) |

### Package File Extensions
| Extension | Type | Install Command |
|-----------|------|----------------|
| .pkg.tar.zst | Standard package | pacman -U |
| .pkg.tar.xz | Legacy package | pacman -U |
| .src.tar.gz | Source package | makepkg -si |
| .flatpak | Flatpak app | flatpak install |
| .AppImage | Portable app | chmod +x && ./ |

## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| Theme not applying | dconf not updated | Run  1s-theme-init manually |
| Icons not changing | Cache not refreshed | Run gtk-update-icon-cache |
| Shell theme broken | Extension conflict | Disable other shell extensions |
| Colors look wrong | Monitor calibration | Check color profile in Settings |

## Practice Exercises

1. Review the key concepts covered in this guide
2. Try applying each configuration step on your system
3. Document any differences you observe from expected behavior
4. Share your experience in the community forums
5. Write a summary of what you learned

## Verification Checklist

- [ ] You can perform the main task described in this guide
- [ ] You understand the common mistakes and how to avoid them
- [ ] You can troubleshoot basic issues independently
- [ ] You know where to find additional help if needed

### Common Pitfalls (Appearance)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Shell theme breaks panel | Incompatible with GNOME version | Check theme supports your GNOME version |
| User themes extension missing | Shell theme won't load without it | Install User Themes extension first |
| Cursor theme not applied | Legacy cursor inheritance | Set both GTK and XCursor theme |
| Icons missing in file manager | Icon cache not updated | Run gtk-update-icon-cache as user |
| Wallpaper not spanning monitors | Wrong display configuration | Use "Span" option in Background settings |

## Practice Exercises (Advanced)

1. **Theme Development**: Create a custom GTK theme with your own color palette; apply it and test across all applications
2. **Icon Set Customization**: Download an icon theme and replace 10 icons with custom SVG designs
3. **Shell Theme Hack**: Modify an existing shell theme to change the panel height, font, and transparency
4. **Color Profile Creation**: Use a colorimeter or manual adjustment to create a custom display color profile
5. **CSS Injection**: Use the Stylish extension or userChrome.css to customize Firefox to match your system theme

## Further Reading

- [Desktop Tour](08-desktop-tour.md) â€” GNOME environment overview
- [Theming and Branding](../features/15-theming-and-branding-system.md) â€” System theming
- [GNOME Extensions](../features/04-gnome-shell-extensions.md) â€” Extension development
- [Desktop Environment](../features/03-desktop-environment.md) â€” Technical details
- [Firefox Customization](15-configuring-firefox.md) â€” Browser theming
- [Boot Splash Customization](../features/02-day1-iso-build-system.md) â€” Plymouth themes
- [Desktop FAQ](../faq/05-desktop-faq.md) â€” Common questions
- [Desktop Troubleshooting](../help/04-desktop-troubleshooting.md) â€” Issue resolution
- [Developer Art Guide](../developers/14-gnome-extension-development.md) â€” UI development
- [Community Themes](../community/07-community-projects-and-ecosystem.md) â€” Shared themes

## Theme Structure Reference

```
MyTheme/
â”œâ”€â”€ gtk-3.0/gtk.css          # GTK3 widget styling
â”œâ”€â”€ gtk-4.0/gtk.css          # GTK4 styling
â”œâ”€â”€ gnome-shell/gnome-shell.css  # Shell theming
â”œâ”€â”€ metacity-1/metacity-theme-1.xml  # Window decorations
â”œâ”€â”€ cinnamon/cinnamon.css    # Cinnamon support
â”œâ”€â”€ unity/unity.css          # Unity support
â””â”€â”€ index.theme              # Theme metadata
```

## Custom Shell Theme Snippet

```css
#panel {
    background-color: rgba(30, 30, 30, 0.95);
    color: #ffffff;
    font-size: 11pt;
    height: 2.2em;
}
.workspace-thumbnails {
    background-color: rgba(20, 20, 20, 0.85);
}
.app-well-app:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}
```

## Real-World Scenario: Branded Enterprise Desktop

A company deploys 50 01s Sovereign workstations with corporate branding. Design: (1) Custom GTK theme with company colors (#2c3e50, #3498db), (2) Company logo as wallpaper and GRUB background, (3) Custom icon set with branded application icons, (4) Unified cursor theme matching brand guidelines, (5) Boot splash with company name. Theme package is distributed via a custom pacman repository and recorded in each machine's ledger.

## GNOME Tweaks Settings

Install GNOME Tweaks: `sudo pacman -S gnome-tweaks`

### Recommended Tweaks
| Category | Setting | Effect |
|----------|---------|--------|
| Appearance | Adwaita-dark | Dark theme system-wide |
| Fonts | Scaling Factor 1.0 | Default text size |
| Fonts | Hinting: Slight | Sharp text on LCD |
| Keyboard & Mouse | Middle Click Paste: off | Prevents accidental pastes |
| Top Bar | Weekday: on | Show day names |
| Top Bar | Seconds: off | Clean clock |
| Windows | Attach Modal Dialogs | Keep dialogs with parent |
| Windows | Center New Windows | Appear in screen center |

## Theme Compatibility Matrix

| Theme Type | GNOME 45 | GNOME 46 | GNOME 47 | Notes |
|------------|----------|----------|----------|-------|
| GTK3 Theme | Full | Full | Full | Most themes |
| GTK4 Theme | Partial | Full | Full | Newer spec required |
| Shell Theme | Full | Full | Full | Check version support |
| Cursor Theme | Full | Full | Full | Cross-platform |
| Icon Theme | Full | Full | Full | Scalable preferred |
| Sound Theme | Full | Full | Full | Rarely customized |

## Creating Custom Accent Colors

```bash
# Create your accent color palette
mkdir -p ~/.local/share/themes/MyAccent/gtk-3.0
cat > ~/.local/share/themes/MyAccent/gtk-3.0/gtk.css << 'CSS'
@define-color accent_color #e67e22;
@define-color accent_bg_color #d35400;
@define-color accent_fg_color #ffffff;
@define-color destructive_color #c0392b;
@define-color success_color #27ae60;
@define-color warning_color #f39c12;
CSS
# Apply via GNOME Tweaks > Appearance > Themes
```

## Installing Community Themes

```bash
# Browse community themes
01s-theme list

# Install a theme
01s-theme install "dracula"

# Install from GitHub directly
git clone https://github.com/dracula/gtk.git ~/.themes/Dracula
git clone https://github.com/dracula/gnome-terminal.git ~/.local/share/gnome-terminal

# Apply via GNOME Tweaks
gnome-tweaks
# Appearance > Themes > Applications > Dracula
# Appearance > Themes > Shell > Dracula
# Appearance > Themes > Icons > Dracula
```

## Wallpaper Management

```bash
# System wallpapers location
ls /usr/share/backgrounds/01s/

# User wallpapers location
mkdir -p ~/.local/share/wallpapers
cp my-wallpaper.jpg ~/.local/share/wallpapers/

# Set wallpaper via command line
gsettings set org.gnome.desktop.background picture-uri \
  "file://$HOME/.local/share/wallpapers/my-wallpaper.jpg"

# Set lock screen wallpaper
gsettings set org.gnome.desktop.screensaver picture-uri \
  "file://$HOME/.local/share/wallpapers/my-wallpaper.jpg"

# Rotate wallpapers on schedule
gsettings set org.gnome.desktop.background picture-options 'zoom'
gsettings set org.gnome.desktop.background picture-uri-dark \
  "file://$HOME/.local/share/wallpapers/night-wallpaper.jpg"
```

## Font Configuration

```bash
# List available fonts
fc-list | grep -i "mono\|sans\|serif"

# Install fonts
sudo pacman -S ttf-jetbrains-mono ttf-fira-code ttf-ubuntu-font-family
sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji

# Configure default fonts via GNOME Tweaks
# Fonts > Interface Text > JetBrains Mono 11
# Fonts > Document Text > Ubuntu 11
# Fonts > Monospace Text > JetBrains Mono 10
# Fonts > Scaling Factor > 1.0

# Font rendering settings
gsettings set org.gnome.desktop.interface font-hinting 'slight'
gsettings set org.gnome.desktop.interface font-antialiasing 'rgba'
```

---

Lois-Kleinner and 0-1.gg 2026 Copyright

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
