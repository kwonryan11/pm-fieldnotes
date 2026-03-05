#!/usr/bin/env node
import fs from 'node:fs';

const sourceFile = process.argv[2];
const category = process.argv[3] || 'newsletter';
const outJson = process.argv[4] || 'data/newsletter-crawl-latest.json';

if (!sourceFile || !fs.existsSync(sourceFile)) {
  process.stdout.write('');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const all = [...(data.core || []), ...(data.extended || [])];
const byName = new Map(all.map(v => [v.name, v]));
const picks = ((data.categoryDefaults || {})[category] || []).map(n => byName.get(n)).filter(Boolean);

const BAD_PATTERNS = [
  /sponsor|sponsored|advertise|promotion/gi,
  /subscribe|sign in|sign up|start publishing/gi,
  /just a moment|attention required|cloudflare|captcha/gi,
  /privacy|terms|cookie|all rights reserved/gi,
  /open main menu|newsletter(s)?\b/gi
];

function decodeHtml(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(s = '') {
  return decodeHtml(s)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanText(text = '') {
  let out = stripTags(text)
    .replace(/Article URL:[^\n]+/gi, ' ')
    .replace(/Comments URL:[^\n]+/gi, ' ')
    .replace(/Points:\s*\d+/gi, ' ')
    .replace(/#\s*Comments:\s*\d+/gi, ' ')
    .replace(/Hey I.?m [^.?!]+[.?!]/gi, ' ')
    .replace(/Share\b/gi, ' ');
  for (const p of BAD_PATTERNS) out = out.replace(p, ' ');
  return out.replace(/\s+/g, ' ').trim();
}

function splitSentences(text = '') {
  return text.split(/(?<=[.!?。！？])\s+/).map(s => s.trim()).filter(Boolean);
}

function isLowValueSentence(s = '') {
  if (!s || s.length < 45) return true;
  if (/building something that needs|special offer|free searches|claim \d+ months|sponsor/i.test(s)) return true;
  return BAD_PATTERNS.some(p => p.test(s));
}

function qualityScore(summary = '', action = '', raw = '') {
  let score = 100;
  if (summary.length < 80) score -= 30;
  if (action.length < 20) score -= 20;
  if (BAD_PATTERNS.some(p => p.test(`${summary} ${raw}`))) score -= 35;
  if (!/[가-힣]/.test(summary)) score -= 15;
  return Math.max(0, Math.min(100, score));
}

function classifyTrack(text = '') {
  if (/ai|model|llm|agent|anthropic|openai|claude|gpt|gemini|gpu|semiconductor|automation/i.test(text)) return '업무자동화';
  if (/market|stock|revenue|funding|ipo|vc|invest|price|earnings|guidance|valuation|금리|환율|실적|가이던스/i.test(text)) return '투자판단';
  return '콘텐츠소재';
}

function buildAction(track) {
  if (track === '업무자동화') return '실행 포인트: 자동화 파이프라인에서 1개 병목(수집/정제/요약/발행)을 지정해 이번 주 개선 실험을 진행한다.';
  if (track === '투자판단') return '실행 포인트: 관련 자산 1개를 골라 실적·가이던스·밸류에이션 가설을 다시 적고 매매 기준을 업데이트한다.';
  return '실행 포인트: 블로그에 배경-변화-영향 3문장 구조로 짧은 분석 글을 발행한다.';
}

function pickMainHtml(html = '') {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0];
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0];
  return article || main || html;
}

function parseRss(xml) {
  const items = [];
  const rssItems = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const raw of rssItems) {
    const title = (raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const link = (raw.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '').trim();
    const pubDate = (raw.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || '').trim();
    const desc = (raw.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || '').trim();
    if (title && link) items.push({ title: cleanText(title), link: decodeHtml(link), pubDate, description: cleanText(desc) });
  }

  const atomItems = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const raw of atomItems) {
    const title = (raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const link = (raw.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || '').trim();
    const pubDate = (raw.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] || raw.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] || '').trim();
    const desc = (raw.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || raw.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] || '').trim();
    if (title && link) items.push({ title: cleanText(title), link: decodeHtml(link), pubDate, description: cleanText(desc) });
  }

  return items;
}

function extractLinksFromHome(html = '', baseUrl = '') {
  const links = [];
  const re = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const text = cleanText(m[2]);
    if (!href || !text) continue;
    if (/^mailto:|^javascript:/i.test(href)) continue;
    try {
      const url = new URL(href, baseUrl).toString();
      if (/\/tag\/|\/category\/|\/about|\/contact|\/privacy|\/terms/i.test(url)) continue;
      links.push({ title: text.slice(0, 140), link: url, pubDate: '', description: '' });
    } catch {}
  }
  // de-dupe
  const seen = new Set();
  return links.filter(x => {
    if (seen.has(x.link)) return false;
    seen.add(x.link);
    return true;
  }).slice(0, 20);
}

async function fetchText(url) {
  const r = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; pm-fieldnotes-bot/1.0)',
      'accept-language': 'en-US,en;q=0.9,ko;q=0.8'
    }
  });
  return r.text();
}

function extractDuckLinks(html = '') {
  const out = [];
  const re = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href = decodeHtml(m[1]);
    const text = cleanText(m[2]);
    if (!href || !text) continue;

    // Duck redirect form: /l/?uddg=<encoded>
    const u = href.match(/[?&]uddg=([^&]+)/);
    if (u) href = decodeURIComponent(u[1]);

    if (!/^https?:\/\//i.test(href)) continue;
    if (/duckduckgo\.com|substack\.com\/top/i.test(href)) continue;
    if (/\/tag\/|\/category\/|\/privacy|\/terms/i.test(href)) continue;

    out.push({ title: text.slice(0, 140), link: href, pubDate: '', description: '' });
  }
  const seen = new Set();
  return out.filter(v => {
    if (seen.has(v.link)) return false;
    seen.add(v.link);
    return true;
  }).slice(0, 10);
}

