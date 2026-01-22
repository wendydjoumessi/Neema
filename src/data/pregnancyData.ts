import { WeeklyInfo, NutritionGuide, Exercise, Medication, ChecklistItem, DailyPrayer } from '@/types/pregnancy';

export const weeklyData: WeeklyInfo[] = [
  {
    week: 1,
    babySize: "0.1mm",
    babySizeComparison: "Poppy seed",
    babyDevelopment: ["Fertilization occurs", "Cell division begins"],
    motherChanges: ["Ovulation may occur", "Hormonal changes begin"],
    tips: ["Start prenatal vitamins", "Avoid alcohol and smoking"],
    trimester: 1
  },
  {
    week: 4,
    babySize: "2mm",
    babySizeComparison: "Poppy seed",
    babyDevelopment: ["Embryo implants in uterus", "Neural tube forming", "Heart begins to form"],
    motherChanges: ["Missed period", "Breast tenderness", "Fatigue"],
    tips: ["Confirm pregnancy with test", "Schedule first prenatal visit"],
    trimester: 1
  },
  {
    week: 8,
    babySize: "1.6cm",
    babySizeComparison: "Raspberry",
    babyDevelopment: ["Arms and legs developing", "Facial features forming", "Heart beating"],
    motherChanges: ["Morning sickness peaks", "Heightened sense of smell", "Mood swings"],
    tips: ["Eat small frequent meals", "Stay hydrated", "Get plenty of rest"],
    trimester: 1
  },
  {
    week: 12,
    babySize: "5.4cm",
    babySizeComparison: "Lime",
    babyDevelopment: ["Organs fully formed", "Reflexes developing", "Fingernails growing"],
    motherChanges: ["Nausea improving", "Energy returning", "Visible baby bump"],
    tips: ["First trimester screening", "Announce pregnancy if desired"],
    trimester: 1
  },
  {
    week: 16,
    babySize: "11.6cm",
    babySizeComparison: "Avocado",
    babyDevelopment: ["Gender can be determined", "Baby can hear sounds", "Movements becoming stronger"],
    motherChanges: ["May feel first movements", "Round ligament pain", "Glowing skin"],
    tips: ["Start talking to baby", "Consider maternity clothes"],
    trimester: 2
  },
  {
    week: 20,
    babySize: "16.4cm",
    babySizeComparison: "Banana",
    babyDevelopment: ["Halfway point!", "Vernix protecting skin", "Taste buds developing"],
    motherChanges: ["Definite baby bump", "Feeling regular movements", "Backaches possible"],
    tips: ["Anatomy scan ultrasound", "Stay active with gentle exercise"],
    trimester: 2
  },
  {
    week: 24,
    babySize: "30cm",
    babySizeComparison: "Ear of corn",
    babyDevelopment: ["Lungs developing surfactant", "Brain growing rapidly", "Viability milestone"],
    motherChanges: ["Glucose screening", "Leg cramps possible", "Braxton Hicks may begin"],
    tips: ["Take glucose tolerance test", "Practice good posture"],
    trimester: 2
  },
  {
    week: 28,
    babySize: "37.6cm",
    babySizeComparison: "Eggplant",
    babyDevelopment: ["Eyes can open", "REM sleep occurring", "Immune system developing"],
    motherChanges: ["Third trimester begins", "Shortness of breath", "Frequent urination"],
    tips: ["Start birth preparation classes", "Begin counting kicks"],
    trimester: 3
  },
  {
    week: 32,
    babySize: "42.4cm",
    babySizeComparison: "Squash",
    babyDevelopment: ["Practicing breathing", "Bones hardening", "Head-down position"],
    motherChanges: ["Difficulty sleeping", "Swollen feet", "Nesting instinct"],
    tips: ["Pack hospital bag", "Finalize birth plan"],
    trimester: 3
  },
  {
    week: 36,
    babySize: "47.4cm",
    babySizeComparison: "Papaya",
    babyDevelopment: ["Fat layers forming", "Immune system strengthening", "Dropping into pelvis"],
    motherChanges: ["Baby drops lower", "Easier breathing", "Increased pelvic pressure"],
    tips: ["Weekly doctor visits", "Install car seat"],
    trimester: 3
  },
  {
    week: 40,
    babySize: "51.2cm",
    babySizeComparison: "Watermelon",
    babyDevelopment: ["Fully developed", "Ready for birth", "Average 3.4kg"],
    motherChanges: ["Full term!", "Signs of labor", "Cervix ripening"],
    tips: ["Watch for labor signs", "Rest when possible", "Trust your body"],
    trimester: 3
  }
];

