'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  CircleCheck,
  Download,
  ExternalLink,
  Globe2,
  Headphones,
  Laptop,
  Menu,
  MessageSquareText,
  PackageCheck,
  Play,
  Printer,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  TabletSmartphone,
  Users,
  X,
  Zap,
} from 'lucide-react';

const features = [
  { icon: Store, title: 'Point of sale', text: 'Move every sale from shelf to receipt with a fast, reliable checkout built for pharmacy teams.' },
  { icon: Boxes, title: 'Inventory intelligence', text: 'Know what is in stock, what is moving, and what needs attention before it becomes a problem.' },
  { icon: PackageCheck, title: 'Batch & expiry control', text: 'Track every batch with confidence and protect your margins with proactive expiry visibility.' },
  { icon: Users, title: 'Team-ready access', text: 'Give every team member the right access, with clear roles and accountability built in.' },
  { icon: Printer, title: 'Hardware connected', text: 'Keep printers, scanners, and your everyday pharmacy setup working in rhythm.' },
  { icon: MessageSquareText, title: 'Ask AI', text: 'Ask Pharma 360 to find, update, edit, or action the work that keeps your day moving.' },
];

const plans = [
  { name: 'Basic', eyebrow: 'For focused stores', description: 'A dependable offline system for one pharmacy and 3–5 computers.', platforms: 'Offline desktop', features: ['Single-store operations', 'Sales & inventory', 'Batch tracking', 'Printer connectivity'], featured: false },
  { name: 'Pro', eyebrow: 'The complete core', description: 'Every essential workspace, available wherever your team needs it.', platforms: 'Web · Desktop · Mobile', features: ['Everything in Basic', 'Web and desktop apps', 'iOS & Android apps', 'Multi-user permissions', 'Advanced reports'], featured: true },
  { name: 'Advanced', eyebrow: 'Built for ambition', description: 'The full Pharma 360 ecosystem with intelligence and growth tools.', platforms: 'Everything, connected', features: ['Everything in Pro', 'Ask AI assistant', 'Pharmacy website builder', 'Multi-location readiness', 'Priority support'], featured: false },
];

