#!/usr/bin/env node
import fs from 'node:fs';

const sourceFile = process.argv[2];
const category = process.argv[3] || 'newsletter';
const statsFile = process.argv[4] || sourceFile?.replace('newsletters.json', 'newsletter-source-stats.json');

if (!sourceFile || !fs.existsSync(sourceFile)) {
  process.stdout.write('');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const all = [...(data.core || []), ...(data.extended || [])];
const byName = new Map(all.map(v => [v.name, v]));

let stats = {};
if (statsFile && fs.existsSync(statsFile)) {
  try { stats = JSON.parse(fs.readFileSync(statsFile, 'utf8')); } catch { stats = {}; }
}

function normalizeUrl(url = '') {
  return url.replace(/\/$/, '');
}

function stripTags(s = '') {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(html, re) {
  const m = html.match(re);
  return m?.[1]?.trim() || '';
}

function scoreSource(src) {
  const key = normalizeUrl(src.url);
  const st = stats[key] || { ok: 0, fail: 0 };
  const total = st.ok + st.fail;
  if (total === 0) return 0;
  return (st.ok / total) * 100 - st.fail * 0.5;
}

const defaults = ((data.categoryDefaults || {})[category] || []).map(name => byName.get(name)).filter(Boolean);
const others = all
  .filter(v => (v.category || []).includes(category) && !defaults.find(d => d.name === v.name))
  .sort((a, b) => scoreSource(b) - scoreSource(a));

const candidates = [...defaults, ...others].slice(0, 12);

async function getSnippet(src) {
  const key = normalizeUrl(src.url);
  const now = new Date().toISOString();
  try {
    const res = await fetch(src.url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; pm-fieldnotes-bot/1.0)',
        'accept-language': 'en-US,en;q=0.9,ko;q=0.8'
      }
    });

    const html = await res.text();
    const titleRaw = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDesc = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i)
      || firstMatch(html, /<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["'][^>]*>/i)
      || firstMatch(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i)
      || firstMatch(html, /<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:description["'][^>]*>/i);

    const title = stripTags(titleRaw).slice(0, 100);
    const summary = stripTags(metaDesc).slice(0, 190);
    const blocked = /just a moment|attention required|cloudflare|captcha/i.test(`${title} ${summary}`);

    stats[key] = stats[key] || { ok: 0, fail: 0 };
    if (!title || blocked) {
      stats[key].fail += 1;
      stats[key].lastStatus = 'blocked';
      stats[key].lastTitle = title || '';
      stats[key].lastCheckedAt = now;
      return { ok: false };
    }

    stats[key].ok += 1;
    stats[key].lastStatus = 'ok';
    stats[key].lastTitle = title;
    stats[key].lastCheckedAt = now;
    return { ok: true, title, summary: summary || `${src.name} 사이트의 최신 소개 문구를 확인했습니다.` };
  } catch {
    stats[key] = stats[key] || { ok: 0, fail: 0 };
    stats[key].fail += 1;
    stats[key].lastStatus = 'error';
    stats[key].lastCheckedAt = now;
    return { ok: false };
  }
}

const lines = [];
for (const src of candidates) {
  if (lines.length >= 5) break;
  // eslint-disable-next-line no-await-in-loop
  const sn = await getSnippet(src);
  if (!sn.ok) continue;
  lines.push(`      <li><a href="${src.url}" target="_blank" rel="noopener noreferrer">${src.name}</a> — <strong>${sn.title}</strong><br/><span class="muted">${sn.summary}</span></li>`);
}

if (statsFile) {
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

if (!lines.length) {
  process.stdout.write('');
  process.exit(0);
}

process.stdout.write(`\n  <h2>실제 확인한 뉴스레터 소스 요약</h2>\n  <p class="muted">발행 시점 실시간 조회 성공률이 높은 소스부터 우선 선택했습니다.</p>\n  <ul>\n${lines.join('\n')}\n  </ul>`);
