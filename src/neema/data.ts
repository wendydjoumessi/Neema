// Neema content: symptoms, chat answers, diet, family planning, checklist and facilities.
// Ported from the Neema design prototype. Clinical wording must be reviewed by Neema's clinical reviewer.


export const DANGER = [
  ['bleeding', 'bleeding'], ['bleed', 'bleeding'], ['blood', 'bleeding'], ['saignement', 'saignement (bleeding)'], ['saigne', 'saignement (bleeding)'],
  ['severe headache', 'a severe headache'], ['strong headache', 'a severe headache'], ['bad headache', 'a severe headache'], ['mal de tête', 'mal de tête (headache)'], ['mal de tete', 'mal de tête (headache)'],
  ['blurred vision', 'blurred vision'], ['blurry vision', 'blurred vision'], ['vision floue', 'vision floue (blurred vision)'],
  ['fever', 'fever'], ['fièvre', 'fièvre (fever)'], ['fievre', 'fièvre (fever)'], ['hot body', 'fever'],
  ['fits', 'fits'], ['convuls', 'convulsions'], ['seizure', 'convulsions'],
  ['water broke', 'waters breaking'], ['waters broke', 'waters breaking'], ['perte des eaux', 'perte des eaux (waters breaking)'], ['leaking fluid', 'fluid leaking'],
  ['not moving', 'baby not moving'], ['ne bouge', 'bébé ne bouge plus (baby not moving)'], ['moving less', 'baby moving less'],
  ['trouble breathing', 'trouble breathing'], ['difficulty breathing', 'trouble breathing'], ["can't breathe", 'trouble breathing'],
  ['severe pain', 'severe pain'], ['swollen face', 'a swollen face'], ['face swelling', 'a swollen face']
];

