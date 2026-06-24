import {ReactNode, useEffect, useState, useMemo} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const stats = [
  {value: '11', label: 'Platform Projects'},
  {value: '40', label: 'Developer Tools'},
  {value: '1,700+', label: 'Document Files'},
  {value: '1,597', label: 'Research Papers'},
  {value: '5', label: 'Cryptographic Standards'},
  {value: '4', label: 'AI Architectures'},
];

const projects = [
  {id: '01', title: 'Kathon', badge: 'Browser', status: 'beta', lang: ['TypeScript', 'Rust'], desc: 'Cryptographic browser with vision-LLM ad blocking (94.3% precision), CRDT P2P sync, spatial workspace, anti-enshittification engine, per-tab VPN.', docs: 21, link: 'https://github.com/kleinnner/Anticloud/tree/main/01-kathon'},
  {id: '02', title: 'Kamelot', badge: 'File System', status: 'beta', lang: ['Rust'], desc: 'Semantic vector file system replacing directory trees with 1536-dim dense embedding search (91% recall at rank 10 vs 28% filename), BLAKE3 hash-chain integrity.', docs: 99, link: 'https://github.com/kleinnner/Anticloud/tree/main/02-kamelot'},
  {id: '03', title: 'Kasteran', badge: 'Language', status: 'stable', lang: ['Kasteran', 'Rust'], desc: 'Systems language with rune-based symbolic syntax, linear capability types, self-hosted compiler with Cranelift JIT/WASM/C backends, formal verification pipeline.', docs: 166, link: 'https://github.com/kleinnner/Anticloud/tree/main/03-kasteran'},
  {id: '04', title: 'aioss-format', badge: 'Ledger', status: 'stable', lang: ['Rust', 'C'], desc: 'Dual-format cryptographic ledger with SHA3-256 hash chaining, Ed25519 state proofs, memory-mapped IO, SQLite event store, post-quantum migration support.', docs: 35, link: 'https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format'},
  {id: '05', title: 'sovereign-os', badge: 'OS', status: 'beta', lang: ['Shell', 'Python', 'C'], desc: 'Arch Linux-based sovereign OS with .aioss ledger daemon, custom toolchain, TPM attestation, measured boot, 20 GNOME shell extensions.', docs: 173, link: 'https://github.com/kleinnner/Anticloud/tree/main/05-sovereign-os'},
  {id: '06', title: 'api-oss', badge: 'AI Platform', status: 'stable', lang: ['TypeScript', 'Python'], desc: 'AI gateway with multi-agent deliberation councils, contradiction detection engine, 162 feature docs, WASM sandbox, 30 research papers.', docs: 446, link: 'https://github.com/kleinnner/Anticloud/tree/main/06-api-oss'},
  {id: '07', title: 'MF+SO', badge: 'Identity', status: 'beta', lang: ['TypeScript', 'Rust'], desc: 'Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed keys.', docs: 83, link: 'https://github.com/kleinnner/Anticloud/tree/main/07-mfso'},
  {id: '08', title: 'libern', badge: 'P2P Comms', status: 'alpha', lang: ['Rust', 'TypeScript'], desc: 'P2P communication engine with CRDT convergence, Ed25519-signed hash chains, local AI summarization, 3D sandbox world, enterprise AI auditability framework.', docs: 126, link: 'https://github.com/kleinnner/Anticloud/tree/main/08-libern'},
  {id: '09', title: 'kazcade', badge: 'Compute', status: 'alpha', lang: ['Rust', 'C'], desc: 'CPU-only columnar compute engine with SIMD-accelerated linear algebra, quantized neural inference, software rasterizer, zero-copy mmap/io_uring architecture.', docs: 158, link: 'https://github.com/kleinnner/Anticloud/tree/main/09-kazcade'},
  {id: '10', title: 'Anticode', badge: 'AI Coding', status: 'alpha', lang: ['TypeScript', 'Python'], desc: 'Terminal-native AI coding engine running fully local LLMs, agent system with MCP protocol, cryptographic audit trail for all AI actions.', docs: 65, link: 'https://github.com/kleinnner/Anticloud/tree/main/10-anticode'},
  {id: '11', title: 'inte11ect', badge: 'AI Platform', status: 'beta', lang: ['TypeScript', 'Rust'], desc: 'Modular AI platform with 72 modules, Eigenvector Routing, GOD-11 deterministic orchestrator, domain-specific AI personas, RAG pipeline, Tauri desktop app.', docs: 122, link: 'https://github.com/kleinnner/Anticloud/tree/main/11-inte11ect'},
];

