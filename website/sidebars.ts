import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  ecosystemSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Platform Projects',
      link: {type: 'doc', id: 'projects'},
      items: [
        'projects/kathon',
        'projects/kamelot',
        'projects/kasteran',
        'projects/aioss-format',
        'projects/sovereign-os',
        'projects/api-oss',
        'projects/mfso',
        'projects/libern',
        'projects/kazcade',
        'projects/anticode',
        'projects/inte11ect',
      ],
    },
    {
      type: 'category',
      label: 'Developer Tools (40)',
      link: {type: 'doc', id: 'tools'},
      items: [
        {
          type: 'category',
          label: 'Security & Cryptography',
          items: [
            'tools/security/attack-surface',
            'tools/security/credential-vault',
            'tools/security/encrypt-text',
            'tools/security/hash-checker',
            'tools/security/jwt-inspector',
            'tools/security/ledger-verifier',
            'tools/security/secure-random',
            'tools/security/threat-model',
            'tools/security/totp-generator',
          ],
        },
        {
          type: 'category',
          label: 'Compliance & Governance',
          items: [
            'tools/compliance/capability-matrix',
            'tools/compliance/cert-badges',
            'tools/compliance/compliance-checklist',
            'tools/compliance/compliance-gap-analyzer',
            'tools/compliance/compliance-generator',
            'tools/compliance/data-residency-map',
            'tools/compliance/ssp-generator',
            'tools/compliance/supply-chain-sbom',
            'tools/compliance/vendor-risk-score',
          ],
        },
        {
          type: 'category',
          label: 'Analysis & Planning',
          items: [
            'tools/analysis/architecture-canvas',
            'tools/analysis/contract-clause-analyzer',
            'tools/analysis/deploy-simulator',
            'tools/analysis/deployment-cost-estimator',
            'tools/analysis/integration-checker',
            'tools/analysis/rfp-response',
            'tools/analysis/roi-calculator',
            'tools/analysis/tco-calculator',
          ],
        },
        {
          type: 'category',
          label: 'Developer Utilities',
          items: [
            'tools/utilities/data-local-score',
            'tools/utilities/diff-viewer',
            'tools/utilities/focus-timer',
            'tools/utilities/habit-tracker',
            'tools/utilities/json-explorer',
            'tools/utilities/link-cleaner',
            'tools/utilities/local-notes',
            'tools/utilities/model-benchmark',
            'tools/utilities/passphrase-generator',
            'tools/utilities/port-protocol-mapper',
            'tools/utilities/privacy-scanner',
            'tools/utilities/readiness-quiz',
            'tools/utilities/regex-playground',
            'tools/utilities/sql-formatter',
          ],
        },
      ],
    },
    'links',
  ],
};

export default sidebars;
