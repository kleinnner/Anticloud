# Desktop Tour

This guide provides a comprehensive tour of the 01s Sovereign GNOME desktop environment, including custom extensions, themes, and applications.

## GNOME Desktop Overview

01s Sovereign ships with GNOME (43+) as the default desktop environment, customized with:
- **Custom themes** -- Obsidian-flow GNOME Shell theme
- **Curated extensions** -- Dash-to-Dock, ArcMenu, Blur My Shell, and more
- **Custom branding** -- 01s wallpaper, GRUB splash, Plymouth theme
- **Pre-configured apps** -- Firefox with privacy settings, Alacritty terminal

### Desktop Layout

```
┌────────────────────────────────────────────────┐
│ [Activities]  Clock              [🔊][🔋][⚙] │  <- Top Bar
├────────────────────────────────────────────────┤
│                                                │
│                                                │
│       ████████████████████████████████         │
│       ██   Main Workspace Area    ██         │  <- Desktop
│       ██                        ██         │
│       ██                        ██         │
│       ████████████████████████████████         │
│                                                │
│  ═══ Dash (Favorites) ═══                     │
│  🖥  🌐  📁  ⚙  ▶                            │  <- Left Side
└────────────────────────────────────────────────┘
```

## Activities Overview

Press **Super** (Windows) key or click **Activities** in the top bar to see:
- Search bar at top
- Window previews in the center
- Workspace thumbnails on the right
- Dash (favorites dock) on the bottom

### Activities Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| Overview | Super key | Window overview with search |
| App Grid | Super + A | Show all installed applications |
| Workspace | Super + S | Workspace overview |
| Search | Start typing in overview | Find files, apps, settings |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Super** | Toggle Activities Overview |
| **Super + 1-9** | Switch to / open app on dock position |
| **Super + Tab** | Switch between applications |
| **Super + Left/Right** | Snap window to side |
| **Super + Up** | Maximize window |
| **Super + Down** | Minimize / restore window |
| **Ctrl + Alt + Up/Down** | Switch workspace |
| **Alt + F2** | Run command dialog |
| **Alt + F4** | Close window |
| **Print Screen** | Screenshot |
| **Super + Shift + S** | Partial screenshot |
| **Super + L** | Lock screen |
| **Alt + Tab** | Switch windows |
| **Ctrl + Alt + T** | Open terminal (if configured) |
| **Super + H** | Hide window |
| **Super + D** | Show desktop |

## GNOME Shell Extensions

01s Sovereign pre-installs these GNOME extensions:

### 1. Dash-to-Dock
A customizable dock on the left side of the screen with auto-hide, intelli-hide, and window previews. Configure via right-click menu.

Settings:
```
Position: Left
Auto-hide: Enabled
Icon size: 48px
Intelli-hide: Enabled
Show favorites: Always
Window previews: On hover
```

### 2. ArcMenu
A traditional-style application menu triggered by clicking the 01s icon. Categories include Accessories, Development, Internet, Settings, etc.

Layout options: Rainbow, Modern, Elegant, Launcher, Runner, Eleven, Mint, Windows 11, Gnome Menu

### 3. Blur My Shell
Adds dynamic blur effects to the overview background, top panel, dash, and app folders.

| Setting | Default | Description |
|---------|---------|-------------|
| Blur intensity | 5 | Strength of blur effect |
| Sigma | 15 | Blur radius |
| Brightness | 0.6 | Background brightness |
| Overview blur | Enabled | Apply to overview |
| Panel blur | Enabled | Apply to top panel |
| Dash blur | Enabled | Apply to dock |

### 4. Just Perfection
Fine-tune GNOME UI behavior -- customize visibility of UI elements, control notifications, manage animations.

```bash
# Example settings
gsettings set org.gnome.shell.extensions.just-perfection activities-button false
gsettings set org.gnome.shell.extensions.just-perfection world-clock false
gsettings set org.gnome.shell.extensions.just-perfection window-demands-attention false
```

### 5. Burn My Windows
Window open/close animations: Fire, Magic lamp, Glide, Energize A.

```bash
# Set animation effect
gsettings set org.gnome.shell.extensions.burn-my-windows animation "fire"
```

### 6. Space Bar
Visual workspace indicator in the top bar.

### 7. Transparent Top Bar
Makes the top bar transparent on non-maximized windows.

