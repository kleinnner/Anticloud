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

  themes: ['@docusaurus/theme-mermaid'],

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
        sitemap: {},
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
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Anticloud',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:width',
        content: '1200',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:height',
        content: '630',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:alt',
        content: 'Anticloud — Sovereign Technology Research — 50+ Privacy-First, Cryptographically-Verified, AI-Native Projects',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: '@kleinner',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:creator',
        content: '@kleinner',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'referrer',
        content: 'no-referrer-when-downgrade',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'fKZzY1kZm2nJ0Z5bR0H5tL0X5c5v5b5R0H5tL0X5c5v5b5R0',
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
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
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
        {
          href: 'https://linkedin.com/in/kleinner',
          position: 'right',
          className: 'header-linkedin-link',
          'aria-label': 'LinkedIn profile',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
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
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Enterprise',
          items: [
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
            {
              label: 'Architecture',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/ARCHITECTURE.md',
            },
          ],
        },
        {
          title: 'Profiles',
          items: [
            {
              label: 'Main Site',
              href: 'https://0-1.gg',
            },
            {
              label: 'LinkedIn',
              href: 'https://linkedin.com/in/kleinner',
            },
            {
              label: 'DEV',
              href: 'https://dev.to/kleinner',
            },
            {
              label: 'Hugging Face',
              href: 'https://huggingface.co/Anticloud',
            },
            {
              label: 'WordPress Blog',
              href: 'https://anticlouds.wordpress.com',
            },
          ],
        },
        {
          title: 'Research',
          items: [
            {
              label: 'Zenodo',
              href: 'https://zenodo.org/search?q=anticloud',
            },
            {
              label: 'Harvard Dataverse',
              href: 'https://dataverse.harvard.edu/dataverse/anticloud',
            },
            {
              label: 'Architecture',
              href: 'https://github.com/kleinnner/Anticloud/blob/main/ARCHITECTURE.md',
            },
            {
              label: 'Published Links',
              to: '/docs/links',
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
