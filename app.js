/* ─── app.js — LegalEase AI Document Platform ─── */

// ══════════════════════════════════════
// NAVBAR SCROLL EFFECT
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ['home', 'features', 'analyze', 'review', 'pricing'];
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// Mobile nav toggle
document.getElementById('nav-toggle').addEventListener('click', () => {
  const links = document.getElementById('nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
});

// ══════════════════════════════════════
// SCROLL UTILITY
// ══════════════════════════════════════
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════════════════════
// TOAST NOTIFICATION
// ══════════════════════════════════════
function showToast(msg, duration = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ══════════════════════════════════════
// SAMPLE DOCUMENT TEXTS
// ══════════════════════════════════════
const SAMPLES = {
  nda: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of September 25, 2026 ("Effective Date") by and between Acme Corporation, a Delaware corporation ("Disclosing Party"), and XYZ Ventures Ltd ("Receiving Party").

1. CONFIDENTIAL INFORMATION
"Confidential Information" means any data or information, oral or written, disclosed by the Disclosing Party to the Receiving Party that is designated as confidential. This includes but is not limited to: trade secrets, business strategies, financial data, client lists, technical specifications, source code, and proprietary algorithms.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose Confidential Information to third parties without prior written consent; (c) use Confidential Information solely for evaluating a potential business partnership.

3. TERM
This Agreement shall remain in effect for five (5) years from the Effective Date. Upon termination, all Confidential Information must be returned or destroyed within 30 days.

4. LIABILITY AND INDEMNIFICATION
The Receiving Party shall be liable for ALL damages, direct, indirect, incidental, consequential, and punitive, arising from any breach of this Agreement, without limitation. The Receiving Party shall indemnify the Disclosing Party against all claims, losses, and expenses, including unlimited legal fees.

5. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware, United States.

6. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof.

7. TERMINATION
Either party may terminate this Agreement with or without cause. No specific notice period is required. Termination shall be effective immediately or at such future date as the terminating party may determine in its sole discretion.`,

  contract: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of October 1, 2026, between TechStart Inc. ("Client") and DevPro Solutions ("Service Provider").

SERVICES: Service Provider agrees to develop a custom CRM software platform including all features described in Exhibit A. Development shall be completed within 90 days from the Effective Date.

PAYMENT TERMS: Client shall pay Service Provider $150,000 total, structured as follows: 30% ($45,000) upon signing; 40% ($60,000) upon delivery of beta version; 30% ($45,000) upon final delivery and acceptance. Payments are due within NET-30 of each milestone.

INTELLECTUAL PROPERTY: All work product, code, designs, and deliverables created by Service Provider under this Agreement shall become the exclusive property of Client upon full payment. Service Provider retains no rights to the deliverables.

CONFIDENTIALITY: Both parties agree to maintain strict confidentiality regarding all proprietary information shared during the engagement.

LIMITATION OF LIABILITY: In no event shall either party be liable for indirect, incidental, or consequential damages. Service Provider's total liability shall not exceed the total fees paid under this Agreement.

TERMINATION: Client may terminate this Agreement with 30 days written notice. Upon termination, Client shall pay for all work completed to date. If terminated without cause, Client shall pay a 15% early termination fee on the remaining contract value.

DISPUTE RESOLUTION: Any disputes shall be resolved through binding arbitration in San Francisco, California.

WARRANTIES: Service Provider warrants that all deliverables will be free from material defects for 90 days following final delivery.`
};

function loadSample(type) {
  document.getElementById('document-input').value = SAMPLES[type] || '';
  showToast(`✅ Sample ${type.toUpperCase()} loaded`);
}

function clearInput() {
  document.getElementById('document-input').value = '';
  resetOutput();
}

function loadContractSample() {
  document.getElementById('contract-input').value = SAMPLES.contract;
  showToast('✅ Sample contract loaded');
}

function clearReview() {
  document.getElementById('contract-input').value = '';
  resetReviewOutput();
}

// ══════════════════════════════════════
// CALL GEMINI API
// ══════════════════════════════════════
async function callGeminiAPI(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ══════════════════════════════════════
// DOCUMENT ANALYSIS
// ══════════════════════════════════════
function resetOutput() {
  document.getElementById('output-placeholder').style.display = 'flex';
  document.getElementById('output-content').style.display = 'none';
  document.getElementById('output-loading').style.display = 'none';
}

async function analyzeDocument() {
  const text = document.getElementById('document-input').value.trim();
  const apiKey = document.getElementById('api-key-input').value.trim();
  const btn = document.getElementById('btn-analyze');

  if (!text) { showToast('⚠️ Please enter a document to analyze'); return; }

  const placeholder = document.getElementById('output-placeholder');
  const content = document.getElementById('output-content');
  const loading = document.getElementById('output-loading');

  placeholder.style.display = 'none';
  content.style.display = 'none';
  loading.style.display = 'flex';
  btn.disabled = true;

  // Animate loading steps
  const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
  let stepIdx = 0;
  const stepInterval = setInterval(() => {
    steps.forEach((s, i) => {
      const el = document.getElementById(s);
      if (i < stepIdx) { el.classList.remove('active'); el.classList.add('done'); }
      else if (i === stepIdx) { el.classList.add('active'); el.classList.remove('done'); }
      else { el.classList.remove('active', 'done'); }
    });
    stepIdx = (stepIdx + 1) % steps.length;
  }, 900);

  try {
    let analysis;

    if (apiKey) {
      const prompt = `You are an expert legal analyst. Analyze the following legal document and respond ONLY with valid JSON in this exact format:
{
  "document_type": "string",
  "overall_risk_score": number (0-100),
  "risk_level": "Low|Medium|High",
  "executive_summary": "string (2-3 sentences)",
  "key_risks": [
    { "title": "string", "description": "string", "severity": "High|Medium|Low", "section": "string" }
  ],
  "key_clauses": [
    { "name": "string", "summary": "string", "favorable": true|false }
  ],
  "recommendations": ["string", "string", "string"]
}

Document:
${text.substring(0, 6000)}`;

      const raw = await callGeminiAPI(apiKey, prompt);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } else {
      // Fallback demo analysis (no API key required)
      analysis = generateDemoAnalysis(text);
    }

    clearInterval(stepInterval);
    loading.style.display = 'none';
    renderAnalysis(analysis);
    content.style.display = 'flex';
    if (!apiKey) showToast('ℹ️ Demo mode — enter API key for real AI analysis');

  } catch (err) {
    clearInterval(stepInterval);
    loading.style.display = 'none';
    placeholder.style.display = 'flex';
    showToast(`❌ Error: ${err.message}`);
    console.error(err);
  } finally {
    btn.disabled = false;
  }
}

function generateDemoAnalysis(text) {
  const lowerText = text.toLowerCase();
  const hasUnlimitedLiability = lowerText.includes('unlimited') || lowerText.includes('without limitation');
  const hasMissingNotice = lowerText.includes('no specific notice') || lowerText.includes('without cause');
  const hasTermination = lowerText.includes('terminat');
  const hasNDA = lowerText.includes('non-disclosure') || lowerText.includes('confidential');

  const risks = [];
  if (hasUnlimitedLiability) risks.push({ title: 'Unlimited Liability Clause', description: 'The agreement imposes unlimited liability which could expose you to disproportionate financial risk.', severity: 'High', section: 'Section 4' });
  if (hasMissingNotice) risks.push({ title: 'Vague Termination Terms', description: 'The termination provisions lack a clear notice period, creating legal uncertainty.', severity: 'Medium', section: 'Section 7' });
  risks.push({ title: 'Broad Confidentiality Scope', description: 'Confidentiality applies to all disclosed information without clear time limits post-termination.', severity: 'Medium', section: 'Section 1' });
  if (hasTermination) risks.push({ title: 'Immediate Termination Right', description: 'Either party may terminate without cause — this could be used adversarially.', severity: 'Low', section: 'Section 7' });

  const riskScore = hasUnlimitedLiability ? 72 : 45;

  return {
    document_type: hasNDA ? 'Non-Disclosure Agreement (NDA)' : 'Service Agreement',
    overall_risk_score: riskScore,
    risk_level: riskScore > 65 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
    executive_summary: `This ${hasNDA ? 'NDA' : 'agreement'} contains several clauses requiring careful review. The most significant concern is ${hasUnlimitedLiability ? 'the unlimited liability provision which exposes the receiving party to potentially catastrophic financial risk' : 'the broad scope of obligations placed on one party'}. Legal counsel should review before signing.`,
    key_risks: risks,
    key_clauses: [
      { name: 'Confidentiality Obligations', summary: 'Standard confidentiality protections for disclosed information.', favorable: true },
      { name: 'Governing Law', summary: 'Delaware law governs — a common and predictable jurisdiction.', favorable: true },
      { name: hasNDA ? '5-Year Term' : 'Payment Terms', summary: hasNDA ? 'Long but standard for NDAs in commercial contexts.' : 'NET-30 payment terms with structured milestone payments.', favorable: true },
      { name: 'Liability & Indemnification', summary: hasUnlimitedLiability ? 'Unlimited liability is unusually broad and potentially dangerous.' : 'Liability capped at contract value — standard and fair.', favorable: !hasUnlimitedLiability }
    ],
    recommendations: [
      'Negotiate the unlimited liability clause to cap damages at a reasonable multiple of contract value',
      'Add a clear notice period (minimum 30 days) for termination provisions',
      'Define specific categories of Confidential Information to limit the scope',
      'Include a mutual limitation of liability clause for balanced protection'
    ]
  };
}

function renderAnalysis(a) {
  const riskColor = a.risk_level === 'High' ? 'high' : a.risk_level === 'Medium' ? 'medium' : 'low';

  document.getElementById('output-summary').innerHTML = `
    <div class="result-card">
      <h4>📄 Document Overview</h4>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:4px;">Document Type</div>
          <div style="font-weight:700; font-size:0.95rem;">${escHtml(a.document_type)}</div>
        </div>
        <div style="text-align:center;">
          <div class="score-badge">${a.overall_risk_score}/100</div>
          <div class="score-desc">Risk Score</div>
          <span class="risk-tag ${riskColor}" style="margin-top:4px;">${a.risk_level} Risk</span>
        </div>
      </div>
      <p>${escHtml(a.executive_summary)}</p>
    </div>`;

  const risksHtml = (a.key_risks || []).map(r => `
    <div class="risk-item">
      <div class="risk-item-text">
        <strong>${escHtml(r.title)}</strong>
        ${escHtml(r.description)} <em style="color:var(--text-muted); font-size:0.8rem;">(${escHtml(r.section)})</em>
      </div>
      <span class="risk-tag ${r.severity.toLowerCase()}">${r.severity}</span>
    </div>`).join('');

  document.getElementById('output-risks').innerHTML = `
    <div class="result-card">
      <h4>⚠️ Key Risks Identified</h4>
      ${risksHtml || '<p>No significant risks identified.</p>'}
    </div>`;

  const clausesHtml = (a.key_clauses || []).map(c => `
    <li>
      <strong style="color:${c.favorable ? 'var(--green)' : 'var(--red)'};">${c.favorable ? '✅' : '❌'} ${escHtml(c.name)}</strong>
      — ${escHtml(c.summary)}
    </li>`).join('');

  const recsHtml = (a.recommendations || []).map(r => `<li>${escHtml(r)}</li>`).join('');

  document.getElementById('output-clauses').innerHTML = `
    <div class="result-card">
      <h4>📋 Key Clauses</h4>
      <ul>${clausesHtml}</ul>
    </div>
    <div class="result-card">
      <h4>💡 Recommendations</h4>
      <ul>${recsHtml}</ul>
    </div>`;
}

// ══════════════════════════════════════
// CONTRACT REVIEW
// ══════════════════════════════════════
function resetReviewOutput() {
  document.getElementById('review-placeholder').style.display = 'flex';
  document.getElementById('review-content').style.display = 'none';
  document.getElementById('review-loading').style.display = 'none';
}

async function reviewContract() {
  const text = document.getElementById('contract-input').value.trim();
  const apiKey = document.getElementById('api-key-input').value.trim();
  const focus = document.getElementById('review-type').value;
  const btn = document.getElementById('btn-review');

  if (!text) { showToast('⚠️ Please enter a contract to review'); return; }

  const placeholder = document.getElementById('review-placeholder');
  const content = document.getElementById('review-content');
  const loading = document.getElementById('review-loading');

  placeholder.style.display = 'none';
  content.style.display = 'none';
  loading.style.display = 'flex';
  btn.disabled = true;

  try {
    let review;

    if (apiKey) {
      const focusMap = {
        general: 'general overview with all key terms',
        risks: 'risk identification and potential legal pitfalls',
        obligations: 'obligations, duties, and deadlines for each party',
        financial: 'financial terms, payment schedules, and penalties',
        termination: 'termination conditions, notice requirements, and consequences'
      };

      const prompt = `You are a senior legal counsel. Review the following contract with a focus on ${focusMap[focus]}. Respond ONLY with valid JSON:
{
  "contract_type": "string",
  "parties": [{ "name": "string", "role": "string" }],
  "executive_summary": "string (3-4 sentences)",
  "key_obligations": [{ "party": "string", "obligation": "string", "deadline": "string or null" }],
  "financial_terms": { "total_value": "string", "payment_schedule": "string", "penalties": "string" },
  "critical_dates": [{ "event": "string", "date": "string" }],
  "negotiation_points": ["string"],
  "overall_assessment": "Favorable|Neutral|Unfavorable",
  "assessment_reason": "string"
}

Contract:
${text.substring(0, 6000)}`;

      const raw = await callGeminiAPI(apiKey, prompt);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      review = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } else {
      review = generateDemoReview(text);
    }

    loading.style.display = 'none';
    renderReview(review);
    content.style.display = 'flex';
    if (!apiKey) showToast('ℹ️ Demo mode — enter API key for real AI review');

  } catch (err) {
    loading.style.display = 'none';
    placeholder.style.display = 'flex';
    showToast(`❌ Error: ${err.message}`);
    console.error(err);
  } finally {
    btn.disabled = false;
  }
}

function generateDemoReview(text) {
  const lower = text.toLowerCase();
  const hasPayment = lower.includes('payment') || lower.includes('$');
  const hasTermination = lower.includes('terminat');

  return {
    contract_type: lower.includes('service') ? 'Service Agreement' : lower.includes('nda') ? 'NDA' : 'Commercial Contract',
    parties: [
      { name: 'TechStart Inc.', role: 'Client' },
      { name: 'DevPro Solutions', role: 'Service Provider' }
    ],
    executive_summary: 'This service agreement establishes a software development engagement between two parties. The terms are largely balanced with standard IP assignment clauses. Key concerns include the 15% early termination penalty and the relatively tight 90-day delivery timeline. Overall the agreement is reasonable but warrants negotiation on termination terms.',
    key_obligations: [
      { party: 'Service Provider', obligation: 'Deliver custom CRM software per Exhibit A specifications', deadline: '90 days from signing' },
      { party: 'Client', obligation: 'Pay $45,000 upon contract signing', deadline: 'Day 0' },
      { party: 'Client', obligation: 'Pay $60,000 upon beta delivery acceptance', deadline: 'Upon milestone' },
      { party: 'Service Provider', obligation: 'Provide 90-day warranty on all deliverables', deadline: 'Post-delivery' }
    ],
    financial_terms: {
      total_value: '$150,000',
      payment_schedule: '30% on signing, 40% on beta, 30% on final delivery (NET-30)',
      penalties: '15% early termination fee on remaining contract value'
    },
    critical_dates: [
      { event: 'Contract Effective Date', date: 'October 1, 2026' },
      { event: 'Beta Delivery Deadline', date: 'Approximately January 1, 2027' },
      { event: 'Final Delivery Deadline', date: 'Approximately January 29, 2027' },
      { event: 'Warranty Expiry', date: '90 days post-final delivery' }
    ],
    negotiation_points: [
      'The 15% early termination fee is on the high end — negotiate to 10% or a flat fee',
      'Request milestone definitions be attached as Exhibit A before signing',
      'Negotiate for a longer warranty period (180 days is industry standard for custom software)',
      'Consider adding a change order process for scope changes that affect timeline',
      'IP assignment should specify all pre-existing IP remains with Service Provider'
    ],
    overall_assessment: 'Neutral',
    assessment_reason: 'The agreement is generally fair with balanced liability caps, but the early termination penalty and tight timeline warrant attention before signing.'
  };
}

function renderReview(r) {
  const assessColor = { Favorable: 'var(--green)', Neutral: 'var(--amber)', Unfavorable: 'var(--red)' };

  const partiesHtml = (r.parties || []).map(p =>
    `<span style="padding:5px 12px; border-radius:40px; border:1px solid var(--border); font-size:0.82rem; background:var(--glass-light);">
      <strong>${escHtml(p.name)}</strong> <span style="color:var(--text-muted);">(${escHtml(p.role)})</span>
    </span>`).join('');

  const obligationsHtml = (r.key_obligations || []).map(o =>
    `<div style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px; flex-wrap:wrap; gap:6px;">
        <span style="font-size:0.78rem; font-weight:700; color:var(--blue-light); text-transform:uppercase; letter-spacing:0.05em;">${escHtml(o.party)}</span>
        ${o.deadline ? `<span style="font-size:0.76rem; color:var(--amber); border:1px solid rgba(245,158,11,0.3); padding:2px 8px; border-radius:40px;">⏰ ${escHtml(o.deadline)}</span>` : ''}
      </div>
      <p style="font-size:0.88rem; color:var(--text-secondary);">${escHtml(o.obligation)}</p>
    </div>`).join('');

  const datesHtml = (r.critical_dates || []).map(d =>
    `<li style="display:flex; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04); flex-wrap:wrap;">
      <span style="font-size:0.88rem;">${escHtml(d.event)}</span>
      <strong style="font-size:0.88rem; color:var(--gold-light);">${escHtml(d.date)}</strong>
    </li>`).join('');

  const negoHtml = (r.negotiation_points || []).map(n => `<li>${escHtml(n)}</li>`).join('');

  document.getElementById('review-content').innerHTML = `
    <div class="result-card">
      <h4>📋 Contract Overview</h4>
      <div style="margin-bottom:12px;">
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">Contract Type</div>
        <div style="font-weight:700; font-size:1rem; margin-bottom:12px;">${escHtml(r.contract_type)}</div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">Parties</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">${partiesHtml}</div>
      </div>
      <div style="padding-top:12px; border-top:1px solid var(--border);">
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">Assessment</div>
        <div style="display:flex; align-items:center; gap:10px;">
          <strong style="color:${assessColor[r.overall_assessment] || 'var(--text-primary)'}; font-size:1rem;">${r.overall_assessment}</strong>
          <span style="font-size:0.85rem; color:var(--text-muted);">— ${escHtml(r.assessment_reason)}</span>
        </div>
      </div>
    </div>
    <div class="result-card">
      <h4>💬 Executive Summary</h4>
      <p>${escHtml(r.executive_summary)}</p>
    </div>
    <div class="result-card">
      <h4>💰 Financial Terms</h4>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px;">
        <div style="padding:10px; background:var(--glass-light); border-radius:var(--radius-sm); border:1px solid var(--border);">
          <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:4px;">Total Value</div>
          <div style="font-weight:800; font-size:1.1rem; color:var(--gold-light);">${escHtml(r.financial_terms?.total_value || 'N/A')}</div>
        </div>
        <div style="padding:10px; background:var(--glass-light); border-radius:var(--radius-sm); border:1px solid var(--border); grid-column: span 2;">
          <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:4px;">Payment Schedule</div>
          <div style="font-size:0.88rem; color:var(--text-secondary);">${escHtml(r.financial_terms?.payment_schedule || 'N/A')}</div>
        </div>
        <div style="padding:10px; background:rgba(239,68,68,0.05); border-radius:var(--radius-sm); border:1px solid rgba(239,68,68,0.15); grid-column: span 3;">
          <div style="font-size:0.72rem; color:var(--red); margin-bottom:4px;">⚠️ Penalties</div>
          <div style="font-size:0.88rem; color:var(--text-secondary);">${escHtml(r.financial_terms?.penalties || 'None')}</div>
        </div>
      </div>
    </div>
    <div class="result-card">
      <h4>📌 Key Obligations</h4>
      ${obligationsHtml}
    </div>
    <div class="result-card">
      <h4>📅 Critical Dates</h4>
      <ul style="margin:0; padding:0;">${datesHtml}</ul>
    </div>
    <div class="result-card">
      <h4>🤝 Negotiation Points</h4>
      <ul>${negoHtml}</ul>
    </div>`;
}

// ══════════════════════════════════════
// UTILITY: HTML ESCAPING
// ══════════════════════════════════════
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Format markdown-like text to HTML
function formatAIText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul style="margin:8px 0 8px 16px; display:flex; flex-direction:column; gap:4px;">$1</ul>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px;">')
    .replace(/\n/g, '<br/>');
}

// ══════════════════════════════════════
// INTERSECTION OBSERVER (scroll animations)
// ══════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .pricing-card, .step-card, .trust-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ══════════════════════════════════════
// MOBILE NAV TOGGLE
// ══════════════════════════════════════
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
  });
});