### 8. Rounded Window Corners
Adds rounded corners to all windows.

### 9. Panel Corners
Rounded panel corners for visual consistency.

### Extension Management

```bash
# List installed extensions
gnome-extensions list

# Get extension info
gnome-extensions info dash-to-dock@micxgx.gmail.com

# Enable/disable
gnome-extensions enable extension-uuid
gnome-extensions disable extension-uuid

# Open extension preferences
gnome-extensions prefs extension-uuid
```

## Default Applications

| Category | Application |
|----------|-------------|
| **Web Browser** | Firefox (privacy-hardened) |
| **File Manager** | Nautilus (Files) |
| **Terminal** | Alacritty |
| **Text Editor** | GNOME Text Editor |
| **Code Editor** | Vim, Nano |
| **Settings** | GNOME Control Center |
| **System Monitor** | Conky (desktop widget) |
| **Audio** | PipeWire + WirePlumber |
| **Image Viewer** | Loupe |
| **Video Player** | GNOME Videos |
| **Archive Manager** | File Roller |
| **Calculator** | GNOME Calculator |
| **Calendar** | GNOME Calendar |

## Conky System Monitor

A semi-transparent Conky widget displays on the desktop showing:
- System name and kernel version
- Uptime, CPU usage, RAM usage
- Disk usage and network activity

### Conky Configuration

The widget is configured at `~/.config/conky/01s.conf`:

```lua
conky.config = {
    alignment = 'top_right',
    gap_x = 20,
    gap_y = 50,
    minimum_width = 250,
    maximum_width = 250,
    own_window_argb_visual = true,
    own_window_argb_value = 120,
    default_color = '00c8ff',
    color1 = '00ff88',
    color2 = 'ff3355',
};

conky.text = [[
${color #00c8ff}${font Ubuntu:size=14}${alignc}01s Sovereign${font}
${hr 2}
${color1}Kernel:${color} $kernel
${color1}Uptime:${color} $uptime
${color1}CPU:${color} ${cpu}%
${color1}RAM:${color} $memperc%
${color1}Disk:${color} ${diskio}
${color1}Net:${color} ${totaldown} down / ${totalup} up
]];
```

## Workspaces

GNOME uses dynamic workspaces:
- **Create:** Drag a window to an empty area in workspace thumbnails
- **Switch:** Super + PageUp/PageDown or Ctrl + Alt + Up/Down
- **Overview:** Shows all workspaces with window previews

### Workspace Tips

| Action | Method |
|--------|--------|
| New workspace | Drag window past edge of workspace list |
| Move window to workspace | Drag window preview in overview |
| Switch workspace | Ctrl + Alt + Arrow keys |
| Switch directly | Super + Page Up/Down |
| See all windows | Super key on empty desktop |

## System Services

```bash
# Check status of 01s services
systemctl status 01s-boot.service
systemctl status 01s-state.timer

# View system journal
journalctl -xe

# Check ledger daemon
01s-ledger status
01s-ledger tail 5
```

### Service Management Reference

```bash
# Start/stop services
sudo systemctl start service-name
sudo systemctl stop service-name

# Enable/disable at boot
sudo systemctl enable service-name
sudo systemctl disable service-name

# Check service logs
journalctl -u service-name
journalctl -u service-name -n 50 --no-pager
```

---


## Desktop Components Reference

| Component | Location | Description |
|-----------|----------|-------------|
| Shell theme | /usr/share/themes/Obsidian-flow/ | GNOME Shell CSS |
| GTK theme | /usr/share/themes/Cyber-Dusk-Rounded-Glass/ | Widget styling |
| Icon theme | /usr/share/icons/Pebble/ | Application icons |
| Cursor theme | /usr/share/icons/WhiteSur-cursors/ | Mouse cursors |
| Plymouth | /usr/share/plymouth/themes/01s/ | Boot animation |
| GRUB theme | /usr/share/grub/themes/Particle-circle-window/ | Boot menu |
| Wallpapers | /usr/share/backgrounds/01s/ | Desktop background |

## GNOME Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Super | Activities overview |
| Super+T | Open terminal |
| Super+D | Show desktop |
| Super+L | Lock screen |
| Super+Tab | Switch applications |
| Super+Left/Right | Snap window to side |
| Super+Up/Down | Maximize/restore |
| Alt+F2 | Run command |
| Alt+F4 | Close window |
| Print | Take screenshot |
| Ctrl+Alt+T | Terminal (alt) |

