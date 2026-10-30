import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, X } from 'lucide-react';
import { serviceRequirementRegistry } from './data/serviceRequirements';
import { openWhatsApp, whatsappUrl } from './utils/whatsapp';

const steps = ['Your details', 'Service details', 'Review & send'];
export const isValidIndianMobile = (value) => {
  const digits = value.replace(/\D/g, '');
  const local = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local);
};
const secretPattern = /(?:\b[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}\b|\b[A-Z]{5}\d{4}[A-Z]\b|\b(?:\d[ -]?){9,18}\d\b|\b(?:otp|one[- ]time password)\s*[:#=-]?\s*\d{4,8}\b|\b(?:password|passcode|upi pin|atm pin|cvv)\s*[:#=-]\s*\S+)/i;
export const containsSensitiveInput = (value) => secretPattern.test(value);

export function buildServiceEnquiryMessage(config, contact, answers, documents, notes) {
  const lines = [
    'PrimeServe — Service Assistance Enquiry',
    `Service: ${config.name}`,
    `Category: ${config.category}`,
    `Name: ${contact.name.trim()}`,
    `WhatsApp / mobile: ${contact.mobile.trim()}`,
    contact.email.trim() ? `Email: ${contact.email.trim()}` : '',
    contact.language ? `Preferred language: ${contact.language}` : '',
    '', 'Service details:',
    ...config.questions.filter((item) => !item.showWhen || answers[item.showWhen.id] === item.showWhen.value).map((item) => `${item.label}: ${answers[item.id] || 'Not provided'}`),
    '', 'Document readiness (availability only):',
    ...config.documents.map((item) => `${item.name} [${item.status}]: ${documents[item.id] || 'Not provided'}`),
    notes.trim() ? `\nAdditional notes: ${notes.trim()}` : '',
    '', 'This is an initial enquiry, not an official application.',
  ].filter(Boolean);
  return lines.join('\n');
}

export function ServiceEnquiry({ service, onClose }) {
  const config = useMemo(() => serviceRequirementRegistry.find((item) => item.categoryId === service?.category?.id && item.name === service?.name), [service]);
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ name: '', mobile: '', email: '', language: '' });
  const [answers, setAnswers] = useState({});
  const [documents, setDocuments] = useState({});
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [messageReady, setMessageReady] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const firstField = useRef(null);
  const dialog = useRef(null);
  const preparedMessage = useMemo(() => config ? buildServiceEnquiryMessage(config, contact, answers, documents, notes) : '', [config, contact, answers, documents, notes]);
  const genericWhatsAppMessage = 'Hello PrimeServe, I have prepared a service enquiry. I will review and paste the details here if I choose to send them.';
  const messageUrl = whatsappUrl(genericWhatsAppMessage);

  useEffect(() => {
    document.body.classList.add('service-enquiry-open');
    firstField.current?.focus();
    return () => document.body.classList.remove('service-enquiry-open');
  }, []);

  if (!config) return null;

  const updateContact = (key, value) => {
    const mobileLooksValid = key === 'mobile' && isValidIndianMobile(value);
    if (!mobileLooksValid && secretPattern.test(value)) { setErrors((current) => ({ ...current, [key]: 'Please remove sensitive numbers or credentials. PrimeServe will confirm what is needed later.' })); return; }
    setErrors((current) => ({ ...current, [key]: '' }));
    setContact((current) => ({ ...current, [key]: value }));
  };
  const updateAnswer = (key, value) => {
    if (secretPattern.test(value)) { setErrors((current) => ({ ...current, [key]: 'This field cannot contain account numbers, identity numbers, OTPs, PINs, or passwords.' })); return; }
    setErrors((current) => ({ ...current, [key]: '' }));
    setAnswers((current) => ({ ...current, [key]: value }));
  };
  const validateStep = () => {
    const next = {};
    for (const [field, message] of Object.entries(errors)) {
      const fieldBelongsToStep = step === 0 ? ['name', 'mobile', 'email'].includes(field) : step === 1 ? config.questions.some((item) => item.id === field) || field === 'notes' : field === 'consent';
      if (message && fieldBelongsToStep) next[field] = message;
    }
    if (step === 0) {
      if (contact.name.trim().length < 2 || contact.name.trim().length > 80) next.name = 'Enter your name (2–80 characters).';
      if (!isValidIndianMobile(contact.mobile)) next.mobile = 'Enter a valid 10-digit Indian mobile number.';
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) next.email = 'Enter a valid email address or leave it blank.';
    }
    if (step === 1) {
      const firstQuestion = config.questions[0];
      if (firstQuestion?.required && !answers[firstQuestion.id]) next[firstQuestion.id] = 'Please choose an answer to continue.';
    }
    if (step === 2 && !consent) next.consent = 'Please confirm consent before opening WhatsApp.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const goNext = () => { if (validateStep()) { setStep((current) => Math.min(2, current + 1)); setErrors({}); window.setTimeout(() => firstField.current?.focus(), 0); } };
  const goBack = () => { setStep((current) => Math.max(0, current - 1)); setErrors({}); window.setTimeout(() => firstField.current?.focus(), 0); };
  const copyEnquiry = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(preparedMessage);
      else { const area = document.getElementById('service-enquiry-copy'); area?.select(); if (!document.execCommand('copy')) throw new Error('copy failed'); }
      setCopyStatus('Enquiry copied. You can paste it into the WhatsApp chat.');
    } catch { setCopyStatus('Copy was unavailable. Select and copy the enquiry text below.'); }
  };
  const submit = () => {
    if (!validateStep()) return;
    if (!messageUrl) { setErrors({ consent: 'WhatsApp is not configured. Please use the Contact page to reach PrimeServe.' }); return; }
    openWhatsApp(genericWhatsAppMessage);
    setMessageReady(true);
  };
  const onDialogKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key === 'Tab') {
      const focusable = [...(dialog.current?.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]') ?? [])].filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };

  const renderQuestion = (item, index) => {
    if (item.showWhen && answers[item.showWhen.id] !== item.showWhen.value) return null;
    const fieldId = `service-enquiry-${item.id}`;
    return <label className="enquiry-field" key={item.id} htmlFor={fieldId}>{item.label}{item.required && ' *'}
      {item.options ? <select ref={index === 0 ? firstField : undefined} id={fieldId} required={item.required} value={answers[item.id] ?? ''} onChange={(event) => updateAnswer(item.id, event.target.value)} aria-invalid={!!errors[item.id]}><option value="">Choose an option</option>{item.options.map((option) => <option key={option}>{option}</option>)}</select> : item.id === 'projectBrief' ? <textarea ref={index === 0 ? firstField : undefined} id={fieldId} required={item.required} maxLength={500} rows={3} value={answers[item.id] ?? ''} onChange={(event) => updateAnswer(item.id, event.target.value)} aria-invalid={!!errors[item.id]} placeholder="A short overview is enough."/> : <input ref={index === 0 ? firstField : undefined} id={fieldId} required={item.required} maxLength={item.id === 'businessName' || item.id === 'applicantName' ? 100 : 160} value={answers[item.id] ?? ''} onChange={(event) => updateAnswer(item.id, event.target.value)} aria-invalid={!!errors[item.id]} />}
      {item.hint && <small>{item.hint}</small>}{errors[item.id] && <small className="error" role="alert">{errors[item.id]}</small>}
    </label>;
  };

  return <div className="service-enquiry-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="service-enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="service-enquiry-title" ref={dialog} onKeyDown={onDialogKeyDown}>
    <header className="service-enquiry-header"><div><span className="eyebrow">SERVICE ENQUIRY</span><h2 id="service-enquiry-title">{messageReady ? 'Your enquiry is prepared' : 'Get assistance'}</h2></div><button type="button" className="service-enquiry-close" aria-label="Close enquiry" onClick={onClose}><X size={20}/></button></header>
    <div className="service-enquiry-selected"><b>{config.name}</b><span>{config.category}</span><p>{config.description}</p></div>
    {messageReady ? <div className="service-enquiry-success" role="status"><Check size={20}/><div><b>WhatsApp was opened or requested in a new tab.</b><p>Your enquiry is not sent until you review it and press Send in WhatsApp. If the tab did not open, copy the enquiry below and paste it into your WhatsApp chat.</p></div></div> : <>
      <nav className="enquiry-progress" aria-label="Enquiry steps">{steps.map((title, index) => <div key={title} className={index === step ? 'current' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}><span>{index < step ? <Check size={13}/> : index + 1}</span><small>{title}</small></div>)}</nav>
      {step === 0 && <div className="enquiry-step"><h3>Your contact details</h3><p>These details stay in this page. They are not placed in a website or WhatsApp URL. You will review and copy the prepared enquiry before choosing what to share.</p><div className="enquiry-form-grid">
        <label className="enquiry-field">Full name *<input ref={firstField} required autoComplete="name" maxLength={80} value={contact.name} onChange={(event) => updateContact('name', event.target.value)} aria-invalid={!!errors.name}/>{errors.name && <small role="alert" className="error">{errors.name}</small>}</label>
        <label className="enquiry-field">WhatsApp / mobile number *<input required type="tel" autoComplete="tel" inputMode="tel" maxLength={16} placeholder="+91 98765 43210" value={contact.mobile} onChange={(event) => updateContact('mobile', event.target.value)} aria-invalid={!!errors.mobile}/>{errors.mobile && <small role="alert" className="error">{errors.mobile}</small>}</label>
        <label className="enquiry-field">Email address (optional)<input type="email" autoComplete="email" maxLength={120} value={contact.email} onChange={(event) => updateContact('email', event.target.value)} aria-invalid={!!errors.email}/>{errors.email && <small role="alert" className="error">{errors.email}</small>}</label>
        <label className="enquiry-field">Preferred language (optional)<select value={contact.language} onChange={(event) => setContact((current) => ({ ...current, language: event.target.value }))}><option value="">No preference</option><option>English</option><option>বাংলা</option><option>हिन्दी</option><option>Other</option></select></label>
      </div><p className="enquiry-safety">Never share an OTP, password, UPI / ATM PIN, card security code, full Aadhaar or PAN number, or document scan here.</p></div>}
      {step === 1 && <div className="enquiry-step"><h3>About this service</h3><p>{config.serviceType}. Answer only what you know; PrimeServe can confirm details with you.</p><div className="enquiry-form-grid">{config.questions.map(renderQuestion)}</div>
        <section className="enquiry-documents"><h4>Document readiness</h4><p>These are preparation prompts, not a request to send documents. Status is not preselected.</p>{config.documents.length ? config.documents.map((item) => <div className="enquiry-document" key={item.id}><div><b>{item.name}</b><span className={`requirement-badge ${item.status}`}>{item.status === 'conditional' ? 'Conditional' : item.status}</span><small>{item.note}</small></div><label htmlFor={`doc-${item.id}`} className="visually-hidden">Readiness for {item.name}</label><select id={`doc-${item.id}`} value={documents[item.id] ?? ''} onChange={(event) => setDocuments((current) => ({ ...current, [item.id]: event.target.value }))}><option value="">Choose status</option><option>Available</option><option>Not available</option><option>Need help</option><option>Not applicable</option></select></div>) : <p className="enquiry-manual">{config.documentNote || 'No document checklist has been confirmed for this service. PrimeServe will confirm whether anything is needed after reviewing your request.'}</p>}</section>
        <label className="enquiry-field">Anything else you would like PrimeServe to know? (optional)<textarea maxLength={500} rows={3} value={notes} onChange={(event) => { if (secretPattern.test(event.target.value)) { setErrors((current) => ({ ...current, notes: 'Please remove sensitive numbers or credentials.' })); return; } setErrors((current) => ({ ...current, notes: '' })); setNotes(event.target.value); }} placeholder="Up to 500 characters." aria-invalid={!!errors.notes}/><small>{notes.length}/500 characters. Do not include passwords, OTPs, or identity numbers.</small>{errors.notes && <small className="error" role="alert">{errors.notes}</small>}</label>
        <aside className="enquiry-verification"><b>{config.verificationStatus === 'needs manual verification by PrimeServe' ? 'Requirements need manual confirmation' : 'Source reviewed; case-specific confirmation still required'}</b><p>Requirements may vary depending on applicant eligibility, application type and current government rules. PrimeServe will confirm the applicable checklist before proceeding.</p>{config.instructions.slice(2).map((instruction) => <p className="enquiry-specific-note" key={instruction}>{instruction}</p>)}{config.officialReferences.length > 0 && <div><span>Requirements and official information:</span>{config.officialReferences.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={12}/></a>)}</div>}</aside>
      </div>}
      {step === 2 && <div className="enquiry-step"><h3>Review your enquiry</h3><p>Check the information below before preparing a WhatsApp message.</p><dl className="enquiry-review"><div><dt>Customer</dt><dd>{contact.name} · {contact.mobile}{contact.email && ` · ${contact.email}`}</dd></div>{config.questions.filter((item) => !item.showWhen || answers[item.showWhen.id] === item.showWhen.value).filter((item) => answers[item.id]).map((item) => <div key={item.id}><dt>{item.label}</dt><dd>{answers[item.id]}</dd></div>)}{config.documents.filter((item) => documents[item.id]).map((item) => <div key={item.id}><dt>{item.name} readiness</dt><dd>{documents[item.id]}</dd></div>)}{notes && <div><dt>Additional notes</dt><dd>{notes}</dd></div>}</dl>
        <label className="enquiry-consent"><input ref={firstField} required type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setErrors((current) => ({ ...current, consent: '' })); }} aria-invalid={!!errors.consent}/><span>I confirm that the information I provided is accurate to the best of my knowledge. I understand this is an initial enquiry for assistance by PrimeServe, not an official government application. I agree to share these details with PrimeServe when I choose to send the prepared message using WhatsApp.</span></label>{errors.consent && <small role="alert" className="error">{errors.consent}</small>}
      </div>}
      <div className="service-enquiry-actions">{step > 0 && <button type="button" className="btn outline" onClick={goBack}><ArrowLeft size={16}/> Back</button>}{step < 2 ? <button type="button" className="btn blue" onClick={goNext}>Next <ArrowRight size={16}/></button> : <button type="button" className="btn blue" onClick={submit}>Prepare enquiry &amp; open WhatsApp <ArrowRight size={16}/></button>}</div>
    </>}
    {messageReady && <div className="service-enquiry-message"><p>A WhatsApp link was requested with a generic note only. No customer answers or contact details were placed in the WhatsApp URL. If your browser blocked the new tab, copy the enquiry below and paste it into WhatsApp if you choose to share it.</p><label htmlFor="service-enquiry-copy">Prepared message</label><textarea id="service-enquiry-copy" readOnly rows={Math.min(12, Math.max(6, preparedMessage.split('\n').length))} value={preparedMessage} onFocus={(event) => event.target.select()}/><div className="actions"><button type="button" className="btn outline" onClick={copyEnquiry}><Copy size={15}/> Copy enquiry</button><button type="button" className="btn blue" onClick={() => openWhatsApp(genericWhatsAppMessage)}>Open WhatsApp again</button></div>{copyStatus && <p role="status">{copyStatus}</p>}</div>}
    <p className="service-enquiry-footer">Nothing is saved on this website. Closing this form clears its answers. WhatsApp is opened only when requested; the enquiry is sent only if you paste and send it there.</p>
  </section></div>;
}