const testimonials = [
  { quote: 'Pharma 360 gives our team one clear view of the store. We spend less time searching and more time caring for customers.', person: 'Aisha Rahman', role: 'Operations lead, CarePoint Pharmacy', image: 'https://images.pexels.com/photos/19471013/pexels-photo-19471013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { quote: 'The simple things matter: a faster checkout, cleaner stock data, and a system our whole team can actually use.', person: 'Daniel Okafor', role: 'Founder, WellSpring Health', image: 'https://images.pexels.com/photos/6129499/pexels-photo-6129499.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { quote: 'It feels like the way pharmacy software should have worked from the start — calm, connected, and ready for growth.', person: 'Maya Thompson', role: 'Director, Northline Pharmacy', image: 'https://images.pexels.com/photos/15114245/pexels-photo-15114245.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

const downloads = {
  Windows: { label: 'Windows 10 / 11', size: '86 MB', version: 'v2.4.1' },
  macOS: { label: 'macOS 12 or later', size: '94 MB', version: 'v2.4.1' },
  Linux: { label: 'Ubuntu 20.04+', size: '88 MB', version: 'v2.4.1' },
};

type DownloadTab = keyof typeof downloads;

type Testimonial = (typeof testimonials)[number];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadTab, setDownloadTab] = useState<DownloadTab>('Windows');
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9f9] text-[#0b1f1d]">
      <header className="site-header">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Pharma 360 home">
          <img src="/logo.png" alt="" />
          <span>PHARMA <strong>360</strong></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#platform" onClick={closeMenu}>Platform</a>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#plans" onClick={closeMenu}>Plans</a>
          <a href="#downloads" onClick={closeMenu}>Downloads</a>
          <a href="#stories" onClick={closeMenu}>Stories</a>
          <a className="nav-login" href="#contact" onClick={closeMenu}>Log in <ExternalLink size={14} /></a>
          <a className="button button-small" href="#contact" onClick={closeMenu}>Book a demo <ArrowRight size={15} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> PHARMACY MANAGEMENT, REFINED</div>
            <h1>Make every part of your pharmacy <em>work better.</em></h1>
            <p className="hero-lead">Pharma 360 brings sales, stock, people, and possibilities into one calm, connected platform built for modern pharmacy teams.</p>
            <div className="hero-actions">
              <a className="button" href="#contact">Book a personal demo <ArrowRight size={17} /></a>
              <a className="text-link" href="#platform">Explore the platform <ArrowRight size={16} /></a>
            </div>
            <div className="hero-proof"><div className="avatar-stack"><span>AR</span><span>DO</span><span>MT</span></div><span>Designed around how pharmacies actually work</span></div>
          </div>
          <div className="hero-visual" aria-label="Pharma 360 dashboard preview">
            <div className="hero-glow" />
            <div className="dashboard-window">
              <div className="dash-sidebar">
                <div className="dash-mark"><span>+</span><strong>PHARMA <b>360</b></strong></div>
                <div className="dash-nav active">Overview</div><div className="dash-nav">Sales</div><div className="dash-nav">Inventory</div><div className="dash-nav">Patients</div><div className="dash-nav">Reports</div>
                <div className="dash-bottom"><CircleCheck size={14} /> All systems healthy</div>
              </div>
              <div className="dash-content">
                <div className="dash-top"><div><small>Tuesday, 24 September</small><h3>Good morning, Aisha</h3></div><div className="dash-user">AR</div></div>
                <div className="dash-metrics"><div><span>Total sales</span><strong>$24,680</strong><small className="positive">↑ 12.8% this month</small></div><div><span>Items in stock</span><strong>8,429</strong><small>Across 4 categories</small></div><div><span>Low stock alerts</span><strong>24</strong><small className="gold-text">Needs attention</small></div></div>
                <div className="dash-chart"><div className="chart-heading"><div><span>Revenue overview</span><strong>$84,260</strong></div><span className="chart-period">Last 7 days <ChevronDown size={13} /></span></div><div className="chart-bars"><i style={{ height: '42%' }} /><i style={{ height: '58%' }} /><i style={{ height: '48%' }} /><i style={{ height: '76%' }} /><i style={{ height: '64%' }} /><i style={{ height: '91%' }} /><i className="chart-highlight" style={{ height: '70%' }} /></div><div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
                <div className="dash-bottom-grid"><div><span>Top selling category</span><strong>Wellness & vitamins <b>+18%</b></strong></div><div><span>Team activity</span><strong>142 actions today <b>View log</b></strong></div></div>
              </div>
            </div>
            <div className="ai-float"><div className="ai-icon"><Sparkles size={16} /></div><div><strong>Ask AI</strong><span>How can I help today?</span></div><ArrowRight size={16} /></div>
            <div className="visual-tag visual-tag-one"><span className="tag-icon"><Zap size={15} /></span><div><strong>Live insights</strong><span>Always one step ahead</span></div></div>
            <div className="visual-tag visual-tag-two"><span className="tag-icon"><ShieldCheck size={15} /></span><div><strong>Secure by design</strong><span>Your data stays protected</span></div></div>
          </div>
        </section>

        <section className="trust-strip"><div className="section-shell trust-inner"><span>One platform for the moments that matter</span><div><span><CircleCheck size={15} /> Sales</span><span><CircleCheck size={15} /> Inventory</span><span><CircleCheck size={15} /> Team</span><span><CircleCheck size={15} /> Growth</span></div></div></section>

        <section className="section-shell platform-section" id="platform">
          <div className="section-intro"><div className="eyebrow">ONE CONNECTED WORKSPACE</div><h2>Everything your pharmacy needs, <em>in sync.</em></h2><p>From the counter to the back office, Pharma 360 keeps your whole operation moving with clarity.</p></div>
          <div className="platform-grid"><div className="platform-card platform-card-dark"><div className="card-kicker">01 / OPERATIONS</div><h3>A better view of your everyday.</h3><p>Turn the busy parts of pharmacy into a simple, repeatable rhythm your team can trust.</p><a className="card-link" href="#features">See what is included <ArrowRight size={16} /></a><div className="mini-orbit"><img src="/logo.png" alt="" /></div></div><div className="platform-card platform-card-light"><div className="card-kicker">02 / ECOSYSTEM</div><h3>One system. Every screen.</h3><div className="device-row"><div className="device desktop"><Laptop size={22} /><span>Desktop</span></div><div className="device tablet"><TabletSmartphone size={22} /><span>Mobile</span></div><div className="device web"><Globe2 size={22} /><span>Web</span></div></div><p>Work where your business takes you — in-store, on the go, or from anywhere.</p></div></div>
        </section>

        <section className="features-section" id="features"><div className="section-shell"><div className="section-intro centered"><div className="eyebrow">BUILT FOR PHARMACY</div><h2>Powerful enough for today.<br /><em>Ready for tomorrow.</em></h2><p>Every feature has a job: helping your team care for customers, run a sharper store, and grow with confidence.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><div className="feature-icon"><Icon size={20} /></div><h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Learn more about ${title}`}><ArrowRight size={17} /></a></article>)}</div><div className="ai-callout"><div className="ai-callout-copy"><div className="eyebrow">THE INTELLIGENT LAYER</div><h3>Your best pharmacy teammate is always one question away.</h3><p>Ask AI can help your team find answers, update records, edit details, and take action without breaking focus.</p><a className="button button-light" href="#contact">Discover Ask AI <ArrowRight size={16} /></a></div><div className="ai-chat"><div className="chat-top"><span className="ai-icon"><Sparkles size={15} /></span><strong>Ask AI</strong><span className="online-dot" /> <small>Online</small></div><div className="chat-question">Which products are low in stock this week?</div><div className="chat-answer"><span className="ai-icon"><Sparkles size={13} /></span><div>There are <strong>24 products</strong> below your threshold. I’ve grouped them by supplier and urgency.<div className="chat-action">View low-stock report <ArrowRight size={13} /></div></div></div><div className="chat-input">Ask anything about your pharmacy <Send size={14} /></div></div></div></div></section>

        <section className="plans-section section-shell" id="plans"><div className="section-intro centered"><div className="eyebrow">PLANS FOR EVERY STAGE</div><h2>Start where you are.<br /><em>Grow when ready.</em></h2><p>Simple options for independent pharmacies and ambitious teams. Pricing is coming soon.</p></div><div className="plan-grid">{plans.map((plan) => <article className={`plan-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>{plan.featured && <div className="featured-label">MOST POPULAR</div>}<div className="plan-top"><div><div className="plan-eyebrow">{plan.eyebrow}</div><h3>{plan.name}</h3></div><span className="coming-pill">Coming soon</span></div><p>{plan.description}</p><div className="platform-pill">{plan.platforms}</div><ul>{plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}</ul><a className={plan.featured ? 'button' : 'button button-outline'} href="#contact">Talk to our team <ArrowRight size={15} /></a></article>)}</div></section>

        <section className="stories-section" id="stories"><div className="section-shell"><div className="stories-heading"><div><div className="eyebrow">FROM THE PEOPLE USING IT</div><h2>Good technology should feel <em>human.</em></h2></div><p>Hear how pharmacy teams are creating calmer days and stronger businesses with Pharma 360.</p></div><div className="testimonial-grid">{testimonials.map((testimonial, index) => <button className={`testimonial-card testimonial-${index + 1}`} key={testimonial.person} onClick={() => setActiveTestimonial(testimonial)}><img src={testimonial.image} alt="" /><span className="testimonial-shade" /><span className="play-button"><Play size={17} fill="currentColor" /></span><span className="video-label">Watch story <ArrowRight size={14} /></span><span className="testimonial-info"><strong>{testimonial.person}</strong><small>{testimonial.role}</small></span></button>)}</div></div></section>

        <section className="downloads-section section-shell" id="downloads"><div className="download-copy"><div className="eyebrow">READY WHEN YOU ARE</div><h2>Take your pharmacy<br /><em>wherever it goes.</em></h2><p>Use Pharma 360 on the desktop at your counter, from the web at home, or on mobile between the moments that matter.</p><a className="text-link" href="#contact">Need help choosing? Talk to us <ArrowRight size={16} /></a></div><div className="download-panel"><div className="download-tabs">{(Object.keys(downloads) as DownloadTab[]).map((tab) => <button className={downloadTab === tab ? 'active' : ''} onClick={() => setDownloadTab(tab)} key={tab}>{tab}</button>)}</div><div className="download-detail"><div className="download-icon"><Laptop size={27} /></div><div><h3>Pharma 360 for {downloadTab}</h3><p>{downloads[downloadTab].label} · {downloads[downloadTab].size} · {downloads[downloadTab].version}</p></div><button className="icon-button" aria-label={`Download for ${downloadTab}`}><Download size={18} /></button></div><div className="download-divider" /><div className="mobile-download"><div className="phone-icon"><TabletSmartphone size={23} /></div><div><h3>Get the mobile app</h3><p>iOS and Android, in your pocket.</p><div className="store-links"><span>App Store</span><span>Google Play</span></div></div><div className="fake-qr" aria-label="QR code placeholder"><QrCode size={38} /></div></div><div className="download-note"><CircleCheck size={14} /> Secure downloads. Always up to date.</div></div></section>

        <section className="contact-section" id="contact"><div className="section-shell contact-grid"><div className="contact-copy"><div className="eyebrow">LET’S BUILD A BETTER PHARMACY</div><h2>See what Pharma 360 could do for <em>your team.</em></h2><p>Tell us a little about your pharmacy and we’ll arrange a personal walkthrough with one of our product specialists.</p><div className="contact-points"><span><Headphones size={17} /> Personal product walkthrough</span><span><CircleCheck size={17} /> No pressure, just clarity</span><span><Globe2 size={17} /> Built for teams everywhere</span></div></div><div className="contact-card">{submitted ? <div className="success-state"><div className="success-icon"><Check size={26} /></div><div className="eyebrow">REQUEST RECEIVED</div><h3>We’ll be in touch shortly.</h3><p>Thank you for your interest in Pharma 360. A member of our team will follow up to arrange your personal demo.</p><button className="button button-outline" onClick={() => setSubmitted(false)}>Send another request</button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><h3>Book your demo</h3><span>Usually takes 2 minutes</span></div><div className="form-row"><label>Full name<input required placeholder="Your name" /></label><label>Work email<input required type="email" placeholder="you@pharmacy.com" /></label></div><label>Pharmacy or company<input required placeholder="Your pharmacy name" /></label><label>What are you looking for?<select defaultValue=""><option value="" disabled>Select an option</option><option>Book a product demo</option><option>Explore a plan</option><option>Ask a question</option></select></label><label>Anything else we should know? <span className="optional">Optional</span><textarea placeholder="Tell us about your team or goals" rows={3} /></label><button className="button form-submit" type="submit">Request my demo <ArrowRight size={16} /></button><small className="form-privacy">By submitting, you agree to be contacted about Pharma 360.</small></form>}</div></div></section>
      </main>

      <footer className="footer"><div className="section-shell footer-top"><div className="footer-brand"><a className="brand" href="#top"><img src="/logo.png" alt="" /><span>PHARMA <strong>360</strong></span></a><p>Smarter pharmacy operations.<br />A healthier tomorrow.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#platform">Platform</a><a href="#features">Features</a><a href="#plans">Plans</a></div><div><strong>Resources</strong><a href="#downloads">Downloads</a><a href="#stories">Customer stories</a><a href="#contact">Contact</a></div><div><strong>Company</strong><a href="#contact">Log in <ExternalLink size={12} /></a><a href="#contact">Privacy</a><a href="#contact">Terms</a></div></div></div><div className="section-shell footer-bottom"><span>© 2026 Pharma 360. All rights reserved.</span><span>Trusted. Complete. Refined.</span></div></footer>

      {activeTestimonial && <div className="modal-backdrop" onClick={() => setActiveTestimonial(null)}><div className="testimonial-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setActiveTestimonial(null)} aria-label="Close testimonial"><X size={20} /></button><div className="modal-image"><img src={activeTestimonial.image} alt="" /><div className="modal-play"><Play size={24} fill="currentColor" /></div></div><div className="modal-content"><div className="eyebrow">CUSTOMER STORY</div><blockquote>“{activeTestimonial.quote}”</blockquote><strong>{activeTestimonial.person}</strong><span>{activeTestimonial.role}</span><p className="video-coming">Video testimonial coming soon</p></div></div></div>}
    </div>
  );
}

export default App;