## Desktop Performance Tuning

`ash
# Disable animations for faster feel
gsettings set org.gnome.desktop.interface enable-animations false

# One workspace per monitor
gsettings set org.gnome.shell.overrides workspaces-only-on-primary true

# Reduce icon size
gsettings set org.gnome.nautilus.icon-view default-zoom-level 'small'
`
"@

 = @"
## 01s Language Syntax Reference

### Data Types

| Type | Example | Description |
|------|---------|-------------|
| Number | 42, 3.14 | Integer or floating-point |
| String | "hello" | Text in double quotes |
| Identifier | x, myVar | Variable or function name |

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| = | Assignment | let x = 42 |
| + | Addition | x + 1 |
| - | Subtraction | x - 1 |
| * | Multiplication | x * 2 |
| / | Division | x / 2 |

### Keywords

| Keyword | Purpose | Example |
|---------|---------|---------|
| let | Variable declaration | let x = 10 |
| if | Conditional | if x { ... } |
| while | Loop | while x { ... } |
| print | Output | print x |
| eturn | Return value | eturn 0 |

## Program Examples

### Hello World
`
print "Hello, 01s Sovereign!"
`

### Simple Arithmetic
`
let x = 5
let y = 3
let result = x + y * 2
print result
`
Computation: esult = 5 + (3 * 2) = 11

### Conditional Logic
`
let x = 42
if x {
    print "x is non-zero"
}
`

### Countdown Loop
`
let count = 5
while count {
    print count
    let count = count - 1
}
print "blastoff!"
`

## Pipeline Visualization

`mermaid
flowchart LR
    A[source.01s] --> B[01s-lexer]
    B --> C[Token Stream]
    C --> D[01s-parser]
    D --> E[AST]
    E --> F[01s-codegen]
    F --> G[.bin file]
    G --> H[Execute]
`
"@

 = @"
## Ledger Command Examples

### Session Management
`ash
# Start a new session
01s-ledger init

# Check current session
01s-ledger status

# List all sessions
ls -la ~/ledger/
`

### Logging
`ash
# Log a custom event
01s-ledger log custom event="system_update" result="success"

# Log multiple key=value pairs
01s-ledger log custom action="deploy" target="production" version="1.0.1"

# Log from script
log_event() {
    01s-ledger log custom event="" timestamp=""
}
`

### Querying
`ash
# Show recent entries
01s-ledger tail 10

# Watch for new entries
01s-ledger watch 5

# Export and count by type
01s-ledger export | python3 -c "
import json, sys
entries = [json.loads(l) for l in sys.stdin if l.strip()]
types = {}
for e in entries:
    t = e.get('type', 'unknown')
    types[t] = types.get(t, 0) + 1
for t, c in sorted(types.items()):
    print(f'{t}: {c}')
"
`

## Ledger Configuration Reference

| Setting | Config File | Default | Description |
|---------|-------------|---------|-------------|
| Ledger dir | ledger_dir | ~/ledger/ | Where .aioss files are stored |
| State interval | STATE_INTERVAL | 300 | Seconds between state snapshots |
| Max entry size | max_entry_size | 65536 | Maximum bytes per entry |
| Hash algorithm | hash_alg | sha3-256 | Hash function |
| JSON indent | json_indent | alse | Pretty-print output |

## Ledger Automation

`ash
# Hourly verification
# Add to crontab -e:
0 * * * * /usr/bin/01s-ledger verify >> /var/log/01s-verify.log 2>&1

# Daily export
0 0 * * * /usr/bin/01s-ledger export > ~/ledger/backups/ledger-.json
`
"@

 = @"
## Package Management Command Reference

| Action | pacman | yay (AUR) |
|--------|--------|-----------|
| Install | pacman -S pkg | yay -S pkg |
| Remove | pacman -R pkg | yay -R pkg |
| Remove + configs | pacman -Rns pkg | yay -Rns pkg |
| Search | pacman -Ss keyword | yay -Ss keyword |
| Info | pacman -Qi pkg | yay -Qi pkg |
| Update all | pacman -Syu | yay -Syu |
| List installed | pacman -Q | yay -Q |
| List explicit | pacman -Qqe | yay -Qqe |
| Orphans | pacman -Qdt | yay -Qdt |
| File owner | pacman -Qo /path | yay -Qo /path |

