import { useState, useMemo, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Search, ChevronDown, Shield, Zap, Check, X, Plus,
  ArrowRight, BarChart2, Star, Quote,
  ChevronLeft, ChevronRight
} from 'lucide-react'

interface Method {
  id: string
  name: string
  emoji: string
  img: string
  category: 'contraception' | 'hiv'
  subcategory: string
  tagline: string
  howItWorks: string
  steps: string[]
  effectivenessTypical: number
  effectivenessLabel: string
  duration: string
  costFree: boolean
  costDetail: string
  sideEffects: string[]
  whereToGet: string[]
  protectsSTIs: boolean
  myths: Array<{ myth: string; fact: string }>
  urgent?: boolean
  note?: string
  costLabel?: string
}

const CAT_CONFIG = {
  contraception: {
    accent: '#93C962',
    bg: 'bg-[#93C962]/10',
    text: 'text-[#5A7D3B]',
  },
  hiv: {
    accent: '#0EA5E9',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
  },
}

const SUBCAT_LABELS: Record<string, string> = {
  hormonal: 'Hormonal',
  barrier: 'Barrier',
  iud: 'IUD',
  emergency: 'Emergency',
  permanent: 'Permanent',
  natural: 'Natural',
  prep: 'PrEP',
  pep: 'PEP',
  surgical: 'Surgical',
  treatment: 'Treatment as Prevention',
  harm_reduction: 'Harm Reduction',
}

const CARDS_PER_PAGE = 6

type SubFilter = 'all' | 'short_acting' | 'long_acting' | 'permanent' | 'natural' | 'prep' | 'pep' | 'vmmc' | 'harm_reduction'

const GROUP_IDS: Record<Exclude<SubFilter, 'all'>, string[]> = {
  short_acting: ['progestin-pill', 'combined-pill', 'male-condom', 'female-condom', 'emergency-contraception', 'withdrawal', 'pep'],
  long_acting: ['depo-provera', 'sayana-press', 'implant', 'hormonal-iud', 'copper-iud', 'lam', 'oral-prep', 'cab-la', 'lenacapavir', 'dapivirine-ring'],
  permanent: ['tubal-ligation', 'vasectomy', 'vmmc'],
  natural: ['withdrawal', 'lam'],
  prep: ['oral-prep', 'cab-la', 'lenacapavir', 'dapivirine-ring'],
  pep: ['pep'],
  vmmc: ['vmmc'],
  harm_reduction: ['harm-reduction'],
}

const SUB_FILTER_LABELS: Record<SubFilter, string> = {
  all: 'All',
  short_acting: 'Short Acting',
  long_acting: 'Long Acting',
  permanent: 'Permanent',
  natural: 'Natural',
  prep: 'PrEP',
  pep: 'PEP',
  vmmc: 'VMMC',
  harm_reduction: 'Harm Reduction',
}

const CATEGORY_SUB_FILTERS: Record<'all' | 'contraception' | 'hiv', Exclude<SubFilter, 'all'>[]> = {
  all:           ['short_acting', 'long_acting', 'permanent', 'natural', 'prep', 'pep', 'vmmc', 'harm_reduction'],
  contraception: ['short_acting', 'long_acting', 'permanent', 'natural'],
  hiv:           ['permanent', 'prep', 'pep', 'vmmc', 'harm_reduction'],
}

