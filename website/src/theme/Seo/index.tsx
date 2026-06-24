import {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';

export default function Seo(): ReactNode {
  const location = useLocation();
  const url = `https://kleinnner.github.io/Anticloud${location.pathname}`;

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
        urlTemplate:
          'https://kleinnner.github.io/Anticloud/docs/?q={search_term_string}',
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

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Anticloud Ecosystem Documentation',
    description:
      'Comprehensive documentation for 50+ privacy-first, cryptographically-verified, AI-native open-source projects.',
    url: url,
    author: {
      '@type': 'Person',
      name: 'Lois-Kleinner',
      url: 'https://linkedin.com/in/kleinner',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Anticloud',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kleinnner.github.io/Anticloud/img/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(webSiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(techArticleSchema)}
      </script>
    </Head>
  );
}
