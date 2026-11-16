export interface DiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  category: 'Fungal' | 'Bacterial' | 'Pest' | 'Normal';
  severity: 'None' | 'Moderate' | 'High' | 'Severe';
  description: string;
  symptoms: string[];
  causes: string[];
  management: string[];
  prevention: string[];
  accentColor: string;
}

export const MANGO_DISEASES: Record<string, DiseaseInfo> = {
  "Anthracnose": {
    id: "anthracnose",
    name: "Anthracnose",
    scientificName: "Colletotrichum gloeosporioides",
    category: "Fungal",
    severity: "High",
    description: "Anthracnose is one of the most widespread and damaging fungal diseases affecting mango orchards worldwide. It attacks young leaves, flowers, twigs, and maturing fruits, leading to premature leaf drop and fruit rot.",
    symptoms: [
      "Small, angular, dark brown to black spots with yellow halos on young foliage",
      "Lesions enlarge and coalesce, forming large necrotic patches",
      "Leaves become distorted, tear along dry lesions, and drop prematurely",
      "Black blight on blossom panicles causing flower drop"
    ],
    causes: [
      "Prolonged leaf wetness and warm temperatures (24°C - 30°C)",
      "High relative humidity above 90% during flowering and flushing",
      "Wind-driven rain splashing fungal conidia from infected twigs"
    ],
    management: [
      "Prune affected branches and destroy fallen infected leaves to reduce inoculum",
      "Apply copper oxychloride (0.3%) or mancozeb before blossom opening",
      "Spray systemic fungicides like carbendazim or azoxystrobin during heavy flush periods"
    ],
    prevention: [
      "Maintain adequate tree spacing and canopy aeration via winter pruning",
      "Avoid overhead sprinkler irrigation that wets leaves and flowers",
      "Plant resistant or tolerant mango cultivars when establishing new groves"
    ],
    accentColor: "rose"
  },
  "Bacterial Canker": {
    id: "bacterial-canker",
    name: "Bacterial Canker",
    scientificName: "Xanthomonas campestris pv. mangiferaeindicae",
    category: "Bacterial",
    severity: "Severe",
    description: "Bacterial Canker is a severe bacterial infection causing cankers, leaf blight, and gummy exudations on mango leaves, branches, and fruits, often causing heavy crop loss.",
    symptoms: [
      "Water-soaked, angular, raised dark brown lesions bounded by leaf veins",
      "Yellow halos typically surrounding angular necrotic spots",
      "Cracking of leaf midribs with bacterial ooze under humid conditions",
      "Staring cankers on twigs leading to branch dieback"
    ],
    causes: [
      "Bacterial ingress through natural openings (stomata, lenticels) and mechanical wounds",
      "Strong windstorms and hail driving rain into tree canopies",
      "High temperatures coupled with frequent rainfall"
    ],
    management: [
      "Spray copper hydroxide or copper oxychloride combined with streptocycline (100 ppm)",
      "Remove severely cankered twigs and seal cuts with Bordeaux paste",
      "Disinfect pruning tools with 70% alcohol or 10% bleach between cuts"
    ],
    prevention: [
      "Establish windbreaks around orchards to minimize mechanical abrasions",
      "Inspect nursery saplings thoroughly before orchard transplanting",
      "Avoid handling trees when leaves and foliage are wet"
    ],
    accentColor: "amber"
  },
  "Cutting Weevil": {
    id: "cutting-weevil",
    name: "Cutting Weevil",
    scientificName: "Deporaus marginatus",
    category: "Pest",
    severity: "Moderate",
    description: "The Mango Leaf-Cutting Weevil is a destructive curculionid beetle. Adult females lay eggs in fresh young leaves and cleanly sever the leaf blade near the petiole, causing severe defoliation during flushing.",
    symptoms: [
      "Clean, scissor-like transversal cuts across the base or middle of tender leaves",
      "Severed leaves carpeting the ground beneath the tree canopy",
      "Stunted flush growth and bare shoot tips",
      "Tiny puncture marks along the midrib where eggs are deposited"
    ],
    causes: [
      "Adult weevils emerging from pupation in the soil during new leaf flush cycles",
      "Dense, unpruned tree canopies providing shelter for adult beetles",
      "Warm and humid weather coinciding with the initiation of new vegetative flushes"
    ],
    management: [
      "Collect and destroy fallen cut leaves containing eggs and larvae promptly",
      "Spray recommended insect growth regulators or neem seed kernel extract (NSKE 5%)",
      "Apply chlorpyrifos or cypermethrin around canopy perimeter during peak adult emergence"
    ],
    prevention: [
      "Rake and plow tree basins to expose pupae to solar heat and natural predators",
      "Synchronize flush management to minimize prolonged vulnerable periods",
      "Encourage predatory ants and birds in the orchard ecosystem"
    ],
    accentColor: "orange"
  },
  "Die Back": {
    id: "die-back",
    name: "Die Back",
    scientificName: "Lasiodiplodia theobromae",
    category: "Fungal",
    severity: "Severe",
    description: "Die Back is a vascular fungal disease characterized by the gradual drying and death of shoots and branches from top to bottom, often leading to partial or complete tree mortality if unmanaged.",
    symptoms: [
      "Leaves turn brown, wither, and dry up while remaining attached to dead twigs",
      "Drying and discoloration progresses downward from the shoot tip to the trunk",
      "Brownish-black internal vascular discoloration visible when twigs are split longitudinally",
      "Gummosis and resin oozing from bark fissures on infected branches"
    ],
    causes: [
      "Weakened trees stressed by drought, poor drainage, or nutritional deficiency",
      "Fungal invasion through pruning wounds, insect borers, or sun scald injuries",
      "High temperatures (30°C - 35°C) and water stagnation around roots"
    ],
    management: [
      "Prune affected branches 5–8 cm below the boundary of diseased wood into healthy green tissue",
      "Immediately paste cut surfaces with Bordeaux paste or copper oxychloride paint",
      "Drench root zones and spray canopy with carbendazim or thiophanate-methyl"
    ],
    prevention: [
      "Maintain balanced fertilization, especially potassium and micronutrients (zinc, boron)",
      "Ensure proper orchard drainage to prevent waterlogging during rainy periods",
      "Control bark borers and stem borers which create entry wounds for the fungus"
    ],
    accentColor: "red"
  },
  "Gall Midge": {
    id: "gall-midge",
    name: "Gall Midge",
    scientificName: "Procontarinia matteiana",
    category: "Pest",
    severity: "Moderate",
    description: "The Mango Gall Midge is a tiny dipteran fly whose larvae feed inside tender leaf tissues, inducing distinct conical or blister-like galls that impair photosynthesis and cause premature leaf drop.",
    symptoms: [
      "Numerous tiny blister-like, wart-like galls on both upper and lower leaf surfaces",
      "Galls initially yellowish-green, turning reddish-brown, and finally dark necrotic black",
      "Severe galling leads to leaf curling, crinkling, deformation, and stunted shoot growth",
      "Tiny exit holes on the underside of galls where adult midges have emerged"
    ],
    causes: [
      "Adult midges laying eggs in newly emerged vegetative flushes",
      "Warm temperatures and high ambient humidity favoring rapid larval development",
      "Continuous overlapping flush cycles offering non-stop food sources"
    ],
    management: [
      "Spray systemic insecticides such as imidacloprid (0.3 ml/L) or thiamethoxam at flush initiation",
      "Prune and burn heavily infested shoots during regular orchard sanitation",
      "Introduce or conserve parasitoid wasps (e.g., Platygaster spp.) that naturally parasitize larvae"
    ],
    prevention: [
      "Light cultivation of tree basins to destroy overwintering/summering pupae in topsoil",
      "Monitor tender leaf emergence using yellow sticky traps",
      "Avoid excessive nitrogen fertilization that prolongs soft vegetative flushes"
    ],
    accentColor: "yellow"
  },
  "Healthy": {
    id: "healthy",
    name: "Healthy",
    scientificName: "Mangifera indica L.",
    category: "Normal",
    severity: "None",
    description: "The leaf sample demonstrates robust physiological health with vibrant chlorophyll pigmentation, intact leaf margins, clear venation, and no visible symptoms of fungal, bacterial, or insect damage.",
    symptoms: [
      "Deep lustrous green foliage with uniform chlorophyll distribution",
      "Intact, smooth leaf margins without tearing, bites, or cuts",
      "Absence of necrotic lesions, blisters, powdery coatings, or fungal mats",
      "Well-developed midrib and secondary lateral veins"
    ],
    causes: [
      "Optimal soil nutrition, proper irrigation balance, and adequate sunlight",
      "Effective orchard sanitation and integrated pest management practices",
      "Good canopy airflow reducing pathogen sporulation conditions"
    ],
    management: [
      "Maintain current fertilization and balanced watering schedule",
      "Continue periodic prophylactic inspections throughout seasonal flushing and flowering",
      "No chemical pesticide intervention required"
    ],
    prevention: [
      "Apply organic compost and mulch around tree drip lines to maintain soil microbiome",
      "Ensure timely winter pruning for adequate sunlight penetration",
      "Routine scouting to catch early disease vectors before colonization"
    ],
    accentColor: "emerald"
  },
  "Powdery Mildew": {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    scientificName: "Oidium mangiferae",
    category: "Fungal",
    severity: "High",
    description: "Powdery Mildew is an economically destructive fungal disease primarily targeting inflorescences and new foliage. It is easily recognized by a powdery white superficial fungal coating.",
    symptoms: [
      "White or grayish powdery superficial mycelial patches on young leaves and blossoms",
      "Infected leaves curl, twist, become brittle, and exhibit purple-brown discoloration beneath the powder",
      "Premature dropping of infected young leaves and unopened blossom buds",
      "Severe reduction in fruit set and complete loss of flower panicles"
    ],
    causes: [
      "Cool nights (10°C - 15°C) followed by warm dry days (25°C - 30°C)",
      "High relative humidity during mornings without requiring actual liquid rainfall",
      "Cloudy and misty weather during mango flowering season"
    ],
    management: [
      "Apply wettable sulfur (0.2%) as an effective protective spray",
      "Spray systemic fungicides like hexaconazole, penconazole, or dinocap at panicle emergence",
      "Repeat application at 10-14 day intervals until fruit set is completed"
    ],
    prevention: [
      "Prune dense inner canopy branches to increase sunlight and heat penetration",
      "Avoid planting overly dense orchards in valleys prone to morning fog and dampness",
      "Conserve beneficial hyperparasitic fungi like Ampelomyces quisqualis"
    ],
    accentColor: "indigo"
  },
  "Sooty Mould": {
    id: "sooty-mould",
    name: "Sooty Mould",
    scientificName: "Meliola mangiferae / Capnodium spp.",
    category: "Fungal",
    severity: "Moderate",
    description: "Sooty Mould is a black, superficial fungal crust that grows on honeydew excreted by sap-sucking insects like mango hoppers, scales, mealybugs, and aphids. Although non-parasitic, it severely inhibits photosynthesis.",
    symptoms: [
      "Thick, velvety or crusty black soot-like coating covering upper leaf surfaces",
      "Black fungal film easily peels or scrapes off the leaf epidermis",
      "Yellowing and stunted growth of underlying leaf tissue due to blocked sunlight",
      "Presence of honeydew-secreting insects (hoppers, mealybugs) on twigs and stems"
    ],
    causes: [
      "Heavy infestation of sucking insect pests excreting sweet honeydew droplets",
      "Shady, humid, and poorly aerated tree canopies favoring fungal proliferation",
      "Absence of insect pest management allowing honeydew accumulation"
    ],
    management: [
      "Control the primary insect culprits with systemic insecticides (imidacloprid or dimethoate)",
      "Spray dilute starch solution (2% to 3%) or Maida paste; as it dries, it flakes off the black crust",
      "Spray copper oxychloride (0.3%) or dilute soap solution to wash away sooty residues"
    ],
    prevention: [
      "Regular orchard scouting for early presence of mango hoppers and mealybugs",
      "Thin out inner canopy shoots to allow wind and sunlight to deter sucking insects",
      "Band tree trunks with polythene sheets and grease to block ant transport of scales"
    ],
    accentColor: "slate"
  }
};

