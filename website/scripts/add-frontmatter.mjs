import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'docs');
const SOCIAL_IMAGE = '/img/anticloud-social.png';

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (entry.name.endsWith('.md')) files.push(p);
  }
  return files;
}

function slugToKeywords(slug) {
  const parts = slug.replace(/-/g, ' ').split('/');
  const title = parts[parts.length - 1];
  const dir = parts.slice(0, -1).join(' ');

  const domainMap = {
    kathon: 'cryptographic browser, vision LLM, ad blocking, CRDT, P2P sync, anti-enshittification',
    kamelot: 'cloud runtime, AI orchestration, serverless, container orchestration, multi-cloud',
    kasteran: 'systems programming, rune-based language, symbolic syntax, memory safety, cryptography',
    kazcade: 'vector file system, content-addressed storage, VFS, distributed filesystem',
    'api-oss': 'API gateway, open source, rate limiting, API management, microservices',
    inte11ect: 'AI gateway, model routing, LLM proxy, AI caching, prompt management',
    'aioss-format': 'cryptographic ledger, proof of usefulness, tamper evident, SHA3-256, Ed25519',
    anticode: 'AI IDE, code generation, developer tools, AI-assisted development',
    'sovereign-os': 'sovereign OS, privacy OS, cryptographic kernel, trusted boot',
    mfso: 'MFSO index, corpus search, sovereign search, encrypted search',
    libern: 'cryptographic library, Ed25519, SHA3, digital signatures, blockchain',
  };

  if (domainMap[title]) return domainMap[title];

  if (dir.includes('security')) {
    return `cryptography, security, ${title}, hash, encryption, verification, penetration testing, Anticloud`;
  }
  if (dir.includes('compliance')) {
    return `compliance, governance, ${title}, FedRAMP, SOC2, audit, risk management, Anticloud`;
  }
  if (dir.includes('analysis')) {
    return `analysis, planning, ${title}, cost estimation, architecture, ROI, TCO, Anticloud`;
  }
  if (dir.includes('utilities')) {
    return `developer utilities, productivity, ${title}, CLI tools, developer experience, Anticloud`;
  }
  return `${title}, Anticloud, sovereign technology, open source, cryptography`;
}

const files = walk(DOCS_DIR);
let changed = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');

  if (!content.startsWith('---')) continue;

  const fmEnd = content.indexOf('---', 3);
  if (fmEnd === -1) continue;

  const frontmatter = content.slice(0, fmEnd + 3);
  const body = content.slice(fmEnd + 3);

  const relPath = relative(DOCS_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '');
  const keywords = slugToKeywords(relPath);

  const hasKeywords = frontmatter.includes('\nkeywords:');
  const hasImage = frontmatter.includes('\nimage:');

  let newFm = frontmatter;

  if (!hasKeywords) {
    const descMatch = newFm.match(/\n(description:.+)/);
    if (descMatch) {
      newFm = newFm.replace(descMatch[1], descMatch[1] + `\nkeywords: [${keywords}]`);
    } else {
      const labelMatch = newFm.match(/\n(sidebar_label:.+)/);
      if (labelMatch) {
        const t = relPath.split('/').pop() || 'doc';
        newFm = newFm.replace(labelMatch[1], labelMatch[1] + `\ndescription: ${t}\nkeywords: [${keywords}]`);
      }
    }
  }

  if (!hasImage) {
    const keywordsLineMatch = newFm.match(/\n(keywords:.+)/);
    if (keywordsLineMatch) {
      newFm = newFm.replace(keywordsLineMatch[1], keywordsLineMatch[1] + `\nimage: ${SOCIAL_IMAGE}`);
    } else {
      const descMatch = newFm.match(/\n(description:.+)/);
      if (descMatch) {
        newFm = newFm.replace(descMatch[1], descMatch[1] + `\nimage: ${SOCIAL_IMAGE}`);
      }
    }
  }

  const newContent = newFm + body;
  if (newContent !== content) {
    writeFileSync(file, newContent, 'utf-8');
    changed++;
    console.log(`Updated: ${relPath}`);
  }
}

console.log(`\nDone. ${changed} files updated.`);
