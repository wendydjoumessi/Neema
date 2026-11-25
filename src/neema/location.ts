/**
 * Where she lives: used to suggest foods from her own markets and exercise that suits the climate.
 * Regional content must be reviewed by Neema's clinical reviewer and a local nutritionist.
 */

export const CAMEROON = 'Cameroon';

/** Cameroon's 10 regions. */
export const REGIONS = [
  'Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'North-West', 'South', 'South-West', 'West',
] as const;
export type Region = (typeof REGIONS)[number];

/** Country choices: Cameroon first, then neighbours and where many Cameroonians live. */
export const COUNTRIES = [
  CAMEROON, 'Nigeria', 'Chad', 'Central African Republic', 'Gabon', 'Equatorial Guinea', 'Republic of the Congo',
  'France', 'Belgium', 'Germany', 'United Kingdom', 'United States', 'Canada', 'Other country',
] as const;

/** Regions grouped by climate and food tradition. */
export type Zone = 'sahel' | 'highlands' | 'coast' | 'forest';
export const ZONE_OF: Record<Region, Zone> = {
  'Far North': 'sahel', North: 'sahel', Adamawa: 'sahel',
  West: 'highlands', 'North-West': 'highlands',
  Littoral: 'coast', 'South-West': 'coast',
  Centre: 'forest', South: 'forest', East: 'forest',
};

export const ZONE_LABEL: Record<Zone, string> = {
  sahel: 'the North', highlands: 'the Grassfields', coast: 'the coast', forest: 'the Centre, South and East',
};

export type LocalFood = { name: string; local: string; kind: string; tags: string[]; benefit: string };

/** Popular, affordable foods in each zone that are good sources of iron, folate, protein or calcium. */
export const REGIONAL_FOODS: Record<Zone, LocalFood[]> = {
  sahel: [
    { name: 'Moringa leaves', local: 'Gawdi', kind: 'leaf', tags: ['Iron', 'Calcium', 'Folate'], benefit: 'Add a handful of fresh or dried leaves to sauce. One of the richest local sources of iron and calcium.' },
    { name: 'Millet or sorghum', local: 'Couscous, bouillie', kind: 'grain', tags: ['Energy', 'Iron'], benefit: 'Steady energy. Eat with a leafy sauce and a fruit to take in more iron.' },
    { name: 'Kossam', local: 'Fresh or soured milk', kind: 'milk', tags: ['Calcium', 'Protein'], benefit: 'Calcium for strong bones and teeth. Choose boiled or pasteurised milk.' },
    { name: 'Beef or eggs', local: 'Well cooked', kind: 'egg', tags: ['Iron', 'Protein'], benefit: 'Iron the body absorbs easily. Cook meat and eggs until no pink or runny part remains.' },
    { name: 'Groundnuts', local: 'Arachides', kind: 'nut', tags: ['Protein', 'Folate'], benefit: 'A handful a day, roasted or in sauce, adds protein and folate.' },
  ],
  highlands: [
    { name: 'Njama njama', local: 'Huckleberry leaves', kind: 'leaf', tags: ['Iron', 'Folate'], benefit: 'Cook with a little palm oil and eat with corn fufu. Rich in iron and folate.' },
    { name: 'Achu and yellow soup', local: 'Cocoyam with palm-oil soup', kind: 'tuber', tags: ['Energy', 'Vitamin A'], benefit: 'Red palm oil brings vitamin A. Add leaves or fish to the soup for iron.' },
    { name: 'Beans', local: 'Koki, haricots', kind: 'bean', tags: ['Iron', 'Protein'], benefit: 'Iron and protein together. Eat with tomato or an orange to absorb more iron.' },
    { name: 'Avocado', local: 'Pear', kind: 'fruit', tags: ['Folate', 'Healthy fats'], benefit: 'In season it is cheap and full of folate and healthy fats.' },
    { name: 'Corn', local: 'Corn fufu, roasted corn', kind: 'grain', tags: ['Energy', 'Fibre'], benefit: 'Filling energy food. Pair it with leaves and beans for a balanced plate.' },
  ],
  coast: [
    { name: 'Ndolé', local: 'Bitter leaf', kind: 'leaf', tags: ['Iron', 'Folate'], benefit: 'Builds blood. Cook well with groundnuts; add tomato for vitamin C.' },
    { name: 'Eru', local: 'With waterleaf', kind: 'leaf', tags: ['Iron', 'Fibre'], benefit: 'Leafy and rich. Eat with water fufu or garri and some fish.' },
    { name: 'Fresh or smoked fish', local: 'Bar, maquereau', kind: 'fish', tags: ['Protein', 'Omega-3'], benefit: 'Supports baby’s brain and eyes. Always cook fish through.' },
    { name: 'Ekoki', local: 'Beans and matobo', kind: 'bean', tags: ['Iron', 'Protein'], benefit: 'Bean cake steamed in leaves: protein and iron in one dish.' },
    { name: 'Plantains', local: 'Boiled or roasted', kind: 'plantain', tags: ['Energy', 'Fibre'], benefit: 'Slow-release energy. Boiled or roasted is better than fried.' },
  ],
  forest: [
    { name: 'Kwem', local: 'Pounded cassava leaves', kind: 'leaf', tags: ['Iron', 'Folate'], benefit: 'Cassava leaves cooked with palm nut: iron and folate. Always cook the leaves well.' },
    { name: 'Okok', local: 'Gnetum leaves', kind: 'leaf', tags: ['Iron', 'Protein'], benefit: 'A leafy dish rich in iron. Eat with cassava stick or plantain.' },
    { name: 'Fish or eggs', local: 'Poisson, œufs', kind: 'fish', tags: ['Protein', 'Iron'], benefit: 'Protein for baby’s growth. Cook through.' },
    { name: 'Groundnut sauce', local: 'Sauce d’arachide', kind: 'nut', tags: ['Protein', 'Folate'], benefit: 'Adds protein and folate to leaves and tubers.' },
    { name: 'Plantains and macabo', local: 'Boiled', kind: 'plantain', tags: ['Energy', 'Fibre'], benefit: 'Filling and gentle. Boil rather than fry.' },
  ],
};

/** Exercise advice that fits the climate of her zone. */
export const REGIONAL_ACTIVITY: Record<Zone, { title: string; tips: string[] }> = {
  sahel: {
    title: 'Hot, dry weather',
    tips: [
      'Walk early in the morning or after sunset, not in the midday heat.',
      'Drink a cup of water before and after, and carry water with you.',
      'In harmattan dust, walk indoors or cover your nose and mouth.',
    ],
  },
  highlands: {
    title: 'Cooler hills',
    tips: [
      'Take hills slowly: you should still be able to talk.',
      'Wear good shoes on slippery paths in the rainy season.',
      'Dress in layers on cool mornings.',
    ],
  },
  coast: {
    title: 'Hot and humid',
    tips: [
      'Move in the cool of the morning or evening.',
      'Wear light, loose clothes and drink more water than you think.',
      'In heavy rain, dance or walk inside your home or compound.',
    ],
  },
  forest: {
    title: 'Warm and humid',
    tips: [
      'Choose shaded paths and avoid the midday sun.',
      'Drink water often, even when it is cloudy.',
      'On rainy days, walk inside or dance at home for 10 minutes.',
    ],
  },
};

export const zoneFor = (country: string, region: string): Zone | null =>
  country === CAMEROON && (REGIONS as readonly string[]).includes(region) ? ZONE_OF[region as Region] : null;
