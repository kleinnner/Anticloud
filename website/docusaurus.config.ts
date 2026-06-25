import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Anticloud',
  tagline: 'Sovereign Technology Research — A Unified Ecosystem of 50+ Privacy-First, Cryptographically-Verified, AI-Native Projects',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
    faster: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  url: 'https://0-1.gg',
  baseUrl: '/',

  organizationName: 'kleinnner',
  projectName: 'Anticloud',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR'],
    localeConfigs: {
      en: { label: 'English' },
      'pt-BR': { label: 'Português (Brasil)' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/kleinnner/tree/main/',
        },
        blog: {
          routeBasePath: '/blog',
          showReadingTime: true,
          feedOptions: {
            type: 'all',
            title: 'Anticloud Blog',
            description: 'Sovereign Technology Research — Privacy-first, cryptographically-verified, AI-native projects',
          },
          blogTitle: 'Anticloud Blog',
          blogDescription: 'Deep dives into cryptographic browsers, vector file systems, AI gateways, and sovereign technology.',
        },
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
            href: '/manifest.json',
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
            color: '#0071e3',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/icon.svg',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#0071e3',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#0071e3',
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
        media: 'print',
        onload: "this.media='all'",
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
        'http-equiv': 'Content-Security-Policy',
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'",
      },
    },
    {
      tagName: 'link',
      attributes: { rel: 'alternate', type: 'application/rss+xml', title: 'Anticloud Blog RSS', href: '/blog/rss.xml' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'alternate', type: 'application/atom+xml', title: 'Anticloud Blog Atom', href: '/blog/atom.xml' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'alternate', type: 'application/feed+json', title: 'Anticloud Blog JSON', href: '/blog/feed.json' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'We9US_CeKk8QncGpXpVIjA4lNWRue3Ns_M2N65cUSyc',
      },
    },
  ],

  stylesheets: [],

  scripts: [
    {
      src: '/loading.js',
      strategy: 'beforeInteractive',
    },
  ],

  themeConfig: {
    image: 'img/anticloud-social.svg',
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
          to: 'https://github.com/kleinnner/wiki',
          label: 'Wiki',
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
              href: 'https://github.com/kleinnner/blob/main/COMPLIANCE-MATRIX.md',
            },
            {
              label: 'Adoption Model',
              href: 'https://github.com/kleinnner/blob/main/ADOPTION.md',
            },
            {
              label: 'Glossary',
              href: 'https://github.com/kleinnner/blob/main/GLOSSARY.md',
            },
            {
              label: 'Architecture',
              href: 'https://github.com/kleinnner/blob/main/ARCHITECTURE.md',
            },
          ],
        },
        {
          title: 'Wiki',
          items: [
            {
              label: 'Home',
              href: 'https://github.com/kleinnner/wiki',
            },
            {
              label: 'Architecture',
              href: 'https://github.com/kleinnner/wiki/Architecture',
            },
            {
              label: 'Projects',
              href: 'https://github.com/kleinnner/wiki/Projects',
            },
            {
              label: 'Ecosystem',
              href: 'https://github.com/kleinnner/wiki/Ecosystem',
            },
            {
              label: 'Roadmap',
              href: 'https://github.com/kleinnner/wiki/Roadmap',
            },
            {
              label: 'FAQ',
              href: 'https://github.com/kleinnner/wiki/FAQ',
            },
            {
              label: 'Glossary',
              href: 'https://github.com/kleinnner/wiki/Glossary',
            },
            {
              label: 'Security',
              href: 'https://github.com/kleinnner/wiki/Security',
            },
            {
              label: 'Performance',
              href: 'https://github.com/kleinnner/wiki/Performance',
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
              href: 'https://github.com/kleinnner/blob/main/ARCHITECTURE.md',
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
              href: 'https://github.com/kleinnner/blob/main/CHANGELOG.md',
            },
            {
              label: 'Roadmap',
              href: 'https://github.com/kleinnner/blob/main/ROADMAP.md',
            },
            {
              label: 'Security',
              href: 'https://github.com/kleinnner/blob/main/SECURITY.md',
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
