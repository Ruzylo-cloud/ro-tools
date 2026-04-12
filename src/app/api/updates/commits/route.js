import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const REPO_OWNER = 'Ruzylo-cloud';
const REPO_NAME = 'ro-tools';
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits`;

// Category detection from commit message prefixes
function categorize(msg) {
  const lower = msg.toLowerCase();
  if (lower.startsWith('feat') || lower.includes('new feature') || lower.includes('add ')) return 'new_feature';
  if (lower.startsWith('fix') || lower.includes('bug fix') || lower.includes('hotfix')) return 'bug_fix';
  if (lower.startsWith('docs') || lower.startsWith('chore') || lower.startsWith('ci')) return 'announcement';
  return 'improvement';
}

// Clean commit message: strip conventional-commit prefix + Co-Authored-By
function cleanMessage(msg) {
  let line = msg.split('\n')[0].trim();
  // Strip "type(scope): " or "type: " prefix
  line = line.replace(/^(feat|fix|docs|chore|ci|refactor|style|perf|test|security|ux)(\([^)]*\))?:\s*/i, '');
  // Capitalize first letter
  if (line.length > 0) line = line[0].toUpperCase() + line.slice(1);
  return line;
}

function extractDescription(msg) {
  const lines = msg.split('\n').filter(l => l.trim() && !l.includes('Co-Authored-By'));
  return lines.slice(1).join(' ').trim().slice(0, 500) || null;
}

/**
 * GET /api/updates/commits?per_page=50&page=1
 * Fetches recent commits from the GitHub repo and formats them as changelog entries.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '50', 10), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);

    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'ro-tools' };
    // Use GITHUB_TOKEN if available for higher rate limits
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${GITHUB_API}?per_page=${perPage}&page=${page}`, { headers, next: { revalidate: 300 } });
    if (!res.ok) {
      const text = await res.text();
      console.error('[commits] GitHub API error:', res.status, text.slice(0, 200));
      return NextResponse.json({ commits: [], error: `GitHub API returned ${res.status}` });
    }

    const data = await res.json();
    const commits = data.map(c => ({
      sha: c.sha.slice(0, 7),
      date: c.commit.author.date,
      author: c.commit.author.name,
      category: categorize(c.commit.message),
      title: cleanMessage(c.commit.message),
      description: extractDescription(c.commit.message),
      url: c.html_url,
    }));

    return NextResponse.json({ commits });
  } catch (err) {
    console.error('[commits] Error:', err);
    return NextResponse.json({ commits: [], error: 'Failed to fetch commits' });
  }
}
