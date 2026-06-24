import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Anticloud',
  tagline: 'Sovereign Technology Research — 50+ Privacy-First, Cryptographically-Verified, AI-Native Projects',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://kleinnner.github.io',
  baseUrl: '/Anticloud/',

  organizationName: 'kleinnner',
  projectName: 'Anticloud',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/kleinnner/Anticloud/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/anticloud-social.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Anticloud',
      logo: {
        alt: 'Anticloud',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'ecosystemSidebar',
          position: 'left',
          label: 'Ecosystem',
        },
        {
          to: '/docs/projects',
          label: 'Projects',
          position: 'left',
        },
        {
          to: '/docs/tools',
          label: 'Developer Tools',
          position: 'left',
        },
        {
          href: 'https://github.com/kleinnner/Anticloud',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'Platform Projects',
              to: '/docs/projects',
            },
            {
              label: 'Developer Tools',
              to: '/docs/tools',
            },
            {
              label: 'Published Links',
              to: '/docs/links',
            },
          ],
        },
        {
          title: 'Enterprise',
          items: [
            {
              label: 'Architecture',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/ARCHITECTURE.md',
            },
            {
              label: 'Compliance Matrix',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/COMPLIANCE-MATRIX.md',
            },
            {
              label: 'Adoption Model',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/ADOPTION.md',
            },
            {
              label: 'Glossary',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/GLOSSARY.md',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/kleinnner/Anticloud',
            },
            {
              label: 'Issues',
              href: 'https://github.com/kleinnner/Anticloud/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/kleinnner/Anticloud/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Changelog',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/CHANGELOG.md',
            },
            {
              label: 'Roadmap',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/ROADMAP.md',
            },
            {
              label: 'Security',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/SECURITY.md',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lois-Kleinner & 0-1.gg. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