// ══════════════════════════════════════
// BUTTON HANDLERS
// ══════════════════════════════════════
document.getElementById('btn-get-started').addEventListener('click', () => scrollToSection('analyze'));
document.getElementById('btn-login').addEventListener('click', () => showToast('\uD83D\uDC4B Login coming soon!'));
['btn-starter', 'btn-pro', 'btn-enterprise'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', () => showToast('\uD83D\uDE80 Signup flow coming soon!'));
});

// ══════════════════════════════════════
// AI CHATBOT
// ══════════════════════════════════════
let chatHistory = [];
const DEMO_ANSWERS = {
  nda: '**Key clauses to look for in an NDA:**\n\n**1. Definition of Confidential Information** — Ensure it\'s specific, not a blanket catch-all.\n\n**2. Exclusions** — Information already public, independently developed, or received from third parties should be excluded.\n\n**3. Term / Duration** — 2–5 years is standard. Perpetual NDAs are a red flag.\n\n**4. Permitted Disclosures** — Who can the receiving party share info with? (employees, legal advisors)\n\n**5. Unlimited Liability Clauses** — Always negotiate these down to a reasonable cap.\n\n**6. Governing Law & Jurisdiction** — Ensure it\'s a jurisdiction where you can realistically enforce it.',
  liability: '**Limitation of Liability vs. Indemnification:**\n\n**Limitation of Liability** caps the maximum amount one party can recover from the other (e.g., "Total liability shall not exceed fees paid in the prior 12 months").\n\n**Indemnification** is a promise to compensate the other party for specific types of losses — especially third-party claims. It defines *what* is covered.\n\nA key distinction: the liability cap sets a *ceiling*, while indemnification defines *categories* of coverage. An indemnification may be carved out from the liability cap, or subject to it — always clarify which applies.',
  noncompete: '**Non-Compete Clause Enforceability:**\n\nEnforceability varies greatly by jurisdiction:\n\n- **US**: California effectively bans them. Most states allow 1–2 years with reasonable scope.\n- **UK**: 6–12 months generally enforceable if reasonable.\n- **EU**: Varies by country; often must be compensated.\n\n**For enforceability, ensure:**\n- Duration of 6–12 months (2+ years is risky)\n- Geographic scope tied to where you actually operated\n- Business scope limited to direct competition\n- Adequate compensation/consideration provided',
  service: '**Red Flags in Service Agreements:**\n\n⚠️ Unlimited liability — always cap at 1–2x contract value\n\n⚠️ Vague deliverables — "best efforts" without specs leads to disputes\n\n⚠️ Unilateral amendment rights — one party can change terms without consent\n\n⚠️ Auto-renewal with short cancellation windows\n\n⚠️ Broad IP assignment — giving away pre-existing IP unintentionally\n\n⚠️ Aggressive termination penalties (>10% is a red flag)\n\n⚠️ Missing SLAs — no defined service levels or remedies for underperformance',
  force: '**Force Majeure — What It Is & When It Applies:**\n\nA force majeure clause excuses performance when extraordinary events beyond a party\'s control make performance impossible or impractical.\n\n**Typically covered:** natural disasters, war, terrorism, government actions, pandemics (must be explicitly listed post-COVID).\n\n**Three conditions usually required:**\n1. The event must be unforeseeable at signing\n2. Performance must be impossible (not just more expensive)\n3. The affected party must give prompt notice\n\nCourts interpret these clauses narrowly — be explicit about what events qualify.',
  payment: '**Negotiating Better Payment Terms:**\n\n- **NET-60 → NET-30**: Offer a 1–2% early payment discount as incentive\n- **Milestone-based payments**: Tie payments to deliverables, not calendar dates\n- **Upfront deposits**: Request 25–30% upfront to cover initial costs\n- **Late payment interest**: Add 1.5–2% monthly interest on overdue amounts\n- **Suspend rights**: Include a right to pause services for non-payment\n- **Attorney fee clause**: Discourages late payment by making collection costs recoverable'
};