export const KB = [
  { keys: ['iron', 'anaemia', 'anemia', 'folong', 'ndol', 'leaves', 'folate'], text: 'Dark green leaves are your best local sources of iron and folate: ndolé, folong (amaranth), cassava leaves, ugu and moringa leaves. Eat them with a vitamin C food such as orange, pineapple or tomato so your body absorbs more iron, and keep tea or coffee away from mealtimes. Food supports, but does not replace, the iron and folic acid tablets from your antenatal visit.', sources: ['Neema · Diet for each stage: Trimester 2', 'WHO antenatal care recommendations (2016): daily iron and folic acid'] },
  { keys: ['water', 'drink', 'hydrat', 'heat', 'hot', 'thirst'], text: 'In pregnancy, about 2.3 L of total water a day is a common reference. On hot, humid days in Douala or Yaoundé you need more, so Neema raises your target. Sip through the day and keep water near you. Pale yellow urine is a good sign. If you feel dizzy or your urine stays very dark, use the symptom checker.', sources: ['Neema · My daily habits', 'EFSA dietary reference values for water'] },
  { keys: ['malaria', 'iptp', 'mosquito', 'paludisme', 'net'], text: 'Malaria is more dangerous in pregnancy. In Cameroon, pregnant women are offered preventive malaria treatment (IPTp) at antenatal visits from the second trimester, and should sleep under an insecticide-treated net every night. Your health worker decides when you take it. Neema can’t tell you to start or stop a medicine.', sources: ['Cameroon MINSANTE · Malaria in pregnancy (IPTp)', 'WHO antenatal care recommendations (2016)'] },
  { keys: ['clay', 'kaolin', 'chalk', 'craving', 'calabar'], text: 'Many women crave clay (kaolin, or calabar chalk) in pregnancy. It is best avoided: it can contain lead and other contaminants, and it can block iron absorption. Strong cravings for clay can be a sign of low iron, so ask for a haemoglobin check at your next visit.', sources: ['Neema · Food safety notes', 'WHO antenatal care recommendations (2016)'] },
  { keys: ['emergency', 'unprotected', 'condom broke', 'morning after', 'pilule du lendemain'], text: 'Emergency contraceptive pills work best taken as soon as possible, and can be used up to 5 days (120 hours) after sex without protection. They are sold in pharmacies. A copper IUD fitted by a health worker within 5 days is the most effective option and keeps protecting you afterwards. Emergency pills do not end an existing pregnancy and are not meant for regular use.', sources: ['WHO Family Planning: A Global Handbook (2022)', 'WHO fact sheet: Emergency contraception'] },
  { keys: ['fertile', 'ovulat', 'conceive', 'get pregnant', 'how long can it take'], text: 'Your fertile window is the 5 days before ovulation and the day of ovulation. In a 28-day cycle, ovulation is often around day 14, but it varies, so Neema’s dates are estimates. Having sex every 2 to 3 days through the cycle gives a good chance. Most couples conceive within 12 months; see a health worker together after 12 months of trying, or after 6 months if you are 35 or older.', sources: ['WHO preconception care', 'Neema · My cycle'] },
  { keys: ['folic'], text: 'Folic acid helps protect your baby’s brain and spine, which form in the first weeks of pregnancy, often before you know you are pregnant. That is why WHO advises taking a daily folic acid tablet from the time you start trying, ideally 2 to 3 months before. Ask your pharmacist or health worker for the right tablet.', sources: ['WHO preconception care', 'WHO antenatal care recommendations (2016)'] },
  { keys: ['stretch mark', 'vergeture'], text: 'No cream or oil can make stretch marks disappear completely, but they fade a lot: over 6 to 12 months they become flatter, softer and closer to your skin colour. Moisturising twice a day with pure shea butter, cocoa butter or coconut oil soothes itching and softens the skin, and a hyaluronic acid cream may help newer marks. Keep them out of the sun. Please avoid lightening creams: many contain mercury, hydroquinone or strong steroids, which are unsafe and can even cause more marks. After breastfeeding, a dermatologist can suggest other treatments.', sources: ['Neema · Body & skin', 'Clinician-reviewed skin care guide'] },
  { keys: ['tummy', 'reduce my stomach', 'reduce my belly', 'flat stomach', 'flat belly', 'lose weight', 'weight after'], text: 'Your womb takes about 6 weeks to shrink back, and breastfeeding helps it contract. After that, the rest of the tummy goes gradually over 6 to 12 months. Start with pelvic floor squeezes, belly breathing and short walks; do stronger exercises once a health worker has checked you, usually at 6 weeks. Avoid sit-ups in the first months, slimming teas and skipping meals, which can reduce your milk. Open Body & skin from your Home screen for a step-by-step plan.', sources: ['WHO postnatal care recommendations (2022)', 'WHO physical activity guidelines (2020)'] },
  { keys: ['binder', 'belly wrap', 'tie the belly', 'tie my belly', 'gaine'], text: 'A belly wrap or binder can feel supportive, especially after a caesarean, but it doesn’t burn fat or shrink the womb. Keep it comfortable: never so tight that it hurts, makes breathing hard or presses on your wound.', sources: ['Neema · Body & skin'] },
  { keys: ['slimming', 'detox', 'diet tea', 'weight loss tea'], text: 'Avoid slimming teas and pills, especially while breastfeeding. Many contain laxatives or water pills that dehydrate you, can reduce your milk and pass into breast milk.', sources: ['Neema · Body & skin'] },
  { keys: ['lighten', 'bleach', 'clarif', 'tcheko', 'hydroquinone', 'mercury'], text: 'Please avoid skin-lightening and “clarifying” creams in pregnancy and while breastfeeding. Many contain mercury, hydroquinone, strong steroids such as clobetasol, or retinoids, which can harm you and your baby. Dark patches from pregnancy usually fade after birth; sun protection with a hat, shade or a mineral sunscreen helps most. You can check any product in Body & skin → Ingredients.', sources: ['Neema · Ingredient checker', 'Clinician-reviewed skin care guide'] },
  { keys: ['safe while breastfeeding', 'methods while breastfeeding', 'spacing'], text: 'Many methods are safe while breastfeeding: the implant, the copper or hormonal IUD, the progestin-only pill, the injection and condoms. An IUD can be fitted within 48 hours of birth or from 4 weeks after. The combined pill is usually not advised in the first 6 months of breastfeeding. Breastfeeding alone (LAM) protects only if baby is under 6 months, feeds only on breast milk, and your period has not returned. WHO advises waiting at least 24 months before the next pregnancy.', sources: ['WHO Family Planning: A Global Handbook (2022)', 'WHO postnatal care recommendations (2022)'] },
  { keys: ['forget', 'pills', 'remember'], text: 'If remembering a daily pill is hard, long-acting methods need nothing day to day: the implant (3 or 5 years), the IUD (5 to 12 years) or the injection (every 2 or 3 months). They are also more effective in everyday use than pills. If you stay on the pill, set a daily reminder in Neema and keep the pack where you see it every day.', sources: ['WHO Family Planning: A Global Handbook (2022)'] },
  { keys: ['future fertility', 'injection affect', 'fertility return', 'return to fertility'], text: 'After stopping the 3-monthly injection, fertility returns, but it can take a few months longer than with other methods: on average about 4 months after the effect wears off. With the implant, IUD, pill and condoms, fertility returns quickly after stopping. None of these methods cause infertility.', sources: ['WHO Family Planning: A Global Handbook (2022)'] },
  { keys: ['genotype', 'sickle'], text: 'Yes, it is a good idea. Sickle cell disease is common in Cameroon. If both partners carry the trait (AS), each pregnancy has a 1 in 4 chance of a baby with sickle cell disease (SS). A simple blood test at a health centre or laboratory tells you your genotype, so you can plan with a health worker.', sources: ['WHO sickle cell disease fact sheet', 'Neema · Pre-conception checklist'] },
  { keys: ['feed', 'breastfeed', 'milk', 'latch'], text: 'Breastfeed on demand, day and night: newborns usually feed 8 to 12 times in 24 hours. Give only breast milk for the first 6 months, with no water or other drinks, even in hot weather. Signs baby is getting enough: 6 or more wet nappies a day after the first week, and steady weight gain at check-ups. If feeding hurts or baby is too sleepy to feed, ask a health worker soon.', sources: ['WHO infant feeding recommendations', 'Neema · After birth'] },
  { keys: ['bleeding after', 'lochia', 'bleed'], text: 'Bleeding after birth (lochia) is heaviest in the first days and slowly becomes lighter, changing from red to brown and then pale. It can last up to about 6 weeks. Soaking a pad in an hour or less, large clots, fever or a foul smell are danger signs: use SOS or go to a health facility now.', sources: ['WHO postnatal care recommendations (2022)'] },
  { keys: ['sad', 'cry', 'depress', 'blues', 'anxious', 'hopeless'], text: 'Many mothers feel tearful, worried or low in the first two weeks after birth. These “baby blues” usually pass. If the feelings last longer than two weeks, make it hard to care for yourself or your baby, or you have thoughts of harming yourself or your baby, talk to a health worker straight away. You are not alone, and help works.', sources: ['WHO postnatal care recommendations (2022)'] },
  { keys: ['hiv', 'sti', 'protect against'], text: 'Only condoms, male or female, protect against HIV and other sexually transmitted infections as well as pregnancy. You can use a condom together with another method, such as the implant or injection, for double protection. Free HIV testing is available at many health centres in Cameroon.', sources: ['WHO Family Planning: A Global Handbook (2022)'] },
  { keys: ['walk', 'exercise', 'active', 'sport', 'market', 'dance'], text: 'Yes. For most women, safe, regular movement is healthy in pregnancy. WHO suggests at least 150 minutes of moderate activity a week, and walking to the market or farm counts. Avoid heavy lifting and overheating, and ask your health worker first if you have complications.', sources: ['WHO guidelines on physical activity (2020)', 'Neema · Healthy routine'] }
];
export const FALLBACK = { text: 'I don’t have an approved Neema source for that yet, so I won’t guess. You can browse this week’s care articles, or ask your health worker at your next antenatal visit.', sources: [] as string[] };

/** Starter questions for each journey. */
export const SUGGEST_BY_JOURNEY: Record<JourneyId, string[]> = {
  preg: ['Which local foods help with iron?', 'How much water should I drink in Douala heat?', 'Is it OK to eat clay (kaolin)?', 'When do I get malaria prevention tablets?', 'Is walking to the market good exercise?'],
  pp: ['How often should my baby feed?', 'How long does bleeding last after birth?', 'How can I reduce my tummy after birth?', 'Can stretch marks be removed?', 'Is it normal to feel sad after birth?'],
  ttc: ['When am I most fertile?', 'Why should I take folic acid before pregnancy?', 'How long can it take to get pregnant?', 'Should my partner and I check our genotypes?'],
  avoid: ['What can I do after unprotected sex?', 'Which method is best if I forget pills?', 'Does the injection affect future fertility?', 'Which methods also protect against HIV?'],
};
export const SUGGEST = ['Which local foods help with iron?', 'How much water should I drink in Douala heat?', 'Is it OK to eat clay (kaolin)?', 'When do I get malaria prevention tablets?', 'Is walking to the market good exercise?'];

