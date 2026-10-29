import {
  FileText, BriefcaseBusiness, GraduationCap, ReceiptText, Files, Monitor,
  WalletCards, Zap, Plane, MapPinned, Globe2,
} from 'lucide-react';

// One source of truth for the homepage overview and full searchable catalogue.
export const serviceCategories = [
  {
    id: 'government-forms-documents', title: 'Government Form & Document Services', icon: FileText,
    description: 'Assistance with public service forms, certificates, records, and applications.',
    services: [
      'Online Government Form Filling', 'Birth Certificate Application Assistance', 'Death Certificate Application Assistance', 'Caste Certificate Application Assistance', 'Income Certificate Application Assistance', 'Residential Certificate Application Assistance', 'Domicile Certificate Application Assistance', 'EWS Certificate Application Assistance', 'Ration Card Application Assistance', 'Voter ID Application Assistance', 'Voter Details Correction Assistance', 'Electoral Roll Search Assistance', 'Passport Application Assistance', 'Driving Licence Application Assistance', "Learner's Licence Application Assistance", 'Government Scheme Application Assistance', 'Online Grievance Submission Assistance', 'Land Record Search Assistance', 'Government Certificate Download Assistance',
    ],
  },
  {
    id: 'jobs-employment', title: 'Job & Employment Services', icon: BriefcaseBusiness,
    description: 'Help with recruitment forms, job documents, and application status.',
    services: [
      'Government Job Application Form Filling', 'Private Job Application Assistance', 'Railway Recruitment Form Assistance', 'SSC Recruitment Form Assistance', 'State Government Job Application Assistance', 'Police Recruitment Form Assistance', 'Bank Recruitment Form Assistance', 'Employment Registration Assistance', 'Online Admit Card Download', 'Examination Result Download', 'Application Status Checking', 'Online Exam Fee Payment Assistance', 'Resume & CV Creation', 'Cover Letter Writing', 'Job Search Assistance', 'Interview Preparation Documents',
    ],
  },
  {
    id: 'student-education', title: 'Student & Education Services', icon: GraduationCap,
    description: 'Support for admissions, scholarships, examinations, and study documents.',
    services: [
      'School Admission Form Filling', 'College Admission Form Filling', 'University Admission Assistance', 'Scholarship Application Assistance', 'Student Credit Card Application Assistance', 'Examination Registration Assistance', 'Online Examination Form Filling', 'Admit Card Download', 'Marksheet Download Assistance', 'Result Checking', 'Migration Certificate Application Assistance', 'Transfer Certificate Application Assistance', 'Online Course Registration', 'Distance Education Admission Assistance', 'NIOS Admission Assistance', 'IGNOU Admission Assistance', 'Project Report Formatting', 'Assignment Typing & Formatting', 'PDF Notes Preparation', 'Online Education Form Filling',
    ],
  },
  {
    id: 'pan-tax', title: 'PAN Card & Tax-Related Services', icon: ReceiptText,
    description: 'Assistance with PAN, tax documents, GST, and business registrations.',
    services: [
      'New PAN Application Assistance', 'PAN Correction Application Assistance', 'PAN Status Checking', 'PAN e-PAN Download Assistance', 'Income Tax Return Preparation Assistance', 'Income Tax e-Filing Assistance', 'Form 16 PDF Management', 'AIS/TIS Download Assistance', 'Tax Document Organisation', 'GST Registration Assistance', 'GST Return Filing Assistance', 'GST Invoice Preparation', 'Udyam Registration Assistance',
    ],
  },
  {
    id: 'digital-documents', title: 'Digital Document Services', icon: Files,
    description: 'Document preparation, typing, conversion, scanning, and file organisation.',
    services: [
      'PDF Creation', 'PDF Merge & Split', 'PDF Compression', 'PDF to Word Conversion', 'Word to PDF Conversion', 'Image to PDF Conversion', 'Document Scanning', 'Document Typing', 'Bengali & English Typing', 'Online Form Data Entry', 'Photo Resizing', 'Passport-Size Photo Preparation', 'Signature Image Resizing', 'Document Formatting', 'Digital File Organisation', 'Document Upload Assistance', 'Email Attachment Preparation', 'File Conversion & Editing',
    ],
  },
  {
    id: 'business-professional', title: 'Business & Professional Services', icon: BriefcaseBusiness,
    description: 'Practical creative and administrative support for businesses and professionals.',
    services: [
      'Resume & Bio-data Design', 'Business Letter Drafting', 'Application Letter Writing', 'Professional Email Drafting', 'Invoice & Quotation Creation', 'Business Profile Creation', 'Visiting Card Design', 'Digital Poster Design', 'Festival Offer Poster Design', 'Product Catalogue Creation', 'WhatsApp Business Catalogue Setup', 'Facebook Page Setup Assistance', 'Instagram Business Profile Setup', 'Google Business Profile Assistance', 'Social Media Post Design', 'Basic Website Creation', 'Online Product Listing Assistance', 'Data Entry Services', 'Excel Spreadsheet Preparation', 'Stock & Sales Sheet Preparation', 'Business Report Formatting',
    ],
    subsections: [
      {
        id: 'website-design-development',
        title: 'Website Design & Development',
        icon: Monitor,
        description: 'From beautiful user experiences to fully responsive websites, we help individuals and businesses establish a professional online presence.',
        services: [
          'UI/UX Design', 'Website Design', 'Website Development', 'Responsive Website Development', 'Business Website Development', 'Landing Page Design & Development', 'Portfolio Website Development', 'Website Redesign & Modernization', 'Website Maintenance & Updates', 'Website Speed & Performance Optimization', 'Website Deployment & Hosting Setup', 'Domain & SSL Setup Assistance', 'Website Content Integration', 'Contact Form Integration', 'WhatsApp Integration', 'Basic On-Page SEO Setup', 'Website Bug Fixes & Improvements', 'Custom Website Solutions',
        ],
      },
    ],
  },
  {
    id: 'banking-financial-documents', title: 'Banking & Financial Document Assistance', icon: WalletCards,
    description: 'Form and document guidance for banking, insurance, and financial services.',
    services: [
      'Bank Account Opening Form Assistance', 'Bank KYC Document Preparation', 'Bank Statement Download Assistance', 'Cheque Book Application Assistance', 'Debit Card Application Assistance', 'ATM Card Block Request Guidance', 'Mobile Banking Registration Guidance', 'UPI Setup Guidance', 'Loan Application Form Assistance', 'Credit Card Application Assistance', 'Pension Application Assistance', 'Life Certificate Application Guidance', 'Insurance Form Assistance', 'Insurance Renewal Guidance', 'Financial Scheme Application Assistance',
    ],
  },
  {
    id: 'bills-recharge', title: 'Online Bill & Recharge Services', icon: Zap,
    description: 'Assistance with supported utility bills, mobile services, and recharges.',
    services: [
      'Mobile Recharge Assistance', 'DTH Recharge Assistance', 'Electricity Bill Payment Assistance', 'Water Bill Payment Assistance', 'Gas Bill Payment Assistance', 'Broadband Bill Payment Assistance', 'Mobile Postpaid Bill Payment Assistance', 'Landline Bill Payment Assistance', 'Municipal Tax Payment Assistance', 'Online Challan Payment Assistance',
    ],
  },
  {
    id: 'travel-booking', title: 'Travel & Booking Services', icon: Plane,
    description: 'Help with travel arrangements, booking assistance, and trip documents.',
    services: [
      'Flight Ticket Booking Assistance', 'Bus Ticket Booking Assistance', 'Hotel Booking Assistance', 'Tour Package Booking Assistance', 'Travel Itinerary Preparation', 'Train Ticket Booking Assistance Through Authorised Channels', 'Travel Document Preparation', 'Online Booking Status Checking',
    ],
  },
  {
    id: 'west-bengal-services', title: 'West Bengal Special Services', icon: MapPinned,
    description: 'Assistance and information for selected West Bengal schemes and services.',
    services: [
      'Lakshmir Bhandar Application Assistance', 'Aikyashree Scholarship Application Assistance', 'Swasthya Sathi Application Assistance', 'Krishak Bandhu Scheme Assistance', 'Jai Johar Scheme Assistance', 'Taposili Bandhu Scheme Assistance', 'Student Scholarship Application Assistance', 'Student Credit Card Application Assistance', 'Caste Certificate Application Assistance', 'Digital Ration Card Services Assistance', 'Land Record & Mutation Application Assistance', 'Bangla Sahayata Kendra Service Information', 'West Bengal Government Recruitment Form Assistance', 'West Bengal Government Scheme Application Assistance',
    ],
  },
  {
    id: 'additional-online-services', title: 'Additional Online Services', icon: Globe2,
    description: 'Everyday digital help for accounts, appointments, forms, and online records.',
    services: [
      'DigiLocker Account Setup Assistance', 'Digital Document Download Assistance', 'Email Account Setup', 'Email Recovery Guidance', 'Online Appointment Booking', 'Online Application Status Tracking', 'Customer Support Email Writing', 'Online Complaint Submission Assistance', 'Internet Research Services', 'Online Survey Form Creation', 'Google Forms Creation', 'Spreadsheet Data Entry', 'Digital Record Management', 'Online Registration Assistance', 'WhatsApp Document Delivery', 'Digital File Backup Assistance',
    ],
  },
];

export function getCategoryServiceCount(category) {
  return category.services.length + (category.subsections ?? []).reduce((sum, subsection) => sum + subsection.services.length, 0);
}

export const serviceCount = serviceCategories.reduce((sum, category) => sum + getCategoryServiceCount(category), 0);