async function fetchWebFallbackItems(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const html = await fetchText(url);
    return extractDuckLinks(html);
  } catch {
    return [];
  }
}

function selectCoreSentences(text = '') {
  const all = splitSentences(text).filter(s => !isLowValueSentence(s));
  const signal = /(launch|release|raise|raised|acquire|deal|partnership|growth|decline|increase|decrease|risk|impact|strategy|announced|reported|도입|출시|인상|하락|상승|투자|실적|리스크|발표)/i;
  const picked = all.filter(s => signal.test(s));
  return (picked.length ? picked : all).slice(0, 6);
}

function buildInsight(item, articleText) {
  const base = cleanText(`${item.title}. ${item.description}. ${articleText}`);
  const core = selectCoreSentences(base);
  if (!core.length) return null;

  const fact = core[0]?.slice(0, 190) || '';
  const why = (core[1] || core[0] || '').slice(0, 190);
  if (!fact || /^(models on the march|show hn|issue \d+)/i.test(fact)) return null;

  const track = classifyTrack(`${item.title} ${base}`);
  const action = buildAction(track);

  const summaryKo = `무슨 일? ${fact} 왜 중요? ${why}`;
  const score = qualityScore(summaryKo, action, base)
    - (/\b(api|model|gpt|anthropic|openai|revenue|investment|funding|market|stock|실적|투자)\b/i.test(`${fact} ${why}`) ? 0 : 20);

  if (score < 70) return null;

  return {
    track,
    fact: `무슨 일? ${fact}`,
    why: `왜 중요? ${why}`,
    action,
    score
  };
}

const crawled = [];
for (const src of picks) {
  try {
    let items = [];
    if (src?.rss) {
      // eslint-disable-next-line no-await-in-loop
      const xml = await fetchText(src.rss);
      items = parseRss(xml).slice(0, 6);
    }

    if (!items.length) {
      // eslint-disable-next-line no-await-in-loop
      const home = await fetchText(src.url);
      items = extractLinksFromHome(home, src.url).slice(0, 6);
    }

    if (!items.length) {
      // web search fallback (no API key)
      // eslint-disable-next-line no-await-in-loop
      items = await fetchWebFallbackItems(`${src.name} latest newsletter ${category}`).then(v => v.slice(0, 6));
    }

    if (!items.length) continue;

    let chosen = null;
    for (const item of items) {
      let articleText = '';
      try {
        if (/hacker newsletter/i.test(src.name)) {
          articleText = cleanText(`${item.title}. ${item.description || ''}`).slice(0, 5000);
        } else {
          // eslint-disable-next-line no-await-in-loop
          const html = await fetchText(item.link);
          let cleaned = cleanText(pickMainHtml(html));
          const tldrStart = cleaned.search(/(Big Tech|Startups|Science|Programming|Data Science|Quick Links)/i);
          if (tldrStart > 0 && /tldr/i.test(src.name)) cleaned = cleaned.slice(tldrStart);
          articleText = cleaned.slice(0, 7000);
        }
      } catch {
        continue;
      }

      const insight = buildInsight(item, articleText);
      if (!insight) continue;
      chosen = { item, articleText, insight };
      break; // quality-gated first good candidate
    }

    crawled.push({
      source: src.name,
      rss: src.rss || null,
      pickedAt: new Date().toISOString(),
      items: items.slice(0, 3),
      chosen: chosen
        ? {
            title: chosen.item.title,
            link: chosen.item.link,
            pubDate: chosen.item.pubDate,
            fullText: chosen.articleText,
            insightKo: chosen.insight
          }
        : null
    });
  } catch {
    // skip
  }
}

fs.writeFileSync(outJson, JSON.stringify({ generatedAt: new Date().toISOString(), category, sources: crawled }, null, 2));

if (!crawled.length) {
  process.stdout.write('');
  process.exit(0);
}

const listItems = [];
const summaryItems = [];
for (const s of crawled) {
  for (const item of s.items.slice(0, 3)) {
    listItems.push(`      <li>[${s.source}] <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>${item.pubDate ? ` <span class="muted">(${item.pubDate})</span>` : ''}</li>`);
  }
  const i = s.chosen?.insightKo;
  if (!i) continue;
  summaryItems.push(`      <li><strong>${s.source}</strong> <span class="muted">(${i.track}, 점수 ${i.score})</span><ul><li>${i.fact}</li><li>${i.why}</li><li>${i.action}</li></ul></li>`);
  if (summaryItems.length >= 3) break;
}

const summaryBlock = summaryItems.length
  ? `<ul>\n${summaryItems.join('\n')}\n  </ul>`
  : '<p class="muted">이번 배치에서는 품질 기준을 통과한 인사이트가 없어 요약을 생략했습니다.</p>';

process.stdout.write(`
  <h2>실제 뉴스 크롤링 리스트</h2>
  <p class="muted">RSS + 원문 페이지 링크 진입으로 수집했습니다.</p>
  <ul>
${listItems.join('\n')}
  </ul>

  <h2>인사이트 브리핑 (의사결정용)</h2>
  <p class="muted">생성→검증 루프를 통과한 상위 3개만 제공합니다.</p>
  ${summaryBlock}`);
