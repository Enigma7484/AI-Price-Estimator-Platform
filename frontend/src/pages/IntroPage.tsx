import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, BarChart3, Check, ClipboardCheck, Gauge, History, Moon, Play, ShieldCheck, Smartphone, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import type { DisplayMode } from "../types/themeTypes";
import type { DeviceQuoteForm } from "../types/quoteTypes";
import { buildDeviceQuote, formatCurrency } from "../utils/deviceQuoteEngine";
import "../styles/intro.css";

// Fictional tour fixture. Never sent to the API or persisted to quote history.
const sampleInput: DeviceQuoteForm = {
  device_model: "Sample Phone 13", storage_gb: 128, condition: "good", battery_health: 87,
  carrier_status: "unlocked", has_box: false, has_charger: true, needs_repair: false,
  battery_power: 1800, clock_speed: 2.4, ram: 4096, internal_memory: 128, mobile_weight: 165,
  n_cores: 8, primary_camera_mp: 48, front_camera_mp: 16, pixel_height: 1920, pixel_width: 1080,
  screen_height_cm: 15, screen_width_cm: 7, talk_time: 20, mobile_depth_cm: 0.8,
  bluetooth: true, dual_sim: true, four_g: true, three_g: true, touch_screen: true, wifi: true,
};
const samplePrediction = {
  predicted_price_range: 2, label: "High cost", confidence: 0.78, probabilities: {},
  model_name: "Fictional tour prediction", explanation: [], input_summary: {},
};
const features = [
  { name: "Device intake", icon: Smartphone, kicker: "01 / KNOW WHAT YOU’RE BUYING", title: "Same phone. Different story.", copy: "Storage, condition, battery health, carrier status, and repairs all matter. Capture the details at the counter and turn them into a consistent starting offer.", link: "Try the quote desk", href: "/quote" },
  { name: "Offer & explanation", icon: ClipboardCheck, kicker: "02 / MAKE THE NUMBERS MAKE SENSE", title: "An offer you can explain.", copy: "See a buy offer, resale target, gross margin, confidence, and risk together. Review the pricing factors and use the generated note to explain the quote to your customer.", link: "Create your own quote", href: "/quote" },
  { name: "Owner review", icon: History, kicker: "03 / KEEP THE DESK IN VIEW", title: "A clearer view of every quote.", copy: "Save quote decisions and review offer value, average margin, and high-risk quotes in the owner dashboard. History stays in this browser, with up to 50 saved quotes.", link: "Open owner dashboard", href: "/dashboard" },
];

function sampleQuote(repair = false) {
  return buildDeviceQuote({ ...sampleInput, needs_repair: repair }, samplePrediction);
}
function Brand() {
  return <span className="ri-brand"><span className="ri-brand-mark"><BarChart3 size={21} /></span><span>ResaleIQ<small>Trade-in quote copilot</small></span></span>;
}
function Numbers({ repair = false }: { repair?: boolean }) {
  const quote = sampleQuote(repair);
  return <div className="ri-numbers"><div><small>Buy offer</small><strong>{formatCurrency(quote.buy_offer)}</strong></div><div><small>Resale target</small><strong>{formatCurrency(quote.list_price)}</strong></div><div><small>Gross margin</small><strong>{Math.round(quote.margin_rate * 100)}%</strong></div></div>;
}