## Update Best Practices

`ash
# Daily: sync package database
sudo pacman -Sy

# Weekly: full system update
sudo pacman -Syu

# Monthly: clean up
sudo pacman -Sc              # Clean cache
sudo pacman -Qdt             # Find orphans
sudo pacman -Rns   # Remove orphans
`

## AUR Helper Installation

`ash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git /tmp/yay
cd /tmp/yay
makepkg -si
cd -
rm -rf /tmp/yay
`

## Package Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| ailed to commit transaction | Lock exists | Remove /var/lib/pacman/db.lck |
| invalid or corrupted package | Download error | Run sudo pacman -Syu again |
| could not resolve host | DNS issue | Check /etc/resolv.conf |
| key not found | GPG key issue | sudo pacman-key --refresh-keys |
| conflicting files | File ownership | Use --overwrite carefully |

## See Also

- [Customizing Appearance](09-customizing-appearance.md)
- [Configuring Firefox](15-configuring-firefox.md)
- [Using 01s-Ledger](10-using-01s-ledger.md)
- [Desktop FAQ](../faq/05-desktop-faq.md)

---


## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| Extension not working | Version mismatch | Check GNOME Shell version compatibility |
| Workspace switching slow | Too many animations | Disable animations in GNOME Tweaks |
| Dash missing apps | Not added to favorites | Right-click app and select 'Add to Favorites' |
| Notifications not showing | Do Not Disturb enabled | Toggle off in quick settings |

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

### Common Pitfalls (Desktop Tour)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Extensions not loading | GNOME Shell version mismatch | Check extension compatibility before installing |
| Workspaces confusing | Different from Windows/macOS | Use Super+PageUp/PageDown to navigate |
| Activities Overview lag | GPU acceleration disabled | Enable in Settings > About > Graphics |
| Dock not showing | Hidden in GNOME 40+ | Press Super key or move mouse to Activities |
| Night Light not activating | Geolocation not set | Manually set schedule in Display settings |
| Search not finding apps | Cache not rebuilt | Run gnome-shell-extension-prefs to reset |

## Practice Exercises (Advanced)

1. **Custom Workspace Layout**: Create 4 workspaces with specific apps assigned to each; document your workflow efficiency
2. **Keyboard Shortcuts Mastery**: Learn and document 20 essential keyboard shortcuts; create a cheat sheet for daily use
3. **Extension Stack**: Install and configure 10 GNOME Shell extensions; identify which ones conflict
4. **Accessibility Audit**: Enable all accessibility features and document how they change the desktop experience
5. **Multi-Monitor Setup**: Connect two monitors; configure different wallpapers, extensions, and workspaces per monitor

## Further Reading

- [Customizing Appearance](09-customizing-appearance.md) — Themes and icons
- [Post-Installation Setup](07-post-installation-setup.md) — Initial configuration
- [GNOME Extensions](../features/04-gnome-shell-extensions.md) — Extension development
- [Theming and Branding](../features/15-theming-and-branding-system.md) — Visual design
- [Desktop Environment](../features/03-desktop-environment.md) — Technical details
- [Desktop Troubleshooting](../help/04-desktop-troubleshooting.md) — Solving issues
- [Desktop FAQ](../faq/05-desktop-faq.md) — Common questions
- [Performance Tuning](24-performance-tuning.md) — Graphics optimization
- [Accessibility Guide](../help/09-getting-support.md) — Accessibility features
- [Audio Configuration](../features/20-audio-and-sound-scheme.md) — Sound setup

## Keyboard Shortcuts Reference

| Shortcut | Action | Category |
|----------|--------|----------|
| Super | Activities Overview | Navigation |
| Super+Tab | Cycle apps | Navigation |
| Super+A | App grid | Navigation |
| Super+D | Show desktop | Navigation |
| Super+↑ | Maximize | Window |
| Super+↓ | Restore/Minimize | Window |
| Super+←/→ | Snap to half | Window |
| Super+PageUp | Prev workspace | Workspace |
| Super+PageDown | Next workspace | Workspace |
| Alt+F10 | Toggle fullscreen | Window |
| Alt+Space | Window menu | Window |
| Alt+Tab | Switch windows | Navigation |
| Alt+F2 | Run command | System |
| Print | Screenshot | System |
| Shift+Print | Screenshot area | System |