export const nutritionGuides: NutritionGuide[] = [
  {
    trimester: 1,
    dailyCalories: 1800,
    keyNutrients: ["Folic Acid (600mcg)", "Iron (27mg)", "Vitamin B12", "Vitamin D"],
    recommended: [
      { name: "Leafy greens", category: "Vegetables", benefits: "Rich in folic acid" },
      { name: "Eggs", category: "Protein", benefits: "Complete protein, choline" },
      { name: "Citrus fruits", category: "Fruits", benefits: "Vitamin C, immune support" },
      { name: "Whole grains", category: "Carbs", benefits: "Fiber, B vitamins" },
      { name: "Lean meats", category: "Protein", benefits: "Iron, protein" },
      { name: "Legumes", category: "Protein", benefits: "Folate, fiber" },
    ],
    avoid: [
      { name: "Raw fish/sushi", category: "Seafood", reason: "Risk of parasites" },
      { name: "Unpasteurized cheese", category: "Dairy", reason: "Listeria risk" },
      { name: "Raw eggs", category: "Protein", reason: "Salmonella risk" },
      { name: "High mercury fish", category: "Seafood", reason: "Mercury toxicity" },
      { name: "Alcohol", category: "Beverages", reason: "Fetal alcohol syndrome" },
      { name: "Excess caffeine", category: "Beverages", reason: "Limit to 200mg/day" },
    ]
  },
  {
    trimester: 2,
    dailyCalories: 2200,
    keyNutrients: ["Calcium (1000mg)", "Omega-3 fatty acids", "Vitamin D", "Magnesium"],
    recommended: [
      { name: "Dairy products", category: "Dairy", benefits: "Calcium for bone development" },
      { name: "Fatty fish (cooked)", category: "Protein", benefits: "Omega-3 for brain development" },
      { name: "Nuts and seeds", category: "Snacks", benefits: "Healthy fats, minerals" },
      { name: "Sweet potatoes", category: "Vegetables", benefits: "Vitamin A, fiber" },
      { name: "Berries", category: "Fruits", benefits: "Antioxidants, vitamin C" },
      { name: "Yogurt", category: "Dairy", benefits: "Probiotics, calcium" },
    ],
    avoid: [
      { name: "Raw fish/sushi", category: "Seafood", reason: "Risk of parasites" },
      { name: "Deli meats", category: "Protein", reason: "Listeria risk unless heated" },
      { name: "Excess vitamin A", category: "Supplements", reason: "Liver damage risk" },
    ]
  },
  {
    trimester: 3,
    dailyCalories: 2400,
    keyNutrients: ["Protein (75-100g)", "Iron (27mg)", "Vitamin K", "Fiber"],
    recommended: [
      { name: "Iron-rich foods", category: "Protein", benefits: "Blood volume increase" },
      { name: "Fiber-rich foods", category: "Vegetables", benefits: "Prevent constipation" },
      { name: "Protein sources", category: "Protein", benefits: "Baby's final growth" },
      { name: "Water-rich foods", category: "Fruits", benefits: "Hydration" },
      { name: "Complex carbs", category: "Carbs", benefits: "Sustained energy" },
    ],
    avoid: [
      { name: "Large meals", category: "Portion", reason: "Reduced stomach capacity" },
      { name: "Spicy foods", category: "Seasoning", reason: "May worsen heartburn" },
      { name: "Excessive salt", category: "Seasoning", reason: "May increase swelling" },
    ]
  }
];