export const STAGES = {
  t1: { short: 'Trim. 1', label: 'Trimester 1', weeks: 'Weeks 1–13', nutrients: ['Folate', 'Iron', 'Iodine'], extra: 'No extra food is usually needed yet. Focus on quality, not quantity.', meals: ['Folong sauce with boiled plantain', 'Millet pap with a handful of groundnuts', 'Beans with ripe plantain and tomato'], problem: 'Nausea: eat small dry snacks such as roasted corn, little and often.' },
  t2: { short: 'Trim. 2', label: 'Trimester 2', weeks: 'Weeks 14–27', nutrients: ['Iron', 'Folate', 'Calcium', 'Protein'], extra: 'Add one modest snack a day, such as a handful of groundnuts and a banana. Not “eating for two”.', meals: ['Ndolé with groundnuts and boiled plantain', 'Folong with mackerel and yam', 'Egusi soup with cassava leaves'], problem: 'Heartburn: smaller meals, less fried food and pepper, stay upright after eating.' },
  t3: { short: 'Trim. 3', label: 'Trimester 3', weeks: 'Weeks 28–40', nutrients: ['Iron', 'Protein', 'Fibre'], extra: 'Keep the one modest snack, such as groundnuts and a banana. Eat smaller meals more often.', meals: ['Sweet potato with beans and tomato', 'Sardines with folong and plantain', 'Sorghum pap with kossam'], problem: 'Constipation: more leaves, fruit and water, and a short walk every day.' },
  ttc: { short: 'Conceiving', label: 'Before pregnancy', weeks: 'Trying to conceive', nutrients: ['Folate', 'Iron', 'Iodine', 'Zinc'], extra: 'No extra food is needed. Build good iron and folate stores before pregnancy, and use iodised salt.', meals: ['Folong with beans and boiled plantain', 'Egusi with fish and cassava leaves', 'Pap with groundnuts and a banana'], problem: 'Very irregular periods? Regular meals and a healthy weight help. See a health worker if your cycle is often shorter than 21 or longer than 35 days.' },
  every: { short: 'Every day', label: 'Healthy every day', weeks: 'Women’s health', nutrients: ['Iron', 'Folate', 'Calcium'], extra: 'Periods lose iron every month. Eat green leaves, beans or fish most days, with a fruit.', meals: ['Ndolé with fish and boiled plantain', 'Beans and corn (koki) with avocado', 'Millet pap with kossam'], problem: 'Very tired during your period? Iron-rich foods with vitamin C help. Ask for a haemoglobin test if it doesn’t pass.' },
  pp: { short: 'After birth', label: 'After birth', weeks: 'Breastfeeding', nutrients: ['Protein', 'Iron', 'Water'], extra: 'Breastfeeding: a little more food each day and more water, about 2.7 L.', meals: ['Mild fish pepper soup', 'Beans and plantain with avocado', 'Millet pap with kossam'], problem: 'Tired and thirsty? Keep a cup of water by you at every feed.' }
};

export const FOODS = [
  { name: 'Ndolé', local: 'Bitter leaf', photo: 'Photo slot · Fresh ndolé leaves, Douala market', tags: ['Iron', 'Folate'], benefit: 'Builds blood. Cook well with groundnuts; add tomato for vitamin C.' },
  { name: 'Folong', local: 'Amaranth', photo: 'Photo slot · Bunches of folong in daylight', tags: ['Iron', 'Folate', 'Calcium'], benefit: 'One of the richest local greens for folate and calcium.' },
  { name: 'Plantains', local: 'Plantain', photo: 'Photo slot · Ripe and green plantains', tags: ['Energy', 'Fibre'], benefit: 'Slow-release energy. Boiled is better than fried.' },
  { name: 'Groundnuts', local: 'Arachides', photo: 'Photo slot · Roasted groundnuts in a calabash', tags: ['Protein', 'Folate'], benefit: 'A handful with a banana makes the ideal extra snack.' },
  { name: 'Mackerel', local: 'Maquereau', photo: 'Photo slot · Fresh mackerel, Youpwé fish market', tags: ['Protein', 'Omega-3'], benefit: 'Supports baby’s brain and eyes. Always cook it through.' },
  { name: 'Beans', local: 'Haricots', photo: 'Photo slot · Red beans in a market basin', tags: ['Iron', 'Protein', 'Fibre'], benefit: 'Iron and protein together; helps prevent constipation.' }
];

export const SWAPS = [
  { from: 'Quinoa', to: 'Millet, sorghum or fonio', why: 'Similar fibre, protein and minerals; easy to make as pap.' },
  { from: 'Salmon', to: 'Mackerel, sardines or dried fish', why: 'The same omega-3 fats for baby’s brain.' },
  { from: 'Kale or spinach', to: 'Folong, cassava leaves or ugu', why: 'As much or more iron and folate.' },
  { from: 'Almonds', to: 'Groundnuts', why: 'Protein, healthy fats and folate.' },
  { from: 'Greek yoghurt', to: 'Kossam (local yoghurt)', why: 'Calcium and protein for baby’s bones.' }
];

export const AVOID = [
  { what: 'Raw or undercooked meat, fish and eggs', why: 'can carry infections' },
  { what: 'Unpasteurised milk', why: 'can carry listeria' },
  { what: 'Alcohol, including palm wine', why: 'harms baby’s brain growth' },
  { what: 'Clay (kaolin)', why: 'may contain lead and blocks iron' },
  { what: 'Unknown herbal mixtures', why: 'some can cause contractions' },
  { what: 'Too much salt and stock cubes', why: 'raise blood pressure' },
  { what: 'Moringa root or bark', why: 'unsafe in pregnancy; the leaves as food are fine' }
];

export const AVOID_EVERYDAY = [
  { what: 'Alcohol, including palm wine', why: 'harms the liver and raises blood pressure' },
  { what: 'Sugary drinks and sweets', why: 'add weight without nutrients' },
  { what: 'Too much salt and stock cubes', why: 'raise blood pressure' },
  { what: 'Clay (kaolin)', why: 'may contain lead and blocks iron' },
  { what: 'Unknown herbal mixtures', why: 'some can affect how your family planning method works' }
];
export const IRON = ['Iron and folic acid tablet', 'Green leaves (ndolé, folong)', 'Beans or groundnuts', 'Fish, egg or meat', 'Vitamin C with a meal'];

/** Daily water target in 250 ml cups: more in pregnancy and while breastfeeding, and in the heat. */
export const waterTarget = (j: JourneyId) => (j === 'preg' || j === 'pp' ? 11 : 8);

