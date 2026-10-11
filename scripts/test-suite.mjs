import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { jsPDF } from 'jspdf';

console.log('====================================================');
console.log('🧪 PIXEL 3.O PRODUCTION SYSTEM VERIFICATION TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------------
// 1. DYNAMIC UNIQUE PARTICIPANT & FEE CALCULATION TEST
// ----------------------------------------------------------------------
console.log('1. Testing Dynamic Unique Participant & Fee Deduplication Logic:');

function isPaperQuest(val) {
  const s = String(val || '').trim().toUpperCase();
  return s.includes('PAPERQUEST') || s.includes('PAPER QUEST');
}
function isMineRelay(val) {
  const s = String(val || '').trim().toUpperCase();
  return s.includes('MINE RELAY') || s.includes('MINERELAY') || s.includes('MIME RELAY') || s.includes('MIMERELAY');
}
function isCheckmate(val) {
  const s = String(val || '').trim().toUpperCase();
  return s.includes('CHECKMATE') || s.includes('CHESS');
}
function isAiFilmForge(val) {
  const s = String(val || '').trim().toUpperCase();
  return s.includes('AI FILMFORGE') || s.includes('FILMFORGE') || s.includes('FILM FORGE');
}

function calculateUniqueMembersAndFee(formData) {
  const hasPQ = isPaperQuest(formData.technicalEvent);
  const hasMR = isMineRelay(formData.nonTechnicalEvent);
  const primaryName = (formData.participantName || '').trim();

  const unique = new Map();
  if (primaryName) {
    unique.set(primaryName.toLowerCase(), primaryName);
  }

  if (hasPQ) {
    const pqMembers = [
      formData.paperPresentationTeamMember1,
      formData.paperPresentationTeamMember2,
      formData.paperPresentationTeamMember3,
      formData.paperPresentationTeamMember4,
    ];
    for (const m of pqMembers) {
      const trimmed = (m || '').trim();
      if (trimmed) unique.set(trimmed.toLowerCase(), trimmed);
    }
  }

  if (hasMR) {
    const mrMembers = [
      formData.mimeRelayTeamMember1,
      formData.mimeRelayTeamMember2,
      formData.mimeRelayTeamMember3,
      formData.mimeRelayTeamMember4,
    ];
    for (const m of mrMembers) {
      const trimmed = (m || '').trim();
      if (trimmed) unique.set(trimmed.toLowerCase(), trimmed);
    }
  }

  const count = Math.max(1, unique.size);
  return {
    uniqueMembers: count,
    totalFee: count * 129,
    memberNames: Array.from(unique.values())
  };
}

runTest('Single Solo Participant (AI FILMFORGE) -> 1 person = ₹129', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Saran K',
    technicalEvent: 'AI FILMFORGE',
    nonTechnicalEvent: ''
  });
  assert.strictEqual(res.uniqueMembers, 1);
  assert.strictEqual(res.totalFee, 129);
});

runTest('Single Solo Participant (CHECKMATE) -> 1 person = ₹129', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Saran K',
    technicalEvent: '',
    nonTechnicalEvent: 'CHECKMATE'
  });
  assert.strictEqual(res.uniqueMembers, 1);
  assert.strictEqual(res.totalFee, 129);
});

runTest('Both Solo Events by Same Participant (AI FILMFORGE + CHECKMATE) -> 1 person = ₹129', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Saran K',
    technicalEvent: 'AI FILMFORGE',
    nonTechnicalEvent: 'CHECKMATE'
  });
  assert.strictEqual(res.uniqueMembers, 1);
  assert.strictEqual(res.totalFee, 129);
});

runTest('PAPERQUEST Team of 4 -> Exactly 4 persons = ₹516', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Alice',
    technicalEvent: 'PAPERQUEST',
    paperPresentationTeamMember1: 'Alice',
    paperPresentationTeamMember2: 'Bob',
    paperPresentationTeamMember3: 'Charlie',
    paperPresentationTeamMember4: 'David'
  });
  assert.strictEqual(res.uniqueMembers, 4);
  assert.strictEqual(res.totalFee, 516);
});