export const exercises: Exercise[] = [
  {
    name: "Walking",
    duration: "30 minutes",
    frequency: "Daily",
    benefits: "Low impact cardio, mood boost",
    safetyTips: ["Wear supportive shoes", "Stay hydrated", "Avoid extreme heat"]
  },
  {
    name: "Prenatal Yoga",
    duration: "30-45 minutes",
    frequency: "3-4 times/week",
    benefits: "Flexibility, breathing, relaxation",
    safetyTips: ["Avoid hot yoga", "Skip deep twists", "Use props for support"]
  },
  {
    name: "Swimming",
    duration: "30 minutes",
    frequency: "2-3 times/week",
    benefits: "Full body workout, joint relief",
    safetyTips: ["Avoid diving", "Watch pool temperature", "Take breaks"]
  },
  {
    name: "Prenatal Pilates",
    duration: "30 minutes",
    frequency: "2-3 times/week",
    benefits: "Core strength, posture",
    safetyTips: ["Modify lying positions", "Focus on breathing", "No overexertion"]
  },
  {
    name: "Kegel Exercises",
    duration: "5-10 minutes",
    frequency: "Daily",
    benefits: "Pelvic floor strength, labor prep",
    safetyTips: ["Don't overdo it", "Empty bladder first", "Consistent practice"]
  },
  {
    name: "Stationary Cycling",
    duration: "20-30 minutes",
    frequency: "3 times/week",
    benefits: "Cardio without joint stress",
    safetyTips: ["Adjust seat height", "Low resistance", "Stay cool"]
  }
];

export const unsafeMedications: Medication[] = [
  { name: "Ibuprofen", category: "unsafe", notes: "May affect fetal heart and kidneys" },
  { name: "Aspirin (high dose)", category: "unsafe", notes: "Risk of bleeding complications" },
  { name: "Isotretinoin (Accutane)", category: "unsafe", notes: "Severe birth defects" },
  { name: "Warfarin", category: "unsafe", notes: "Causes birth defects" },
  { name: "ACE Inhibitors", category: "unsafe", notes: "Kidney damage to fetus" },
  { name: "Tetracycline", category: "unsafe", notes: "Affects bone and teeth development" },
  { name: "Acetaminophen", category: "safe", notes: "Safe when used as directed" },
  { name: "Prenatal vitamins", category: "safe", notes: "Essential for pregnancy" },
  { name: "Antacids", category: "caution", notes: "Check with doctor first" },
];