export const METHODS = [
  { id: 'implant', name: 'Implant (3–5 years)', eff: 'Over 99%', daily: false, hormone: true, bf: true, natural: false, sti: false, pros: 'Nothing to remember; long-lasting; private.', cons: 'Irregular or unpredictable bleeding; a trained provider inserts and removes it; no STI protection.', fert: 'Returns quickly after removal.', bfText: 'Yes, suitable while breastfeeding.' },
  { id: 'cuiud', name: 'Copper IUD (10+ years)', eff: 'Over 99%', daily: false, hormone: false, bf: true, natural: false, sti: false, pros: 'Hormone-free; very long-lasting; also works as emergency contraception within 5 days.', cons: 'Heavier, more painful periods at first; inserted by a provider; no STI protection.', fert: 'Returns quickly after removal.', bfText: 'Yes, suitable while breastfeeding.' },
  { id: 'hiud', name: 'Hormonal IUD (3–8 years)', eff: 'Over 99%', daily: false, hormone: true, bf: true, natural: false, sti: false, pros: 'Often lighter periods; long-lasting.', cons: 'Less available and costlier in some areas; irregular bleeding at first; inserted by a provider.', fert: 'Returns quickly after removal.', bfText: 'Yes, suitable while breastfeeding.' },
  { id: 'inject', name: 'Injectable (every 2–3 months)', eff: 'About 96%', daily: false, hormone: true, bf: true, natural: false, sti: false, pros: 'Private; only a few times a year; self-injection possible after training.', cons: 'Irregular or no periods; weight change for some; you must return on time.', fert: 'Can take several months after the last injection.', bfText: 'Yes, suitable while breastfeeding.' },
  { id: 'coc', name: 'Combined pill', eff: 'About 93%', daily: true, hormone: true, bf: false, natural: false, sti: false, pros: 'Regular, often lighter periods; stops working as soon as you stop.', cons: 'Must be taken every day; not for some women (e.g., high blood pressure, smokers over 35).', fert: 'Returns soon after stopping.', bfText: 'Not usually advised in the first 6 months of breastfeeding.' },
  { id: 'pop', name: 'Progestin-only pill', eff: 'About 93%', daily: true, hormone: true, bf: true, natural: false, sti: false, pros: 'Suitable while breastfeeding; no oestrogen.', cons: 'Must be taken at the same time every day; irregular bleeding.', fert: 'Returns quickly after stopping.', bfText: 'Yes, suitable while breastfeeding.' },
  { id: 'mcondom', name: 'Male condom', eff: 'About 87%', daily: true, hormone: false, bf: true, natural: false, sti: true, pros: 'Protects against STIs and HIV; cheap and easy to find; no hormones or provider needed.', cons: 'Needs partner cooperation every time; can break or slip.', fert: 'No effect on fertility.', bfText: 'Yes.' },
  { id: 'fcondom', name: 'Female condom', eff: 'About 79%', daily: true, hormone: false, bf: true, natural: false, sti: true, pros: 'Controlled by the woman; protects against STIs and HIV.', cons: 'Less available; needs practice.', fert: 'No effect on fertility.', bfText: 'Yes.' },
  { id: 'lam', name: 'Lactational amenorrhoea (LAM)', eff: 'About 98% if all conditions met', daily: false, hormone: false, bf: true, natural: true, sti: false, pros: 'Free; natural; supports breastfeeding.', cons: 'Works only if baby is under 6 months, breastfeeding is exclusive and periods have not returned.', fert: 'Can return before your first period. Plan your next method before 6 months.', bfText: 'Yes, it relies on breastfeeding.' },
  { id: 'fam', name: 'Fertility awareness', eff: 'About 77–98%', daily: true, hormone: false, bf: true, natural: true, sti: false, pros: 'No side effects; suits women who prefer natural methods; also helps when trying to conceive.', cons: 'Needs regular cycles, daily tracking and partner cooperation; avoid sex or use condoms on fertile days. The app’s estimate alone is not contraception.', fert: 'No effect on fertility.', bfText: 'Possible, but fertile signs are harder to read while breastfeeding.' },
  { id: 'withdraw', name: 'Withdrawal', eff: 'About 80%', daily: true, hormone: false, bf: true, natural: true, sti: false, pros: 'Free; always available.', cons: 'High failure rate; no STI protection.', fert: 'No effect on fertility.', bfText: 'Yes.' },
  { id: 'steril', name: 'Sterilisation / vasectomy', eff: 'Over 99%', daily: false, hormone: false, bf: true, natural: false, sti: false, pros: 'Permanent; one-time procedure; vasectomy is simpler.', cons: 'Permanent: reversal is difficult and costly; requires surgery.', fert: 'Permanent. Only for couples sure they want no more children.', bfText: 'Yes.' }
];
export type Method = (typeof METHODS)[number];
export type ShopItem = (typeof SHOP)[number];
export type Symptom = (typeof SYMPTOMS)[number];
export type Lang = keyof typeof T;
export type JourneyId = 'ttc' | 'preg' | 'pp' | 'avoid';
export type LevelId = keyof typeof LEVELS;

export const FP_FILTERS = [
  { id: 'nodaily', label: 'No daily action', test: (m: Method) => !m.daily },
  { id: 'nohormone', label: 'Hormone-free', test: (m: Method) => !m.hormone },
  { id: 'bf', label: 'OK while breastfeeding', test: (m: Method) => m.bf },
  { id: 'natural', label: 'Natural method', test: (m: Method) => m.natural },
  { id: 'sti', label: 'Protects against STIs', test: (m: Method) => m.sti }
];
export const CMP_TABS = [{ id: 'pros', label: 'Pros' }, { id: 'cons', label: 'Cons' }, { id: 'fert', label: 'Return to fertility' }, { id: 'bfText', label: 'Breastfeeding' }] as const;