## GNOME Extension Recommendations

| Extension | Purpose | Risk Level |
|-----------|---------|------------|
| Dash to Dock | Taskbar | Low |
| AppIndicator | Tray icons | Low |
| Clipboard Indicator | History | Low |
| GSConnect | Phone integration | Medium |
| Vitals | System monitor | Low |
| Blur My Shell | Visual effects | Medium |
| Night Theme Slider | Auto dark mode | Low |
| Just Perfection | Tweak UI | Medium |

## Real-World Scenario: Kiosk Mode

A museum deploys 01s Sovereign as interactive kiosks. Desktop configuration: (1) Auto-login for kiosk user, (2) Single application mode (Firefox in fullscreen), (3) Disable all keyboard shortcuts except Alt+F4, (4) Remove workspace switcher and dock, (5) Enable remote monitoring via ledger. Result: 12 kiosk stations running reliably with remote health monitoring through the ledger.

## Detailed GNOME Interface Guide

### Top Bar Components
| Element | Left | Center | Right |
|---------|------|--------|-------|
| Activities | Overview button | - | - |
| Clock | - | Date/time (click for calendar) | - |
| System Menu | - | - | WiFi, sound, battery, settings |
| Notification | - | - | Bell icon (alerts) |
| Workspace | - | - | Workspace indicator |

### Activities Overview
- Press Super key to enter
- Top: Search bar (apps, files, settings, calculator)
- Center: Open windows as thumbnails
- Bottom: Workspace switcher
- Left: Dash (favorite apps)

### File Manager (Nautilus) Features
- Ctrl+T: New tab
- Ctrl+D: Bookmark folder
- Ctrl+H: Show hidden files
- Ctrl+L: Enter location path
- Ctrl+F: Search within folder
- F3: Split view
- Ctrl+1/2: Icon/list view

## Recommended Applications

| Category | Application | Package Name | Alternative |
|----------|-------------|--------------|-------------|
| Browser | Firefox (customized) | firefox | Chromium |
| Office | LibreOffice | libreoffice-fresh | OnlyOffice |
| Media | VLC | vlc | Celluloid |
| Image | GIMP | gimp | Inkscape (vector) |
| Terminal | GNOME Console | kgx | Tilix |
| Text Editor | VS Code | visual-studio-code-bin (AUR) | GNOME Builder |
| Music | GNOME Music | gnome-music | Spotify (flatpak) |
| Email | Thunderbird | thunderbird | Geary |

## Activities Overview Detailed Guide

The Activities Overview is the central navigation hub in GNOME:

**Opening the Overview:**
- Press the Super key (Windows key)
- Move mouse to top-left hot corner
- Click "Activities" in the top bar

**Overview Components:**
1. **Search Bar** (top): Type to search apps, files, settings, calculator results, and web
2. **Dash** (left): Favorite applications for quick launch (drag to add/remove)
3. **Window Previews** (center): All open windows displayed as scaled thumbnails
4. **Workspace Switcher** (right): Virtual desktops, drag windows between them
5. **App Grid** (bottom): Click grid icon or press Super+A to see all installed apps

**Keyboard Navigation in Overview:**
- Super: Toggle overview
- Super+A: Open app grid
- Super+Tab: Cycle through recent applications
- Alt+Tab: Switch between windows of current application
- Ctrl+Alt+Up/Down: Move between workspaces
- Super+PageUp/PageDown: Switch workspaces
- Shift+Super+PageUp: Move window to previous workspace

## Notification and Messaging

- Notifications appear at the top of the screen (center)
- Click notification to open the relevant application
- Right-click notification to dismiss or change settings
- Toggle Do Not Disturb from quick settings menu
- Notification history is available by clicking the clock
- Each notification is logged in the ledger with app name and timestamp

## GNOME Software & Package Management

GNOME Software provides a graphical interface for package management:
- Browse featured and categorized applications
- Search for specific packages
- View application details (description, screenshots, ratings)
- Install/uninstall with one click
- Manage Flatpak and Snap applications (if enabled)
- View update history with ledger timestamps

---

Lois-Kleinner and 0-1.gg 2026 Copyright

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