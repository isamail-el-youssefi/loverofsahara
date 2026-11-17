/**
 * Editorial content for each place a trip stops at (English only for now).
 *
 * Written from general knowledge for the owner to review before publishing. Things that are NOT written
 * here but derived from the trips instead (so they can never drift): coordinates, distance from Marrakech
 * and which trips visit the place.
 */

export type PlaceKind =
  | "City"
  | "Town"
  | "Village"
  | "Kasbah"
  | "Pass"
  | "Gorge"
  | "Valley"
  | "Oasis"
  | "Dunes"
  | "Lake"
  | "Massif"
  | "Coast"
  | "Park";

export interface Place {
  name: string;
  kind: PlaceKind;
  /** A loose geographic label (not an administrative region). */
  region: string;
  /** Two or three sentences: what the place is and why it is on a route. */
  brief: string;
  bestTime: string;
  /** Always five, in this order: why stop here, what to see, the story, best moment, good to know. */
  insights: [string, string, string, string, string];
}

/** As written below: the three original notes (why stop here, what to see, good to know). */
type BasePlace = Omit<Place, "insights"> & { insights: [string, string, string] };

const BASE: Record<string, BasePlace> = {
  marrakech: {
    name: "Marrakech",
    kind: "City",
    region: "Marrakech plain",
    brief:
      "Morocco's imperial red city and the starting point of most of our journeys. Behind the medina walls, souks, riads and the Jemaa el-Fna square trade all day before the road climbs into the High Atlas.",
    bestTime: "March to May, September to November",
    insights: [
      "It is where the journey begins and ends: a last night of comfort before the desert, and a first one after it.",
      "The Koutoubia minaret, the Jemaa el-Fna square at dusk, the souks of the medina and the Bahia Palace.",
      "Summer afternoons are very hot. Explore in the morning and after sunset, and keep an evening free for the square.",
    ],
  },
  agadir: {
    name: "Agadir",
    kind: "City",
    region: "Atlantic coast",
    brief:
      "A modern seaside city on the Atlantic, rebuilt after the 1960 earthquake. It makes a relaxed start or finish for journeys that head inland towards Taroudant and the Anti-Atlas.",
    bestTime: "Year-round; warmest from May to October",
    insights: [
      "The ocean, after days of desert and mountains: a soft landing at the end of a long route.",
      "The long beach and promenade, the marina, and the ruins of the hilltop kasbah with views over the bay.",
      "The old city was destroyed in 1960, so the appeal here is the coast rather than a medina. Pair it with Taroudant for a walled-town feel.",
    ],
  },
  taroudant: {
    name: "Taroudant",
    kind: "City",
    region: "Souss valley",
    brief:
      "A walled market town in the Souss valley, often called 'the little Marrakech' for its ochre ramparts, with a quieter and more local pace.",
    bestTime: "October to April",
    insights: [
      "You get the walls, souks and craftsmanship of a great Moroccan city without the crowds.",
      "Walk or cycle the full circuit of the ramparts, browse the Berber and Arab souks, and look for leather and silver work.",
      "Late afternoon light on the ramparts is the best moment. The souks are calm, so bargaining is relaxed.",
    ],
  },
  taliouine: {
    name: "Taliouine",
    kind: "Village",
    region: "Anti-Atlas",
    brief:
      "A small town at the foot of the Anti-Atlas, known as the saffron capital of Morocco, where the crocus fields supply one of the world's most precious spices.",
    bestTime: "Late October to November, for the saffron harvest",
    insights: [
      "A rare chance to see saffron grown and handled by the families who produce it.",
      "Saffron cooperatives and fields, the old Taliouine kasbah, and mountain views over the valley.",
      "The harvest lasts only a few weeks. Buying from a cooperative gives you honest quality and fair prices.",
    ],
  },
  "tizi-n-tichka": {
    name: "Tizi n'Tichka Pass",
    kind: "Pass",
    region: "High Atlas",
    brief:
      "The High Atlas pass on the road between Marrakech and Ouarzazate, at around 2,260 metres one of the highest main roads in the country. It is the doorway from the green north to the dry south.",
    bestTime: "April to October; check conditions from December to February",
    insights: [
      "The landscape changes in a few hours: from orchards and pine to red earth, kasbahs and an open horizon.",
      "Switchback viewpoints over the valleys, Berber villages clinging to the slopes, and roadside sellers of minerals and fossils.",
      "Snow can slow or close the pass in winter. It is cool at the top even in spring, so keep a layer within reach.",
    ],
  },
  telouet: {
    name: "Telouet",
    kind: "Kasbah",
    region: "High Atlas",
    brief:
      "A mountain village known for its palace kasbah, the former seat of the powerful Glaoui family, set above the Ounila valley.",
    bestTime: "March to June, September to November",
    insights: [
      "A quieter, more atmospheric alternative to the big stops on the main road, with a story of power and decline.",
      "The Glaoui kasbah with its painted ceilings and mosaics, the Ounila valley, and the red-earth villages around it.",
      "Parts of the kasbah are fragile and being restored, so what you can enter changes. The valley drive is the highlight either way.",
    ],
  },
  "ait-ben-haddou": {
    name: "Ait Ben Haddou",
    kind: "Kasbah",
    region: "Ouarzazate region",
    brief:
      "A fortified earthen village (ksar) climbing a hillside above a river, listed as a UNESCO World Heritage Site in 1987 and a familiar film location.",
    bestTime: "March to May, September to November",
    insights: [
      "It is the clearest picture of a pre-Saharan fortified village, built entirely of earth and still standing.",
      "Climb through the ksar to the hilltop granary for views, and cross the river at golden hour for the classic view of the whole village.",
      "Go early or late to avoid day-trip crowds and midday heat. A few families still live inside the walls.",
    ],
  },
  "oasis-fint": {
    name: "Fint Oasis",
    kind: "Oasis",
    region: "Ouarzazate region",
    brief:
      "A small, quiet palm-grove oasis a short drive from Ouarzazate, well away from the main tourist routes.",
    bestTime: "October to April",
    insights: [
      "A slow, human-scale stop that shows how oasis communities live and farm.",
      "Walks through the palm groves and along the irrigation channels, and the chance to meet local families.",
      "It is best explored on foot with a local guide, a gentle contrast to the big sites around it.",
    ],
  },
  ouarzazate: {
    name: "Ouarzazate",
    kind: "City",
    region: "Ouarzazate region",
    brief:
      "A crossroads town between the High Atlas and the desert, known as Morocco's film capital and the practical gateway to the south.",
    bestTime: "October to April; summers are very hot",
    insights: [
      "It is the rest-and-restock point before longer desert drives, with good places to eat and sleep.",
      "Taourirt Kasbah, the film studios, and day trips to Fint Oasis and Ait Ben Haddou.",
      "Stock up on water and supplies here. Summers are intense, so plan outdoor time for early morning or evening.",
    ],
  },
  "kalaat-mgouna": {
    name: "Kalaat M'Gouna",
    kind: "Town",
    region: "Dadès valley",
    brief:
      "The town at the heart of the Valley of Roses, where damask roses grow along the irrigation channels and are made into rose water and cosmetics.",
    bestTime: "Late April to mid-May, in rose season",
    insights: [
      "A scented, green valley between the High Atlas and the dry plains, with a real local craft behind it.",
      "Rose-water and cosmetic cooperatives, the fields in bloom, the spring rose festival, and nearby kasbahs and palm groves.",
      "The bloom is brief, usually late April to May. Outside it the valley is still green and the rose products are sold all year.",
    ],
  },
  bouthgrar: {
    name: "Bouthgrar",
    kind: "Village",
    region: "Dadès valley",
    brief:
      "A palm-grove village in the Dadès valley, on the road between Kalaat M'Gouna and Boumalne Dadès.",
    bestTime: "March to May, September to November",
    insights: [
      "A green, unhurried pause in the valley that most people drive straight past.",
      "Walks among date palms and mud-brick kasbahs, and views along the valley.",
      "It suits walking better than driving. Ask your guide about local paths and family-run cafés.",
    ],
  },
  "dades-gorges": {
    name: "Dadès Gorges & Valley",
    kind: "Gorge",
    region: "Dadès valley",
    brief:
      "A dramatic canyon carved by the Dadès river, with red cliffs, the winding 'Monkey Fingers' rock formations and a road of tight hairpins.",
    bestTime: "March to May, September to November",
    insights: [
      "One of the great road-and-landscape stretches of the south, with kasbahs scattered along the valley.",
      "The Monkey Fingers formations, the hairpin-road viewpoints and the kasbahs along the river.",
      "Early morning gives the best light on the cliffs. Walking shoes help for the short riverside trails.",
    ],
  },
  "boumalne-dades": {
    name: "Boumalne Dadès",
    kind: "Town",
    region: "Dadès valley",
    brief:
      "A market town and the usual gateway to the Dadès Gorges, with views over the valley from the hills above.",
    bestTime: "March to May, September to November",
    insights: [
      "A convenient base for the Dadès and Todgha gorges, with simple, good places to stay.",
      "The local market, kasbahs on the hills, and the start of the gorge road.",
      "Use it as an overnight stop and head up the gorge early, before the day-trip traffic.",
    ],
  },
  msemrir: {
    name: "Msemrir",
    kind: "Village",
    region: "High Atlas",
    brief:
      "A remote Berber village high on the road between the Dadès and Todgha gorges, at the edge of the High Atlas.",
    bestTime: "April to June, September to October",
    insights: [
      "A real off-the-main-route stop, where the landscape is big and the crowds are not.",
      "Terraced fields, mud-brick houses and wide mountain views.",
      "The road is rough and slow, so allow extra time. The reward is silence and space.",
    ],
  },
  agoudal: {
    name: "Agoudal",
    kind: "Village",
    region: "High Atlas",
    brief:
      "A high-altitude Berber village in the High Atlas, on the road towards Imilchil, home to Aït Hdiddou communities.",
    bestTime: "May to October",
    insights: [
      "A glimpse of mountain pastoral life far from the usual tourist circuit.",
      "Panoramic mountain views, village life, and the traditions of the families who herd here.",
      "It is high and exposed, so it can be cold even in spring. Bring warm layers.",
    ],
  },
  "todgha-gorges": {
    name: "Todgha Gorges",
    kind: "Gorge",
    region: "Todgha valley",
    brief:
      "A narrow canyon where the Todgha river cuts between sheer limestone walls hundreds of metres high, with a palm-grove oasis in the valley below.",
    bestTime: "March to May, September to November",
    insights: [
      "The scale of the walls is hard to appreciate from the road, so walk in and look up.",
      "Walking the canyon floor, climbing routes on the cliffs, and the palm grove at the entrance.",
      "Midday brings the most visitors, so go early or late. River crossings can be wet after rain.",
    ],
  },
  "jbel-saghro": {
    name: "Jbel Saghro",
    kind: "Massif",
    region: "Anti-Atlas",
    brief:
      "A volcanic range of dark rock, plateaus and canyons in the Anti-Atlas, long the territory of the Aït Atta nomads.",
    bestTime: "March to May, September to November",
    insights: [
      "Wild, quiet trekking country with huge skies and almost no light pollution.",
      "Hiking among strange rock formations, nomad camps, and sunrise and stars from the ridges.",
      "The climate is harsh: hot days and cold nights. Spring and autumn are the right seasons.",
    ],
  },
  taznakht: {
    name: "Taznakht",
    kind: "Village",
    region: "Anti-Atlas",
    brief:
      "A village known for its hand-woven Berber carpets, made on looms in homes and cooperatives across the area.",
    bestTime: "October to April",
    insights: [
      "A chance to see a craft up close, from wool to finished carpet, and meet the weavers.",
      "Carpet cooperatives and weaving workshops, the old kasbah, and the local souk.",
      "Buy direct from a cooperative, and ask about patterns and natural dyes. Each design tells a regional story.",
    ],
  },
  agdz: {
    name: "Agdz",
    kind: "Town",
    region: "Drâa valley",
    brief:
      "An oasis town at the start of the Drâa valley, set beneath the rocky Jbel Kissane and surrounded by palm groves and kasbahs.",
    bestTime: "October to April",
    insights: [
      "The first real taste of the Drâa valley's palm-lined road towards the Sahara.",
      "Kasbah Tamnougalt and the surrounding ksour, and the palm groves along the river.",
      "Often a rest stop on the way to Zagora. The old kasbah is worth an hour.",
    ],
  },
  "draa-valley": {
    name: "Drâa Valley",
    kind: "Valley",
    region: "Drâa valley",
    brief:
      "Morocco's longest river valley, a ribbon of palm groves and fortified villages running from the High Atlas towards the Sahara.",
    bestTime: "October to April",
    insights: [
      "A green line through dry country, and the traditional route of caravans heading south.",
      "Palm groves, kasbahs and ksour, with the desert horizon beyond.",
      "It is a drive best done slowly. Stop in villages for mint tea and conversation.",
    ],
  },
  zagora: {
    name: "Zagora",
    kind: "City",
    region: "Drâa valley",
    brief:
      "The last big oasis town before the Sahara, famous for its signpost counting 52 days by camel to Timbuktu.",
    bestTime: "October to April; very hot in summer",
    insights: [
      "The start of the real desert: from here the road leads to dunes, pottery villages and camel treks.",
      "The Timbuktu signpost, the palm groves, nearby Tamgroute, and sunsets over the dunes.",
      "Summers are intense. Head to the dunes in late afternoon when the heat eases.",
    ],
  },
  tamgroute: {
    name: "Tamgroute",
    kind: "Village",
    region: "Drâa valley",
    brief:
      "A village known for its green-glazed pottery and for an old library of Koranic manuscripts kept by a Sufi brotherhood (zawiya).",
    bestTime: "October to April",
    insights: [
      "Two traditions in one small place: a distinctive pottery craft and a centuries-old centre of learning.",
      "The potters' workshops and kilns, and the Naciri library with its old manuscripts.",
      "The pottery is cheaper here than in the cities. The library may ask for a small donation.",
    ],
  },
  mhamid: {
    name: "M'Hamid El Ghizlane",
    kind: "Village",
    region: "Sahara",
    brief:
      "The end of the paved road, where the Drâa valley meets the Sahara, long a crossroads for nomads and caravans.",
    bestTime: "October to April",
    insights: [
      "It is the real edge of the desert, and the usual departure point for the dunes of Erg Chegaga and Erg Lihoudi.",
      "The desert market, camel-trek departures, and the nomad culture that still passes through.",
      "Book camel and 4x4 options in advance, and carry cash, since services get scarce beyond here.",
    ],
  },
  "erg-chegaga": {
    name: "Erg Chegaga",
    kind: "Dunes",
    region: "Sahara",
    brief:
      "One of Morocco's two great dune seas and the wilder of them, a vast stretch of golden dunes far from any road.",
    bestTime: "October to April; very hot in summer",
    insights: [
      "True remoteness: no paved road, no town, and some of the darkest skies in the country.",
      "Sunrise and sunset from the high dunes, camel rides, and a night in a camp under the stars.",
      "It is reached by 4x4 across stony plains. Nights get cold in winter, so pack warm.",
    ],
  },
  "erg-lihoudi": {
    name: "Erg Lihoudi",
    kind: "Dunes",
    region: "Sahara",
    brief:
      "A smaller dune field in the Zagora and M'Hamid region that gives you an authentic desert night with a shorter drive than Erg Chegaga.",
    bestTime: "October to April",
    insights: [
      "A good choice for shorter trips: real dunes without the long transfer.",
      "Dune walks, a camel ride at sunset, and a camp with dinner under the stars.",
      "It is easier to reach, so it can be busier than Chegaga. Ask for a quieter camp spot.",
    ],
  },
  "lake-iriki": {
    name: "Lake Iriki",
    kind: "Lake",
    region: "Sahara",
    brief:
      "A vast dry lake bed that fills only after rare heavy rains and lies on the way to Erg Chegaga.",
    bestTime: "October to April",
    insights: [
      "A landscape that feels like another planet: flat, white and enormous, with mirages in the heat.",
      "The open plain and wide skies, and, when it floods, birdlife and reflections.",
      "It is usually dry. If it has water, you are lucky: it happens only after exceptional rain.",
    ],
  },
  "foum-zguid": {
    name: "Foum Zguid",
    kind: "Town",
    region: "Sahara",
    brief:
      "A small oasis town on the edge of the desert, the gateway to Lake Iriki and Erg Chegaga.",
    bestTime: "October to April",
    insights: [
      "The last proper town before the desert tracks begin, and a good place to see local life.",
      "The local market, the palm groves, and the start of the desert pistes.",
      "A sensible place to top up on water, fuel and supplies before heading into the dunes.",
    ],
  },
  tafraoute: {
    name: "Tafraoute",
    kind: "Town",
    region: "Anti-Atlas",
    brief:
      "A town in the Ammeln valley, ringed by pink granite boulders and almond groves, in the heart of the Anti-Atlas.",
    bestTime: "March to May, September to November",
    insights: [
      "Strange, rounded rock landscapes in warm pink and ochre, unlike anywhere else on the route.",
      "The Painted Rocks, palm and almond groves in the Ammeln valley, and the Berber markets.",
      "Almond blossom in late winter is a highlight. Spring and autumn are best for walking.",
    ],
  },
  "ait-mansour-gorges": {
    name: "Aït Mansour Gorges",
    kind: "Gorge",
    region: "Anti-Atlas",
    brief:
      "A green gorge near Tafraoute with a stream, palms and rocky walls, an oasis in the dry Anti-Atlas.",
    bestTime: "March to May, September to November",
    insights: [
      "Shade, water and palms in a landscape that is otherwise dry and rocky.",
      "Walking along the stream, natural pools, and the small oasis villages.",
      "Water levels change with the season. Wear shoes you do not mind getting wet.",
    ],
  },
  amtoudi: {
    name: "Amtoudi",
    kind: "Village",
    region: "Anti-Atlas",
    brief:
      "An oasis village known for its fortified hilltop granary (agadir) and the natural pools below it.",
    bestTime: "October to April",
    insights: [
      "A rare surviving collective granary, once used by the community to guard its harvest.",
      "The Agadir Id Aissa granary, the pools and waterfalls, and the oasis below.",
      "Climb up for the views, and keep swimming for the warmer months.",
    ],
  },
  "sidi-ifni": {
    name: "Sidi Ifni",
    kind: "Town",
    region: "Atlantic coast",
    brief:
      "A relaxed coastal town with Art Deco buildings from its Spanish past, which ended in 1969.",
    bestTime: "Year-round; mornings are often foggy",
    insights: [
      "A small, slow seaside town with a distinct architecture and an easy rhythm.",
      "The Art Deco buildings, the fish market, and the beach.",
      "Foggy mornings are normal on this coast, and it warms up by midday.",
    ],
  },
  legzira: {
    name: "Legzira",
    kind: "Coast",
    region: "Atlantic coast",
    brief:
      "A beach of red sandstone cliffs with sea arches carved by the Atlantic. One of the two arches collapsed in 2016.",
    bestTime: "Year-round; best at low tide and at sunset",
    insights: [
      "One of the most photogenic stretches of the Moroccan coast, especially at sunset.",
      "Walking the beach at low tide, and the red cliffs and rock formations.",
      "The tide decides what you can walk, so check low-tide times before you go.",
    ],
  },
  mirleft: {
    name: "Mirleft",
    kind: "Village",
    region: "Atlantic coast",
    brief:
      "A small coastal village with sandy coves and a laid-back, surf-friendly feel.",
    bestTime: "Year-round; warmest from May to October",
    insights: [
      "A quiet, unpolished seaside stop that suits a slow evening after a long drive.",
      "The beaches and coves, fresh fish, and the village cafés.",
      "Quieter than Agadir. It is good for an easy night by the sea.",
    ],
  },
  "massa-national-park": {
    name: "Massa National Park",
    kind: "Park",
    region: "Atlantic coast",
    brief:
      "A coastal national park of dunes, lagoons and argan forest, home to a wide range of birdlife including the northern bald ibis.",
    bestTime: "Winter and spring, for birdwatching",
    insights: [
      "A protected stretch of wild coast, rich in birds and quiet landscapes.",
      "Birdwatching at the estuary, the dunes, and the argan trees.",
      "Bring binoculars and go early in the morning when the birds are most active.",
    ],
  },
};

