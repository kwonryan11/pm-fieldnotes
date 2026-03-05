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
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function takeSentences(text = '', n = 2) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const parts = clean.split(/(?<=[.!?。！？])\s+/).filter(Boolean);
  return parts.slice(0, n).join(' ').slice(0, 420);
}

function cleanBoilerplate(text = '') {
  return text
    .replace(/\b(Subscribe|Sign in|Sign up|Advertise|Privacy|Careers|Open main menu)\b/gi, ' ')
    .replace(/\b(Sponsor|Sponsored|Newsletters?)\b/gi, ' ')
    .replace(/\b(Just a moment|Attention Required|Cloudflare|captcha)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeKoreanSummary(title = '', text = '') {
  const t = cleanBoilerplate(title).slice(0, 100);
  const lead = takeSentences(cleanBoilerplate(text), 2).slice(0, 260);
  if (lead) {
    return `핵심 이슈는 "${t}"입니다. 원문 요지는 ${lead} 로, 관련 배경과 영향 포인트를 함께 다룹니다.`;
  }
  return `핵심 이슈는 "${t}"입니다. 원문에서 해당 주제의 배경과 파급효과를 중심으로 설명합니다.`;
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
    if (title && link) items.push({ title: stripTags(title), link: decodeHtml(link), pubDate, description: stripTags(desc) });
  }

  const atomItems = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const raw of atomItems) {
    const title = (raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const link = (raw.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || '').trim();
    const pubDate = (raw.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] || raw.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] || '').trim();
    const desc = (raw.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || raw.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] || '').trim();
    if (title && link) items.push({ title: stripTags(title), link: decodeHtml(link), pubDate, description: stripTags(desc) });
  }

  return items;
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

const crawled = [];
for (const src of picks) {
  if (!src?.rss) continue;
  try {
    // eslint-disable-next-line no-await-in-loop
    const xml = await fetchText(src.rss);
    const items = parseRss(xml).slice(0, 3);
    if (!items.length) continue;

    // eslint-disable-next-line no-await-in-loop
    const articleHtml = await fetchText(items[0].link);
    const articleMain = pickMainHtml(articleHtml);
    const articleText = cleanBoilerplate(stripTags(articleMain)).slice(0, 8000);

    crawled.push({
      source: src.name,
      rss: src.rss,
      pickedAt: new Date().toISOString(),
      items,
      article: {
        title: items[0].title,
        link: items[0].link,
        pubDate: items[0].pubDate,
        fullText: articleText,
        summaryEn: takeSentences((articleText.length > 220 ? articleText : `${items[0].description}. ${articleText}`).trim() || items[0].title, 2),
        summaryKo: makeKoreanSummary(items[0].title, (articleText.length > 220 ? articleText : `${items[0].description}. ${articleText}`).trim())
      }
    });
  } catch {
    // skip source on failure
  }
}

fs.writeFileSync(outJson, JSON.stringify({ generatedAt: new Date().toISOString(), category, sources: crawled }, null, 2));

if (!crawled.length) {
  process.stdout.write('');
  process.exit(0);
}

const listItems = [];
const summaryItems = [];
for (const s of crawled.slice(0, 5)) {
  for (const item of s.items.slice(0, 3)) {
    listItems.push(`      <li>[${s.source}] <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>${item.pubDate ? ` <span class="muted">(${item.pubDate})</span>` : ''}</li>`);
  }
  summaryItems.push(`      <li><strong>${s.source}</strong>: ${s.article.summaryKo || s.article.title}</li>`);
}

process.stdout.write(`
  <h2>실제 뉴스 크롤링 리스트</h2>
  <p class="muted">아래 링크들은 발행 시점에 RSS/원문 페이지에서 직접 수집한 최신 기사입니다.</p>
  <ul>
${listItems.join('\n')}
  </ul>

  <h2>요약 브리핑</h2>
  <ul>
${summaryItems.join('\n')}
  </ul>`);