// Pexels CDN helper
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop`

const METHODS: Method[] = [
  {
    id: 'progestin-pill',
    name: 'Progestin-Only Pill',
    emoji: '💊',
    img: '/projestin-only birth control.jpg',
    category: 'contraception',
    subcategory: 'hormonal',
    tagline: 'A daily pill with no estrogen',
    howItWorks: "Contains only progestogen, which thickens cervical mucus so sperm can't reach an egg, and sometimes prevents ovulation.",
    steps: [
      'Get a prescription or visit a clinic',
      'Take one pill every day at the same time',
      'No 7-day break — pack is continuous',
      'Use a backup method for the first 2 days',
    ],
    effectivenessTypical: 91,
    effectivenessLabel: '91% typical use',
    duration: 'Daily',
    costFree: true,
    costDetail: 'Free at government clinics and selected pharmacies',
    sideEffects: ['Irregular bleeding', 'Headaches', 'Acne', 'Breast tenderness'],
    whereToGet: ['Government clinics', 'Marie Stopes Zimbabwe', 'Private pharmacies'],
    protectsSTIs: false,
    myths: [
      { myth: 'The pill makes you permanently infertile', fact: 'Fertility returns within 1–3 months of stopping.' },
      { myth: 'You must take a break every few years', fact: "No break needed — it's safe to take continuously." },
    ],
  },
  {
    id: 'combined-pill',
    name: 'Combined Oral Contraceptive',
    emoji: '💊',
    img: '/combined pills.webp',
    category: 'contraception',
    subcategory: 'hormonal',
    tagline: 'Estrogen + progestin in one daily pill',
    howItWorks: 'Prevents ovulation, thickens cervical mucus, and thins the uterine lining. Most commonly used oral contraceptive.',
    steps: [
      'Visit a clinic for a blood pressure check',
      'Take one pill daily at the same time',
      "Follow your pack's 21 or 28-day cycle",
      'Use condoms for the first 7 days',
    ],
    effectivenessTypical: 91,
    effectivenessLabel: '91% typical use',
    duration: 'Daily',
    costFree: true,
    costDetail: 'Free at public health facilities',
    sideEffects: ['Nausea', 'Spotting', 'Mood changes', 'Reduced libido'],
    whereToGet: ['Government hospitals', 'Clinics', 'CeSHHAR partner sites','PSH'],
    protectsSTIs: false,
    myths: [
      { myth: 'The pill causes cancer', fact: 'Some studies show a slight decrease in ovarian and endometrial cancer risk.' },
      { myth: "You can't get pregnant right after stopping", fact: 'Fertility returns quickly — sometimes within days.' },
    ],
  },
  {
    id: 'depo-provera',
    name: 'Depo-Provera',
    emoji: '💉',
    img: '/Depo.png',
    category: 'contraception',
    subcategory: 'hormonal',
    tagline: 'Once-every-3-months injection',
    howItWorks: 'Progestogen injection that stops ovulation and thickens cervical mucus for up to 3 months.',
    steps: [
      'Visit a clinic for your first shot',
      'Return every 12 weeks for the next dose',
      'Use a backup method for the first week if not on period',
      'Keep a reminder — late injections reduce effectiveness',
    ],
    effectivenessTypical: 94,
    effectivenessLabel: '94% typical use',
    duration: '3 months per injection',
    costFree: true,
    costDetail: 'Free at government facilities',
    sideEffects: ['Irregular periods or no period', 'Weight gain', 'Delayed fertility return (6–18 months)'],
    whereToGet: ['All government clinics', 'Mobile health units'],
    protectsSTIs: false,
    myths: [
      { myth: 'Depo causes permanent infertility', fact: 'Fertility returns within 6–18 months after stopping.' },
      { myth: 'You gain a lot of weight on Depo', fact: 'Weight change is modest and not universal.' },
    ],
  },
  {
    id: 'sayana-press',
    name: 'Sayana Press',
    emoji: '💉',
    img: px(6074929),
    category: 'contraception',
    subcategory: 'hormonal',
    tagline: 'Self-injectable every 13 weeks',
    howItWorks: 'Same hormone as Depo-Provera in a prefilled auto-injector you can use at home after one clinic training session.',
    steps: [
      'Get trained at a clinic (one-time visit)',
      'Inject under the skin of belly or thigh every 13 weeks',
      'Dispose of used injector safely',
      'Set a phone reminder for the next dose',
    ],
    effectivenessTypical: 94,
    effectivenessLabel: '94% typical use',
    duration: '13 weeks per injection',
    costFree: true,
    costDetail: 'Available through community health programmes',
    sideEffects: ['Irregular bleeding', 'No period', 'Injection site bruising'],
    whereToGet: ['Selected clinics', 'Community health workers', 'CeSHHAR sites'],
    protectsSTIs: false,
    myths: [
      { myth: 'Self-injection is dangerous', fact: 'After one training session, self-injection is safe and as effective as clinic injection.' },
    ],
  },
  {
    id: 'implant',
    name: 'Contraceptive Implant',
    emoji: '🦴',
    img: px(7447008),
    category: 'contraception',
    subcategory: 'hormonal',
    tagline: 'A matchstick-sized rod for 3–5 years',
    howItWorks: 'A small rod inserted under the skin of the upper arm that releases progestogen continuously, preventing ovulation.',
    steps: [
      'Visit a trained provider',
      'A small area of the arm is numbed',
      'Rod inserted in minutes — no stitches needed',
      'Effective immediately if inserted days 1–5 of cycle',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '>99% effective',
    duration: '3–5 years',
    costFree: true,
    costDetail: 'Subsidised or free at CeSHHAR partner clinics',
    sideEffects: ['Irregular bleeding', 'Headaches', 'Acne', 'Mood changes'],
    whereToGet: ['Marie Stopes Zimbabwe', 'City health clinics', 'CeSHHAR sites'],
    protectsSTIs: false,
    myths: [
      { myth: 'The implant can move to your heart', fact: 'The implant stays in the arm. Migration to the heart has never been documented.' },
      { myth: "It's painful to remove", fact: 'Removal takes a few minutes under local anaesthetic.' },
    ],
  },
  {
    id: 'hormonal-iud',
    name: 'Hormonal IUD (Mirena)',
    emoji: '🔬',
    img: '/hormonal.gif',
    category: 'contraception',
    subcategory: 'iud',
    tagline: 'T-shaped device, lighter periods',
    howItWorks: 'A small plastic T inserted in the uterus releasing levonorgestrel, thickening cervical mucus and thinning the uterine lining.',
    steps: [
      'Get a pelvic exam and counselling first',
      'Provider inserts it during a brief appointment',
      'Check the string monthly for first few months',
      'Return for follow-up at 4–6 weeks',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '>99% effective',
    duration: '5–7 years',
    costFree: false,
    costDetail: 'Available at private clinics; subsidised at some NGO sites',
    sideEffects: ['Lighter/no periods', 'Spotting in first 3 months', 'Cramping after insertion'],
    whereToGet: ['Private clinics', 'Marie Stopes Zimbabwe', 'Select NGO clinics'],
    protectsSTIs: false,
    myths: [
      { myth: "IUDs are only for women who've had babies", fact: "IUDs are safe and effective for young women who haven't had children." },
    ],
  },
  {
    id: 'copper-iud',
    name: 'Copper IUD',
    emoji: '🔬',
    img: '/hormonal-and-copper-iud-illustration.gif__1200x1200_q65_subsampling-2.webp',
    category: 'contraception',
    subcategory: 'iud',
    tagline: 'Non-hormonal, lasts up to 10 years',
    howItWorks: 'Copper releases ions toxic to sperm, preventing fertilisation. Can also be used as emergency contraception within 5 days.',
    steps: [
      'Have a pelvic exam and pregnancy test',
      'Provider inserts the IUD into the uterus',
      'Effective immediately',
      'Annual check-up recommended',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '>99% effective',
    duration: 'Up to 10 years',
    costFree: true,
    costDetail: 'Free at most government hospitals',
    sideEffects: ['Heavier periods', 'More cramping', 'Spotting'],
    whereToGet: ['Government hospitals', 'Marie Stopes Zimbabwe'],
    protectsSTIs: false,
    myths: [
      { myth: 'The copper IUD causes infertility', fact: 'Fertility returns immediately after removal.' },
    ],
  },
  {
    id: 'male-condom',
    name: 'Male (External) Condom',
    emoji: '🛡️',
    img: '/Male_condom.png',
    category: 'contraception',
    subcategory: 'barrier',
    tagline: 'Dual protection — pregnancy & STIs',
    howItWorks: 'A thin sheath worn over the penis that collects sperm and blocks STI transmission when used correctly every time.',
    steps: [
      'Check expiry date and packaging',
      'Pinch the tip and unroll onto erect penis',
      'Use with water-based lube only',
      'Hold the base when withdrawing after sex',
    ],
    effectivenessTypical: 87,
    effectivenessLabel: '87% typical · 98% perfect use',
    duration: 'Single use',
    costFree: true,
    costDetail: 'Free at clinics, universities, and outreach sites',
    sideEffects: ['Latex allergy (rare)', 'Reduced sensation for some users'],
    whereToGet: ['Any clinic', 'Most pharmacies', 'Peer educators on campus'],
    protectsSTIs: true,
    myths: [
      { myth: 'Wearing two condoms is safer', fact: 'Double-condomming causes friction making both more likely to break.' },
      { myth: 'Condoms reduce pleasure significantly', fact: 'With proper fit and lube, most users notice little difference.' },
    ],
  },
  {
    id: 'female-condom',
    name: 'Female (Internal) Condom',
    emoji: '🛡️',
    img: '/female_condom.jpg',
    category: 'contraception',
    subcategory: 'barrier',
    tagline: "You're in control — insert before sex",
    howItWorks: 'A pouch inserted into the vagina before sex. The inner ring holds it in; the outer ring stays outside covering the labia.',
    steps: [
      'Insert up to 8 hours before sex',
      'Squeeze inner ring and push into vagina',
      'Make sure outer ring lies flat outside',
      'After sex, twist outer ring and remove gently',
    ],
    effectivenessTypical: 79,
    effectivenessLabel: '79% typical · 95% perfect use',
    duration: 'Single use',
    costFree: true,
    costDetail: 'Available at select clinics and NGO sites',
    sideEffects: ['Slight rustling sound (add lube)', 'Outer ring may shift'],
    whereToGet: ['Marie Stopes Zimbabwe', 'Select health facilities'],
    protectsSTIs: true,
    myths: [
      { myth: 'Female condoms are too difficult to use', fact: 'Practice makes it easy — most users are comfortable after 2–3 tries.' },
    ],
  },
  {
    id: 'emergency-contraception',
    name: 'Emergency Contraception',
    emoji: '⚡',
    img: '/emergency contraception.png',
    category: 'contraception',
    subcategory: 'emergency',
    tagline: 'Up to 72 hours after unprotected sex',
    howItWorks: 'High-dose levonorgestrel delays or prevents ovulation. Does NOT cause abortion — it prevents pregnancy from starting.',
    steps: [
      'Take as soon as possible — every hour counts',
      'Works up to 72 hours; less effective after',
      'Take with food if you feel nauseous',
      'Follow up with ongoing contraception',
    ],
    effectivenessTypical: 89,
    effectivenessLabel: '89% effective within 72 hrs',
    duration: 'Single dose',
    costFree: false,
    costDetail: 'Low cost (~$1–3) at pharmacies; free at some youth clinics',
    sideEffects: ['Nausea', 'Irregular next period', 'Headache'],
    whereToGet: ['Most pharmacies (no prescription)', 'Clinics', 'CeSHHAR sites'],
    protectsSTIs: false,
    urgent: true,
    myths: [
      { myth: 'EC causes abortion', fact: 'EC prevents pregnancy before it starts and cannot end an established pregnancy.' },
      { myth: "EC is harmful if used more than once", fact: "It's safe to use EC multiple times, but regular contraception is more effective." },
    ],
  },
  {
    id: 'withdrawal',
    name: 'Withdrawal (Pull-Out)',
    emoji: '✋',
    img: '/withdrawal method.avif',
    category: 'contraception',
    subcategory: 'natural',
    tagline: 'Free but requires perfect timing',
    howItWorks: 'The male partner withdraws before ejaculation. Only effective when done consistently and correctly every single time.',
    steps: [
      'Partner must withdraw before any ejaculation',
      'Urinate between rounds to clear pre-ejaculate',
      'Requires trust and self-control',
      'Pair with another method for stronger protection',
    ],
    effectivenessTypical: 78,
    effectivenessLabel: '78% typical · 96% perfect use',
    duration: 'Per act',
    costFree: true,
    costDetail: 'Free — no supplies needed',
    sideEffects: ['Anxiety', 'Reduced spontaneity'],
    whereToGet: ['No supplies needed'],
    protectsSTIs: false,
    myths: [
      { myth: "Pre-ejaculate contains no sperm", fact: 'Pre-cum can contain sperm, especially after a recent ejaculation.' },
    ],
  },
  {
    id: 'lam',
    name: 'LAM (Lactational Amenorrhea)',
    emoji: '🤱',
    img: '/Lactational Amenorrhea Methods (LAM).png',
    category: 'contraception',
    subcategory: 'natural',
    tagline: 'Breastfeeding as contraception',
    howItWorks: 'Exclusive breastfeeding suppresses ovulation through hormonal changes. Only works when all three criteria are simultaneously met.',
    steps: [
      'Must be exclusively breastfeeding — no formula or solids',
      'Baby must be under 6 months old',
      'Your period must not have returned',
      'Switch to another method the moment any criterion changes',
    ],
    effectivenessTypical: 98,
    effectivenessLabel: '98% when all 3 criteria are met',
    duration: 'Up to 6 months',
    costFree: true,
    costDetail: 'No cost',
    sideEffects: ['None'],
    whereToGet: ['Guidance from any nurse or midwife'],
    protectsSTIs: false,
    note: 'All three criteria must be met simultaneously — if any one changes, protection ends immediately.',
    myths: [
      { myth: "You can't get pregnant at all while breastfeeding", fact: 'LAM only works when ALL three criteria are met. Formula, dummies, or a returning period removes protection.' },
    ],
  },
  {
    id: 'tubal-ligation',
    name: 'Tubal Ligation',
    emoji: '♾️',
    img: px(263337),
    category: 'contraception',
    subcategory: 'permanent',
    tagline: 'Permanent female sterilisation',
    howItWorks: 'A surgical procedure that cuts, ties, or blocks the fallopian tubes, permanently preventing eggs from reaching sperm.',
    steps: [
      'Mandatory counselling session required',
      'Outpatient surgical procedure under anaesthesia',
      'Short recovery of 1–2 days',
      'Effective immediately after surgery',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '>99% effective (permanent)',
    duration: 'Permanent',
    costFree: false,
    costDetail: 'Available at government hospitals; subsidised for qualifying patients',
    sideEffects: ['Surgical risks (infection, anaesthesia)', 'Ectopic pregnancy risk if method fails'],
    whereToGet: ['Government hospitals', 'Private surgical centres'],
    protectsSTIs: false,
    myths: [
      { myth: 'Tubal ligation causes early menopause', fact: 'It has no effect on hormones or menstrual cycle.' },
    ],
  },
  {
    id: 'vasectomy',
    name: 'Vasectomy',
    emoji: '♾️',
    img: px(1250655),
    category: 'contraception',
    subcategory: 'permanent',
    tagline: 'Permanent male sterilisation',
    howItWorks: 'A minor procedure that cuts or blocks the vas deferens, permanently preventing sperm from entering semen.',
    steps: [
      'Counselling required before the procedure',
      '15–30 minute outpatient procedure under local anaesthetic',
      'Use backup contraception for 3 months (sperm remain)',
      'Confirm success with a semen analysis at 3 months',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '>99% effective (permanent)',
    duration: 'Permanent',
    costFree: false,
    costDetail: 'Available at select hospitals; lower cost than tubal ligation',
    sideEffects: ['Temporary bruising/swelling', 'Very rare: sperm granuloma'],
    whereToGet: ['Select government hospitals', 'Marie Stopes Zimbabwe'],
    protectsSTIs: false,
    myths: [
      { myth: 'Vasectomy affects libido or testosterone', fact: "Vasectomy doesn't affect erections, libido, or hormone levels." },
    ],
  },
  // HIV Prevention
  {
    id: 'oral-prep',
    name: 'Oral PrEP (TDF/FTC)',
    emoji: '🔵',
    img: '/prep_enhanced_v2.png',
    category: 'hiv',
    subcategory: 'prep',
    tagline: 'Daily pill that stops HIV before it starts',
    howItWorks: 'Tenofovir + Emtricitabine maintain drug levels in blood/tissue that block HIV from establishing infection if you are exposed.',
    steps: [
      'Get tested for HIV — must be HIV-negative to start',
      'Take one pill every day at the same time',
      'Return every 3 months for HIV test and kidney check',
      'Takes ~7 days for anal, ~21 days for vaginal full protection',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '>99% with daily adherence',
    duration: 'Daily, ongoing',
    costFree: true,
    costDetail: 'Free through Zimbabwe national PrEP programme',
    sideEffects: ['Nausea (first 2 weeks)', 'Headache', 'Mild kidney effects (rare, monitored)'],
    whereToGet: ['CeSHHAR clinics', 'Government ARV sites', 'Youth-friendly clinics'],
    protectsSTIs: false,
    myths: [
      { myth: 'PrEP is a cure for HIV', fact: 'PrEP prevents infection but does not treat or cure HIV.' },
      { myth: "You don't need condoms on PrEP", fact: "PrEP doesn't protect against other STIs — use condoms too." },
    ],
  },
  {
    id: 'cab-la',
    name: 'CAB-LA (Cabotegravir)',
    emoji: '💉',
    img: '/CAB-LA injection.webp',
    category: 'hiv',
    subcategory: 'prep',
    tagline: 'Injection every 2 months — no daily pill',
    howItWorks: 'Long-acting injectable cabotegravir every 8 weeks maintains protective drug levels with no daily adherence required.',
    steps: [
      'Two starter injections 4 weeks apart',
      'Then one injection every 8 weeks',
      'HIV test required before each injection',
      'Continue for as long as you need protection',
    ],
    effectivenessTypical: 99,
    effectivenessLabel: '66% more effective than daily pill in trials',
    duration: 'Every 2 months',
    costFree: true,
    costDetail: 'Rolling out through the national programme',
    sideEffects: ['Injection site pain', 'Headache', 'Fatigue'],
    whereToGet: ['CeSHHAR sites', 'Select government clinics (roll-out)'],
    protectsSTIs: false,
    myths: [
      { myth: "Injectable PrEP means you're HIV positive", fact: "CAB-LA is for HIV-negative people to stay negative — not treatment." },
    ],
  },
  {
    id: 'lenacapavir',
    name: 'Lenacapavir (PURPOSE 1)',
    emoji: '🧬',
    img: '/lenacapavir-hiv-prep-injection.png',
    category: 'hiv',
    subcategory: 'prep',
    tagline: 'Twice-yearly injection — future of PrEP',
    howItWorks: "A capsid inhibitor given twice a year. PURPOSE 1 trial showed 100% efficacy in cisgender women — the most effective PrEP ever tested.",
    steps: [
      'Two subcutaneous injections every 6 months',
      'HIV test required before each dose',
      'Currently in trial/rollout phase in Zimbabwe',
      'Ask your clinic if available near you',
    ],
    effectivenessTypical: 100,
    effectivenessLabel: '100% in PURPOSE 1 trial',
    duration: 'Every 6 months',
    costFree: false,
    costLabel: 'Mostly Free',
    costDetail: 'Currently in trial; national rollout expected',
    sideEffects: ['Injection site nodule', 'Headache'],
    whereToGet: ['CeSHHAR trial sites', 'Select research clinics'],
    protectsSTIs: false,
    note: 'Newest PrEP option — ask your provider about access in your area.',
    myths: [
      { myth: '100% efficacy means it is widely available now', fact: 'Lenacapavir is in late-stage rollout — availability varies by location.' },
    ],
  },
  {
    id: 'dapivirine-ring',
    name: 'Dapivirine Vaginal Ring',
    emoji: '💍',
    img: '/Dapivirine vaginal ring.jpg',
    category: 'hiv',
    subcategory: 'prep',
    tagline: 'Monthly ring — discreet HIV protection',
    howItWorks: 'A monthly silicone ring inserted into the vagina that releases dapivirine continuously, reducing HIV acquisition by ~50–70%.',
    steps: [
      'Insert ring into vagina (similar to a menstrual disc)',
      'Replace every 28 days',
      'Can be worn during sex and menstruation',
      'HIV test every 3 months',
    ],
    effectivenessTypical: 56,
    effectivenessLabel: '~56% (higher with consistent use)',
    duration: 'Monthly replacement',
    costFree: false,
    costDetail: 'Available at select CeSHHAR and DREAMS programme sites',
    sideEffects: ['Vaginal discomfort (first week)', 'Discharge'],
    whereToGet: ['CeSHHAR sites', 'DREAMS programme clinics'],
    protectsSTIs: false,
    myths: [
      { myth: 'The ring can get lost inside you', fact: 'The vagina is a closed canal — the ring stays in place and is easily removed.' },
    ],
  },
  {
    id: 'pep',
    name: 'PEP (Post-Exposure Prophylaxis)',
    emoji: '🚨',
    img: '/PEP.jpg',
    category: 'hiv',
    subcategory: 'pep',
    tagline: 'Emergency HIV prevention after exposure',
    howItWorks: 'A 28-day course of antiretrovirals started within 72 hours of possible HIV exposure prevents the virus from establishing infection.',
    steps: [
      'Go to a clinic or emergency room IMMEDIATELY',
      'Must start within 72 hours — earlier is better',
      'Take the full 28-day course without missing doses',
      'HIV test at start, 6 weeks, and 3 months after',
    ],
    effectivenessTypical: 92,
    effectivenessLabel: '>92% if started within 24 hrs and completed',
    duration: '28-day course',
    costFree: true,
    costDetail: 'Free at government hospitals — emergency dept or ARV clinic',
    sideEffects: ['Nausea', 'Fatigue', 'Diarrhoea', 'Headache'],
    whereToGet: ['ANY government hospital', 'Emergency departments', 'ARV clinics'],
    protectsSTIs: false,
    urgent: true,
    myths: [
      { myth: 'PEP always works no matter when you start', fact: 'Starting PEP late (after 72 hrs) dramatically reduces effectiveness.' },
      { myth: 'PEP is a substitute for PrEP', fact: "PEP is emergency use only. If you're at ongoing risk, switch to PrEP." },
    ],
  },
  {
    id: 'vmmc',
    name: 'VMMC (Male Circumcision)',
    emoji: '✂️',
    img: '/VOLUNTARY MALE MEDICAL CIRCUMCISION.jpeg',
    category: 'hiv',
    subcategory: 'surgical',
    tagline: 'One-time procedure, lifelong risk reduction',
    howItWorks: 'Removing the foreskin reduces HIV acquisition risk in heterosexual men by ~60% by eliminating the inner foreskin tissue where HIV easily enters.',
    steps: [
      'Counselling and HIV test required first',
      '30–45 minute outpatient procedure under local anaesthetic',
      'Abstain from sex for 6 weeks during healing',
      'Wound check at 1 week and 6 weeks',
    ],
    effectivenessTypical: 60,
    effectivenessLabel: '~60% reduction in HIV acquisition (men)',
    duration: 'Permanent (one-time)',
    costFree: true,
    costDetail: 'Free through Zimbabwe VMMC programme (ZAZIC/DREAMS)',
    sideEffects: ['Post-surgery pain (1–2 weeks)', 'Swelling', 'Infection risk if wound not cared for'],
    whereToGet: ['VMMC programme sites', 'Government hospitals', 'ZAZIC partner clinics'],
    protectsSTIs: false,
    myths: [
      { myth: 'Circumcision gives complete HIV protection', fact: 'VMMC reduces risk by ~60% — combine with condoms and/or PrEP for fuller protection.' },
      { myth: 'Circumcision reduces sexual pleasure', fact: 'Studies show no significant difference in sexual satisfaction after VMMC.' },
    ],
  },
  {
    id: 'tasp',
    name: 'U=U / Treatment as Prevention',
    emoji: '💚',
    img: '/Treatment as Prevention (TasP).jpeg',
    category: 'hiv',
    subcategory: 'treatment',
    tagline: 'Undetectable = Untransmittable',
    howItWorks: 'People living with HIV on ART who maintain an undetectable viral load (<200 copies/mL) cannot sexually transmit HIV. Proven science.',
    steps: [
      'Person living with HIV starts and stays on ART',
      'Achieve and maintain undetectable viral load',
      'Viral load test every 6 months to confirm suppression',
      'Continue ART consistently — missing doses can raise viral load',
    ],
    effectivenessTypical: 100,
    effectivenessLabel: '100% — zero transmissions documented in PARTNER studies',
    duration: 'As long as viral load is undetectable',
    costFree: true,
    costDetail: 'ART is free in Zimbabwe',
    sideEffects: ['ART side effects vary by regimen — most manageable'],
    whereToGet: ['All government ART sites', 'CeSHHAR partner clinics'],
    protectsSTIs: false,
    myths: [
      { myth: "U=U means you don't need to disclose your status", fact: "U=U is about transmission risk, not legal or ethical disclosure obligations." },
      { myth: 'ART is only for people who are very sick', fact: 'Starting ART early — regardless of CD4 count — maximises health outcomes.' },
    ],
  },
  {
    id: 'harm-reduction',
    name: 'Harm Reduction (PWID)',
    emoji: '🩹',
    img: '/Harm Reduction (for people who inject drugs).jpeg',
    category: 'hiv',
    subcategory: 'harm_reduction',
    tagline: 'Safe injecting practices for people who inject drugs',
    howItWorks: 'HIV spreads through shared needles. Harm reduction means never sharing equipment, using sterile needles every time, and accessing needle-syringe programmes.',
    steps: [
      'Never share needles, syringes, or drug preparation equipment',
      'Use a new sterile needle for every injection',
      'Access needle-syringe programmes (NSP) for free clean equipment',
      'Combine with PrEP and regular HIV testing',
    ],
    effectivenessTypical: 80,
    effectivenessLabel: 'Highly effective when practiced consistently',
    duration: 'Every injecting episode',
    costFree: true,
    costDetail: 'NSPs provide free needles and equipment',
    sideEffects: ['None from harm reduction itself'],
    whereToGet: ['CeSHHAR outreach', 'Selected NGO harm reduction programmes'],
    protectsSTIs: false,
    myths: [
      { myth: 'Harm reduction encourages drug use', fact: 'Harm reduction reduces deaths and HIV transmission without increasing drug use rates.' },
    ],
  },
]

const TESTIMONIALS: Record<string, Array<{ quote: string; name: string; detail: string; tag?: string }>> = {
  'progestin-pill': [
    { quote: "I worried the pill would affect my moods. For me it hasn't at all. The key is taking it at exactly the same time every day — I set a phone alarm and never miss.", name: 'Rudo, 21', detail: 'University of Zimbabwe', tag: '1 year on the pill' },
  ],
  'depo-provera': [
    { quote: "My periods stopped after the second injection. I was scared at first but the nurse explained it's completely normal. As a student it's actually been a relief.", name: 'Chido, 20', detail: 'Midlands State University', tag: '6 months on Depo' },
    { quote: "I missed my 12-week window by 10 days and panicked. The clinic was understanding and sorted me out. Set a phone reminder — don't rely on memory.", name: 'Anonymous, 19', detail: 'Harare Polytechnic', tag: 'Practical tip' },
  ],
  'implant': [
    { quote: "Insertion was over in 5 minutes. I've had my implant for 2 years and forget it's even there. Best decision I made for my studies.", name: 'Mercy, 23', detail: 'Bindura University', tag: '2 years post-insertion' },
    { quote: "The irregular bleeding in month 2 worried me. My nurse reassured me it settles — and it did by month 4. Stick with it.", name: 'Anonymous, 20', detail: 'UZ student', tag: 'Worked through side effects' },
  ],
  'copper-iud': [
    { quote: "Heavier periods for 3 months almost made me give up. Then they normalised. Now I have 10 years of hormone-free contraception sorted. Worth the wait.", name: 'Vimbai, 24', detail: 'University of Zimbabwe', tag: '9 months post-insertion' },
  ],
  'male-condom': [
    { quote: "My partner complained about condoms until we watched the video guide together on this app. Now he understands why they matter. Knowledge changes everything.", name: 'Chido, 20', detail: 'Chinhoyi University', tag: 'Couples experience' },
    { quote: "I pick up a dozen free condoms every clinic visit — no questions, no shame. Keep them at home, not just in your wallet.", name: 'Takudzwa, 22', detail: 'Harare Institute of Technology', tag: 'Regular user' },
  ],
  'emergency-contraception': [
    { quote: "I was too embarrassed to ask for EC. Then a friend told me pharmacies sell it over the counter with no prescription needed. I wish I'd known sooner.", name: 'Anonymous, 21', detail: 'NUST student', tag: 'Barrier overcome' },
    { quote: "Took EC after a condom broke on a Friday night. The pharmacist was kind and also mentioned PrEP. One scary moment turned into a useful health conversation.", name: 'Ngoni, 22', detail: 'National University of Science & Technology', tag: 'First-time user' },
  ],
  'withdrawal': [
    { quote: "I relied on withdrawal as my only method. When I saw the real stats — 78% typical use — I immediately switched to condoms. The peace of mind is incomparable.", name: 'Anonymous, 21', detail: 'UZ student', tag: 'Method switcher' },
  ],
  'oral-prep': [
    { quote: "I was worried people would think I had HIV if they saw my pills. I keep them in a vitamin bottle now. It's my health and my private choice. PrEP gave me real freedom.", name: 'Tafadzwa, 22', detail: 'Midlands State University', tag: '8 months on oral PrEP' },
    { quote: "The nausea in week one was very real. By week three it was completely gone. Don't quit in the first weeks — it absolutely passes.", name: 'Anonymous, 23', detail: 'Great Zimbabwe University', tag: 'Side effect experience' },
  ],
  'cab-la': [
    { quote: "I couldn't remember to take a daily pill reliably. CAB-LA changed everything — one injection every two months is all I need. The injection site was sore for just one day. That's it.", name: 'Tendai, 24', detail: 'CeSHHAR participant, Harare', tag: 'Switched from oral PrEP' },
  ],
  'pep': [
    { quote: "After a high-risk exposure I went to emergency at midnight. They gave me PEP within the hour. I'm now HIV-negative and transitioned to PrEP. Please don't wait — every hour matters.", name: 'Anonymous, 23', detail: 'Harare student', tag: 'PEP → PrEP journey' },
  ],
  'vmmc': [
    { quote: "The counsellor answered every question without rushing me. The procedure was quick and recovery took about 3 weeks. Knowing the HIV risk reduction made it absolutely worth it.", name: 'Simba, 22', detail: 'NUST student', tag: 'Post-procedure' },
  ],
  'tasp': [
    { quote: "When my doctor explained U=U my life changed. I have an undetectable viral load and my HIV-negative partner and I can now live without constant fear. This science is life-changing.", name: 'Anonymous, 27', detail: 'Bulawayo, on ART for 4 years', tag: 'Living with HIV on ART' },
  ],
  'harm-reduction': [
    { quote: "The outreach team never judged me — they just gave me clean needles and helped me stay safe while I worked through my situation. That non-judgmental approach kept me alive.", name: 'Anonymous, 25', detail: 'CeSHHAR outreach participant', tag: 'Shares outreach experience' },
  ],
}

const FEATURED_TESTIMONIALS: Array<{
  quote: string; name: string; detail: string;
  method: string; methodId: string; category: 'hiv' | 'contraception'
}> = [
  {
    quote: "I was worried people would think I had HIV if they saw my pills. PrEP is my private choice and it gives me real freedom. Starting it was the best decision I've made.",
    name: 'Tafadzwa, 22', detail: 'Midlands State University',
    method: 'Oral PrEP', methodId: 'oral-prep', category: 'hiv',
  },
  {
    quote: "My periods stopped on Depo which scared me at first. The nurse explained it's completely normal. As a student it's honestly been a relief — one less thing to manage.",
    name: 'Chido, 20', detail: 'Midlands State University',
    method: 'Depo-Provera', methodId: 'depo-provera', category: 'contraception',
  },
  {
    quote: "After a high-risk exposure I went to emergency at midnight and got PEP within the hour. I'm HIV-negative now and on PrEP. Please don't wait — every hour counts.",
    name: 'Anonymous, 23', detail: 'Harare student',
    method: 'PEP', methodId: 'pep', category: 'hiv',
  },
  {
    quote: "When my doctor explained U=U it changed my life. I have an undetectable viral load and my HIV-negative partner and I can now live without constant fear.",
    name: 'Anonymous, 27', detail: 'Bulawayo, on ART for 4 years',
    method: 'U=U / TasP', methodId: 'tasp', category: 'hiv',
  },
  {
    quote: "I was too embarrassed to buy emergency contraception. Then I learned pharmacies sell it over the counter with no prescription. Please tell your friends — knowledge removes the shame.",
    name: 'Anonymous, 21', detail: 'NUST student',
    method: 'Emergency Contraception', methodId: 'emergency-contraception', category: 'contraception',
  },
  {
    quote: "My partner complained about condoms until we watched the video guide together on this app. He finally understood why they matter. Knowledge really does change everything.",
    name: 'Chido, 20', detail: 'Chinhoyi University',
    method: 'Condoms', methodId: 'male-condom', category: 'contraception',
  },
]

const COMMUNITY_STORAGE_KEY = 'mascot_community_testimonials'

interface CommunityTestimonial {
  quote: string
  name: string
  detail: string
  method: string
  methodId: string
  category: 'hiv' | 'contraception'
}

function loadCommunityTestimonials(): CommunityTestimonial[] {
  try { return JSON.parse(localStorage.getItem(COMMUNITY_STORAGE_KEY) || '[]') } catch { return [] }
}

const VIDEO_MAP: Record<string, string> = {
  'male-condom': '/videos/how-to-use-condom.mp4',
  'emergency-contraception': '/videos/morning-after-pill.mp4',
  'oral-prep': '/videos/how-to-use-prep.mp4',
}

function effectivenessColor(pct: number) {
  if (pct >= 95) return 'bg-emerald-500'
  if (pct >= 85) return 'bg-[#93C962]'
  if (pct >= 70) return 'bg-amber-400'
  return 'bg-red-400'
}

function MethodCard({
  method,
  selected,
  onSelect,
  maxCompare,
  onLearnMore,
}: {
  method: Method
  selected: boolean
  onSelect: () => void
  maxCompare: boolean
  onLearnMore: () => void
}) {
  const cfg = CAT_CONFIG[method.category]

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1 ${selected ? 'ring-2 ring-[#93C962]' : ''}`}>

      {/* Photo */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={method.img}
          alt={method.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.target as HTMLImageElement
            t.onerror = null
            t.style.display = 'none'
            if (t.parentElement) {
              t.parentElement.style.background = method.category === 'hiv'
                ? 'linear-gradient(135deg,#e0f2fe,#bae6fd)'
                : 'linear-gradient(135deg,#f0fae6,#d4f4a8)'
            }
          }}
        />
        {method.urgent && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold shadow-md">
            <Zap size={10} className="fill-white" /> Urgent
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect() }}
          disabled={maxCompare && !selected}
          className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-150 shadow-sm ${
            selected
              ? 'bg-[#93C962] border-[#93C962] text-white'
              : maxCompare
              ? 'bg-white/60 border-gray-200 text-gray-300 cursor-not-allowed'
              : 'bg-white/90 border-white/70 text-gray-700 hover:bg-white hover:border-[#93C962] hover:text-[#5A7D3B]'
          }`}
        >
          {selected ? <Check size={11} /> : <Plus size={11} />}
          {selected ? 'Added' : maxCompare ? 'Max 3' : 'Compare'}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${cfg.bg} ${cfg.text}`}>
            {SUBCAT_LABELS[method.subcategory] ?? method.subcategory}
          </span>
          <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-snug">{method.name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{method.tagline}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${method.costFree || method.costLabel ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {method.costLabel ?? (method.costFree ? 'Free' : 'Paid')}
            </span>
            {method.protectsSTIs && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <Shield size={9} /> STI
              </span>
            )}
          </div>
          <button
            onClick={onLearnMore}
            className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${cfg.text} hover:opacity-70`}
          >
            Learn more <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function CompareModal({ methods, onClose }: { methods: Method[]; onClose: () => void }) {
  const fields: Array<{ label: string; render: (m: Method) => React.ReactNode }> = [
    {
      label: 'Effectiveness', render: (m) => (
        <div>
          <div className="text-xs font-semibold mb-1">{m.effectivenessLabel}</div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full ${effectivenessColor(m.effectivenessTypical)}`} style={{ width: `${m.effectivenessTypical}%` }} />
          </div>
        </div>
      )
    },
    { label: 'Duration', render: (m) => <span className="text-xs">{m.duration}</span> },
    {
      label: 'Cost', render: (m) => (
        <span className={`text-xs ${m.costFree ? 'text-emerald-600 font-semibold' : 'text-amber-600'}`}>
          {m.costFree ? '✓ Free' : 'Paid'} · {m.costDetail}
        </span>
      )
    },
    {
      label: 'STI Protection', render: (m) => m.protectsSTIs
        ? <span className="text-xs text-blue-600 font-semibold">✓ Yes</span>
        : <span className="text-xs text-gray-400">✗ No</span>
    },
    {
      label: 'Side Effects', render: (m) => (
        <div className="flex flex-wrap gap-1">
          {m.sideEffects.slice(0, 3).map(se => (
            <span key={se} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs">{se}</span>
          ))}
        </div>
      )
    },
    { label: 'Where to Get', render: (m) => <span className="text-xs text-gray-600">{m.whereToGet.slice(0, 2).join(', ')}</span> },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-black text-gray-900 text-lg">Compare Methods</h3>
            <p className="text-xs text-gray-500">{methods.length} methods side by side</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `120px repeat(${methods.length}, 1fr)` }}>
              <div />
              {methods.map(m => (
                <div key={m.id} className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden mb-2">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-bold text-xs text-gray-900 leading-tight">{m.name}</div>
                </div>
              ))}
            </div>
            {fields.map(({ label, render }) => (
              <div key={label} className="grid gap-4 py-3 border-t border-gray-50" style={{ gridTemplateColumns: `120px repeat(${methods.length}, 1fr)` }}>
                <div className="text-xs font-semibold text-gray-500 flex items-start pt-0.5">{label}</div>
                {methods.map(m => <div key={m.id}>{render(m)}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MethodModal({ method, onClose }: { method: Method; onClose: () => void }) {
  const [mythOpen, setMythOpen] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSrc = VIDEO_MAP[method.id] ?? null
  const testimonials = TESTIMONIALS[method.id] ?? []

  const isHiv = method.category === 'hiv'
  const accent    = isHiv ? '#0EA5E9' : '#93C962'
  const accentDark= isHiv ? '#0369a1' : '#3d6b20'
  const accentBg  = isHiv ? '#f0f9ff' : '#f0fae6'
  const accentBdr = isHiv ? '#bae6fd' : '#c6f6a0'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      videoRef.current?.pause()
    }
  }, [onClose])

  const SectionLabel = ({ color = accent, children }: { color?: string; children: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
      <div style={{ width: 3, height: 15, background: color, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        {children}
      </span>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 22,
          width: '100%', maxWidth: 620,
          maxHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Hero image ──────────────────────── */}
        <div style={{ position: 'relative', height: 230, flexShrink: 0 }}>
          <img
            src={method.img}
            alt={method.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.onerror = null; t.style.display = 'none'
              if (t.parentElement) t.parentElement.style.background = isHiv
                ? 'linear-gradient(135deg,#e0f2fe,#bae6fd)'
                : 'linear-gradient(135deg,#f0fae6,#d4f4a8)'
            }}
          />

          {/* Black overlay on image */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)' }} />
          {/* Bottom gradient for text */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)' }} />
          {/* Top accent stripe */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={15} />
          </button>

          {/* Urgent badge */}
          {method.urgent && (
            <div style={{
              position: 'absolute', top: 14, left: 14,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 99,
              background: '#dc2626', color: '#fff',
              fontSize: 11, fontWeight: 800,
              boxShadow: '0 2px 8px rgba(220,38,38,0.5)',
            }}>
              <Zap size={11} className="fill-white" /> Urgent — Act Fast
            </div>
          )}

          {/* Title block */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                padding: '4px 11px', borderRadius: 99,
              }}>
                {method.emoji} {SUBCAT_LABELS[method.subcategory] ?? method.subcategory}
              </span>
              {method.protectsSTIs && (
                <span style={{
                  background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(147,197,253,0.5)',
                  color: '#93c5fd', fontSize: 10, fontWeight: 700,
                  padding: '4px 11px', borderRadius: 99,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Shield size={9} /> STI Protection
                </span>
              )}
            </div>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1.15, margin: '0 0 5px', letterSpacing: '-0.02em' }}>
              {method.name}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0 }}>{method.tagline}</p>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '20px 22px 0' }}>
            {[
              {
                value: `${method.effectivenessTypical}%`,
                label: 'Effectiveness',
                bg: accentBg, bdr: accentBdr, color: accentDark, big: true,
              },
              {
                value: method.duration,
                label: 'Duration',
                bg: '#f9fafb', bdr: '#f0f0f0', color: '#1f2937', big: false,
              },
              {
                value: method.costLabel ?? (method.costFree ? 'Free' : 'Paid'),
                label: 'Cost',
                bg: method.costFree || method.costLabel ? '#f0fdf4' : '#fffbeb',
                bdr: method.costFree || method.costLabel ? '#bbf7d0' : '#fde68a',
                color: method.costFree ? '#15803d' : '#b45309', big: false,
              },
            ].map(({ value, label, bg, bdr, color, big }) => (
              <div key={label} style={{
                background: bg, border: `1px solid ${bdr}`,
                borderRadius: 13, padding: '14px 10px', textAlign: 'center',
              }}>
                <div style={{
                  fontSize: big ? 26 : 14, fontWeight: 900, color, lineHeight: 1.15,
                  marginBottom: 5, letterSpacing: big ? '-0.02em' : 0,
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Content sections */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>

            <section>
              <SectionLabel>Overview</SectionLabel>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{method.howItWorks}</p>
            </section>

            <div style={{ height: 1, background: '#f3f4f6' }} />

            <section>
              <SectionLabel>How to Use</SectionLabel>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
                {method.steps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: accent, color: isHiv ? '#fff' : '#1A2E0A',
                      fontSize: 12, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: 1, boxShadow: `0 2px 6px ${accent}55`,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.65 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {videoSrc && (
              <>
                <div style={{ height: 1, background: '#f3f4f6' }} />
                <section>
                  <SectionLabel>Video Guide</SectionLabel>
                  <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                    <video ref={videoRef} src={videoSrc} controls preload="metadata" playsInline className="w-full aspect-video">
                      <source src={videoSrc} type="video/mp4" />
                    </video>
                  </div>
                </section>
              </>
            )}

            <div style={{ height: 1, background: '#f3f4f6' }} />

            <section>
              <SectionLabel color="#f59e0b">Possible Side Effects</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {method.sideEffects.map(se => (
                  <span key={se} style={{
                    padding: '5px 12px', background: '#fffbeb',
                    color: '#92400e', border: '1px solid #fde68a',
                    borderRadius: 8, fontSize: 12, fontWeight: 500,
                  }}>
                    {se}
                  </span>
                ))}
              </div>
            </section>

            <div style={{ height: 1, background: '#f3f4f6' }} />

            <section>
              <SectionLabel color="#10b981">Access & Cost</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 8 }}>
                {method.whereToGet.map(w => (
                  <span key={w} style={{
                    padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: accentBg, color: accentDark, border: `1px solid ${accentBdr}`,
                  }}>
                    {w}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{method.costDetail}</p>
            </section>

            {method.note && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 16px', borderRadius: 12,
                background: accentBg, border: `1px solid ${accentBdr}`,
              }}>
                <Star size={14} color={accentDark} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: accentDark, lineHeight: 1.65, margin: 0 }}>{method.note}</p>
              </div>
            )}

            {method.myths.length > 0 && (
              <>
                <div style={{ height: 1, background: '#f3f4f6' }} />
                <section>
                  <SectionLabel color="#ef4444">Myths vs Facts</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {method.myths.map((m, i) => (
                      <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
                        <button
                          onClick={() => setMythOpen(mythOpen === i ? null : i)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', padding: '12px 16px',
                            textAlign: 'left', background: 'none', border: 'none',
                            cursor: 'pointer', gap: 12,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1 }}>
                            <X size={12} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 12, color: '#ef4444', fontStyle: 'italic', fontWeight: 500 }}>
                              "{m.myth}"
                            </span>
                          </span>
                          <ChevronDown size={14} color="#9ca3af" style={{
                            flexShrink: 0,
                            transition: 'transform 0.2s',
                            transform: mythOpen === i ? 'rotate(180deg)' : 'none',
                          }} />
                        </button>
                        {mythOpen === i && (
                          <div style={{
                            padding: '12px 16px', background: '#f0fdf4',
                            display: 'flex', alignItems: 'flex-start', gap: 8,
                            borderTop: '1px solid #dcfce7',
                          }}>
                            <Check size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                            <p style={{ fontSize: 12, color: '#15803d', lineHeight: 1.65, margin: 0 }}>{m.fact}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {testimonials.length > 0 && (
              <>
                <div style={{ height: 1, background: '#f3f4f6' }} />
                <section>
                  <SectionLabel color="#7c3aed">Peer Experiences</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {testimonials.map((t, i) => (
                      <div key={i} style={{
                        padding: '14px 16px', borderRadius: 12,
                        background: accentBg, border: `1px solid ${accentBdr}`,
                        position: 'relative',
                      }}>
                        <Quote size={16} color={accentDark} style={{ opacity: 0.3, position: 'absolute', top: 12, right: 14, flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.72, fontStyle: 'italic', margin: '0 0 10px', paddingRight: 28 }}>
                          "{t.quote}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: accentDark }}>— {t.name}</span>
                            <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>{t.detail}</span>
                          </div>
                          {t.tag && (
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              padding: '3px 9px', borderRadius: 99,
                              background: `${accent}1a`, color: accentDark,
                              border: `1px solid ${accentBdr}`,
                            }}>
                              {t.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* CTA */}
            <a
              href="/chat"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '14px 0', borderRadius: 13,
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                background: isHiv
                  ? 'linear-gradient(135deg, #0369a1, #0ea5e9)'
                  : 'linear-gradient(135deg, #3d6b20, #93C962)',
                color: '#fff',
                boxShadow: isHiv
                  ? '0 4px 16px rgba(14,165,233,0.38)'
                  : '0 4px 16px rgba(93,155,40,0.38)',
                marginBottom: 2,
              }}
            >
              <Shield size={16} /> Ask AI Health Assistant about this method
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompareTip({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-gradient-to-r from-[#f0fae6] to-white border border-[#93C962]/35 rounded-2xl p-4 mb-5 flex items-start gap-4 shadow-sm">
      <div className="w-9 h-9 rounded-xl bg-[#93C962]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <BarChart2 size={17} className="text-[#5A7D3B]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm mb-2.5">Compare methods side by side</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#93C962] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">1</span>
            <span className="text-xs text-gray-600">Tap <span className="font-semibold text-[#5A7D3B] bg-[#93C962]/10 px-1.5 py-0.5 rounded-md">+ Compare</span> on any card</span>
          </div>
          <ArrowRight size={11} className="text-gray-300 hidden sm:block flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#93C962] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">2</span>
            <span className="text-xs text-gray-600">Pick <span className="font-semibold">2 or 3</span> methods you're curious about</span>
          </div>
          <ArrowRight size={11} className="text-gray-300 hidden sm:block flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#93C962] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">3</span>
            <span className="text-xs text-gray-600">Hit <span className="font-semibold text-[#5A7D3B]">Compare methods</span> in the bar below</span>
          </div>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 p-1 mt-0.5 rounded-lg hover:bg-gray-100"
        aria-label="Dismiss tip"
      >
        <X size={14} />
      </button>
    </div>
  )
}

function CompareTray({
  compareIds,
  methods,
  onRemove,
  onCompare,
  onClear,
}: {
  compareIds: string[]
  methods: Method[]
  onRemove: (id: string) => void
  onCompare: () => void
  onClear: () => void
}) {
  const selected = methods.filter(m => compareIds.includes(m.id))
  const emptySlots = 3 - selected.length

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        compareIds.length > 0 ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t-2 border-[#93C962]/50 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">

          {/* Label */}
          <div className="hidden md:flex flex-col flex-shrink-0 pr-3 border-r border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Comparing</p>
            <p className="text-xs text-gray-500">{selected.length} / 3 selected</p>
          </div>

          {/* Method slots */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0">
            {selected.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-2 bg-[#f8fdf4] border border-[#93C962]/40 rounded-xl pl-1 pr-2.5 py-1.5 flex-shrink-0"
              >
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="text-xs font-semibold text-gray-700 max-w-[88px] truncate">{m.name}</span>
                <button
                  onClick={() => onRemove(m.id)}
                  className="ml-0.5 w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors flex-shrink-0"
                  aria-label={`Remove ${m.name}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-32 h-11 border-2 border-dashed border-gray-200 rounded-xl flex-shrink-0"
              >
                <span className="text-[11px] text-gray-300 font-medium">+ Add method</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear all
            </button>
            <button
              disabled={selected.length < 2}
              onClick={onCompare}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selected.length >= 2
                  ? 'bg-[#93C962] text-[#1A2E0A] hover:bg-[#7ab050] shadow-sm'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <BarChart2 size={14} />
              {selected.length >= 2 ? `Compare ${selected.length} methods` : 'Select 2+ to compare'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function ShareTestimonyModal({
  user,
  onClose,
  onSubmit,
}: {
  user: { fullName: string; username: string } | null
  onClose: () => void
  onSubmit: (t: CommunityTestimonial) => void
}) {
  const [quote, setQuote] = useState('')
  const [methodId, setMethodId] = useState(METHODS[0].id)
  const [isAnonymous, setIsAnonymous] = useState(!user)
  const [error, setError] = useState('')

  const selectedMethod = METHODS.find(m => m.id === methodId)!
  const displayName = isAnonymous ? 'Anonymous' : (user?.fullName ?? 'Anonymous')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  function handleSubmit() {
    if (quote.trim().length < 30) {
      setError('Please share at least 30 characters so others can benefit from your experience.')
      return
    }
    onSubmit({
      quote: quote.trim(),
      name: displayName,
      detail: isAnonymous ? 'Community member' : (user?.fullName ?? 'Community member'),
      method: selectedMethod.name,
      methodId: selectedMethod.id,
      category: selectedMethod.category,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-gray-900 text-lg">Share Your Experience</h3>
            <p className="text-xs text-gray-400 mt-0.5">Help other students make informed decisions</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">

          {/* Story */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Your story</label>
            <textarea
              rows={4}
              placeholder="What was your experience? What helped or surprised you? What would you tell a friend?"
              value={quote}
              onChange={e => { setQuote(e.target.value); setError('') }}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#93C962]/30 focus:border-[#93C962] resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1">
              {error
                ? <p className="text-xs text-red-500">{error}</p>
                : <span />
              }
              <span className={`text-xs ml-auto ${quote.length >= 30 ? 'text-[#5A7D3B] font-semibold' : 'text-gray-300'}`}>
                {quote.length} / 30 min
              </span>
            </div>
          </div>

          {/* Method */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Related method</label>
            <select
              value={methodId}
              onChange={e => setMethodId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#93C962]/30 focus:border-[#93C962] bg-white"
            >
              <optgroup label="Contraception">
                {METHODS.filter(m => m.category === 'contraception').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              <optgroup label="HIV Prevention">
                {METHODS.filter(m => m.category === 'hiv').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Identity */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-700">Will appear as</span>
              {user && (
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    isAnonymous
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      : 'bg-[#93C962]/15 text-[#5A7D3B] hover:bg-[#93C962]/25'
                  }`}
                >
                  {isAnonymous ? '🙈 Staying anonymous' : '✓ Using my name'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                isAnonymous ? 'bg-gray-200 text-gray-500' : 'bg-[#93C962]/15 text-[#5A7D3B]'
              }`}>
                {isAnonymous ? '?' : displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-400">
                  {isAnonymous
                    ? 'Your identity is completely hidden'
                    : 'Your full name will appear on the testimony'}
                </p>
              </div>
            </div>
            {!user && (
              <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                Not logged in — your story will post anonymously.{' '}
                <a href="/login" className="text-[#5A7D3B] font-semibold hover:underline">Log in</a>
                {' '}to post with your name.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-xl bg-[#93C962] text-[#1A2E0A] text-sm font-bold hover:bg-[#7ab050] transition-colors shadow-sm"
          >
            Share Story
          </button>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection({ onMethodClick }: { onMethodClick: (m: Method) => void }) {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [showShare, setShowShare] = useState(false)
  const [communityTestimonials, setCommunityTestimonials] = useState<CommunityTestimonial[]>(loadCommunityTestimonials)

  const allTestimonials = [...FEATURED_TESTIMONIALS, ...communityTestimonials]
  const CARDS_PER_PAGE = 3
  const totalPages = Math.ceil(allTestimonials.length / CARDS_PER_PAGE)

  function scrollToPage(p: number) {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector('[data-card]') as HTMLElement | null
    if (!card) return
    const cardW = card.offsetWidth + 16
    el.scrollTo({ left: p * cardW * CARDS_PER_PAGE, behavior: 'smooth' })
    setPage(p)
  }

  useEffect(() => {
    const t = setInterval(() => {
      setPage(prev => {
        const next = (prev + 1) % totalPages
        const el = scrollRef.current
        if (el) {
          const card = el.querySelector('[data-card]') as HTMLElement | null
          if (card) {
            const cardW = card.offsetWidth + 16
            el.scrollTo({ left: next * cardW * CARDS_PER_PAGE, behavior: 'smooth' })
          }
        }
        return next
      })
    }, 60_000)
    return () => clearInterval(t)
  }, [totalPages])

  function handleSubmit(t: CommunityTestimonial) {
    const updated = [...communityTestimonials, t]
    setCommunityTestimonials(updated)
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <span className="inline-block bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-purple-100">
            Community Voices
          </span>
          <h2 className="text-lg font-black text-gray-900">What students are saying</h2>
          <p className="text-sm text-gray-400 mt-0.5">Real experiences shared by peers across Zimbabwe</p>
        </div>
        <button
          onClick={() => setShowShare(true)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#93C962] text-[#1A2E0A] rounded-xl text-sm font-bold hover:bg-[#7ab050] transition-colors shadow-sm mt-1"
        >
          <Plus size={15} /> Share Your Story
        </button>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory">
        {allTestimonials.map((t, i) => {
          const isHiv = t.category === 'hiv'
          return (
            <div
              key={i}
              data-card=""
              className="flex-shrink-0 w-[300px] sm:w-[320px] snap-start bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                  isHiv ? 'bg-sky-100 text-sky-700' : 'bg-[#93C962]/15 text-[#5A7D3B]'
                }`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.detail}</div>
                </div>
              </div>
              <Quote size={14} className="text-gray-200 mb-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed italic flex-1">"{t.quote}"</p>
              <button
                onClick={() => {
                  const method = METHODS.find(m => m.id === t.methodId)
                  if (method) onMethodClick(method)
                }}
                className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full self-start transition-colors ${
                  isHiv
                    ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                    : 'bg-[#93C962]/10 text-[#5A7D3B] hover:bg-[#93C962]/20'
                }`}
              >
                {t.method} <ArrowRight size={10} />
              </button>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`rounded-full transition-all duration-300 ${
                page === i ? 'w-5 h-1.5 bg-[#93C962]' : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {showShare && (
        <ShareTestimonyModal
          user={user}
          onClose={() => setShowShare(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default function PreventionPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'contraception' | 'hiv'>('all')
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilter>('all')
  const [modalMethod, setModalMethod] = useState<Method | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [showCompareTip, setShowCompareTip] = useState(true)
  const [page, setPage] = useState(0)

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [search, activeCategory, activeSubFilter])

  // Auto-dismiss tip after 12 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowCompareTip(false), 12000)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return METHODS.filter(m => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory
      const matchSub = activeSubFilter === 'all' || GROUP_IDS[activeSubFilter].includes(m.id)
      const q = search.toLowerCase()
      const matchSearch = !q
        || m.name.toLowerCase().includes(q)
        || m.tagline.toLowerCase().includes(q)
        || m.howItWorks.toLowerCase().includes(q)
      return matchCat && matchSub && matchSearch
    })
  }, [search, activeCategory, activeSubFilter])

  function subFilterCount(key: Exclude<SubFilter, 'all'>) {
    return METHODS.filter(m => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory
      return matchCat && GROUP_IDS[key].includes(m.id)
    }).length
  }

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE)
  const pageItems = filtered.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
  const compareMethods = METHODS.filter(m => compareIds.includes(m.id))

  function toggleCompare(id: string) {
    setShowCompareTip(false)
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const contraCount = METHODS.filter(m => m.category === 'contraception').length
  const hivCount = METHODS.filter(m => m.category === 'hiv').length

  return (
    <div className={`min-h-screen bg-[#F5FAF0] ${compareIds.length > 0 ? 'pb-20' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Page header with inline search */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-11 h-11 rounded-xl bg-[#93C962]/15 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-[#5A7D3B]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Prevention Methods</h1>
            <p className="text-gray-400 text-sm">Evidence-based HIV and pregnancy prevention for young people in Zimbabwe</p>
          </div>
          <div className="relative w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="e.g. 'injection', 'daily', 'free'…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93C962]/30 focus:border-[#93C962] text-sm text-gray-700 placeholder:text-gray-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Category segmented control */}
        <div className="bg-gray-100 rounded-xl p-1 mb-4 flex gap-1">
          {(
            [
              ['all', 'All Methods', METHODS.length],
              ['contraception', 'Pregnancy Prevention', contraCount],
              ['hiv', 'HIV Prevention', hivCount],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setActiveSubFilter('all') }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{key === 'all' ? 'All' : key === 'contraception' ? 'Pregnancy' : 'HIV'}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                activeCategory === key
                  ? key === 'hiv'
                    ? 'bg-sky-100 text-sky-600'
                    : key === 'contraception'
                    ? 'bg-[#93C962]/20 text-[#5A7D3B]'
                    : 'bg-gray-100 text-gray-500'
                  : 'text-gray-400'
              }`}>{count}</span>
            </button>
          ))}
        </div>


        {/* Sub-category filter pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_SUB_FILTERS[activeCategory].map(key => {
            const count = subFilterCount(key)
            const isActive = activeSubFilter === key
            return (
              <button
                key={key}
                onClick={() => setActiveSubFilter(key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? 'bg-[#93C962] border-[#93C962] text-[#1A2E0A] shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#93C962]/50 hover:text-gray-700'
                }`}
              >
                {SUB_FILTER_LABELS[key]}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-[#1A2E0A]/15 text-[#1A2E0A]' : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Compare onboarding tip */}
        {showCompareTip && (
          <CompareTip onDismiss={() => setShowCompareTip(false)} />
        )}

        {/* Cards grid */}
        {pageItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {pageItems.map(method => (
              <MethodCard
                key={method.id}
                method={method}
                selected={compareIds.includes(method.id)}
                onSelect={() => toggleCompare(method.id)}
                maxCompare={compareIds.length >= 3 && !compareIds.includes(method.id)}
                onLearnMore={() => setModalMethod(method)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-semibold text-gray-600 mb-2">No methods match your search</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all') }}
              className="text-sm text-[#5A7D3B] underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                  page === i
                    ? 'bg-[#93C962] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Testimonials */}
        <TestimonialsSection onMethodClick={setModalMethod} />

      </div>

      <CompareTray
        compareIds={compareIds}
        methods={METHODS}
        onRemove={id => setCompareIds(prev => prev.filter(x => x !== id))}
        onCompare={() => setShowCompare(true)}
        onClear={() => setCompareIds([])}
      />

      {showCompare && compareMethods.length >= 2 && (
        <CompareModal methods={compareMethods} onClose={() => setShowCompare(false)} />
      )}

      {modalMethod && (
        <MethodModal method={modalMethod} onClose={() => setModalMethod(null)} />
      )}
    </div>
  )
}