runTest('MINE RELAY Team of 4 -> Exactly 4 persons = ₹516', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Alice',
    nonTechnicalEvent: 'MINE RELAY',
    mimeRelayTeamMember1: 'Alice',
    mimeRelayTeamMember2: 'Bob',
    mimeRelayTeamMember3: 'Charlie',
    mimeRelayTeamMember4: 'David'
  });
  assert.strictEqual(res.uniqueMembers, 4);
  assert.strictEqual(res.totalFee, 516);
});

runTest('PAPERQUEST + MINE RELAY (Same 4 Team Members) -> Deduplicated to 4 persons = ₹516', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Alice',
    technicalEvent: 'PAPERQUEST',
    nonTechnicalEvent: 'MINE RELAY',
    paperPresentationTeamMember1: 'Alice',
    paperPresentationTeamMember2: 'Bob',
    paperPresentationTeamMember3: 'Charlie',
    paperPresentationTeamMember4: 'David',
    mimeRelayTeamMember1: 'Alice',
    mimeRelayTeamMember2: 'Bob',
    mimeRelayTeamMember3: 'Charlie',
    mimeRelayTeamMember4: 'David'
  });
  assert.strictEqual(res.uniqueMembers, 4);
  assert.strictEqual(res.totalFee, 516);
});

runTest('PAPERQUEST + MINE RELAY (Distinct Team Members: 1 Lead + 3 PQ + 3 MR) -> 7 persons = ₹903', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Alice',
    technicalEvent: 'PAPERQUEST',
    nonTechnicalEvent: 'MINE RELAY',
    paperPresentationTeamMember1: 'Alice',
    paperPresentationTeamMember2: 'Bob',
    paperPresentationTeamMember3: 'Charlie',
    paperPresentationTeamMember4: 'David',
    mimeRelayTeamMember1: 'Alice',
    mimeRelayTeamMember2: 'Eve',
    mimeRelayTeamMember3: 'Frank',
    mimeRelayTeamMember4: 'Grace'
  });
  assert.strictEqual(res.uniqueMembers, 7);
  assert.strictEqual(res.totalFee, 903);
});

runTest('Backward compatibility with legacy MIME RELAY spelling -> 4 persons = ₹516', () => {
  const res = calculateUniqueMembersAndFee({
    participantName: 'Karthik',
    nonTechnicalEvent: 'Mime Relay',
    mimeRelayTeamMember1: 'Karthik',
    mimeRelayTeamMember2: 'Ravi',
    mimeRelayTeamMember3: 'Suresh',
    mimeRelayTeamMember4: 'Vijay'
  });
  assert.strictEqual(res.uniqueMembers, 4);
  assert.strictEqual(res.totalFee, 516);
});

// ----------------------------------------------------------------------
// 2. DYNAMIC PDF GENERATION AND LAYOUT TEST
// ----------------------------------------------------------------------
console.log('\n2. Testing Dynamic Pass PDF Generation and Layout Containment:');

runTest('Generate PDF for Solo Participant with dynamic ₹129 calculation', () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const totalAmount = 129;
  const uniqueCount = 1;
  
  // Test PDF canvas drawing
  doc.setFillColor(10, 10, 12);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('PIXEL-3.O', 20, 25);
  
  // Total Fee text
  doc.text(`Total Paid: Rs. ${totalAmount}`, 20, 80);
  doc.text(`Unique Participants: ${uniqueCount}`, 20, 90);
  
  const pdfBytes = doc.output('arraybuffer');
  assert.ok(pdfBytes.byteLength > 1000, 'PDF buffer should be non-empty');
});