function getDemoAnswer(q) {
  const l = q.toLowerCase();
  if (l.includes('nda') || l.includes('non-disclosure')) return DEMO_ANSWERS.nda;
  if (l.includes('liabilit') || l.includes('indemnif')) return DEMO_ANSWERS.liability;
  if (l.includes('non-compete') || l.includes('compete')) return DEMO_ANSWERS.noncompete;
  if (l.includes('service') || l.includes('red flag')) return DEMO_ANSWERS.service;
  if (l.includes('force')) return DEMO_ANSWERS.force;
  if (l.includes('payment') || l.includes('negotiate')) return DEMO_ANSWERS.payment;
  return 'That\'s a great legal question! In demo mode, I can answer about: NDA clauses, liability vs indemnification, non-compete enforceability, service agreement red flags, force majeure, and payment terms.\n\nFor real AI answers, enter your **Gemini API key** above — I\'ll give detailed, personalized responses.';
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMsg(role, text, typing = false) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  const avatarSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`;
  const avatar = role === 'ai'
    ? `<div class="msg-avatar">${avatarSvg}</div>`
    : `<div class="msg-avatar"><span class="user-avatar-letter">U</span></div>`;
  if (typing) {
    div.id = 'typing-msg';
    div.innerHTML = `${avatar}<div class="msg-bubble"><div class="msg-typing"><span></span><span></span><span></span></div></div>`;
  } else {
    div.innerHTML = `${avatar}<div class="msg-bubble"><p>${formatAIText(text)}</p><div class="msg-time">${getTime()}</div></div>`;
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function clearChat() {
  chatHistory = [];
  const c = document.getElementById('chat-messages');
  c.innerHTML = `<div class="chat-msg ai"><div class="msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg></div><div class="msg-bubble"><p>Chat cleared! How can I help you with your legal questions?</p><div class="msg-time">${getTime()}</div></div></div>`;
  showToast('\uD83D\uDDD1\uFE0F Chat cleared');
}

