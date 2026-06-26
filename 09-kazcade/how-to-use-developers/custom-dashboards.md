<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Custom Dashboards

This guide covers building custom dashboard plugins using the web extension API.

## Dashboard Extension Architecture

`
+----------------------------------------------------------+
¦                  Kazkade Dashboard                        ¦
¦  +----------+ +----------+ +------------------------+  ¦
¦  ¦ Core UI  ¦ ¦ Extension¦ ¦ Custom Widgets          ¦  ¦
¦  ¦ (built-  ¦ ¦ Registry ¦ ¦ +--------+ +--------+  ¦  ¦
¦  ¦  in)     ¦ ¦          ¦ ¦ ¦Widget A¦ ¦Widget B¦  ¦  ¦
¦  +----------+ +----------+ ¦ +--------+ +--------+  ¦  ¦
¦                    ¦       +------------------------+  ¦
¦                    ?                                    ¦
¦           +----------------+                           ¦
¦           ¦ Extension API  ¦                           ¦
¦           ¦ (WebSocket +   ¦                           ¦
¦           ¦  REST)         ¦                           ¦
¦           +----------------+                           ¦
+----------------------------------------------------------+
`

## Extension API

Extensions communicate via WebSocket and REST:

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/v1/extensions | GET | List installed extensions |
| /api/v1/extensions/:id | GET | Extension details |
| /api/v1/extensions/:id/widgets | GET | Extension widgets |
| /api/v1/extensions/:id/config | GET/PUT | Extension config |
| /ws/extensions/:id | WS | Real-time data channel |

## Creating a Custom Widget

### Step 1: Widget Manifest

`json
{
  "id": "my-extension",
  "name": "My Dashboard Extension",
  "version": "1.0.0",
  "description": "Custom analytics widgets",
  "author": "My Name",
  "widgets": [
    {
      "id": "realtime-chart",
      "name": "Real-time Chart",
      "type": "chart",
      "defaults": {
        "width": 2,
        "height": 2,
        "refresh_interval": 1000
      }
    },
    {
      "id": "status-panel",
      "name": "Status Panel",
      "type": "panel",
      "defaults": {
        "width": 1,
        "height": 1
      }
    }
  ],
  "permissions": [
    "query:read",
    "files:list"
  ]
}
`

### Step 2: React Widget

`jsx
// widgets/realtime-chart.jsx
import { useState, useEffect } from 'react';
import { useDashboard, Chart } from '@kazcade/dashboard-sdk';

export function RealtimeChart({ config }) {
  const { query, subscribe } = useDashboard();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Subscribe to real-time data
    const unsubscribe = subscribe('realtime-data', (newData) => {
      setData(prev => [...prev.slice(-100), ...newData]);
    });

    // Initial query
    query(
      SELECT timestamp, value 
      FROM sensor_data 
      WHERE ts > NOW() - INTERVAL '5 minutes'
      ORDER BY timestamp
    ).then(setData);

    return () => unsubscribe();
  }, []);

  return (
    <Chart
      type="line"
      data={data}
      x="timestamp"
      y="value"
      title={config.title || "Real-time Sensor Data"}
      color="#00ff88"
    />
  );
}
`

### Step 3: Vanilla JS Widget

`javascript
// widgets/status-panel.js
class StatusPanelWidget {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.api = window.__KAZCADE_DASHBOARD_API__;
    this.render();
  }

  async render() {
    const health = await this.api.get('/api/v1/health');
    const info = await this.api.get('/api/v1/info');

    this.container.innerHTML = 
      <div class="status-panel">
        <h3></h3>
        <div class="status-grid">
          <div class="status-item ">
            <span class="label">Health</span>
            <span class="value"></span>
          </div>
          <div class="status-item">
            <span class="label">Uptime</span>
            <span class="value"></span>
          </div>
          <div class="status-item">
            <span class="label">Files</span>
            <span class="value"></span>
          </div>
          <div class="status-item">
            <span class="label">SIMD</span>
            <span class="value"></span>
          </div>
        </div>
      </div>
    ;
  }

  formatUptime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return ${h}h m;
  }
}

// Register
window.__KAZCADE_DASHBOARD_API__.registerWidget('status-panel', StatusPanelWidget);
`

