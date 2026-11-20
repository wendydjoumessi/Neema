/**
 * Healthy & skin routine content (spec §9.3 FR-MOVE, §9.7 FR-SKIN, §9.8 FR-CONT-15, §16 FR-POST-09).
 * Everything here must be reviewed by Neema's clinical reviewer (ideally with a dermatologist) before launch.
 */

export type Move = {
  id: string;
  name: string;
  dose: string;
  steps: string[];
  /** Extra caution after a caesarean. */
  csNote?: string;
};

// ---------------------------------------------------------------------------
// Activity after birth: three stages. The plan moves past "gentle" only when
// she confirms a health worker checked her (FR-MOVE-02).
// ---------------------------------------------------------------------------
export const MOVES_GENTLE: Move[] = [
  {
    id: 'kegel', name: 'Pelvic floor squeezes', dose: '10 squeezes, 3 times a day',
    steps: [
      'Sit or lie comfortably and breathe normally.',
      'Squeeze the muscles you would use to hold in wind and stop a wee, and lift them up inside.',
      'Hold for 3 to 5 seconds, then fully relax for 5 seconds.',
      'Repeat 10 times. Over the weeks, build up to holding for 10 seconds.',
      'Don’t hold your breath or squeeze your bottom or thighs. Don’t practise while actually passing urine.',
    ],
  },
  {
    id: 'breath', name: 'Belly breathing', dose: '10 slow breaths, twice a day',
    steps: [
      'Lie on your back with knees bent, or on your side.',
      'Breathe in through your nose and let your belly rise.',
      'Breathe out slowly. As you do, gently draw your belly button in towards your spine and lift your pelvic floor.',
      'Relax completely, then repeat. This reconnects your deep tummy muscles safely.',
    ],
    csNote: 'After a caesarean, rest a hand or pillow over your wound for comfort.',
  },
  {
    id: 'tilt', name: 'Pelvic tilts', dose: '10 times, once or twice a day',
    steps: [
      'Lie on your back with knees bent and feet flat.',
      'Breathe out and gently press your lower back into the floor, tilting your pelvis up.',
      'Hold for 3 seconds, then relax.',
    ],
    csNote: 'After a caesarean, start only when it feels comfortable, usually after the first week or two.',
  },
  {
    id: 'walk', name: 'Short walks', dose: '5 to 10 minutes, a little more each day',
    steps: [
      'Walk around your home or compound, at an easy pace.',
      'Add a few minutes each day if your bleeding doesn’t get heavier.',
      'Rest when baby sleeps: walking is not a race.',
    ],
  },
];

export const MOVES_BUILD: Move[] = [
  {
    id: 'brisk', name: 'Brisk walking', dose: '20 to 30 minutes, most days',
    steps: [
      'Walk fast enough to breathe harder but still talk.',
      'Walking to the market or carrying baby in a wrap counts.',
      'Drink water before and after, and feed baby first if you can.',
    ],
  },
  {
    id: 'heel', name: 'Heel slides', dose: '10 each side',
    steps: [
      'Lie on your back, knees bent. Breathe out and draw your belly in gently.',
      'Slowly slide one heel along the floor until the leg is straight, keeping your back still.',
      'Slide it back and switch legs.',
    ],
  },
  {
    id: 'bridge', name: 'Bridges', dose: '10 times, rest, repeat',
    steps: [
      'Lie on your back, knees bent, feet hip-width apart.',
      'Breathe out, lift your pelvic floor and raise your bottom off the floor.',
      'Hold for 3 seconds, then lower slowly.',
    ],
  },
  {
    id: 'four', name: 'Hands-and-knees reach', dose: '8 each side',
    steps: [
      'Kneel on hands and knees, hands under shoulders.',
      'Keep your back flat. Slowly stretch one arm forward, hold 3 seconds and return.',
      'When that feels easy, stretch the opposite leg back at the same time.',
    ],
  },
];

export const MOVES_FULL: Move[] = [
  {
    id: 'active150', name: '150 active minutes a week', dose: 'For example 30 minutes, 5 days',
    steps: [
      'Brisk walking, dancing at church, active housework or farm work all count.',
      'Build up slowly. You should be able to talk while moving.',
    ],
  },
  {
    id: 'squat', name: 'Squats to a chair', dose: '10 times, twice',
    steps: [
      'Stand in front of a chair, feet hip-width apart.',
      'Breathe in and sit back slowly until you just touch the chair.',
      'Breathe out, lift your pelvic floor and stand up.',
    ],
  },
  {
    id: 'plank', name: 'Kneeling plank', dose: 'Hold 10 to 20 seconds, 3 times',
    steps: [
      'Rest on your forearms and knees, body in a straight line from head to knees.',
      'Breathe normally. Stop if your tummy bulges or domes along the middle.',
    ],
  },
];