function sendQuickPrompt(text) {
  document.getElementById('chat-input').value = text;
  sendChatMessage();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const apiKey = document.getElementById('chat-api-key').value.trim()
    || document.getElementById('api-key-input').value.trim();
  const btn = document.getElementById('btn-chat-send');
  const text = input.value.trim();
  if (!text) return;

  input.value = ''; input.style.height = 'auto';
  addMsg('user', text);
  chatHistory.push({ role: 'user', text });
  btn.disabled = true;
  addMsg('ai', '', true);

  try {
    let reply;
    if (apiKey) {
      const ctx = chatHistory.slice(-8).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n\n');
      const prompt = `You are LegalEase AI, a knowledgeable legal assistant. Provide clear, accurate, helpful information about legal concepts, contracts, and documents. Always note that responses are informational, not legal advice. Be thorough and use **bold** for key terms.\n\nConversation:\n${ctx}\n\nUser: ${text}\n\nAssistant:`;
      reply = await callGeminiAPI(apiKey, prompt);
    } else {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      reply = getDemoAnswer(text);
    }
    document.getElementById('typing-msg')?.remove();
    addMsg('ai', reply);
    chatHistory.push({ role: 'assistant', text: reply });
    if (!apiKey) showToast('\u2139\uFE0F Demo mode — add API key for real AI answers');
  } catch (err) {
    document.getElementById('typing-msg')?.remove();
    addMsg('ai', `Error: ${err.message}. Please check your API key.`);
  } finally {
    btn.disabled = false;
    input.focus();
  }
}

// Auto-resize textarea
document.getElementById('chat-input')?.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

