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

function makeKoreanInsight(title = '', text = '') {
  const t = cleanBoilerplate(title).slice(0, 100);
  const clean = cleanBoilerplate(text);
  const sents = clean.split(/(?<=[.!?。！？])\s+/).filter(Boolean);
  const fact = (sents[0] || clean).slice(0, 220);
  const why = (sents[1] || sents[0] || clean).slice(0, 220);

  const hasAi = /ai|model|llm|agent|anthropic|openai|claude|gpt|gemini/i.test(`${t} ${clean}`);
  const hasMarket = /market|stock|revenue|funding|ipo|vc|invest|price|금리|환율/i.test(`${t} ${clean}`);

  const action = hasAi
    ? '실행 포인트: 내 업무에서 자동화 가능한 1개 작업을 고르고, 이번 주 안에 테스트해보세요.'
    : hasMarket
      ? '실행 포인트: 관련 지표(수요·실적·가이던스)를 확인해 기존 가설을 업데이트하세요.'
      : '실행 포인트: 이번 주 의사결정에 연결되는 항목 1개만 뽑아 실제 행동으로 옮기세요.';

  return {
    fact: `무슨 일? ${fact}`,
    why: `왜 중요? ${why}`,
    action
  };
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

    let articleText = '';
    if (/hacker newsletter/i.test(src.name)) {
      articleText = cleanBoilerplate(`${items[0].title}. ${items[0].description || ''}`)
        .replace(/Article URL:[^#]+/gi, ' ')
        .replace(/Comments URL:[^#]+/gi, ' ')
        .replace(/Points:\s*\d+/gi, ' ')
        .replace(/# Comments:\s*\d+/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000);
    } else {
      // eslint-disable-next-line no-await-in-loop
      const articleHtml = await fetchText(items[0].link);
      const articleMain = pickMainHtml(articleHtml);
      articleText = cleanBoilerplate(stripTags(articleMain)).slice(0, 8000);
    }

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
        insightKo: makeKoreanInsight(items[0].title, (articleText.length > 220 ? articleText : `${items[0].description}. ${articleText}`).trim())
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
  const i = s.article.insightKo;
  if (i) {
    summaryItems.push(`      <li><strong>${s.source}</strong><ul><li>${i.fact}</li><li>${i.why}</li><li>${i.action}</li></ul></li>`);
  } else {
    summaryItems.push(`      <li><strong>${s.source}</strong>: 요약 생성 실패</li>`);
  }
}

process.stdout.write(`
  <h2>실제 뉴스 크롤링 리스트</h2>
  <p class="muted">아래 링크들은 발행 시점에 RSS/원문 페이지에서 직접 수집한 최신 기사입니다.</p>
  <ul>
${listItems.join('\n')}
  </ul>

  <h2>인사이트 브리핑 (의사결정용)</h2>
  <p class="muted">제목 요약이 아니라, 실제 행동에 연결되는 포인트 중심으로 정리했습니다.</p>
  <ul>
${summaryItems.join('\n')}
  </ul>`);
