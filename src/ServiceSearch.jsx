import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { serviceCategories, serviceCount } from './data/services';

const aliases = {
  pan: ['permanent account number'],
  tax: ['income tax', 'itr', 'gst', 'tax return', 'e-filing'],
  job: ['employment', 'recruitment', 'resume', 'cv'],
  jobs: ['employment', 'recruitment', 'resume', 'cv'],
  employment: ['job', 'recruitment'],
  website: ['web', 'ui/ux', 'landing page', 'development'],
  web: ['website', 'ui/ux', 'landing page'],
  development: ['website development', 'custom website'],
  form: ['application', 'registration'],
  forms: ['application', 'registration'],
  government: ['govt', 'scheme', 'certificate'],
  bill: ['payment', 'utility', 'recharge'],
  bills: ['payment', 'utility', 'recharge'],
  document: ['pdf', 'certificate', 'record'],
  documents: ['pdf', 'certificate', 'record'],
  wb: ['west bengal'],
};

const normalize = (text) => text.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export const searchableServices = serviceCategories.flatMap((category) => [
  ...category.services.map((name) => ({ name, category, group: category.title, context: category.description })),
  ...(category.subsections ?? []).flatMap((subsection) => subsection.services.map((name) => ({ name, category, group: subsection.title, context: `${subsection.description} ${category.description}` }))),
]);

export function searchCatalogue(query) {
  const normalized = normalize(query);
  if (!normalized) return [];
  const tokens = normalized.split(' ');
  const matchedCategories = new Set(serviceCategories.filter((category) => {
    const haystack = normalize(`${category.title} ${category.description}`);
    return tokens.every((token) => {
      const variants = [token, ...(token.length > 3 && token.endsWith('s') ? [token.slice(0, -1)] : []), ...(aliases[token] ?? []).map(normalize)];
      return variants.some((term) => haystack.includes(term));
    });
  }));

  return searchableServices.map((item) => {
    const haystack = normalize(`${item.name} ${item.group} ${item.category.title} ${item.context}`);
    const matched = tokens.every((token) => {
      const terms = [token, ...(token.length > 3 && token.endsWith('s') ? [token.slice(0, -1)] : []), ...(aliases[token] ?? []).map(normalize)];
      return terms.some((term) => haystack.includes(term));
    });
    return { ...item, matched: matched || matchedCategories.has(item.category) };
  }).filter((item) => item.matched);
}

const suggestions = ['PAN Card', 'Government Forms', 'Job Applications', 'Income Tax', 'Website Design', 'Electricity Bill'];

export function ServiceSearch({ value, onChange, compact = false, onSelect }) {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = useMemo(() => searchCatalogue(value), [value]);
  const showPanel = focused;
  const setQuery = (next) => { onChange(next); setActiveIndex(-1); };
  const resultHref = (item) => `/services#service-category-${item.category.id}`;
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') { setQuery(''); setFocused(false); }
    if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setActiveIndex((current) => (current + 1) % Math.min(results.length, 8)); }
    if (event.key === 'ArrowUp' && results.length) { event.preventDefault(); setActiveIndex((current) => current <= 0 ? Math.min(results.length, 8) - 1 : current - 1); }
    if (event.key === 'Enter' && results.length) {
      event.preventDefault();
      const selected = results[activeIndex >= 0 ? activeIndex : 0];
      if (onSelect) onSelect(selected); else window.location.assign(resultHref(selected));
    }
  };

  return <div className={`service-search-wrap${compact ? ' compact' : ''}`}>
    <div className="service-search">
      <Search size={19} aria-hidden="true" />
      <label className="visually-hidden" htmlFor={compact ? 'home-service-search' : 'catalogue-service-search'}>Search the PrimeServe service catalogue</label>
      <input id={compact ? 'home-service-search' : 'catalogue-service-search'} type="search" value={value} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 140)} onKeyDown={handleKeyDown} placeholder="Search for a service... e.g. PAN Card, Job Application" aria-label="Search services" aria-controls="service-search-results" aria-expanded={showPanel && !!value.trim()} aria-autocomplete="list" aria-activedescendant={activeIndex>=0?`service-search-option-${activeIndex}`:undefined} />
      {value && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={17}/></button>}
    </div>
    {showPanel && <div className="service-search-panel" id="service-search-results">
      {value.trim() ? results.length ? <>
        <p className="service-search-count">{results.length} matching services</p>
        <ul role="listbox" aria-label="Matching services">{results.slice(0, 8).map((item, index) => <li id={`service-search-option-${index}`} key={`${item.category.id}-${item.group}-${item.name}`} role="option" aria-selected={activeIndex === index} onMouseDown={(event) => event.preventDefault()} onClick={() => { onSelect ? onSelect(item) : window.location.assign(resultHref(item)); }}><span><b>{item.name}</b><small>{item.group}</small><small className="service-search-description">{item.context}</small><small className="service-search-cta">Get Assistance →</small></span><ArrowRight size={15} aria-hidden="true"/></li>)}</ul>
        {results.length > 8 && (compact ? <a className="service-search-more" href="/services">Browse the full catalogue <ArrowRight size={14}/></a> : <a className="service-search-more" href="#catalogue-results">View all {results.length} results below <ArrowRight size={14}/></a>)}
      </> : <div className="service-search-no-results"><b>No matching services</b><span>Try another name or browse all {serviceCount} services.</span><a href="/services">Browse the catalogue <ArrowRight size={14}/></a></div>
      : <div className="service-search-suggestions"><small>POPULAR SEARCHES</small><div>{suggestions.map((suggestion) => <button type="button" key={suggestion} onMouseDown={(event) => event.preventDefault()} onClick={() => setQuery(suggestion)}>{suggestion}</button>)}</div><a href="/services">Browse all {serviceCount} services across {serviceCategories.length} categories</a></div>}
    </div>}
    <span className="visually-hidden" aria-live="polite">{value.trim() ? `${results.length} services found` : `${serviceCount} services available`}</span>
  </div>;
}