const profiles = [
  {label: 'Main Site', href: 'https://0-1.gg', icon: 'globe'},
  {label: 'LinkedIn', href: 'https://linkedin.com/in/kleinner', icon: 'linkedin'},
  {label: 'DEV', href: 'https://dev.to/kleinner', icon: 'dev'},
  {label: 'Hugging Face', href: 'https://huggingface.co/Anticloud', icon: 'hf'},
  {label: 'Blog', href: 'https://anticlouds.wordpress.com', icon: 'wordpress'},
  {label: 'Zenodo', href: 'https://zenodo.org/search?q=anticloud', icon: 'zenodo'},
  {label: 'Harvard Dataverse', href: 'https://dataverse.harvard.edu/dataverse/anticloud', icon: 'dataverse'},
  {label: 'Wiki', href: 'https://github.com/kleinnner/Anticloud/wiki', icon: 'wiki'},
];

const allCategories = [...new Set(projects.map((p) => p.badge))];
const allStatuses = [...new Set(projects.map((p) => p.status))] as const;

const techStack = [
  'Rust', 'TypeScript', 'Python', 'React', 'Tauri',
  'WebAssembly', 'CRDT', 'SIMD (AVX-512)', 'WGPU',
  'SHA3-256', 'Ed25519', 'BLAKE3', 'ML-DSA', 'FALCON',
  'Qwen2.5-VL', 'Whisper.cpp', 'NLLB-200', 'llama.cpp',
  'systemd', 'Docker', 'Cranelift JIT', 'TPM 2.0',
];

const toolCategories = [
  {
    name: 'Security & Cryptography',
    count: 9,
    tools: ['Attack Surface Analyzer', 'Credential Vault', 'Encrypt Text', 'Hash Checker', 'JWT Inspector', 'Ledger Verifier', 'Secure Random', 'Threat Modeler', 'TOTP Generator'],
    link: 'https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools#security--cryptography',
  },
  {
    name: 'Compliance & Governance',
    count: 9,
    tools: ['Capability Matrix', 'Cert Badges', 'Compliance Checklist', 'Compliance Gap Analyzer', 'Compliance Generator', 'Data Residency Map', 'SSP Generator', 'Supply Chain SBOM', 'Vendor Risk Score'],
    link: 'https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools#compliance--governance',
  },
  {
    name: 'Analysis & Planning',
    count: 8,
    tools: ['Architecture Canvas', 'Contract Clause Analyzer', 'Deploy Simulator', 'Deployment Cost Estimator', 'Integration Checker', 'RFP Response', 'ROI Calculator', 'TCO Calculator'],
    link: 'https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools#analysis--planning',
  },
  {
    name: 'Developer Utilities',
    count: 14,
    tools: ['Data Local Score', 'Diff Viewer', 'Focus Timer', 'Habit Tracker', 'JSON Explorer', 'Link Cleaner', 'Local Notes', 'Model Benchmark', 'Passphrase Generator', 'Port Protocol Mapper', 'Privacy Scanner', 'Readiness Quiz', 'Regex Playground', 'SQL Formatter'],
    link: 'https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools#developer-utilities',
  },
];