/** The two notes that sit between "what to see" and "good to know": [the story, best moment]. */
const MORE: Record<string, [string, string]> = {
  marrakech: [
    "Founded in the eleventh century by the Almoravids, it became an imperial capital and still sets the tone for the whole south.",
    "Dusk, when the Jemaa el-Fna fills with food stalls and storytellers and the Koutoubia glows.",
  ],
  agadir: [
    "A 1960 earthquake destroyed the old town, so the modern city was rebuilt with wide streets and a seafront.",
    "Late afternoon on the promenade, when the heat eases and the bay turns gold.",
  ],
  taroudant: [
    "The Saadian dynasty made it an early capital before they took Marrakech, and it kept much of its fortified circuit.",
    "Late afternoon, when the ramparts glow ochre.",
  ],
  taliouine: [
    "Saffron is picked by hand, flower by flower, and it is the lifeblood of the valley.",
    "Dawn in harvest season, when the crocus flowers are gathered early in the morning.",
  ],
  "tizi-n-tichka": [
    "For centuries it has been the main crossing between Marrakech and the south, used by caravans long before cars.",
    "Morning, when the valleys on the south side are clear and the light is soft.",
  ],
  telouet: [
    "The Glaoui family ruled much of the south in the early twentieth century, and Telouet was their stronghold.",
    "Late morning, when light reaches the decorated rooms and the valley.",
  ],
  "ait-ben-haddou": [
    "It stood on a caravan route between the Sahara and Marrakech, and its tightly packed earthen houses were built for defence.",
    "Sunset, from across the river, when the earth glows deep red.",
  ],
  "oasis-fint": [
    "Oasis farming here depends on shared water channels that families have managed for generations.",
    "Early morning, when the groves are cool and village life is starting.",
  ],
  ouarzazate: [
    "Its kasbah and its studios tell two stories: a crossroads of Berber trade, then a film industry built on the desert light.",
    "Sunset over the Taourirt Kasbah.",
  ],
  "kalaat-mgouna": [
    "Rose growing here is traditional and small-scale, with hedges of damask roses planted around the fields.",
    "Early morning in rose season, when petals are picked while still cool.",
  ],
  bouthgrar: [
    "Like much of the valley, it lives from date palms and small-scale farming around shared irrigation.",
    "Late afternoon, when the palms catch the light and families come out.",
  ],
  "dades-gorges": [
    "The river carved the gorge over a very long time, and the kasbahs along it were built to watch the route.",
    "Early morning for light on the cliffs, before the road fills.",
  ],
  "boumalne-dades": [
    "A market town where valley farmers and nomads meet to trade.",
    "Market mornings, when the town is busiest.",
  ],
  msemrir: [
    "Life here follows the seasons, with herding and terraced farming still shaping the year.",
    "Early morning, when the village wakes and the mountain air is clearest.",
  ],
  agoudal: [
    "The high pastures around it have been used by semi-nomadic herders for generations.",
    "Early morning, with clear air and long views over the mountains.",
  ],
  "todgha-gorges": [
    "The river cut the canyon through limestone over a very long time, and it has long linked the oasis with the mountains.",
    "Early morning, when the walls are still shaded and the canyon is quiet.",
  ],
  "jbel-saghro": [
    "The massif's dark volcanic rock gives it a very different look from the red-earth valleys around it.",
    "Sunrise and sunset, when the dark rock glows and the plains turn gold.",
  ],
  taznakht: [
    "Taznakht carpets are known for bold geometric patterns woven in natural wool colours.",
    "Mid-morning, when the weaving cooperatives are busiest.",
  ],
  agdz: [
    "The town stood on the old caravan road to the south, and its kasbahs show the families who once controlled it.",
    "Late afternoon, when warm light falls on the kasbahs.",
  ],
  "draa-valley": [
    "For generations the river has fed a chain of oases, and caravans used the valley to cross the edge of the desert.",
    "Early morning and late afternoon, when the palm groves are soft and green.",
  ],
  zagora: [
    "It was a staging post for caravans heading towards West Africa, which is why the Timbuktu sign still draws visitors.",
    "Sunset from the dunes just outside town.",
  ],
  tamgroute: [
    "The zawiya library has kept manuscripts for centuries, and the green glaze on local pottery comes from the community's potters.",
    "Morning, when the kilns are being lit and the workshops are active.",
  ],
  mhamid: [
    "For centuries caravans left from here for the Sahara, and today nomad families and festivals keep that heritage alive.",
    "Early morning, when camels are loaded and treks set off.",
  ],
  "erg-chegaga": [
    "Caravans once crossed this part of the Sahara, and the nomads who live nearby still know its tracks by heart.",
    "Sunrise and sunset, when the dune crests turn gold and the sand is cool.",
  ],
  "erg-lihoudi": [
    "Nomad families have long grazed and travelled across this stretch of desert.",
    "Sunset from the high crest, then the stars after dark.",
  ],
  "lake-iriki": [
    "The lake was once a large body of water, and its bed is now a flat sweep of dried clay and salt.",
    "Early morning or late afternoon, when the light is low and the plain is cooler.",
  ],
  "foum-zguid": [
    "The town has long served as a stopping point on the edge of the desert.",
    "Morning, before departure, when the market and the town are active.",
  ],
  tafraoute: [
    "The Ammeln valley villages have long relied on almonds, argan and carefully terraced fields.",
    "Late afternoon, when the pink granite glows.",
  ],
  "ait-mansour-gorges": [
    "The gorge is a rare green ribbon in dry country, and villages have long farmed along its stream.",
    "Morning, when the walls shade the water and the walk is cool.",
  ],
  amtoudi: [
    "Granaries like this one let families store their harvest safely, guarded by the community.",
    "Late afternoon, with warm light on the granary and the pools.",
  ],
  "sidi-ifni": [
    "Spain held the town until 1969, which explains its Art Deco town hall and colonial street layout.",
    "Late afternoon, once the fog has lifted and the beach is calm.",
  ],
  legzira: [
    "The arches were shaped by the Atlantic wearing into soft red sandstone, and they keep changing.",
    "Sunset at low tide, when the sandstone glows red.",
  ],
  mirleft: [
    "A fishing village that grew into a quiet seaside stop on the Atlantic coast.",
    "Late afternoon on the beach, then fresh fish at sunset.",
  ],
  "massa-national-park": [
    "The park protects coastal habitat on the Atlantic, and its argan woodland is a regional speciality.",
    "Early morning, when birds are most active on the estuary.",
  ],
};

/** The places with all five notes in reading order: [why stop here, what to see, the story, best moment, good to know]. */
export const PLACES: Record<string, Place> = Object.fromEntries(
  Object.entries(BASE).map(([id, p]) => {
    const [why, see, know] = p.insights;
    const [story, moment] = MORE[id] ?? ["", ""];
    return [id, { ...p, insights: [why, see, story, moment, know] } satisfies Place];
  }),
);