/** Activity guidance for the other journeys (FR-MOVE-01/02/03). */
export const MOVES_PREG: Move[] = [
  MOVES_GENTLE[0],
  { id: 'pwalk', name: 'Walking', dose: '30 minutes, 5 days a week', steps: ['Walking to the market, to church or to work counts.', 'Walk in the cooler morning or evening and drink water.', 'You should be able to talk while walking.'] },
  { id: 'back', name: 'Back stretch on hands and knees', dose: '10 times, when your back aches', steps: ['Kneel on hands and knees.', 'Breathe out and gently round your back up like a cat.', 'Breathe in and return to a flat back. Don’t let your belly sag.'] },
  { id: 'labour', name: 'Breathing for labour', dose: '5 minutes a day from week 30', steps: ['Breathe in slowly through your nose for 4 counts.', 'Breathe out slowly through your mouth for 6 counts.', 'Practise now so it comes easily in labour.'] },
];
export const MOVES_GENERAL: Move[] = [
  MOVES_FULL[0],
  MOVES_GENTLE[0],
  MOVES_FULL[1],
];

// ---------------------------------------------------------------------------
export const TUMMY_MYTHS = [
  { myth: 'Tying the belly very tight flattens it for good.', fact: 'A wrap or binder can feel supportive, especially after a caesarean, but it doesn’t burn fat or shrink the womb. Keep it comfortable: never so tight that it hurts, makes breathing hard or presses on your wound.' },
  { myth: 'Massaging the belly with very hot water makes it go down.', fact: 'Very hot water can burn your skin and doesn’t shrink the tummy. Warm, comfortable water is fine for washing.' },
  { myth: 'Slimming teas and pills help after birth.', fact: 'Many contain laxatives or water pills. They can dehydrate you, reduce your milk and pass into breast milk. Avoid them.' },
  { myth: 'Skipping meals brings the weight down faster.', fact: 'It leaves you tired and can reduce your milk. Regular meals with vegetables, beans, fish and fruit, and water at every feed, work better.' },
  { myth: 'Sit-ups are the quickest way to a flat tummy.', fact: 'In the first months, sit-ups and crunches can widen a gap in your tummy muscles. Start with belly breathing and pelvic tilts instead.' },
];

export const TUMMY_STOP = [
  'Bleeding gets heavier or turns bright red again',
  'Pain in your tummy or around your wound',
  'Dizziness, a racing heart or feeling faint',
  'Leaking urine that doesn’t improve, or heaviness or a bulge in the vagina',
];

// ---------------------------------------------------------------------------
// Genetics vs habits (FR-CONT-15)
// ---------------------------------------------------------------------------
export const CANT_CHANGE = [
  'Whether you get stretch marks: it runs in families',
  'Where your body stores fat',
  'Skin darkening in pregnancy',
  'How quickly your skin tightens again',
];
export const CAN_CHANGE = [
  { text: 'Moisturise daily to ease itching and dryness', to: 'skin' as const },
  { text: 'Move every day to rebuild strength and stamina', to: 'activity' as const },
  { text: 'Eat iron-rich local foods and drink enough water', to: 'diet' as const },
  { text: 'Protect your skin from the sun so dark patches fade', to: 'skin' as const },
];

// ---------------------------------------------------------------------------
// Ingredient checker (FR-SKIN-05). Classes are for pregnancy AND breastfeeding.
// ---------------------------------------------------------------------------
export type SafetyClass = 'avoid' | 'care' | 'safe';
export type Ingredient = { name: string; aliases: string[]; cls: SafetyClass; why: string };

export const SAFETY_LABEL: Record<SafetyClass, string> = {
  avoid: 'Avoid in pregnancy and breastfeeding',
  care: 'Use with care',
  safe: 'Generally safe',
};