function Home(): ReactNode {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    let result = [...projects];
    if (categoryFilter !== 'All') result = result.filter((p) => p.badge === categoryFilter);
    if (statusFilter !== 'All') result = result.filter((p) => p.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    if (activeTech) {
      result = result.filter((p) => p.lang?.some((l) => l.toLowerCase() === activeTech.toLowerCase()));
    }
    if (sortBy === 'alpha') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'docs') result.sort((a, b) => b.docs - a.docs);
    else result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  }, [categoryFilter, statusFilter, searchQuery, sortBy, activeTech]);

  return (
    <Layout
      title="Anticloud — Sovereign Technology Research"
      description="Open-source ecosystem documentation for AI-research, privacy tools, and decentralized social publishing. 50+ projects."
    >
      <header className="hero">
        <div className="container text--center">
          <h1 className="hero__title">Anticloud</h1>
          <p className="hero__subtitle">
            Sovereign Technology Research — A Unified Ecosystem of 50+ Privacy-First,
            Cryptographically-Verified, AI-Native Projects
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Explore the Ecosystem →
            </Link>
            <Link className="button button--secondary button--lg" to="https://github.com/kleinnner/Anticloud">
              GitHub Repository
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <nav className="section-nav">
          <a href="#stats">Stats</a>
          <a href="#projects">Projects</a>
          <a href="#tools">Tools</a>
          <a href="#tech">Tech Stack</a>
          <a href="#connect">Connect</a>
        </nav>

        <div id="stats" className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
            </div>
          ))}
        </div>

        <section id="projects">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem'}}>
            <div>
              <h2 className="section-title" style={{marginBottom: 0}}>Platform Projects</h2>
              <p className="section-subtitle">Cryptographic browser, vector file system, programming language, and more.</p>
            </div>
            <input className="inline-search" type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="filter-bar">
            <button className={`filter-btn${categoryFilter === 'All' ? ' active' : ''}`} onClick={() => setCategoryFilter('All')}>All</button>
            {allCategories.map((cat) => (
              <button key={cat} className={`filter-btn${categoryFilter === cat ? ' active' : ''}`} onClick={() => setCategoryFilter(cat)}>{cat}</button>
            ))}
          </div>

          <div className="filter-bar">
            <button className={`filter-btn${statusFilter === 'All' ? ' active' : ''}`} onClick={() => setStatusFilter('All')}>Any Status</button>
            {allStatuses.map((s) => (
              <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>

          <div className="sort-control">
            <span>Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="id">By ID</option>
              <option value="alpha">A-Z</option>
              <option value="docs">By Docs</option>
            </select>
            {filteredProjects.length < projects.length && (
              <span style={{marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--apple-gray-400)'}}>{filteredProjects.length} of {projects.length}</span>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects match your filter criteria.</p>
              <button className="button button--secondary" onClick={() => { setCategoryFilter('All'); setStatusFilter('All'); setSearchQuery(''); setActiveTech(null); }}>Reset Filters</button>
            </div>
          ) : (
            <div className="project-grid">
              {filteredProjects.map((project) => (
                <Link key={project.id} className="project-card" href={project.link}>
                  <div className="project-card__title">
                    <span style={{opacity: 0.4, fontSize: '0.8rem'}}>{project.id}</span>
                    {project.title}
                    <span className={`badge badge--${(project.badge || '').toLowerCase().replace(/\s+/g, '')}`}>{project.badge}</span>
                    {project.status && <span className={`badge badge--${project.status}`}>{project.status}</span>}
                  </div>
                  <div className="project-card__description">{project.desc}</div>
                  <div className="project-card__meta">
                    <span>{project.docs} documents</span>
                  </div>
                  {project.lang && (
                    <div className="project-card__badges">
                      {project.lang.map((l) => (
                        <span key={l} className="lang-tag">{l}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="tools">
          <h2 className="section-title">40 Developer Tools</h2>
          <p className="section-subtitle">Organized into four domains: security, compliance, analysis, and utilities.</p>
          {toolCategories.map((cat) => (
            <details key={cat.name} className="accordion-category">
              <summary>{cat.name} <span className="badge">{cat.count} tools</span></summary>
              <div className="accordion-tools">
                {cat.tools.map((tool) => (
                  <a key={tool} href={cat.link}>{tool}</a>
                ))}
              </div>
            </details>
          ))}
        </section>

        <section id="tech">
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">Languages, runtimes, cryptographic primitives, and AI architectures powering the ecosystem.</p>
          <div className="tech-grid">
            {techStack.map((tech) => (
              <div key={tech} className={`tech-tag${activeTech === tech ? ' active' : ''}`} onClick={() => { setActiveTech(activeTech === tech ? null : tech); setCategoryFilter('All'); setStatusFilter('All'); }}>
                {tech}
              </div>
            ))}
          </div>
        </section>

        <section id="connect">
          <h2 className="section-title">Connect</h2>
          <p className="section-subtitle">Find the Anticloud ecosystem across the web.</p>
          <div className="connect-grid">
            {profiles.map((p) => (
              <a key={p.label} href={p.href} className="connect-link" target="_blank" rel="noopener noreferrer">
                <span className={`connect-icon connect-icon--${p.icon}`} />
                <span className="connect-label">{p.label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2>Get Started</h2>
          <p>Browse the documentation, explore the research papers, or dive into a specific project.</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link className="button button--primary" to="/docs/intro">Read the Docs</Link>
            <Link className="button button--secondary" to="https://github.com/kleinnner/Anticloud/blob/main/ROADMAP.md">View Roadmap</Link>
            <Link className="button button--secondary" to="https://github.com/kleinnner/Anticloud/blob/main/CONTRIBUTING.md">Contributing</Link>
            <Link className="button button--secondary" to="https://github.com/kleinnner/Anticloud/wiki">Explore Wiki</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