export default function IntroPage({ mode, onToggleMode }: { mode: DisplayMode; onToggleMode: () => void }) {
  const [selected, setSelected] = useState(0);
  const [repair, setRepair] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const feature = features[selected];
  const quote = sampleQuote(repair);
  function tour() {
    document.getElementById("intro-tour")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function selectTab(index: number, focus = false) {
    setSelected(index);
    if (focus) tabRefs.current[index]?.focus();
  }
  return <div className="ri-intro">
    <a className="ri-skip" href="#intro-main">Skip to content</a>
    <header className="ri-nav ri-container">
      <Link to="/intro" aria-label="ResaleIQ introduction"><Brand /></Link>
      <nav aria-label="Introduction navigation">
        <button className="ri-text ri-explore" onClick={tour}>Explore the workflow</button>
        <button className="ri-mode" onClick={onToggleMode} aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>{mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        <Link className="ri-button" to="/quote">Open quote desk <ArrowRight size={16} /></Link>
      </nav>
    </header>
    <main id="intro-main">
      <section className="ri-hero ri-container">
        <div className="ri-hero-copy">
          <p className="ri-eyebrow"><span className="ri-dot" /> FOR DEVICE RESELLERS & TRADE-IN TEAMS</p>
          <h1>Buy with clarity.<br />Resell with <em>confidence.</em></h1>
          <p className="ri-lead">A phone comes across the counter. What should you offer? ResaleIQ brings the device details, resale target, and margin into one clear quote.</p>
          <div className="ri-actions"><Link className="ri-button" to="/quote">Start a quote <ArrowRight size={18} /></Link><button className="ri-text" onClick={tour}><Play size={15} /> Try the interactive tour</button></div>
          <p className="ri-small"><ShieldCheck size={15} /> A starting point for your judgment. You make the buying decision.</p>
        </div>
        <div className="ri-scene" aria-label="Fictional device quote preview">
          <div className="ri-scene-top"><span className="ri-eyebrow">THE QUOTE DESK</span><span className="ri-pill">Fictional example · USD</span></div>
          <div className="ri-preview">
            <div className="ri-preview-heading"><span className="ri-device"><Smartphone size={32} /></span><div><small>DEVICE / 001</small><h2>Sample Phone 13</h2><p>128 GB · Good condition · Unlocked</p></div></div>
            <div className="ri-device-facts"><span>Battery health <strong>87%</strong></span><span>Repair flag <strong>None</strong></span></div>
            <Numbers />
            <div className="ri-margin"><div><span>Room for margin</span><strong>31% gross</strong></div><div className="ri-margin-track"><span /></div><p>Before operating costs. Confirm after inspection.</p></div>
            <div className="ri-preview-foot"><span><ShieldCheck size={15} /> Low risk</span><span>78% model confidence</span></div>
          </div>
          <div className="ri-scene-note"><Check size={19} /><div><strong>From device details to a buying decision.</strong><span>Offer. Resale target. Reasons you can review.</span></div></div>
        </div>
      </section>
      <div className="ri-path ri-container"><span><Smartphone size={18} /> Capture the device</span><ArrowRight size={16} /><span><Gauge size={18} /> Check the margin</span><ArrowRight size={16} /><span><History size={18} /> Keep the history</span><button className="ri-mode" onClick={tour} aria-label="Go to interactive tour"><ArrowDown size={17} /></button></div>
      <section id="intro-tour" className="ri-tour ri-container" aria-labelledby="tour-heading">
        <div className="ri-section-heading"><p className="ri-eyebrow">A WALK THROUGH THE WORKFLOW</p><h2 id="tour-heading">A better quote starts with the details.</h2><p>Try a few decisions at a fictional trade-in desk. No real quotes are created.</p></div>
        <div className="ri-tabs" role="tablist" aria-label="Workflow tour" onKeyDown={(event) => {
          const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          if (offset || event.key === "Home" || event.key === "End") {
            event.preventDefault();
            selectTab(event.key === "Home" ? 0 : event.key === "End" ? features.length - 1 : (selected + offset + features.length) % features.length, true);
          }
        }}>{features.map((item, index) => <button key={item.name} ref={(node) => { tabRefs.current[index] = node; }} id={`tour-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="tour-panel" tabIndex={selected === index ? 0 : -1} onClick={() => selectTab(index)}><item.icon size={17} />{item.name}</button>)}</div>
        <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${selected}`} tabIndex={0} className="ri-tour-panel">
          <div className="ri-feature-copy"><p className="ri-eyebrow">{feature.kicker}</p><h3>{feature.title}</h3><p>{feature.copy}</p><Link className="ri-feature-link" to={feature.href}>{feature.link}<ArrowRight size={16} /></Link></div>
          <div className="ri-demo"><div className="ri-demo-bar"><span><feature.icon size={16} />{feature.name}</span><small>Fictional demo · USD</small></div>
            <div className="ri-demo-body">
              {selected === 0 && <><h4>Sample Phone 13</h4><p className="ri-small">128 GB · Good condition · 87% battery · Unlocked</p><label className="ri-toggle"><span>Needs repair<small>Try adding a repair flag</small></span><input type="checkbox" checked={repair} onChange={(event) => setRepair(event.target.checked)} /></label><Numbers repair={repair} /><p className="ri-demo-note" role="status">{repair ? "Repair flag added: a lower resale target and a 42% margin buffer. Model confidence adjusts to 70%." : "No repair flag: a 31% margin buffer. Model confidence is 78%."}</p><p className="ri-small">Fixed sample model tier; the app’s pricing rules update these numbers.</p></>}
              {selected === 1 && <><h4>Show your reasoning.</h4><Numbers repair={repair} /><ul className="ri-factors"><li><Check size={14} />Good cosmetic condition</li><li><Check size={14} />Unlocked carrier status</li><li><Check size={14} />{repair ? "Repair flag increases margin buffer" : "No repair flag entered"}</li></ul><button className="ri-demo-action" aria-expanded={noteOpen} aria-controls="sample-note" onClick={() => setNoteOpen(!noteOpen)}>{noteOpen ? "Hide customer note" : "Preview customer note"}<ArrowRight size={15} /></button><div id="sample-note" hidden={!noteOpen} className="ri-demo-note"><small>CUSTOMER NOTE · FICTIONAL</small><p>{quote.customer_note}</p></div></>}
              {selected === 2 && <><div className="ri-review-head"><h4>Sample quote history</h4><span className="ri-pill">{saved ? 3 : 2} samples</span></div><label className="ri-filter"><input type="checkbox" checked={highRiskOnly} onChange={(event) => setHighRiskOnly(event.target.checked)} /> Show high-risk only</label><div className="ri-review-list" aria-label="Fictional quote history"><div><span>Sample Phone Mini<small>Offer $145 · Margin 36%</small></span><span className="ri-risk">High risk</span></div>{!highRiskOnly && <><div><span>Sample Phone Pro<small>Offer $420 · Margin 31%</small></span><span className="ri-pill">Low risk</span></div>{saved && <div><span>{sampleInput.device_model}<small>Offer {formatCurrency(quote.buy_offer)} · Margin {Math.round(quote.margin_rate * 100)}%</small></span><span className="ri-pill">{quote.risk_level} risk</span></div>}</>}</div><button className="ri-demo-action" onClick={() => setSaved(!saved)}>{saved ? <><Check size={16} /> Reset sample history</> : <>Add tour quote to sample history<ArrowRight size={15} /></>}</button><p className="ri-small" role="status">{saved ? `Tour quote added${highRiskOnly ? "; hidden by the high-risk filter" : ""}. Demo only; nothing saved to your browser history.` : "Sample history is temporary. Your actual saved quotes stay separate."}</p></>}
            </div>
          </div>
        </div>
      </section>
      <section className="ri-details ri-container" aria-label="Availability and limits"><div><span className="ri-eyebrow">AVAILABLE TODAY</span><h3>One desk. A visible decision trail.</h3><p>Device intake, model-assisted quotes, margin and risk checks, customer notes, and an owner dashboard. Vehicle and property estimators are also available in the workspace.</p><p className="ri-detail-caption">Live predictions need the backend and trained models. Quote history is local to this browser, not shared across a team.</p><div className="ri-detail-links"><Link to="/estimators/car">Vehicle estimator <ArrowRight size={14} /></Link><Link to="/estimators/housing">Property estimator <ArrowRight size={14} /></Link></div></div><div><span className="ri-eyebrow ri-muted">ON THE ROADMAP</span><h3>More depth, as the product grows.</h3><p>Laptop valuation and a dedicated used-phone resale model are planned. Today’s device quotes combine a hardware-based price tier with condition and margin rules.</p><p className="ri-detail-caption">These planned estimators are not available yet. Quotes are recommendations, not live market appraisals or guaranteed resale prices.</p></div></section>
      <section className="ri-final"><div className="ri-container"><p className="ri-eyebrow">YOUR NEXT DEVICE. A CLEARER DECISION.</p><h2>Put a little more clarity<br />behind your next offer.</h2><p>Start with the device in front of you.</p><Link className="ri-button" to="/quote">Open the quote desk<ArrowRight size={18} /></Link><small>No sign-in required in this version.</small></div></section>
    </main>
    <footer className="ri-footer ri-container"><Link to="/intro"><Brand /></Link><p>Better context. More consistent offers.</p><nav aria-label="Footer navigation"><Link to="/">Workspace</Link><Link to="/dashboard">Dashboard</Link><Link to="/settings">Settings</Link></nav></footer>
  </div>;
}