export const INGREDIENTS: Ingredient[] = [
  // Avoid
  { name: 'Hydroquinone', aliases: ['hydroquinone', 'hydroquinon'], cls: 'avoid', why: 'A skin bleaching agent. A large share is absorbed into the body. Avoid while pregnant or breastfeeding.' },
  { name: 'Mercury', aliases: ['mercury', 'mercurous chloride', 'mercuric', 'calomel', 'hydrargyri', 'mercurio'], cls: 'avoid', why: 'Found in some illegal lightening creams and soaps. It harms the kidneys and nerves and can damage a baby’s developing brain. Stop using any product that contains it.' },
  { name: 'Clobetasol (strong steroid)', aliases: ['clobetasol'], cls: 'avoid', why: 'A very strong steroid often sold in lightening creams. Long use thins the skin, causes stretch marks and acne, and can affect your hormones. Use only if a doctor prescribes it.' },
  { name: 'Betamethasone (steroid)', aliases: ['betamethasone', 'betamethason'], cls: 'avoid', why: 'A strong steroid sometimes added to lightening creams. Use only if a doctor prescribes it for a skin condition.' },
  { name: 'Tretinoin', aliases: ['tretinoin', 'retinoic acid'], cls: 'avoid', why: 'A retinoid. It can harm a developing baby. Wait until after pregnancy and breastfeeding, and use only with a doctor’s advice.' },
  { name: 'Isotretinoin', aliases: ['isotretinoin'], cls: 'avoid', why: 'Causes serious birth defects. Never use it when you could be pregnant.' },
  { name: 'Retinol', aliases: ['retinol', 'retinal', 'retinyl', 'retinaldehyde'], cls: 'avoid', why: 'A vitamin A form used in anti-ageing creams. Best avoided in pregnancy and while breastfeeding.' },
  { name: 'Adapalene / tazarotene', aliases: ['adapalene', 'tazarotene'], cls: 'avoid', why: 'Retinoid acne treatments. Avoid in pregnancy and while breastfeeding.' },
  { name: 'Glutathione injections', aliases: ['glutathione injection', 'glutathione iv'], cls: 'avoid', why: 'Injected for skin lightening. Not proven safe and risky when injected outside a hospital.' },
  { name: 'Formaldehyde (hair straighteners)', aliases: ['formaldehyde', 'methylene glycol', 'formalin'], cls: 'avoid', why: 'Released by some hair-straightening treatments. Avoid breathing it in while pregnant or breastfeeding.' },
  // Use with care
  { name: 'Salicylic acid', aliases: ['salicylic', 'bha', 'beta hydroxy'], cls: 'care', why: 'Small amounts in a face wash are usually fine. Avoid strong peels and large areas of skin.' },
  { name: 'Benzoyl peroxide', aliases: ['benzoyl peroxide'], cls: 'care', why: 'Usually fine on small areas for acne. Keep it away from the breast area while breastfeeding.' },
  { name: 'Kojic acid', aliases: ['kojic'], cls: 'care', why: 'A lightening ingredient. Little is known about safety in pregnancy. Ask your health worker first.' },
  { name: 'Arbutin', aliases: ['arbutin', 'alpha-arbutin'], cls: 'care', why: 'A lightening ingredient related to hydroquinone. Ask your health worker before using it.' },
  { name: 'Chemical sunscreen filters', aliases: ['oxybenzone', 'benzophenone-3', 'avobenzone', 'octinoxate'], cls: 'care', why: 'Probably fine, but mineral sunscreens (zinc oxide, titanium dioxide) are the safer first choice in pregnancy.' },
  { name: 'Essential oils', aliases: ['essential oil', 'rosemary oil', 'clary sage', 'peppermint oil', 'tea tree'], cls: 'care', why: 'Strong oils can irritate skin. Use only a few drops well diluted, and not on the breast area while breastfeeding.' },
  { name: 'Hair dye (peroxide, PPD)', aliases: ['hydrogen peroxide', 'paraphenylenediamine', 'ppd'], cls: 'care', why: 'Probably fine after the first trimester. Use gloves and a well-aired room, and do a patch test.' },
  // Generally safe
  { name: 'Shea butter (karité)', aliases: ['shea', 'karite', 'karité', 'butyrospermum'], cls: 'safe', why: 'Pure unrefined shea butter soothes dry, itchy, stretching skin. It softens skin but can’t fully prevent or remove stretch marks.' },
  { name: 'Cocoa butter', aliases: ['cocoa butter', 'theobroma', 'beurre de cacao'], cls: 'safe', why: 'A good moisturiser for stretching skin. Soothes, but can’t fully prevent stretch marks.' },
  { name: 'Coconut oil', aliases: ['coconut', 'cocos nucifera', 'huile de coco'], cls: 'safe', why: 'A safe moisturiser for skin and hair.' },
  { name: 'Glycerin', aliases: ['glycerin', 'glycerine', 'glycerol'], cls: 'safe', why: 'Draws water into the skin. Safe in pregnancy and breastfeeding.' },
  { name: 'Hyaluronic acid', aliases: ['hyaluronic', 'sodium hyaluronate'], cls: 'safe', why: 'Keeps skin moist. Some studies suggest it may help newer stretch marks look softer.' },
  { name: 'Centella asiatica (gotu kola)', aliases: ['centella', 'gotu kola', 'madecassoside', 'asiaticoside'], cls: 'safe', why: 'A plant extract that supports skin repair. May help stretch marks fade. Safe on the skin.' },
  { name: 'Sweet almond oil', aliases: ['almond oil', 'prunus amygdalus', 'prunus dulcis'], cls: 'safe', why: 'A gentle oil for massage on stretching skin. Avoid if you are allergic to nuts.' },
  { name: 'Glycolic acid', aliases: ['glycolic', 'alpha hydroxy'], cls: 'care', why: 'May help older stretch marks look smoother. Low-strength creams are usually fine; avoid strong peels in pregnancy.' },
  { name: 'Zinc oxide', aliases: ['zinc oxide'], cls: 'safe', why: 'A mineral sunscreen. The best choice to stop dark patches getting darker.' },
  { name: 'Titanium dioxide', aliases: ['titanium dioxide'], cls: 'safe', why: 'A mineral sunscreen, safe in pregnancy and breastfeeding.' },
  { name: 'Niacinamide', aliases: ['niacinamide', 'nicotinamide', 'vitamin b3'], cls: 'safe', why: 'Helps even out skin tone and calm the skin.' },
  { name: 'Azelaic acid', aliases: ['azelaic'], cls: 'safe', why: 'Considered safe in pregnancy. Can help with acne and dark patches.' },
  { name: 'Vitamin C', aliases: ['ascorbic', 'vitamin c', 'ascorbyl'], cls: 'safe', why: 'Helps brighten dark patches gently. Safe in pregnancy and breastfeeding.' },
  { name: 'Aloe vera', aliases: ['aloe'], cls: 'safe', why: 'Soothing on the skin. Don’t take it by mouth: aloe drinks can act as a laxative.' },
  { name: 'Petroleum jelly', aliases: ['petrolatum', 'petroleum jelly'], cls: 'safe', why: 'Protects very dry skin and cracked heels.' },
  { name: 'Ceramides', aliases: ['ceramide'], cls: 'safe', why: 'Strengthen the skin barrier. Safe to use.' },
];