export const defaultChecklist: ChecklistItem[] = [
  // Clothes
  { id: "c1", category: "clothes", name: "Onesies (newborn)", completed: false, quantity: 8, priority: "essential" },
  { id: "c2", category: "clothes", name: "Sleepers/pajamas", completed: false, quantity: 6, priority: "essential" },
  { id: "c3", category: "clothes", name: "Baby hats", completed: false, quantity: 3, priority: "essential" },
  { id: "c4", category: "clothes", name: "Socks/booties", completed: false, quantity: 6, priority: "essential" },
  { id: "c5", category: "clothes", name: "Mittens", completed: false, quantity: 3, priority: "recommended" },
  { id: "c6", category: "clothes", name: "Swaddle blankets", completed: false, quantity: 4, priority: "essential" },
  
  // Hygiene
  { id: "h1", category: "hygiene", name: "Diapers (newborn)", completed: false, quantity: 200, priority: "essential" },
  { id: "h2", category: "hygiene", name: "Baby wipes", completed: false, quantity: 4, priority: "essential" },
  { id: "h3", category: "hygiene", name: "Diaper cream", completed: false, quantity: 2, priority: "essential" },
  { id: "h4", category: "hygiene", name: "Baby shampoo", completed: false, quantity: 1, priority: "essential" },
  { id: "h5", category: "hygiene", name: "Baby lotion", completed: false, quantity: 1, priority: "recommended" },
  { id: "h6", category: "hygiene", name: "Nail clippers", completed: false, quantity: 1, priority: "essential" },
  { id: "h7", category: "hygiene", name: "Baby thermometer", completed: false, quantity: 1, priority: "essential" },
  
  // Equipment
  { id: "e1", category: "equipment", name: "Car seat", completed: false, quantity: 1, priority: "essential" },
  { id: "e2", category: "equipment", name: "Crib/bassinet", completed: false, quantity: 1, priority: "essential" },
  { id: "e3", category: "equipment", name: "Stroller", completed: false, quantity: 1, priority: "essential" },
  { id: "e4", category: "equipment", name: "Baby carrier", completed: false, quantity: 1, priority: "recommended" },
  { id: "e5", category: "equipment", name: "Nursing pillow", completed: false, quantity: 1, priority: "recommended" },
  { id: "e6", category: "equipment", name: "Baby monitor", completed: false, quantity: 1, priority: "recommended" },
  { id: "e7", category: "equipment", name: "Changing pad", completed: false, quantity: 1, priority: "essential" },
  { id: "e8", category: "equipment", name: "Bottles", completed: false, quantity: 6, priority: "essential" },
  
  // Hospital bag
  { id: "b1", category: "hospital-bag", name: "Insurance/ID documents", completed: false, priority: "essential" },
  { id: "b2", category: "hospital-bag", name: "Birth plan copies", completed: false, priority: "recommended" },
  { id: "b3", category: "hospital-bag", name: "Comfortable clothes", completed: false, priority: "essential" },
  { id: "b4", category: "hospital-bag", name: "Toiletries", completed: false, priority: "essential" },
  { id: "b5", category: "hospital-bag", name: "Going home outfit (baby)", completed: false, priority: "essential" },
  { id: "b6", category: "hospital-bag", name: "Going home outfit (mom)", completed: false, priority: "essential" },
  { id: "b7", category: "hospital-bag", name: "Phone charger", completed: false, priority: "essential" },
  { id: "b8", category: "hospital-bag", name: "Nursing bras", completed: false, quantity: 2, priority: "essential" },
  { id: "b9", category: "hospital-bag", name: "Snacks", completed: false, priority: "recommended" },
  { id: "b10", category: "hospital-bag", name: "Pillow from home", completed: false, priority: "optional" },
];

export const dailyPrayers: DailyPrayer[] = [
  {
    id: "p1",
    date: new Date(),
    title: "Prayer for a Healthy Baby",
    content: "Dear Lord, I thank You for the precious gift growing within me. Please watch over my baby's development and keep them healthy and strong. Grant me peace and strength throughout this journey.",
    verse: "For you created my inmost being; you knit me together in my mother's womb. - Psalm 139:13",
    affirmation: "My body is nurturing and protecting my baby with every breath I take."
  },
  {
    id: "p2",
    date: new Date(),
    title: "Prayer for Strength",
    content: "Heavenly Father, grant me the strength to face each day with grace. Help me to remain calm and positive, trusting in Your perfect plan for me and my baby.",
    verse: "I can do all things through Christ who strengthens me. - Philippians 4:13",
    affirmation: "I am strong, capable, and prepared for this beautiful journey of motherhood."
  },
  {
    id: "p3",
    date: new Date(),
    title: "Prayer of Gratitude",
    content: "Thank You, Lord, for the miracle of life. I am grateful for each movement, each heartbeat, and each sign of growth. Help me cherish these precious moments.",
    verse: "Children are a heritage from the Lord, offspring a reward from him. - Psalm 127:3",
    affirmation: "I am blessed to be carrying new life, and I embrace this gift with joy."
  }
];

export const dangerSymptoms = [
  "Heavy vaginal bleeding",
  "Severe abdominal pain",
  "High fever (over 101°F / 38.3°C)",
  "Severe headache with vision changes",
  "Sudden severe swelling (face, hands)",
  "Baby not moving for extended period",
  "Water breaking before 37 weeks",
  "Contractions before 37 weeks",
  "Difficulty breathing",
  "Signs of preeclampsia"
];

export const commonSymptoms = [
  "Morning sickness",
  "Fatigue",
  "Back pain",
  "Heartburn",
  "Leg cramps",
  "Swollen feet",
  "Frequent urination",
  "Mood swings",
  "Food cravings",
  "Insomnia",
  "Braxton Hicks contractions",
  "Round ligament pain"
];
