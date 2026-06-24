import {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function NotFound(): ReactNode {
  return (
    <Layout
      title="Page Not Found"
      description="The page you are looking for does not exist in the Anticloud ecosystem."
    >
      <main className="container" style={{padding: '4rem 0', textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 800, marginBottom: '1rem'}}>404</h1>
        <h2 style={{fontWeight: 600, marginBottom: '1rem'}}>Page Not Found</h2>
        <p style={{color: 'var(--apple-text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem'}}>
          The page you're looking for doesn't exist in the Anticloud ecosystem.
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link className="button button--primary" to="/">Return Home</Link>
          <Link className="button button--secondary" to="/docs/intro">Browse Docs</Link>
        </div>
      </main>
    </Layout>
  );
}