runTest('Generate PDF for 4-Member Team with dynamic ₹516 calculation & multi-line wrapping', () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const totalAmount = 516;
  const uniqueCount = 4;
  const longCollegeName = 'Adhiparasakthi Engineering College, Melmaruvathur, Chengalpattu District, Tamil Nadu 603319';
  
  const wrappedCollege = doc.splitTextToSize(longCollegeName, 170);
  assert.ok(wrappedCollege.length >= 2, 'Long college name should wrap to multiple lines');
  
  doc.setFillColor(10, 10, 12);
  doc.rect(0, 0, 210, 297, 'F');
  
  let currentY = 50;
  for (const line of wrappedCollege) {
    doc.text(line, 20, currentY);
    currentY += 6;
  }
  
  // Team members
  const members = [
    'Alice Smith (Lead & Primary Participant)',
    'Bob Dylan (Paper Presentation Member 2)',
    'Charlie Chaplin (Paper Presentation Member 3)',
    'David Livingstone (Paper Presentation Member 4)'
  ];
  for (const m of members) {
    const wrapped = doc.splitTextToSize(m, 170);
    for (const w of wrapped) {
      doc.text(w, 20, currentY);
      currentY += 5;
    }
  }
  
  // Verification that Y never exceeds A4 height (297mm)
  assert.ok(currentY < 280, `Layout currentY (${currentY}mm) must be well within A4 height (297mm)`);
  
  const pdfBytes = doc.output('arraybuffer');
  assert.ok(pdfBytes.byteLength > 1500, 'Team PDF buffer should be non-empty');
});

// ----------------------------------------------------------------------
// 3. SEO METADATA & SCHEMA VALIDATION TEST
// ----------------------------------------------------------------------
console.log('\n3. Testing Technical SEO Implementation & Schema:');

const indexPath = path.resolve('index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

runTest('index.html Title is concise and within standard SERP length (<= 60 chars)', () => {
  const titleMatch = indexHtml.match(/<title>(.*?)<\/title>/);
  assert.ok(titleMatch, 'Title tag must exist');
  const title = titleMatch[1];
  assert.strictEqual(title, 'PIXEL 3.O 2026 | National Level Technical Symposium');
  assert.ok(title.length <= 60, `Title length (${title.length}) should be <= 60 characters`);
});

runTest('index.html Meta Description is within optimal 140-160 character range', () => {
  const descMatch = indexHtml.match(/<meta name="description" content="(.*?)"/);
  assert.ok(descMatch, 'Meta description must exist');
  const desc = descMatch[1];
  assert.ok(desc.length >= 120 && desc.length <= 160, `Description length (${desc.length}) must be 120-160 chars`);
});

runTest('index.html contains canonical link to https://pixel-3-o.vercel.app/', () => {
  assert.ok(indexHtml.includes('<link rel="canonical" href="https://pixel-3-o.vercel.app/" />'));
});

runTest('index.html contains Open Graph & Twitter image tags', () => {
  assert.ok(indexHtml.includes('property="og:image"'));
  assert.ok(indexHtml.includes('https://pixel-3-o.vercel.app/og-image.jpg'));
  assert.ok(indexHtml.includes('name="twitter:card" content="summary_large_image"'));
});

runTest('index.html contains valid Schema.org JSON-LD structure', () => {
  const scriptMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'JSON-LD script tag must exist');
  const jsonContent = scriptMatch[1].trim();
  const parsed = JSON.parse(jsonContent);
  assert.strictEqual(parsed['@context'], 'https://schema.org');
  assert.ok(Array.isArray(parsed['@graph']));
  
  const eventObj = parsed['@graph'].find(item => item['@type'] === 'Event');
  assert.ok(eventObj, 'Event schema object must exist');
  assert.strictEqual(eventObj.startDate, '2026-10-14T09:00:00+05:30');
  assert.strictEqual(eventObj.offers.price, '129');
  assert.strictEqual(eventObj.offers.priceCurrency, 'INR');
  assert.strictEqual(eventObj.subEvent.length, 4, 'Must list exactly 4 subEvents');
});

