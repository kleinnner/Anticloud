import {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useGlobalData from '@docusaurus/useGlobalData';

export default function Seo(): ReactNode {
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const globalData = useGlobalData();
  const baseUrl = siteConfig.baseUrl || '/';
  const currentPath = location.pathname;
  const url = `https://kleinnner.github.io${baseUrl.replace(/\/$/, '')}${currentPath}`;

  const isDoc = currentPath.startsWith(`${baseUrl}docs/`);
  const isTool = currentPath.includes('/tools/');
  const isProject = currentPath.includes('/projects/');
  const isBlog = currentPath.startsWith(`${baseUrl}blog/`);

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Anticloud',
    url: 'https://kleinnner.github.io/Anticloud/',
    description:
      'Sovereign Technology Research — A Unified Ecosystem of 50+ Privacy-First, Cryptographically-Verified, AI-Native Projects',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://kleinnner.github.io/Anticloud/docs/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Anticloud',
    url: 'https://kleinnner.github.io/Anticloud/',
    logo: 'https://kleinnner.github.io/Anticloud/img/icon.svg',
    description:
      'Sovereign Technology Research — 50+ Privacy-First, Cryptographically-Verified, AI-Native Projects',
    sameAs: [
      'https://github.com/kleinnner/Anticloud',
      'https://linkedin.com/in/kleinner',
      'https://dev.to/kleinner',
      'https://huggingface.co/Anticloud',
      'https://anticlouds.wordpress.com',
      'https://0-1.gg',
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Anticloud', item: 'https://kleinnner.github.io/Anticloud/'},
    ],
  };

  const parts = currentPath.replace(baseUrl, '').split('/').filter(Boolean);
  if (parts.length > 0) {
    parts.forEach((part, i) => {
      const name = part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const path = '/' + parts.slice(0, i + 1).join('/');
      breadcrumbSchema.itemListElement.push({
        '@type': 'ListItem',
        position: i + 2,
        name,
        item: `https://kleinnner.github.io${baseUrl}${path}`,
      });
    });
  }

  const pageSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: siteConfig.title,
    description: siteConfig.tagline,
    url,
  };

  if (isTool) {
    const toolName = parts[parts.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Developer Tool';
    pageSchema['@type'] = 'WebApplication';
    pageSchema.name = toolName;
    pageSchema.applicationCategory = 'DeveloperApplication';
    pageSchema.operatingSystem = 'Cross-platform (Web, CLI)';
    pageSchema.description = `${toolName} — part of the Anticloud ecosystem of privacy-first, cryptographically-verified developer tools.`;
  } else if (isProject) {
    const projectName = parts[parts.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Project';
    pageSchema['@type'] = 'SoftwareSourceCode';
    pageSchema.name = projectName;
    pageSchema.description = `${projectName} — an open-source project in the Anticloud ecosystem.`;
    pageSchema.codeRepository = `https://github.com/kleinnner/Anticloud/tree/main/0${parts[parts.length - 1] === 'kathon' ? '1' : parts[parts.length - 1] === 'kamelot' ? '2' : '0'}-${parts[parts.length - 1] || ''}`;
  } else if (isBlog) {
    const blogTitle = parts[parts.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Blog Post';
    pageSchema['@type'] = 'Article';
    pageSchema.headline = blogTitle;
    pageSchema.author = {
      '@type': 'Person',
      name: 'Lois-Kleinner',
      url: 'https://github.com/kleinnner',
    };
    pageSchema.datePublished = '2026-06-24';
    pageSchema.image = 'https://kleinnner.github.io/Anticloud/img/anticloud-social.png';
  }

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Head>
  );
}
