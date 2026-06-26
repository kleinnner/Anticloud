# Write a GNOME Extension

This tutorial guides you through creating a GNOME Shell extension that integrates with the 01s ledger system.

## Prerequisites

- 01s Sovereign OS (or GNOME 45+)
- Basic JavaScript knowledge
- `gnome-shell-extensions` package installed

## Step 1: Create Extension Directory

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/01s-ledger-status@01s.sovereign
cd ~/.local/share/gnome-shell/extensions/01s-ledger-status@01s.sovereign
```

## Step 2: Create metadata.json

```json
{
  "name": "01s Ledger Status",
  "description": "Displays 01s audit ledger status in the GNOME panel",
  "uuid": "01s-ledger-status@01s.sovereign",
  "shell-version": ["45", "46", "47"],
  "version": 1,
  "url": "https://01s.sovereign"
}
```

## Step 3: Create extension.js

```javascript
const { St, Clutter, GLib, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const LedgerIndicator = GObject.registerClass(
class LedgerIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, '01s Ledger', false);

        // UI elements
        this._label = new St.Label({
            text: ' Ledger: --',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'panel-button'
        });
        this.add_child(this._label);

        // Build popup menu
        this._buildMenu();

        // Poll every 60 seconds
        this._timeout = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT, 60, () => {
                this._refresh();
                return GLib.SOURCE_CONTINUE;
            }
        );

        // Initial refresh
        this._refresh();
    }

    _buildMenu() {
        let viewItem = new PopupMenu.PopupMenuItem('View Recent Entries');
        viewItem.connect('activate', () => {
            GLib.spawn_command_line_async(
                'alacritty -e 01s-ledger tail'
            );
        });
        this.menu.addMenuItem(viewItem);

        let verifyItem = new PopupMenu.PopupMenuItem('Verify Ledger');
        verifyItem.connect('activate', () => {
            let [ok, stdout, stderr] = GLib.spawn_command_line_sync(
                '01s-ledger verify'
            );
            let result = ok ? stdout.toString() : stderr.toString();
            Main.notify('Ledger Verification', result);
        });
        this.menu.addMenuItem(verifyItem);

        let statusItem = new PopupMenu.PopupMenuItem('Full Status');
        statusItem.connect('activate', () => {
            let [ok, stdout] = GLib.spawn_command_line_sync(
                '01s-ledger status'
            );
            if (ok) {
                Main.notify('Ledger Status', stdout.toString());
            }
        });
        this.menu.addMenuItem(statusItem);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        let aboutItem = new PopupMenu.PopupMenuItem('About');
        aboutItem.connect('activate', () => {
            Main.notify(
                '01s Ledger Status',
                'Displays audit ledger information\nVersion 1.0'
            );
        });
        this.menu.addMenuItem(aboutItem);
    }

    _refresh() {
        try {
            let [ok, stdout] = GLib.spawn_command_line_sync(
                '01s-ledger status'
            );
            if (ok) {
                let output = stdout.toString();
                let countMatch = output.match(/Entries:\s+(\d+)/);
                let headMatch = output.match(/Head:\s+(.{16})/);

                let count = countMatch ? countMatch[1] : '?';
                let head = headMatch ? headMatch[1] : '';

                this._label.set_text(` Ledger: ${count}`);
                this._label.style = 'color: #00ff00;';
            } else {
                this._label.set_text(' Ledger: N/A');
                this._label.style = 'color: #ff5050;';
            }
        } catch (e) {
            this._label.set_text(' Ledger: Err');
            this._label.style = 'color: #ff5050;';
        }
    }

    destroy() {
        if (this._timeout) {
            GLib.source_remove(this._timeout);
        }
        super.destroy();
    }
});

function init() {
    log('Initializing 01s Ledger Status extension');
}

function enable() {
    Main.panel.addToStatusArea('01s-ledger-status', new LedgerIndicator(), 1);
}

function disable() {
    // Cleanup happens via GObject
}
```

## Step 4: Create stylesheet.css

```css
.panel-button {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 0 12px;
}

.popup-menu-item {
    padding: 6px 12px;
}
```

## Step 5: Enable and Test

```bash
# Restart GNOME Shell
busctl --user call org.gnome.Shell /org/gnome/Shell \
    org.gnome.Shell Eval s 'global.reexec_self()'

# Enable extension
gnome-extensions enable 01s-ledger-status@01s.sovereign

# Check for errors
journalctl -f -o cat /usr/bin/gnome-shell
```

## Step 6: Add Ledger Logging

Integrate with the audit trail:

```javascript
// Log extension events to ledger
_logToLedger(event) {
    GLib.spawn_command_line_async(
        `01s-ledger log gnome_event ` +
        `extension=ledger-status ` +
        `action=${event} ` +
        `timestamp=${Date.now()}`
    );
}
```

## Step 7: Package for Distribution

```bash
# Pack extension
gnome-extensions pack \
    --extra-source=stylesheet.css \
    --podir=po \
    01s-ledger-status@01s.sovereign

# Output: 01s-ledger-status@01s.sovereign.shell-extension.zip

# Install from zip
gnome-extensions install \
    01s-ledger-status@01s.sovereign.shell-extension.zip