export const SHOP_CATS = [
  { id: 'mother', title: 'Mother’s care & recovery', note: '' },
  { id: 'feed', title: 'Feeding & lactation', note: 'Breastfeeding needs no equipment. These help if you express milk, return to work or are apart from baby.' },
  { id: 'baby', title: 'Newborn essentials', note: '' },
  { id: 'kit', title: 'Delivery kit (“mama kit”)', note: 'Most Cameroonian facilities ask you to bring these. Check your clinic’s own maternity list, as items vary.' }
];
export const SHOP_STAGES = [
  { id: 't2', title: 'Trimester 2 · buy now', note: '' },
  { id: 't3', title: 'Trimester 3 · by week 32', note: '' },
  { id: 'bag', title: 'Hospital bag · packed by week 36', note: 'Take these to the facility when labour starts.' },
  { id: 'pp', title: 'Postpartum · after birth', note: 'Buy when you need them, or ask someone to get them for you.' }
];
/** WHO birth preparedness: not things to buy, but what a mother should have arranged before labour. */
export const READY = [
  { id: 'r_fac', label: 'I know where I will give birth', sub: 'Visit the facility before labour and ask for its maternity list.' },
  { id: 'r_trans', label: 'Transport arranged, day and night', sub: 'Save a driver’s or moto-taxi number and plan for night-time.' },
  { id: 'r_money', label: 'Money set aside', sub: 'For transport, fees and any emergency.' },
  { id: 'r_comp', label: 'A companion for labour', sub: 'WHO encourages having someone you choose with you.' },
  { id: 'r_blood', label: 'A possible blood donor', sub: 'A relative or friend ready to donate if you need blood.' },
  { id: 'r_signs', label: 'I know the danger signs', sub: 'Bleeding, severe headache, blurred vision, fits, fever, or water breaking early: go now.' },
];
/** The hospital bag packed as three separate bags. */
export const BAGS = [
  { id: 'mother', title: 'Bag for you', note: '' },
  { id: 'baby', title: 'Bag for baby', note: '' },
  { id: 'kit', title: 'Mama kit for the delivery', note: 'Most facilities in Cameroon ask you to bring these. Lists vary: add anything your clinic asks for.' },
];
export const STAGE_TAG = { t2: 'Trimester 2', t3: 'Trimester 3', bag: 'Hospital bag', pp: 'Postpartum' };
export const SHOP = [
  { id: 'docs', cat: 'mother', when: 'bag', ess: true, name: 'Antenatal card, ID and insurance papers', qty: 'In a plastic sleeve', tip: 'The facility will ask for your antenatal card at admission.' },
  { id: 'pads', cat: 'mother', when: 'bag', ess: true, name: 'Maternity pads', qty: '2–3 packs, extra-long and heavy flow', tip: 'Bleeding after birth is heaviest in the first days. Change pads at least every 4 hours.' },
  { id: 'pants', cat: 'mother', when: 'bag', ess: true, name: 'Disposable maternity underwear', qty: '6–10 pairs', tip: 'Or loose cotton briefs one size up that you don’t mind staining.' },
  { id: 'gowns', cat: 'mother', when: 'bag', ess: true, name: 'Front-opening nightgowns', qty: '2, loose and light cotton', tip: 'Front buttons make breastfeeding and check-ups easier.' },
  { id: 'hyg', cat: 'mother', when: 'bag', ess: true, name: 'Postpartum hygiene items', qty: 'Small jug for rinsing, mild unscented soap, 2 clean towels, toothbrush', tip: 'Rinse the vulva with clean warm water after using the toilet. No douching or herbal steam.' },
  { id: 'meds', cat: 'mother', when: 'bag', ess: true, name: 'Your medicines and iron tablets', qty: 'Enough for 3–4 days, with any prescriptions', tip: 'Tell the midwife about every medicine you take, including herbal ones.' },
  { id: 'phone', cat: 'mother', when: 'bag', ess: true, name: 'Phone, charger and emergency numbers', qty: 'Numbers written on paper too', tip: 'Power cuts happen. Keep your companion’s and driver’s numbers on paper in the bag.' },
  { id: 'snacks', cat: 'mother', when: 'bag', ess: true, name: 'Water bottle and light snacks', qty: '1 bottle, biscuits or fruit', tip: 'If your labour is normal, drinking and light eating help you keep your strength.' },
  { id: 'gohome', cat: 'mother', when: 'bag', ess: false, name: 'Loose clothes to go home in', qty: '1 outfit', tip: 'Your belly takes weeks to go down: pick something loose and comfortable.' },
  { id: 'slippers', cat: 'mother', when: 'bag', ess: true, name: 'Slippers and a light wrap or cardigan', qty: '1 pair, 1 wrap', tip: 'Wards can be cold at night with fans or air conditioning.' },
  { id: 'bras', cat: 'mother', when: 't3', ess: true, name: 'Nursing bras', qty: '2–3, front-opening, no underwire', tip: 'Buy around week 36 when your size has settled; leave room for milk coming in.' },
  { id: 'nipple', cat: 'mother', when: 't3', ess: false, name: 'Nipple cream (pure lanolin)', qty: '1 small tube', tip: 'A few drops of your own breast milk, air-dried, also soothe sore nipples. Pain usually means the latch needs adjusting.' },
  { id: 'wrap', cat: 'mother', when: 'pp', ess: false, name: 'Post-birth belly wrap', qty: '1 support band', tip: 'Optional, for comfort. After a caesarean, ask your health worker before using one.' },
  { id: 'bpads', cat: 'feed', when: 't3', ess: true, name: 'Breast pads', qty: '1 box disposable or 6 washable pairs', tip: 'Soak up leaking milk in the early weeks.', guide: ['Place a pad inside each bra cup, soft side towards the nipple.', 'Change it as soon as it feels damp, to prevent soreness and thrush.', 'Wash reusable pads with mild soap and dry them fully in the sun.', 'Avoid pads with a plastic backing; they trap moisture.'] },
  { id: 'mpump', cat: 'feed', when: 'pp', ess: false, name: 'Manual breast pump', qty: '1, with spare valve and membrane', tip: 'Quiet, affordable and needs no electricity. Good for occasional expressing.', guide: ['Wash your hands. Wash and sterilise every part that touches milk.', 'Sit comfortably. A warm cloth on the breast and gentle massage help milk flow.', 'Centre the nipple in the funnel (flange) so it moves freely without rubbing.', 'Squeeze the handle slowly and steadily. Start gently; it should never hurt.', 'Pump 10–15 minutes per breast, or until the flow slows, then switch sides.', 'Pour the milk into a clean storage bag or container and label it with the date and time.'] },
  { id: 'epump', cat: 'feed', when: 'pp', ess: false, name: 'Electric breast pump', qty: '1 single or double, with charger', tip: 'Faster for mothers returning to work. Choose one that runs on battery during power cuts.', guide: ['Wash your hands. Assemble clean, sterilised parts that touch milk.', 'Choose the funnel size that fits: the nipple moves freely and the areola is not pulled in deeply.', 'Start on the lowest suction and the fast “let-down” setting for about 2 minutes.', 'Switch to the slower expression mode and raise suction only as far as feels comfortable.', 'Stop after 15–20 minutes or when flow stops. Never keep using a pump that causes pain or bleeding.', 'Wash milk parts in hot soapy water straight away. Wipe the motor; never put it in water.'] },
  { id: 'bags', cat: 'feed', when: 'pp', ess: false, name: 'Breast milk storage bags', qty: '1 box (25–50)', tip: 'Clean, lidded food-grade containers also work.', guide: ['Fill to about three-quarters; milk expands when frozen.', 'Squeeze out the air, seal, and write the date and time on the bag.', 'Fresh milk keeps up to 4 hours at room temperature (less on hot days in Douala) and up to 4 days at the back of the fridge.', 'Frozen milk is best used within 6 months.', 'Thaw in the fridge or in a bowl of warm water. Never microwave it, and never refreeze thawed milk.', 'Use the oldest milk first.'] },
  { id: 'steril', cat: 'feed', when: 'pp', ess: false, name: 'Sterilising container or a lidded pot', qty: '1, kept only for feeding items', tip: 'A pot of boiling water works as well as an electric steriliser.', guide: ['Wash bottles, teats and pump parts in hot soapy water with a brush, then rinse.', 'Put everything in the pot and cover it fully with water, with no air bubbles trapped inside.', 'Bring to the boil and boil for at least 10 minutes with the lid on.', 'Leave items in the covered pot until needed, or let them cool and store them covered.', 'Wash your hands before taking items out.'] },
  { id: 'bottles', cat: 'feed', when: 'pp', ess: false, name: 'Feeding bottles or a small open cup', qty: '2 bottles with newborn teats, or 1 cup', tip: 'For expressed milk. Health workers often suggest cup feeding for newborns: a cup is easier to keep clean.', guide: ['Wash your hands and use a sterilised bottle or cup.', 'Warm milk by standing it in a bowl of warm water; test a few drops on your wrist.', 'Hold baby upright, never lying flat, and let baby set the pace.', 'With a cup: rest it on baby’s lower lip and tip it until the milk just touches the lips. Let baby lap; don’t pour.', 'Throw away milk left over after a feed within 1 hour.', 'Wash and sterilise everything straight after use.'] },
  { id: 'net', cat: 'baby', when: 't2', ess: true, name: 'Insecticide-treated bed net', qty: '1, for baby’s sleeping space', tip: 'Often given free at antenatal care in Cameroon. Ask at your next visit.' },
  { id: 'cot', cat: 'baby', when: 't2', ess: false, name: 'Baby cot or Moses basket', qty: '1, with a firm, flat mattress', tip: 'A borrowed cot is fine if it is sturdy. Keep pillows and soft toys out.' },
  { id: 'onesies', cat: 'baby', when: 't3', ess: true, name: 'Soft cotton onesies', qty: '6–8, newborn and 0–3 months', tip: '100% cotton is coolest in the heat. Wash before first use.' },
  { id: 'vests', cat: 'baby', when: 't3', ess: true, name: 'Baby vests', qty: '4–6 short-sleeved', tip: 'A light layer under a onesie on cooler nights.' },
  { id: 'socks', cat: 'baby', when: 't3', ess: true, name: 'Booties or socks', qty: '4 pairs', tip: 'Newborns get cold easily in the first days. Skin-to-skin contact on your chest is the best way to warm baby.' },
  { id: 'mitts', cat: 'baby', when: 't3', ess: true, name: 'Scratch mittens', qty: '3 pairs', tip: 'Stop scratches until you can safely trim baby’s nails.' },
  { id: 'caps', cat: 'baby', when: 't3', ess: true, name: 'Soft cotton caps', qty: '2–3', tip: 'For the first days and air-conditioned rooms.' },
  { id: 'blankets', cat: 'baby', when: 't3', ess: true, name: 'Light baby blankets', qty: '2–3 cotton receiving blankets', tip: 'Light layers are safer than one thick blanket.' },
  { id: 'towels', cat: 'baby', when: 't3', ess: true, name: 'Baby towels', qty: '2 soft, hooded', tip: 'Keep them only for baby and dry them in the sun.' },
  { id: 'thermo', cat: 'baby', when: 't3', ess: true, name: 'Digital thermometer', qty: '1, for the armpit', tip: 'A newborn with a temperature of 37.5 °C or more, or below 35.5 °C, needs a health worker the same day.' },
  { id: 'outfit', cat: 'baby', when: 'bag', ess: true, name: 'Going-home outfit for baby', qty: '1 onesie, cap, socks and a blanket', tip: 'Pack them in a separate small bag so they are easy to find.' },
  { id: 'carrier', cat: 'baby', when: 'pp', ess: false, name: 'Baby wrap or carrier', qty: '1', tip: 'Keep baby’s face visible and chin off the chest, high enough to kiss.' },
  { id: 'tub', cat: 'baby', when: 't3', ess: true, name: 'Baby bathtub', qty: '1, or a clean basin kept only for baby', tip: 'Test the water with your elbow: warm, never hot.' },
  { id: 'cotton', cat: 'baby', when: 'bag', ess: true, name: 'Cotton wool', qty: '1 large roll', tip: 'With cooled boiled water for cleaning eyes and the nappy area.' },
  { id: 'soap', cat: 'baby', when: 'bag', ess: true, name: 'Mild, unscented baby wash or soap', qty: '1 bar or bottle', tip: 'Avoid perfumed or medicated soaps on newborn skin.' },
  { id: 'jelly', cat: 'baby', when: 'bag', ess: true, name: 'Petroleum jelly or pure shea butter', qty: '1 small jar', tip: 'For dry skin and the nappy area. Pure, unrefined karité is a good choice.' },
  { id: 'cord', cat: 'baby', when: 'bag', ess: true, name: 'Umbilical cord care supplies', qty: 'As your facility advises, e.g. chlorhexidine gel and sterile gauze', tip: 'Keep the cord clean and dry. Never put ash, oil, toothpaste or herbs on it.' },
  { id: 'nappies', cat: 'baby', when: 'bag', ess: true, name: 'Newborn nappies', qty: '1 pack (size 1) or 12 cloth nappies', tip: 'Cloth nappies can be washed and reused for months.' },
  { id: 'gloves', cat: 'kit', when: 'bag', ess: true, name: 'Sterile gloves', qty: '2–3 pairs, plus a box of examination gloves', tip: 'Usually the first item on facility lists.' },
  { id: 'blade', cat: 'kit', when: 'bag', ess: true, name: 'Sterile surgical blade', qty: '1, sealed', tip: 'Used by the midwife to cut the cord. Check the packet is sealed and in date.' },
  { id: 'clamp', cat: 'kit', when: 'bag', ess: true, name: 'Umbilical cord clamp', qty: '2', tip: 'Sterile, sealed plastic clamps from a pharmacy.' },
  { id: 'mack', cat: 'kit', when: 'bag', ess: true, name: 'Mackintosh (plastic sheet)', qty: '1, about 1 m × 1 m', tip: 'Protects the delivery bed.' },
  { id: 'medcotton', cat: 'kit', when: 'bag', ess: true, name: 'Medical cotton and gauze', qty: '1 roll of cotton, 1 pack of sterile gauze', tip: 'Keep separate from baby’s cotton wool.' },
  { id: 'antisep', cat: 'kit', when: 'bag', ess: false, name: 'Antiseptic solution', qty: '1 bottle, only if your clinic lists it', tip: 'Bring it only if your facility’s list asks for it.' }
];