export const QUICK_INGREDIENTS = ['Hydroquinone', 'Clobetasol', 'Mercury', 'Retinol', 'Shea butter', 'Centella'];

/**
 * Ingredients that help stretch marks fade (FR-SKIN-03). Ingredient names only, never brands or products.
 * Honest framing: they soften and fade marks; none removes them completely.
 */
export const STRETCH_HELPERS: { name: string; what: string; when: 'now' | 'later' }[] = [
  { name: 'Hyaluronic acid', what: 'The best-studied for new, red or dark marks. Helps them look softer and flatter.', when: 'now' },
  { name: 'Centella asiatica (gotu kola)', what: 'A plant extract that supports skin repair and may help marks fade.', when: 'now' },
  { name: 'Shea butter (karité)', what: 'Pure, unrefined. Eases dryness and itching and softens the skin.', when: 'now' },
  { name: 'Cocoa butter', what: 'Rich moisturiser that keeps stretching skin supple.', when: 'now' },
  { name: 'Sweet almond oil', what: 'Gentle massage oil; daily massage may help new marks. Avoid if allergic to nuts.', when: 'now' },
  { name: 'Coconut oil', what: 'Moisturises and soothes itchy skin.', when: 'now' },
  { name: 'Tretinoin (prescription)', what: 'Can improve newer marks, but only from a doctor, and never while pregnant or breastfeeding.', when: 'later' },
  { name: 'Glycolic acid', what: 'May smooth older marks. Start low-strength after breastfeeding, or ask your health worker.', when: 'later' },
];

/** Finds every known ingredient in what she typed or pasted from a label. */
export function checkIngredients(text: string): Ingredient[] {
  const t = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (t.trim().length < 3) return [];
  const order: Record<SafetyClass, number> = { avoid: 0, care: 1, safe: 2 };
  return INGREDIENTS
    .filter((ing) => [ing.name.toLowerCase(), ...ing.aliases].some((a) => {
      const alias = a.normalize('NFD').replace(/[̀-ͯ]/g, '');
      return t.includes(alias) || (t.trim().length >= 4 && alias.startsWith(t.trim()));
    }))
    .sort((a, b) => order[a.cls] - order[b.cls]);
}
