import { serviceCategories, serviceCount } from './services';

export const requirementSources = {
  pan: { label: 'PAN service document guidance (Protean)', url: 'https://www.protean-tinpan.com/services/pan/documents-req' },
  voter: { label: 'Election Commission of India — voter registration', url: 'https://www.eci.gov.in/faq/en/how-to-register' },
  voterForm6: { label: 'Election Commission of India — Form 6 guidelines', url: 'https://voters.eci.gov.in/guidelines/Form-6_en.pdf' },
  passport: { label: 'Passport Seva — documents for a fresh passport', url: 'https://www.passportindia.gov.in/psp/docAdvisor/attachmentAdvFreshInp' },
  wbCaste: { label: 'West Bengal Backward Classes Welfare Department — caste certificate process', url: 'https://castcertificatewb.gov.in/how_to_apply' },
  gst: { label: 'GST Portal — registration user guide', url: 'https://tutorial.gst.gov.in/userguide/registration/Apply_for_Registration_Normal_Taxpayer.htm' },
  gstChecklist: { label: 'GST Portal — registration document checklist', url: 'https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf' },
  incomeTax: { label: 'Income Tax Department — e-Filing services', url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services' },
  udyam: { label: 'Udyam Registration Portal — important information', url: 'https://www.udyamregistration.gov.in/Important.aspx' },
};

const question = (id, label, options, hint = '') => ({ id, label, type: options ? 'select' : 'text', options, hint });
const availability = (id, label) => question(id, label, ['Available', 'Not available', 'Need help'], 'Choose only whether you can access this. Never enter a number or upload a document.');

function configFor(category, name) {
  const text = `${category.title} ${name}`.toLowerCase();
  const lower = name.toLowerCase();
  if (/website|ui\/ux|landing page|domain|ssl/.test(lower)) return {
    serviceType: 'Website design and development',
    questions: [question('projectType', 'What would you like to build or improve?', ['Business website', 'Landing page', 'Portfolio website', 'Website redesign', 'Fix or update an existing website', 'Other']), question('businessName', 'Business or organisation name'), question('pageCount', 'About how many pages do you expect?', ['1 page', '2–5 pages', '6–10 pages', 'More than 10', 'Not sure']), question('features', 'Which features should we discuss?', ['Contact form', 'WhatsApp contact', 'Product or service catalogue', 'Booking or enquiry flow', 'Other / not sure']), question('domain', 'Do you already have a domain name?', ['Yes', 'No', 'Not sure']), question('projectBrief', 'Briefly describe your project', null, 'Up to 500 characters. Share public design references only; never send login credentials.')], documents: [], sources: [], verified: false,
  };
  if (/gst registration/.test(lower)) return {
    serviceType: 'GST registration assistance',
    questions: [question('constitution', 'Business constitution', ['Proprietorship', 'Partnership', 'LLP', 'Company', 'Trust / society', 'Other', 'Not sure']), question('businessName', 'Business or trade name'), question('district', 'State and district where the business operates'), question('premises', 'Business premises arrangement', ['Owned', 'Rented / leased', 'Shared', 'Other', 'Not sure']), availability('businessPanAvailable', 'Can the business PAN details be accessed when needed?'), availability('signatoryAvailable', 'Can the authorised signatory participate if required?')],
    documents: [{ id: 'business-constitution', name: 'Business constitution or formation details', status: 'conditional', note: 'Depends on the type of business.' }, { id: 'business-place', name: 'Information about the principal business premises', status: 'conditional', note: 'The portal lists different proof types depending on the premises arrangement.' }], sources: ['gst', 'gstChecklist'], verified: true,
  };
  if (/gst return|gst invoice/.test(lower)) return {
    serviceType: 'GST return or invoice assistance',
    questions: [question('gstTask', 'What GST support do you need?', ['Return preparation / filing guidance', 'Invoice preparation', 'Correction / other help']), question('filingPeriod', 'Which tax period is involved?'), availability('recordsReady', 'Are the relevant sales, purchase, or tax records organised?')],
    documents: [{ id: 'gst-records', name: 'Records relevant to the selected GST task', status: 'conditional', note: 'The applicable records vary by return, tax period, and business circumstances; confirm individually.' }], sources: ['gst'], verified: true,
  };
  if (/udyam registration/.test(lower)) return {
    serviceType: 'Udyam registration assistance',
    questions: [question('enterpriseType', 'Enterprise type', ['Proprietorship', 'Partnership', 'LLP', 'Company', 'Other', 'Not sure']), question('businessName', 'Enterprise or business name'), availability('businessPanAvailable', 'Can the authorised person access the required business identity details when using the official portal?')],
    documents: [], documentNote: 'The official Udyam Registration Portal describes registration as paperless and self-declared, with no documents or proofs to upload. This enquiry form does not ask for uploads.', instructions: ['The official portal states that MSME registration is done through its government portal and that private agencies or persons are not authorised to carry out the registration. This form is only an enquiry for guidance; PrimeServe does not submit the official registration.'], sources: ['udyam'], verified: true,
  };
  if (/pan card|\bpan\b/.test(lower)) return {
    serviceType: 'PAN assistance',
    questions: [question('panRequest', 'What PAN assistance do you need?', ['New PAN', 'Correction or update', 'Reprint / e-PAN download', 'Status check', 'Other']), question('applicantType', 'Applicant type', ['Individual', 'HUF', 'Company / firm / other organisation', 'Not sure']), question('applicantName', 'Applicant name as relevant to this request', null, 'Do not enter a PAN number.'), availability('identityProof', 'Can you access a suitable identity proof if required?'), availability('addressProof', 'Can you access a suitable address proof if required?'), availability('dobProof', 'Can you access date-of-birth / incorporation proof if required?'), question('correctionDetails', 'Which detail needs correction?', ['Name', 'Date of birth / incorporation', 'Address', 'Other'], 'Shown only for correction or update requests.')],
    documents: [{ id: 'pan-identity', name: 'Identity proof', status: 'conditional', note: 'Accepted proofs depend on applicant type and application route.' }, { id: 'pan-address', name: 'Address proof', status: 'conditional', note: 'Applicability depends on applicant type and route.' }, { id: 'pan-dob', name: 'Date-of-birth or incorporation proof', status: 'conditional', note: 'Applicability depends on applicant type and route.' }], sources: ['pan'], verified: true,
  };
  if (/voter|electoral roll/.test(lower)) return {
    serviceType: 'Voter registration or electoral roll assistance',
    questions: [question('voterRequest', 'What voter service do you need?', ['New registration', 'Correction of existing details', 'Shifting address', 'Replacement EPIC', 'Electoral roll search', 'Other']), question('district', 'State, district and locality (no house number needed)'), question('eligibility', 'Are you eligible to apply for this voter service?', ['Yes', 'No', 'Not sure']), availability('ageResidenceProof', 'Can you access relevant age or residence proof if the official form asks for it?')],
    documents: [{ id: 'voter-photo', name: 'Recent photograph', status: 'conditional', note: 'Check the current form and applicant route.' }, { id: 'voter-age', name: 'Age proof', status: 'conditional', note: 'The relevant form specifies acceptable options and alternatives.' }, { id: 'voter-residence', name: 'Ordinary residence information or proof', status: 'conditional', note: 'Requirements depend on the application and verification.' }], sources: ['voter', 'voterForm6'], verified: true,
  };
  if (/caste certificate/.test(lower) && category.id === 'west-bengal-services') return {
    serviceType: 'West Bengal caste certificate assistance',
    questions: [question('casteGroup', 'Certificate category requested', ['SC', 'ST', 'OBC', 'Not sure']), question('district', 'District'), question('subdivision', 'Subdivision'), question('blockMunicipality', 'Block or municipality'), question('supportInfo', 'Can you provide details of relevant family or community records if requested?', ['Yes', 'No', 'Need help'])],
    documents: [{ id: 'wb-records', name: 'Details of relevant supporting records', status: 'conditional', note: 'The West Bengal portal says online applicants do not upload documents for the caste-certificate application, but asks for details of supporting documents. The applicable list depends on the case.' }], sources: ['wbCaste'], verified: true,
  };
  if (/passport application/.test(lower)) return {
    serviceType: 'Passport application assistance',
    questions: [question('passportRequest', 'What passport assistance do you need?', ['Fresh passport', 'Re-issue', 'Correction', 'Appointment / status help', 'Other']), question('applicantAge', 'Applicant age group', ['Under 18', '18 or older', 'Prefer to discuss']), question('district', 'State and district of application'), availability('identityAddress', 'Can you access identity and address documents for review against the official checklist?')],
    documents: [{ id: 'passport-checklist', name: 'Documents listed for your exact passport application route', status: 'conditional', note: 'The Passport Seva document advisor varies by fresh/re-issue, age, and other circumstances. Check the official advisor before preparing documents.' }], sources: ['passport'], verified: true,
  };
  if (/income tax|itr|tax return/.test(lower)) return {
    serviceType: 'Income tax assistance',
    questions: [question('taxYear', 'Which assessment year or filing period?', null, 'If unsure, say so in Additional notes.'), question('taxRequest', 'What do you need help with?', ['Return preparation', 'E-filing assistance', 'Tax document organisation', 'Status / response help', 'Other']), availability('recordsReady', 'Are the relevant income and tax records available?')],
    documents: [{ id: 'tax-records', name: 'Income and tax records relevant to the selected filing', status: 'conditional', note: 'The relevant records depend on income sources, tax year, and filing situation. Confirm individually.' }], sources: ['incomeTax'], verified: true,
  };

  if (/bill|recharge|challan|payment/.test(lower)) return { serviceType: 'Bill or recharge assistance', questions: [question('provider', 'Which provider or bill type?'), question('requestType', 'What help do you need?', ['Payment guidance', 'Bill / recharge information', 'Status check', 'Other']), question('serviceArea', 'State and city / district')], documents: [], sources: [], verified: false };
  if (/job|employment|resume|cv|recruitment|admit card|result/.test(text)) return { serviceType: 'Employment or recruitment assistance', questions: [question('recruitment', 'Which recruitment, employer, or exam is this about?'), question('requestType', 'What help do you need?', ['Find an opportunity', 'Application form', 'Admit card / result', 'Resume or supporting document', 'Status check', 'Other']), availability('noticeAvailable', 'Can you access the official recruitment notice or application page?')], documents: [], sources: [], verified: false };
  if (/student|education|exam|admission|scholarship|school|college|university|ignou|nios/.test(text)) return { serviceType: 'Education or examination assistance', questions: [question('institution', 'School, board, university, or exam name'), question('requestType', 'What stage do you need help with?', ['Admission / registration', 'Examination form', 'Scholarship', 'Result / admit card', 'Certificate / records', 'Other']), question('courseClass', 'Course, class, or programme (if relevant)')], documents: [], sources: [], verified: false };
  if (/bank|financial|insurance|pension|upi|loan|credit card/.test(text)) return { serviceType: 'Banking or financial document assistance', questions: [question('institution', 'Bank, insurer, or scheme provider'), question('requestType', 'What assistance do you need?', null, 'Describe the task without account numbers, card details, or credentials.'), availability('recordsAvailable', 'Can you access the relevant official statements or forms if needed?')], documents: [], sources: [], verified: false };
  if (/travel|flight|bus ticket|train|hotel|booking/.test(text)) return { serviceType: 'Travel or booking assistance', questions: [question('travelRequest', 'What booking or travel help do you need?'), question('route', 'Origin and destination or place of stay'), question('travelMonth', 'Approximate travel date or month')], documents: [], sources: [], verified: false };
  if (/pdf|document|typing|scanning|photo|file|email attachment/.test(text)) return { serviceType: 'Digital document assistance', questions: [question('documentTask', 'What document task should we help with?'), question('format', 'Preferred output format (if relevant)', ['PDF', 'Word document', 'Image', 'Not sure', 'Other'])], documents: [], sources: [], verified: false };
  if (/business|professional|social media|poster|catalogue|data entry|spreadsheet/.test(text)) return { serviceType: 'Business and professional assistance', questions: [question('businessType', 'What type of business or professional work is this for?'), question('requestedWork', 'What result would you like help with?'), question('referenceReady', 'Do you have existing content or examples to refer to?', ['Yes', 'No', 'Need help'])], documents: [], sources: [], verified: false };
  if (/government|scheme|certificate|application|form|record|ration|land|grievance|licence|license/.test(text)) return { serviceType: 'Government form or document assistance', questions: [question('requestType', 'What help do you need?', ['New application', 'Correction / update', 'Renewal / re-issue', 'Download / status check', 'Other']), question('portalOrDepartment', 'Which department, scheme, or official service?'), question('district', 'State and district (if relevant)')], documents: [], sources: [], verified: false };
  return { serviceType: 'Online service assistance', questions: [question('requestedHelp', 'What would you like PrimeServe to help you do?'), question('serviceContext', 'Which provider, organisation, or online service is involved?')], documents: [], sources: [], verified: false };
}

const slug = (text) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const serviceRequirementRegistry = serviceCategories.flatMap((category) => [
  ...category.services.map((name) => ({ category, name })),
  ...(category.subsections ?? []).flatMap((subsection) => subsection.services.map((name) => ({ category, name, subsection }))),
].map(({ category: sourceCategory, name, subsection }) => {
  const config = configFor(sourceCategory, name);
  const references = config.sources.map((key) => requirementSources[key]);
  const reviewed = references.length > 0 && config.verified;
  return {
    id: `${sourceCategory.id}-${slug(name)}`, name,
    categoryId: sourceCategory.id, category: subsection?.title ?? sourceCategory.title,
    description: subsection?.description ?? sourceCategory.description,
    serviceType: config.serviceType, applicantTypes: config.questions.find((item) => item.id === 'applicantType')?.options ?? [], questions: config.questions.map((item, index) => ({ ...item, required: index === 0, ...(item.id === 'correctionDetails' ? { showWhen: { id: 'panRequest', value: 'Correction or update' } } : {}) })),
    documents: config.documents, optionalDocuments: [],
    documentNote: config.documentNote ?? '',
    instructions: ['Requirements vary by applicant, application type, location, and current portal rules.', 'Do not share passwords, one-time passwords, full Aadhaar or PAN numbers, payment credentials, or document scans in this enquiry.', ...(config.instructions ?? [])],
    privacyWarning: true, officialReferences: references,
    lastVerified: reviewed ? '2026-10-30' : null,
    verificationStatus: reviewed ? 'source-reviewed; confirm current case-specific applicability' : 'needs manual verification by PrimeServe',
  };
}));

export const configuredServiceCount = serviceRequirementRegistry.length;
export const manualVerificationServices = serviceRequirementRegistry.filter((item) => item.verificationStatus === 'needs manual verification by PrimeServe');
if (configuredServiceCount !== serviceCount) throw new Error(`Service requirement registry mismatch: ${configuredServiceCount} configurations for ${serviceCount} services.`);