## Extension Packaging

`ash
# Create extension package
npm init -y
npm install @kazcade/dashboard-sdk
`

### package.json

`json
{
  "name": "kazcade-extension-my-extension",
  "version": "1.0.0",
  "main": "dist/index.js",
  "kazcade": {
    "manifest": "manifest.json",
    "entry": "dist/index.js",
    "styles": "dist/styles.css"
  },
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  }
}
`

### Webpack Config

`javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ]
  },
  externals: {
    '@kazcade/dashboard-sdk': 'KazcadeDashboardSDK',
    'react': 'React',
  }
};
`

## Installing Extensions

`ash
# Local installation
kazkade dashboard extension install ./my-extension
# or via URL
kazkade dashboard extension install https://extensions.kazcade.io/my-extension.v1.kdext

# List installed
kazkade dashboard extension list

# Enable/disable
kazkade dashboard extension enable my-extension
kazkade dashboard extension disable my-extension

# Uninstall
kazkade dashboard extension uninstall my-extension
`

## Widget API Reference

`javascript
const api = window.__KAZCADE_DASHBOARD_API__;

// Query data
api.query(sql, params);            // Promise<Result>
api.subscribe(channel, callback);  // unsubscribe function

// Dashboard state
api.getState();                    // Current dashboard state
api.onStateChange(callback);       // State change listener

// Navigation
api.navigate(path);                // Navigate to dashboard page

// Storage
api.getConfig(widgetId);           // Widget configuration
api.setConfig(widgetId, config);   // Update configuration

// Events
api.emit(event, data);             // Emit custom event
api.on(event, callback);           // Listen for events
`

## React SDK

`jsx
import {
  DashboardProvider,
  useQuery,
  useSubscription,
  Widget,
  Chart,
  Table,
  Panel,
  useConfig,
} from '@kazcade/dashboard-sdk';

function MyWidget() {
  const { data, loading, error } = useQuery(
    SELECT category, SUM(amount) as total
    FROM transactions
    GROUP BY category
    ORDER BY total DESC
  );

  const [config, setConfig] = useConfig();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Widget title={config.title || "Revenue by Category"}>
      <Chart type="bar" data={data} x="category" y="total" />
      <Table data={data} />
    </Widget>
  );
}

// Register
<DashboardProvider apiKey="...">
  <MyWidget />
</DashboardProvider>
`

## Widget Configuration UI

`jsx
function WidgetConfig({ config, onChange }) {
  return (
    <div className="widget-config">
      <label>
        Title:
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
        />
      </label>
      <label>
        Refresh Interval (ms):
        <input
          type="number"
          value={config.refreshInterval || 5000}
          onChange={(e) => onChange({ ...config, refreshInterval: +e.target.value })}
        />
      </label>
      <label>
        Theme:
        <select
          value={config.theme || 'auto'}
          onChange={(e) => onChange({ ...config, theme: e.target.value })}
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}
`

## Example: Custom Dashboard Layout

`json
{
  "layout": [
    { "widget": "builtin:file-browser", "x": 0, "y": 0, "w": 2, "h": 4 },
    { "widget": "my-extension:realtime-chart", "x": 2, "y": 0, "w": 4, "h": 2 },
    { "widget": "my-extension:status-panel", "x": 6, "y": 0, "w": 2, "h": 1 },
    { "widget": "builtin:sql-console", "x": 2, "y": 2, "w": 4, "h": 2 },
    { "widget": "builtin:leaderboard", "x": 6, "y": 1, "w": 2, "h": 3 }
  ]
}
`

## Extension Distribution

`ash
# Package extension
kazkade dashboard extension package ./my-extension --output my-extension.kdext

# Publish to extension registry
kazkade dashboard extension publish my-extension.kdext
`

## Security

Extensions run in an isolated iframe with controlled permissions:

`json
{
  "permissions": ["query:read"],
  "sandbox": {
    "allow_network": false,
    "allow_storage": false,
    "allowed_domains": ["https://api.example.com"]
  }
}
`

`ash
# Run extension in strict sandbox
kazkade dashboard extension install my-extension --sandbox strict
`

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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