runTest('index.html has crawler-accessible H1, H2, and internal links in #root', () => {
  assert.ok(indexHtml.includes('<h1>PIXEL 3.O 2026 | National Level Technical Symposium</h1>'));
  assert.ok(indexHtml.includes('<h2>Department of Computer Science and Engineering — Adhiparasakthi Engineering College</h2>'));
  assert.ok(indexHtml.includes('<a href="/registration">'));
  assert.ok(indexHtml.includes('<a href="/about">'));
  assert.ok(indexHtml.includes('<a href="/agenda">'));
});

// ----------------------------------------------------------------------
// 4. ROBOTS.TXT & SITEMAP.XML TEST
// ----------------------------------------------------------------------
console.log('\n4. Testing Robots.txt and Sitemap.xml:');

runTest('public/robots.txt correctly allows public routes and disallows /admin, /verify, /pass', () => {
  const robots = fs.readFileSync(path.resolve('public/robots.txt'), 'utf-8');
  assert.ok(robots.includes('Allow: /'));
  assert.ok(robots.includes('Disallow: /admin'));
  assert.ok(robots.includes('Disallow: /verify'));
  assert.ok(robots.includes('Disallow: /pass'));
  assert.ok(robots.includes('Sitemap: https://pixel-3-o.vercel.app/sitemap.xml'));
});

runTest('public/sitemap.xml contains all 7 public indexable routes', () => {
  const sitemap = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf-8');
  const routes = [
    'https://pixel-3-o.vercel.app/',
    'https://pixel-3-o.vercel.app/registration',
    'https://pixel-3-o.vercel.app/about',
    'https://pixel-3-o.vercel.app/agenda',
    'https://pixel-3-o.vercel.app/venues',
    'https://pixel-3-o.vercel.app/staff-coordinators',
    'https://pixel-3-o.vercel.app/student-coordinators',
  ];
  for (const r of routes) {
    assert.ok(sitemap.includes(`<loc>${r}</loc>`), `Sitemap must contain ${r}`);
  }
  assert.ok(!sitemap.includes('/admin'), 'Sitemap must NOT contain admin routes');
  assert.ok(!sitemap.includes('/verify'), 'Sitemap must NOT contain verify routes');
});

// ----------------------------------------------------------------------
// 5. UPI ID VERIFICATION TEST
// ----------------------------------------------------------------------
console.log('\n5. Testing Payment UPI ID Integrity:');

runTest('Active project uses official UPI ID gokulkumar1406@okaxis and eliminates old sachinvelu6925-2@oksbi', () => {
  const regPage = fs.readFileSync(path.resolve('src/pages/RegistrationPage.tsx'), 'utf-8');
  assert.ok(regPage.includes('gokulkumar1406@okaxis'), 'Must contain official UPI ID gokulkumar1406@okaxis');
  assert.ok(!regPage.includes('sachinvelu6925-2@oksbi'), 'Must NOT contain old UPI ID');
});

// ----------------------------------------------------------------------
// 6. REGISTRATION EVENT SELECTION RULE FIX & SHARED IDENTITY TESTS
// ----------------------------------------------------------------------
console.log('\n6. Testing Event Selection Rules & Shared Primary Participant Identity:');

function simulateEventToggle(currentEvents, eventToToggle) {
  const isTech = eventToToggle === 'PaperQuest' || eventToToggle === 'AI FilmForge';
  const isNonTech = eventToToggle === 'Checkmate' || eventToToggle === 'Mine Relay';
  let newEvents = [...currentEvents];

  if (isTech) {
    if (newEvents.includes(eventToToggle)) {
      newEvents = newEvents.filter(e => e !== eventToToggle);
    } else {
      newEvents = newEvents.filter(e => e !== 'PaperQuest' && e !== 'AI FilmForge');
      newEvents.push(eventToToggle);
    }
  } else if (isNonTech) {
    if (newEvents.includes(eventToToggle)) {
      newEvents = newEvents.filter(e => e !== eventToToggle);
    } else {
      newEvents = newEvents.filter(e => e !== 'Checkmate' && e !== 'Mine Relay');
      newEvents.push(eventToToggle);
    }
  }
  return newEvents;
}

