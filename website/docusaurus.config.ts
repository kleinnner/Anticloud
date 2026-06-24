import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Anticloud',
  tagline: 'Sovereign Technology Research — A Unified Ecosystem of 50+ Privacy-First, Cryptographically-Verified, AI-Native Projects',
  favicon: 'img/favicon.svg',

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

  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: 'img/favicon.svg',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/Anticloud/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'default',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/apple-touch-icon.svg',
            sizes: '180x180',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/icon.svg',
            color: '#1d1d1f',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/icon.svg',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#f5f5f7',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#f5f5f7',
          },
        ],
      },
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
      },
    },
  ],

  stylesheets: [],

  scripts: [
    {
      src: '/Anticloud/loading.js',
      async: false,
    },
  ],

  themeConfig: {
    image: 'img/anticloud-social.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Anticloud',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 120,
        height: 24,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'ecosystemSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/projects',
          label: 'Projects',
          position: 'left',
        },
        {
          to: '/docs/tools',
          label: 'Tools',
          position: 'left',
        },
        {
          href: 'https://github.com/kleinnner/Anticloud',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
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