export const LEVELS: Record<'now' | 'today' | 'soon' | 'home', { label: string; bg: string; ink: string }> = {
  now: { label: 'GO TO A MATERNITY FACILITY NOW', bg: '#FBE9E3', ink: '#B54523' },
  today: { label: 'VISIT YOUR MIDWIFE TODAY', bg: '#FBEFD9', ink: '#7A4E0E' },
  soon: { label: 'BOOK A CHECK THIS WEEK', bg: '#E9E6F0', ink: '#3E3560' },
  home: { label: 'CARE FOR YOURSELF AT HOME', bg: '#E4F3E8', ink: '#1E6B34' }
};
export const SYMPTOMS = [
  { id: 'bleed', label: 'Bleeding from the vagina', level: 'now', word: 'bleeding', lead: 'Thank you for checking. Acting early is the best thing you can do for you and your baby.', why: 'Any bleeding in pregnancy should be checked by a midwife straight away, even if it is light or has stopped.', steps: ['Go to your maternity unit now. Ask someone to go with you.', 'Bring your antenatal card and a pad so staff can see the bleeding.', 'Lie on your left side while you wait for transport.'] },
  { id: 'head', label: 'Severe headache or blurred vision', level: 'now', word: 'a severe headache or blurred vision', lead: 'You are right to pay attention to this. It is usually very treatable when checked early.', why: 'A strong headache or blurred vision in pregnancy can be a sign of high blood pressure, which needs checking straight away.', steps: ['Go to your maternity unit now to have your blood pressure checked.', 'Don’t take herbal mixtures or painkillers without advice.', 'Bring your antenatal card.'] },
  { id: 'fits', label: 'Fits or convulsions', level: 'now', word: 'fits', lead: 'Stay as calm as you can. Help is close.', why: 'A fit in pregnancy needs care straight away. A family member can call 119 for an ambulance.', steps: ['Lay her on her left side on the floor, away from hard objects.', 'Don’t put anything in her mouth or hold her down.', 'Call 119 or go to the nearest maternity unit now.'] },
  { id: 'fever', label: 'Fever or hot body', level: 'now', word: 'fever', lead: 'Good that you are checking. Fever is common and treatable once its cause is found.', why: 'In pregnancy, fever is often malaria or an infection, and both need testing quickly so you can start treatment.', steps: ['Go to a facility now for a malaria test.', 'Drink water often and rest in a cool place.', 'Keep sleeping under your treated bed net.'] },
  { id: 'move', label: 'Baby moving less, or not at all', level: 'now', word: 'baby moving less', lead: 'You know your baby best, and checking is always the right choice.', why: 'A change in your baby’s movements should be checked the same day. A midwife can listen to the heartbeat.', steps: ['Go to your maternity unit now. Don’t wait until tomorrow.', 'You don’t need to count kicks first.', 'Bring your antenatal card.'] },
  { id: 'fluid', label: 'Fluid leaking before labour', level: 'now', word: 'fluid leaking', lead: 'Thank you for checking. Your midwife will know what to look for.', why: 'Leaking fluid can mean your waters have broken, which needs checking whatever your week.', steps: ['Go to your maternity unit now, with a clean pad.', 'Note the time it started and the colour of the fluid.', 'Don’t put anything inside the vagina.'] },
  { id: 'face', label: 'Swelling of face or hands', level: 'today', word: 'swelling of the face or hands', lead: 'Some swelling is common in pregnancy, and it’s good that you noticed.', why: 'Swelling of the face or hands should be checked today, because it can go with high blood pressure.', steps: ['Visit your midwife or health centre today for a blood pressure check.', 'Go now instead if you also have a bad headache or blurred vision.', 'Rest with your feet raised in the meantime.'] },
  { id: 'tired', label: 'Very tired, pale inner eyelids', level: 'soon', word: '', lead: 'Feeling tired is very common, especially in trimester 2. Let’s look after your iron.', why: 'Tiredness with pale inner eyelids can be a sign of low iron (anaemia), which is easy to test for.', steps: ['Ask for a haemoglobin test this week or at your next antenatal visit.', 'Keep taking your iron and folic acid tablet every day.', 'Eat ndolé, folong or beans with an orange or tomato.'] },
  { id: 'feet', label: 'Swollen feet at the end of the day', level: 'home', word: '', lead: 'This is very common in the third trimester and in hot weather.', why: 'Mild swelling of the feet and ankles that gets better with rest is usually normal.', steps: ['Rest with your feet raised when you can.', 'Drink water through the day and go easy on salt and stock cubes.', 'Visit your midwife today if your face or hands also swell.'] },
  { id: 'nausea', label: 'Mild nausea', level: 'home', word: '', lead: 'Nausea is common and usually eases with time. You’re doing well.', why: 'Mild nausea that still lets you eat and drink can be managed at home.', steps: ['Eat small dry snacks, like roasted corn or crackers, little and often.', 'Sip water or ginger tea through the day.', 'Visit your midwife today if you can’t keep food or drink down.'] },
  { id: 'heartburn', label: 'Heartburn after meals', level: 'home', word: '', lead: 'Heartburn is very common as your baby grows. It isn’t harmful.', why: 'It happens as pregnancy hormones relax the stomach and baby presses upwards.', steps: ['Eat smaller meals, with less fried food and pepper.', 'Stay upright for an hour after eating.', 'Ask your midwife about safe remedies if it keeps you awake.'] },
  { id: 'back', label: 'Lower back ache', level: 'home', word: '', lead: 'Back ache is one of the most common pregnancy discomforts.', why: 'Your growing bump changes your posture. Gentle movement often helps.', steps: ['Avoid lifting heavy loads; bend your knees if you must lift.', 'Try gentle stretches and a warm cloth on your back.', 'See your midwife today if the pain is rhythmic or comes with bleeding.'] }
];