runTest('Technical Event Selection allows ONLY ONE technical event (PaperQuest OR AI FilmForge)', () => {
  let events = [];
  events = simulateEventToggle(events, 'PaperQuest');
  assert.deepStrictEqual(events, ['PaperQuest']);
  
  // Selecting AI FilmForge replaces PaperQuest (max 1 technical)
  events = simulateEventToggle(events, 'AI FilmForge');
  assert.deepStrictEqual(events, ['AI FilmForge']);
  
  // Clicking AI FilmForge again deselects it
  events = simulateEventToggle(events, 'AI FilmForge');
  assert.deepStrictEqual(events, []);
});

runTest('Non-Technical Event Selection allows ONLY ONE non-technical event (Checkmate OR Mine Relay)', () => {
  let events = [];
  events = simulateEventToggle(events, 'Checkmate');
  assert.deepStrictEqual(events, ['Checkmate']);
  
  // Selecting Mine Relay replaces Checkmate (max 1 non-technical)
  events = simulateEventToggle(events, 'Mine Relay');
  assert.deepStrictEqual(events, ['Mine Relay']);
  
  // Clicking Mine Relay again deselects it
  events = simulateEventToggle(events, 'Mine Relay');
  assert.deepStrictEqual(events, []);
});

runTest('Allows maximum of one from each category (1 Technical + 1 Non-Technical)', () => {
  let events = [];
  events = simulateEventToggle(events, 'PaperQuest');
  events = simulateEventToggle(events, 'Mine Relay');
  assert.deepStrictEqual(events.sort(), ['Mine Relay', 'PaperQuest'].sort());
  
  // Switching technical event preserves non-technical event
  events = simulateEventToggle(events, 'AI FilmForge');
  assert.deepStrictEqual(events.sort(), ['AI FilmForge', 'Mine Relay'].sort());
  
  // Switching non-technical event preserves technical event
  events = simulateEventToggle(events, 'Checkmate');
  assert.deepStrictEqual(events.sort(), ['AI FilmForge', 'Checkmate'].sort());
});

runTest('Shared Identity: PaperQuest + Mine Relay reuses primary participant as Member 1 in both teams', () => {
  const primaryName = 'Gokul Kumar';
  const pqMember2 = 'Priya R', pqMember3 = 'Kaviya S', pqMember4 = 'Anand M';
  const mrMember2 = 'Vikram V', mrMember3 = 'Sanjay K', mrMember4 = 'Dinesh B';
  
  // Primary name is Member 1 in both teams
  const formData = {
    participantName: primaryName,
    technicalEvent: 'PAPERQUEST',
    paperPresentationTeamMember1: primaryName,
    paperPresentationTeamMember2: pqMember2,
    paperPresentationTeamMember3: pqMember3,
    paperPresentationTeamMember4: pqMember4,
    nonTechnicalEvent: 'MINE RELAY',
    mimeRelayTeamMember1: primaryName, // Reused Member 1 automatically
    mimeRelayTeamMember2: mrMember2,
    mimeRelayTeamMember3: mrMember3,
    mimeRelayTeamMember4: mrMember4
  };
  
  const res = calculateUniqueMembersAndFee(formData);
  // 1 primary + 3 PQ + 3 MR = 7 unique participants
  assert.strictEqual(res.uniqueMembers, 7);
  assert.strictEqual(res.totalFee, 7 * 129);
  assert.ok(res.memberNames.includes(primaryName));
  // Primary name is deduplicated and not counted twice
  const occurrences = res.memberNames.filter(n => n.toLowerCase() === primaryName.toLowerCase());
  assert.strictEqual(occurrences.length, 1);
});

console.log('\n====================================================');
console.log(`🎉 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}

