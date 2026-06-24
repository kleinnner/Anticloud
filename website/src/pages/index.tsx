import {ReactNode} from 'react';
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
  {id: '01', title: 'Kathon', badge: 'Browser', desc: 'Cryptographic browser with vision-LLM ad blocking (94.3% precision), CRDT P2P sync, spatial workspace, anti-enshittification engine, per-tab VPN.', docs: 21, link: 'https://github.com/kleinnner/Anticloud/tree/main/01-kathon'},
  {id: '02', title: 'Kamelot', badge: 'File System', desc: 'Semantic vector file system replacing directory trees with 1536-dim dense embedding search (91% recall at rank 10 vs 28% filename), BLAKE3 hash-chain integrity.', docs: 99, link: 'https://github.com/kleinnner/Anticloud/tree/main/02-kamelot'},
  {id: '03', title: 'Kasteran', badge: 'Language', desc: 'Systems language with rune-based symbolic syntax, linear capability types, self-hosted compiler with Cranelift JIT/WASM/C backends, formal verification pipeline.', docs: 166, link: 'https://github.com/kleinnner/Anticloud/tree/main/03-kasteran'},
  {id: '04', title: 'aioss-format', badge: 'Ledger', desc: 'Dual-format cryptographic ledger with SHA3-256 hash chaining, Ed25519 state proofs, memory-mapped IO, SQLite event store, post-quantum migration support.', docs: 35, link: 'https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format'},
  {id: '05', title: 'sovereign-os', badge: 'OS', desc: 'Arch Linux-based sovereign OS with .aioss ledger daemon, custom toolchain, TPM attestation, measured boot, 20 GNOME shell extensions.', docs: 173, link: 'https://github.com/kleinnner/Anticloud/tree/main/05-sovereign-os'},
  {id: '06', title: 'api-oss', badge: 'AI Platform', desc: 'AI gateway with multi-agent deliberation councils, contradiction detection engine, 162 feature docs, WASM sandbox, 30 research papers.', docs: 446, link: 'https://github.com/kleinnner/Anticloud/tree/main/06-api-oss'},
  {id: '07', title: 'MF+SO', badge: 'Identity', desc: 'Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed keys.', docs: 83, link: 'https://github.com/kleinnner/Anticloud/tree/main/07-mfso'},
  {id: '08', title: 'libern', badge: 'P2P Comms', desc: 'P2P communication engine with CRDT convergence, Ed25519-signed hash chains, local AI summarization, 3D sandbox world, enterprise AI auditability framework.', docs: 126, link: 'https://github.com/kleinnner/Anticloud/tree/main/08-libern'},
  {id: '09', title: 'kazcade', badge: 'Compute', desc: 'CPU-only columnar compute engine with SIMD-accelerated linear algebra, quantized neural inference, software rasterizer, zero-copy mmap/io_uring architecture.', docs: 158, link: 'https://github.com/kleinnner/Anticloud/tree/main/09-kazcade'},
  {id: '10', title: 'Anticode', badge: 'AI Coding', desc: 'Terminal-native AI coding engine running fully local LLMs, agent system with MCP protocol, cryptographic audit trail for all AI actions.', docs: 65, link: 'https://github.com/kleinnner/Anticloud/tree/main/10-anticode'},
  {id: '11', title: 'inte11ect', badge: 'AI Platform', desc: 'Modular AI platform with 72 modules, Eigenvector Routing, GOD-11 deterministic orchestrator, domain-specific AI personas, RAG pipeline, Tauri desktop app.', docs: 122, link: 'https://github.com/kleinnner/Anticloud/tree/main/11-inte11ect'},
];

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
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
            </div>
          ))}
        </div>

        <section>
          <h2 className="section-title">Platform Projects</h2>
          <p className="section-subtitle">Cryptographic browser, vector file system, programming language, sovereign OS, AI platforms, identity, communications, and compute engine.</p>
          <div className="project-grid">
            {projects.map((project) => (
              <Link key={project.id} className="project-card" href={project.link}>
                <div className="project-card__title">
                  <span style={{opacity: 0.4, fontSize: '0.8rem'}}>{project.id}</span>
                  {project.title}
                  <span className="badge">{project.badge}</span>
                </div>
                <div className="project-card__description">{project.desc}</div>
                <div className="project-card__meta">
                  <span>{project.docs} documents</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">40 Developer Tools</h2>
          <p className="section-subtitle">Organized into four domains: security & cryptography, compliance & governance, analysis & planning, and developer utilities.</p>
          <div className="project-grid">
            {toolCategories.map((cat) => (
              <Link key={cat.name} className="project-card" href={cat.link}>
                <div className="project-card__title">
                  {cat.name}
                  <span className="badge">{cat.count} tools</span>
                </div>
                <div className="project-card__description">
                  {cat.tools.join(', ')}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">Languages, runtimes, cryptographic primitives, and AI architectures powering the ecosystem.</p>
          <div className="tech-grid">
            {techStack.map((tech) => (
              <div key={tech} className="tech-tag">{tech}</div>
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
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