export const TTC_CHECK = [
  { id: 'folic', label: 'Start folic acid every day', sub: 'Ideally 2–3 months before conceiving. It helps protect baby’s brain and spine.' },
  { id: 'geno', label: 'Know both partners’ genotypes (AA, AS, SS)', sub: 'Sickle cell is common in Cameroon. A simple blood test helps you plan.' },
  { id: 'blood', label: 'Check blood group and rhesus', sub: 'Rhesus-negative mothers may need extra care in pregnancy.' },
  { id: 'tests', label: 'Test for HIV, syphilis and hepatitis B', sub: 'Free or low-cost at many health centres. Treating early protects your baby.' },
  { id: 'vacc', label: 'Check your tetanus vaccination', sub: 'Bring your vaccination card to the health centre.' },
  { id: 'chronic', label: 'Review long-term conditions and medicines', sub: 'High blood pressure, diabetes or sickle cell? See your health worker first.' },
  { id: 'habits', label: 'Stop alcohol, including palm wine, and tobacco', sub: 'For both partners: it improves fertility and protects baby.' },
  { id: 'net', label: 'Sleep under a treated bed net', sub: 'Malaria in early pregnancy is risky, often before you know you’re pregnant.' }
];
export const TTC_FOODS = [
  { title: 'Folate-rich greens', text: 'Folong, ndolé, cassava leaves and ugu several times a week, with tomato or orange.' },
  { title: 'Iron stores', text: 'Beans, eggs, fish and liver. Start pregnancy with good iron levels.' },
  { title: 'For him too', text: 'Groundnuts, fish and pumpkin seeds (egusi) provide zinc for healthy sperm.' },
  { title: 'Healthy weight', text: 'Plantain and yam boiled rather than fried; fewer sugary drinks.' }
];