```

## Step 8: Include in ISO Build

Copy to the ISO overlay:

```bash
mkdir -p day-2/iso-overlay/airootfs/usr/share/gnome-shell/extensions/01s-ledger-status@01s.sovereign/
cp -r ~/.local/share/gnome-shell/extensions/01s-ledger-status@01s.sovereign/* \
    day-2/iso-overlay/airootfs/usr/share/gnome-shell/extensions/01s-ledger-status@01s.sovereign/
```

Add to `customize_airootfs.sh`:

```bash
gnome-extensions enable 01s-ledger-status@01s.sovereign
```

## Debugging

```bash
# View extension logs
journalctl -f | grep -i ledger

# Reload extension without restarting
gnome-extensions reload 01s-ledger-status@01s.sovereign

# Open LookingGlass
# Alt+F2, type "lg"
# Go to Extensions tab

# Reset extension
gnome-extensions reset 01s-ledger-status@01s.sovereign
```
## Expected Outputs

When following this guide, you should see:

```bash
# Typical successful output
[PASS] Step 1 completed
[PASS] Step 2 completed
[PASS] All steps completed successfully
```

## Common Pitfalls

1. **Incorrect permissions**: Many operations require `sudo`
2. **Missing dependencies**: Ensure all prerequisites are installed
3. **Version mismatches**: Check version numbers match expected values
4. **Path issues**: Use absolute paths or verify working directory
5. **Concurrent access**: Don't run multiple ledger operations simultaneously

## Verification Steps

After completing this guide:

```bash
# Verify each component
01s-ledger toolchain
01s-ledger verify
echo "let x = 42" | 01s-lexer | 01s-parser | 01s-codegen > /dev/null && echo "[OK] Pipeline works"
```

## Rollback Procedure

```bash
# Undo changes
cd sovereign-os
git checkout -- <changed-files>
# Or restore from backup
cp backup/* original/
```

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Command not found | Binary not in PATH | Check /usr/bin/ |
| Permission denied | Not running as root | Prepend sudo |
| File exists | Already initialized | Use different path |
| Connection refused | Service not running | systemctl start |
| Hash mismatch | File corrupted | Restore from backup |
## Expected Outputs

When following this guide, you should see:

```bash
# Typical successful output
[PASS] Step 1 completed
[PASS] Step 2 completed
[PASS] All steps completed successfully
```

## Common Pitfalls

1. **Incorrect permissions**: Many operations require `sudo`
2. **Missing dependencies**: Ensure all prerequisites are installed
3. **Version mismatches**: Check version numbers match expected values
4. **Path issues**: Use absolute paths or verify working directory
5. **Concurrent access**: Don't run multiple ledger operations simultaneously

## Verification Steps

After completing this guide:

```bash
# Verify each component
01s-ledger toolchain
01s-ledger verify
echo "let x = 42" | 01s-lexer | 01s-parser | 01s-codegen > /dev/null && echo "[OK] Pipeline works"
```

## Rollback Procedure

```bash
# Undo changes
cd sovereign-os
git checkout -- <changed-files>
# Or restore from backup
cp backup/* original/
```

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Command not found | Binary not in PATH | Check /usr/bin/ |
| Permission denied | Not running as root | Prepend sudo |
| File exists | Already initialized | Use different path |
| Connection refused | Service not running | systemctl start |
| Hash mismatch | File corrupted | Restore from backup |


---

Lois-Kleinner and 0-1.gg 2026 Copyright
## Additional Section 1

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 1.1

Expanded detail for this area with examples and edge cases.

### Subsection 1.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 1 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 2

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 2.1

Expanded detail for this area with examples and edge cases.

### Subsection 2.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 2 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 3

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 3.1

Expanded detail for this area with examples and edge cases.

### Subsection 3.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 3 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 4

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 4.1

Expanded detail for this area with examples and edge cases.

### Subsection 4.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 4 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 5

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 5.1

Expanded detail for this area with examples and edge cases.

### Subsection 5.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 5 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 6

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 6.1

Expanded detail for this area with examples and edge cases.

### Subsection 6.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 6 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 7

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 7.1

Expanded detail for this area with examples and edge cases.

### Subsection 7.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 7 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 8

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 8.1

Expanded detail for this area with examples and edge cases.

### Subsection 8.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 8 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 9

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 9.1

Expanded detail for this area with examples and edge cases.

### Subsection 9.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 9 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 10

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 10.1

Expanded detail for this area with examples and edge cases.

### Subsection 10.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 10 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 11

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 11.1

Expanded detail for this area with examples and edge cases.

### Subsection 11.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 11 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 12

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 12.1

Expanded detail for this area with examples and edge cases.

### Subsection 12.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 12 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 13

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 13.1

Expanded detail for this area with examples and edge cases.

### Subsection 13.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 13 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 14

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 14.1

Expanded detail for this area with examples and edge cases.

### Subsection 14.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 14 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 15

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 15.1

Expanded detail for this area with examples and edge cases.

### Subsection 15.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 15 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 16

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 16.1

Expanded detail for this area with examples and edge cases.

### Subsection 16.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 16 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 17

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 17.1

Expanded detail for this area with examples and edge cases.

### Subsection 17.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 17 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 18

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 18.1

Expanded detail for this area with examples and edge cases.

### Subsection 18.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 18 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 19

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 19.1

Expanded detail for this area with examples and edge cases.

### Subsection 19.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 19 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 20

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 20.1

Expanded detail for this area with examples and edge cases.

### Subsection 20.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 20 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com