import {
  MessageCircle, CalendarHeart, ShoppingBag, Salad, Sparkles, HeartPulse, Users, Sun, HandHeart,
  type LucideIcon,
} from 'lucide-react';

/** Neema's nine core services, as defined in the v1.9 specification (section 1.4). */
export type Service = {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  Icon: LucideIcon;
  tint: string;
  ink: string;
};

export const SERVICES: Service[] = [
  {
    id: 'care',
    title: 'Care during and after pregnancy',
    summary: 'Follow your pregnancy week by week and know what to do when something feels wrong.',
    includes: [
      'Due date and week-by-week updates',
      'Antenatal visit reminders',
      'Symptom checker with clear next steps',
      'SOS: one tap to call 119 and alert your family',
      'Nearest maternity facilities',
      'Medicine safety check',
      'Contraction timer and hospital bag',
      'After birth: recovery, postnatal visits, breastfeeding and danger signs',
      'Care library with audio, including sexual health and myths & facts',
    ],
    Icon: HeartPulse, tint: 'bg-neema-primary-soft', ink: 'text-neema-dark',
  },
  {
    id: 'ask',
    title: 'Ask Neema',
    summary: 'An AI assistant that answers everyday questions in English or French, at any time.',
    includes: [
      'Answers only from clinician-approved content and WHO and African guidelines',
      'Shows its sources',
      'Never diagnoses or prescribes',
      'Danger signs go straight to SOS',
    ],
    Icon: MessageCircle, tint: 'bg-neema-lilac', ink: 'text-neema-lilac-ink',
  },
  {
    id: 'diet',
    title: 'Diet for each stage',
    summary: 'What to eat in trimesters 1, 2 and 3 and after birth, using foods from your own market.',
    includes: [
      'Local foods like ndolé, folong, plantains, groundnuts and mackerel',
      'Iron and folate focus to prevent anaemia',
      'More nutrients, not “eating for two”',
      'My daily habits: water (raised on hot days), iron foods, active minutes',
      'Local swaps for imported ingredients',
    ],
    Icon: Salad, tint: 'bg-neema-success-soft', ink: 'text-neema-success-ink',
  },
  {
    id: 'routine',
    title: 'Healthy & skin routine',
    summary: 'Stay active and care for your skin safely, during and after pregnancy.',
    includes: [
      'Activity built around daily life: 150 minutes a week',
      'Zero-equipment routines and pelvic floor exercises',
      'Melanin-informed skincare',
      'Cosmetic ingredient checker, including skin-lightening risks',
      'Genetics vs habits: what you can change',
    ],
    Icon: Sparkles, tint: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink',
  },
  {
    id: 'fp',
    title: 'Family planning',
    summary: 'Private, complete information to plan or avoid a pregnancy.',
    includes: [
      'Cycle calendar and fertile-window estimate',
      'Pre-conception checklist and nutrition',
      '13 modern methods with pros and cons',
      'Compare up to three methods side by side',
      'Planning calendar and birth spacing',
      'Contraception after birth and while breastfeeding',
    ],
    Icon: CalendarHeart, tint: 'bg-neema-primary-soft', ink: 'text-neema-dark',
  },
  {
    id: 'shop',
    title: 'Baby & mother shopping',
    summary: 'A practical checklist so you are ready for birth without overspending.',
    includes: [
      'Lists by trimester and after birth',
      'Essentials-only view',
      'Clothes, hygiene products and equipment guidance',
      'Hospital bag and your facility’s maternity (“mama kit”) list',
      'How-to guides for breast pumps, milk storage and sterilising',
    ],
    Icon: ShoppingBag, tint: 'bg-neema-ochre-soft', ink: 'text-neema-ochre-ink',
  },
  {
    id: 'partner',
    title: 'Partner support',
    summary: 'Bring your husband, mother or sister along. You choose what they see.',
    includes: [
      'Invite a trusted support person',
      'Mother-controlled sharing',
      'Partner home with weekly guidance',
      'Emergency alerts by push or SMS, even on basic phones',
    ],
    Icon: Users, tint: 'bg-neema-lilac', ink: 'text-neema-lilac-ink',
  },
  {
    id: 'tips',
    title: 'Regular tips',
    summary: 'A daily tip and a weekly update matched to your stage.',
    includes: [
      'Diet, routine, skin, care and family planning topics',
      'Encouragement along the way',
      'In the app, by push notification or by SMS',
    ],
    Icon: Sun, tint: 'bg-neema-success-soft', ink: 'text-neema-success-ink',
  },
  {
    id: 'spirit',
    title: 'Spiritual & emotional support',
    summary: 'Care for your mind and spirit as well as your body.',
    includes: [
      'Optional daily prayer or verse: Christian, Muslim or none, with audio',
      'Calming audio and breathing exercises',
      'Mood check-in and postnatal mood screening with referral',
      'Support after a loss',
      'Crisis help, any time',
    ],
    Icon: HandHeart, tint: 'bg-neema-primary-soft', ink: 'text-neema-dark',
  },
];

/** Planned for release 1.1 (specification section 1.6.4). */
export const COMING_SOON = [
  'Voice questions and Pidgin in Ask Neema',
  'Kick counter',
  'Scan cosmetic ingredients and maternity lists with your camera',
  'Contraception renewal reminders',
  'Partner tasks and danger-signs course',
  'Support for twins',
];