export const FACILITIES = [
  { name: 'Hôpital Gynéco-Obstétrique et Pédiatrique de Douala', area: 'Yassa', km: '4.2 km', note: 'maternity 24 h' },
  { name: 'Hôpital Laquintinie', area: 'Douala', km: '6.8 km', note: 'maternity 24 h' },
  { name: 'Hôpital Général de Douala', area: 'Douala', km: '7.5 km', note: 'referral hospital' }
];

export const T = {
  en: { myProfile: 'My profile', greeting: 'Good afternoon', openProfile: 'Open profile and settings', home: 'Home', ask: 'Ask Neema', diet: 'Diet', fp: 'Planning', fpTtc: 'My cycle', fpAvoid: 'Methods', fpDiscreet: 'Calendar', shop: 'Shopping', sosBig: 'SOS · GET HELP NOW', profile: 'Profile & settings', back: 'Back to Home', journey: 'My journey', privacy: 'Privacy', language: 'Language', contacts: 'Emergency contacts', data: 'My data', security: 'Account security', export: 'Download my data', deleteAll: 'Delete my account and data' },
  fr: { myProfile: 'Mon profil', greeting: 'Bon après-midi', openProfile: 'Ouvrir le profil et les paramètres', home: 'Accueil', ask: 'Demander', diet: 'Nutrition', fp: 'Planning', fpTtc: 'Mon cycle', fpAvoid: 'Méthodes', fpDiscreet: 'Calendrier', shop: 'Achats', sosBig: 'SOS · AIDE IMMÉDIATE', profile: 'Profil et paramètres', back: 'Retour à l’accueil', journey: 'Mon parcours', privacy: 'Confidentialité', language: 'Langue', contacts: 'Contacts d’urgence', data: 'Mes données', security: 'Sécurité du compte', export: 'Télécharger mes données', deleteAll: 'Supprimer mon compte et mes données' }
};
export const JOURNEYS = [
  { id: 'ttc', short: 'Trying to conceive', label: 'Family planning · trying to conceive', sub: 'Cycle, fertile window, pre-conception checklist', tag: 'TRYING TO CONCEIVE', title: 'Cycle day 12', text: 'Your fertile window is estimated to start in about 2 days (an estimate only). Start a daily folic acid tablet now if you haven’t yet.' },
  { id: 'preg', short: 'Pregnant', label: 'Pregnant', sub: 'Week-by-week, visits, danger signs', tag: '', title: '', text: '' },
  { id: 'pp', short: 'Postpartum', label: 'Postpartum (after birth)', sub: 'Recovery, breastfeeding, baby care', tag: 'AFTER BIRTH', title: '2 weeks after birth', text: 'Rest, eat well and drink about 2.7 L a day while breastfeeding. Watch for heavy bleeding, fever or foul discharge. WHO advises waiting at least 24 months before your next pregnancy.' },
  { id: 'avoid', short: 'Avoiding pregnancy', label: 'Family planning · avoiding pregnancy', sub: 'Compare methods privately', tag: 'AVOIDING PREGNANCY', title: 'Cycle day 12', text: 'Compare methods side by side in Family planning. Cycle tracking alone is not reliable contraception.' }
];




// Approximate baby length (crown to heel from week 20) and weight by week, with a familiar size comparison.
export const BABY_SIZES: { week: number; size: string; length: string; weight: string }[] = [
  { week: 4, size: 'a poppy seed', length: '1 mm', weight: '' },
  { week: 6, size: 'a groundnut', length: '6 mm', weight: '' },
  { week: 8, size: 'a raspberry', length: '1.6 cm', weight: '1 g' },
  { week: 10, size: 'a kumquat', length: '3 cm', weight: '4 g' },
  { week: 12, size: 'a lime', length: '5 cm', weight: '14 g' },
  { week: 14, size: 'a lemon', length: '9 cm', weight: '45 g' },
  { week: 16, size: 'an avocado', length: '12 cm', weight: '100 g' },
  { week: 18, size: 'a sweet pepper', length: '14 cm', weight: '190 g' },
  { week: 20, size: 'a banana', length: '25 cm', weight: '300 g' },
  { week: 22, size: 'a pawpaw', length: '28 cm', weight: '430 g' },
  { week: 24, size: 'an ear of corn', length: '30 cm', weight: '600 g' },
  { week: 26, size: 'a head of lettuce', length: '35 cm', weight: '760 g' },
  { week: 28, size: 'an aubergine', length: '37 cm', weight: '1 kg' },
  { week: 30, size: 'a cabbage', length: '40 cm', weight: '1.3 kg' },
  { week: 32, size: 'a large yam', length: '42 cm', weight: '1.7 kg' },
  { week: 34, size: 'a pineapple', length: '45 cm', weight: '2.1 kg' },
  { week: 36, size: 'a papaya', length: '47 cm', weight: '2.6 kg' },
  { week: 38, size: 'a small pumpkin', length: '49 cm', weight: '3.1 kg' },
  { week: 40, size: 'a watermelon', length: '51 cm', weight: '3.4 kg' }
];
export function babySizeFor(week: number) {
  let best = BABY_SIZES[0];
  for (const b of BABY_SIZES) if (b.week <= week) best = b;
  return best;
}

export const MILESTONES: { from: number; text: string }[] = [
  { from: 4, text: 'Baby’s heart is starting to form. Keep taking folic acid every day.' },
  { from: 9, text: 'All of baby’s major organs are forming. Book your first antenatal visit if you haven’t yet.' },
  { from: 14, text: 'Baby can make faces and is growing fast. Many women feel more energy now.' },
  { from: 18, text: 'You may start to feel the first flutters of movement.' },
  { from: 22, text: 'Baby can hear your voice. Talk, sing or pray aloud — they are listening.' },
  { from: 28, text: 'Baby’s eyes can open and close. Start packing your hospital bag soon.' },
  { from: 32, text: 'Baby is practising breathing. Know your route to the maternity unit.' },
  { from: 36, text: 'Baby is getting ready for birth. Keep your hospital bag by the door.' }
];
export function milestoneFor(week: number) {
  let best = MILESTONES[0];
  for (const m of MILESTONES) if (m.from <= week) best = m;
  return best.text;
}
