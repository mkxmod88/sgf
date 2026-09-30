/* ============================================================
   AI Couple Prompts — builder prompt realistik untuk pasangan.
   Data lokal, tidak butuh API.
   ============================================================ */

"use strict";

/* ---------- Skenario (dirakit bersama penampilan + kamera) ---------- */
var SCENES = [
  /* --- Romantis --- */
  {
    id: 'r1',
    title: 'Malam Berbintang',
    cat: 'romantis',
    tags: ['malam', 'bintang', 'intim'],
    scene: 'the two of them lying on a thick blanket in an open field at night, stars and the Milky Way above, a warm picnic lantern glowing softly beside them, calm intimate mood, gentle breeze'
  },
  {
    id: 'r2',
    title: 'Hujan Bersama',
    cat: 'romantis',
    tags: ['hujan', 'payung', 'kota'],
    scene: 'the two of them sharing a single umbrella on a quiet street during steady rain, headlights and shop signs softly blurred behind them, wet pavement with reflections, a natural candid laugh between them'
  },
  {
    id: 'r3',
    title: 'Tarian Ruang Tamu',
    cat: 'romantis',
    tags: ['rumah', 'lampu senar', 'malam'],
    scene: 'the two of them slow dancing in a small living room lit only by fairy lights and candles at night, a record player in the corner, casual home clothes, an unguarded tender moment'
  },
  {
    id: 'r4',
    title: 'Kopi Berdua',
    cat: 'romantis',
    tags: ['kafe', 'pagi', 'candid'],
    scene: 'the two of them sitting close at a small cafe table sharing one cup of coffee, steam rising, morning window light falling across the table, mid-conversation, relaxed body language'
  },
  {
    id: 'r5',
    title: 'Janji di Jembatan',
    cat: 'romantis',
    tags: ['jembatan', 'senja', 'sungai'],
    scene: 'the two of them holding hands while standing on an old wooden bridge over a quiet river at dusk, string lights strung along the railing, soft amber glow, evening breeze'
  },
  {
    id: 'r6',
    title: 'Numpang Punggung',
    cat: 'romantis',
    tags: ['gendong', 'taman', 'tertawa'],
    scene: 'the girl riding piggyback on the guy with both arms wrapped around his neck, both laughing mid-stride down a quiet park path, her scarf fluttering behind, playful natural energy, softly blurred background'
  },
  {
    id: 'r7',
    title: 'Cium Kening Tenang',
    cat: 'romantis',
    tags: ['cium', 'kening', 'tenang'],
    scene: 'the guy gently kissing the girl on the forehead while she leans her head against his chest with eyes closed, warm afternoon light falling through a window, quiet unhurried tender moment'
  },
  {
    id: 'r8',
    title: 'Dapur Kacau',
    cat: 'romantis',
    tags: ['masak', 'tepung', 'lucu'],
    scene: 'the two of them baking together in a small messy kitchen, flour smeared on both their noses and cheeks, the girl tasting batter off the spoon while the guy laughs, candid kitchen chaos, warm evening light'
  },
  {
    id: 'r9',
    title: 'Tawa Tak Berhenti',
    cat: 'romantis',
    tags: ['sofa', 'tertawa', 'santai'],
    scene: 'the two of them collapsed laughing together on a living room sofa, the girl doubled over wiping tears of laughter, the guy holding his stomach, limbs tangled, a genuinely silly unguarded moment'
  },
  {
    id: 'r10',
    title: 'Hidung Bertemu',
    cat: 'romantis',
    tags: ['eskimo kiss', 'lucu', 'dekat'],
    scene: 'the two of them nose to nose in a playful eskimo kiss, eyes crinkled with suppressed smiles, fingers gently interlaced between them, soft golden light, cute tender standoff'
  },
  {
    id: 'r11',
    title: 'Dansa Tanpa Musik',
    cat: 'romantis',
    tags: ['dansa', 'dapur', 'genggaman'],
    scene: 'the two of them slow dancing in the kitchen with no music playing, the girl standing on the guys feet to keep up, both giggling, unpolished and unposed, warm kitchen light'
  },
  {
    id: 'r12',
    title: 'Hujan Sambil Tertawa',
    cat: 'romantis',
    tags: ['hujan', 'lari', 'santai'],
    scene: 'the two of them sprinting through light rain holding hands, laughing at getting soaked, one shoe almost slipping off, joyful candid energy, city street at dusk'
  },
  {
    id: 'r13',
    title: 'Sarapan Malas di Ranjang',
    cat: 'romantis',
    tags: ['ranjang', 'pagi', 'santai'],
    scene: 'the two of them sharing breakfast in bed on a slow weekend morning, messy hair and mismatched pajamas, the girl stealing a bite off the guys toast, soft morning window light, cozy unpolished moment'
  },
  {
    id: 'r14',
    title: 'Belanja Sambil Ngarol',
    cat: 'romantis',
    tags: ['supermarket', 'keranjang', 'tertawa'],
    scene: 'the guy pushing the girl through a supermarket in a shopping cart, both laughing uncontrollably, a few groceries tumbling out, candid chaotic fun, bright supermarket light'
  },
  {
    id: 'r15',
    title: 'Ciuman Kilat di Pipi',
    cat: 'romantis',
    tags: ['cium', 'pipi', 'kejutan'],
    scene: 'the girl planting a quick kiss on the guys cheek while he reacts with mock surprise, both mid-laugh, caught off guard, candid street moment outside a cafe'
  },
  {
    id: 'r16',
    title: 'Malam Game Seru',
    cat: 'romantis',
    tags: ['game', 'tv', 'menang'],
    scene: 'the two of them on the floor in front of the TV playing a racing game, the guy throwing his hands up in defeat while the girl does a little victory dance, cozy living room, warm lamp light'
  },
  {
    id: 'r17',
    title: 'Menunggu Hujan Reda',
    cat: 'romantis',
    tags: ['hujan', 'berpelukan', 'kafe'],
    scene: 'the two of them squeezed together under a narrow shop awning hugging to stay warm while waiting out a downpour, steam rising from a coffee cup, candid everyday moment'
  },
  {
    id: 'r18',
    title: 'Perang Bantal',
    cat: 'romantis',
    tags: ['bantal', 'malam', 'lucu'],
    scene: 'a playful pillow fight in the middle of the night, feathers flying everywhere, both laughing mid-swing, duvet tangled around them, dim bedside lamp glow'
  },
  {
    id: 'r19',
    title: 'Satu Earphone Berdua',
    cat: 'romantis',
    tags: ['musik', 'taman', 'sore'],
    scene: 'the two of them sharing one pair of earbuds on a park bench, leaning into each other, the girl humming along while the guy watches her smile, golden afternoon light'
  },
  {
    id: 'r20',
    title: 'Belajar Naik Sepeda',
    cat: 'romantis',
    tags: ['sepeda', 'latihan', 'tertawa'],
    scene: 'the guy teaching the girl to ride a bicycle on an empty street, her wobbling with wide eyes while he runs beside her steadying the seat, both laughing, sunset light'
  },
  {
    id: 'r21',
    title: 'Kencan Es Krim',
    cat: 'romantis',
    tags: ['es krim', 'lucu', 'panas'],
    scene: 'the two of them walking with ice cream cones, the guy leaning over for an exaggerated bite of the girls cone, both giggling mid-step, bright summer day, a drip of melting ice cream falling'
  },
  {
    id: 'r22',
    title: 'Pose Foto Konyol',
    cat: 'romantis',
    tags: ['selfie', 'konyol', 'ceria'],
    scene: 'the two of them striking a deliberately silly pose for a selfie, tongues out and eyes crossed, holding the phone at arms length, natural sunlight, goofy happy couple moment'
  },

  /* --- Anime --- */
  {
    id: 'a1',
    title: 'Anime Sakura',
    cat: 'anime',
    tags: ['sakura', 'pastel', 'ghibli'],
    scene: 'anime couple holding hands and smiling under blooming cherry blossom trees, petals drifting in the wind, soft pastel colors, warm afternoon light, Ghibli-inspired background'
  },
  {
    id: 'a2',
    title: 'Anime Hujan',
    cat: 'anime',
    tags: ['sekolah', 'hujan', 'emosional'],
    scene: 'anime couple in school uniforms sharing one umbrella in heavy rain, dramatic clouds, shy glances, vibrant colors, clean lineart, emotional slice-of-life scene'
  },
  {
    id: 'a3',
    title: 'Anime Kota Malam',
    cat: 'anime',
    tags: ['kota', 'neon', 'atap'],
    scene: 'anime couple sitting on a rooftop at night overlooking a glowing Tokyo skyline, wind blowing their hair, city lights below, quiet intimate conversation, cinematic composition'
  },
  {
    id: 'a4',
    title: 'Anime Negeri Dongeng',
    cat: 'anime',
    tags: ['fantasi', 'kunang-kunang', 'bulan'],
    scene: 'anime couple under a giant glowing moon in a magical forest filled with fireflies, whimsical fairytale mood, soft pastel palette, dreamy atmosphere'
  },
  {
    id: 'a5',
    title: 'Anime Musim Dingin',
    cat: 'anime',
    tags: ['salju', 'hangat', 'jalanan'],
    scene: 'anime couple in thick winter coats walking through falling snow, warm knitted scarves, cozy street lamps glowing, soft blue and pink palette, gentle happy expressions'
  },

  /* --- Golden Hour --- */
  {
    id: 's1',
    title: 'Pantai Senja',
    cat: 'sunset',
    tags: ['pantai', 'golden hour', 'siluet'],
    scene: 'the two of them walking barefoot along the waterline at golden hour, holding hands, the low sun behind them catching their silhouettes, warm orange and pink sky reflecting on wet sand'
  },
  {
    id: 's2',
    title: 'Senja di Atap',
    cat: 'sunset',
    tags: ['atap', 'kota', 'tenang'],
    scene: 'the two of them sitting side by side on the edge of a rooftop at dusk, legs hanging over the edge, the sky shifting from orange to purple behind the city skyline, peaceful everyday moment'
  },
  {
    id: 's3',
    title: 'Bersepeda di Senja',
    cat: 'sunset',
    tags: ['sawah', 'pedesaan', 'lensa flare'],
    scene: 'the two of them riding a bicycle down a narrow path between golden rice fields at sunset, warm backlight and soft lens flare, a wooden hut and coconut trees in the distance'
  },
  {
    id: 's4',
    title: 'Puncak Bukit',
    cat: 'sunset',
    tags: ['bukit', 'angin', 'sun flare'],
    scene: 'the two of them standing on a grassy hilltop at golden hour, his arm loosely around her shoulder, wind in their hair, soft sun flare over rolling green hills'
  },
  {
    id: 's5',
    title: 'Gurun Keemasan',
    cat: 'sunset',
    tags: ['gurun', 'horizon', 'tenang'],
    scene: 'the two of them standing on a high sand dune watching the sunset across the desert, long soft shadows stretching over rippled sand, vast open horizon, calm wind'
  },

  /* --- Pernikahan --- */
  {
    id: 'w1',
    title: 'Janji Sehidup Semati',
    cat: 'wedding',
    tags: ['bunga', 'taman', 'kissing'],
    scene: 'the bride and groom kissing beneath an arch of white and cream flowers, a few petals drifting down, warm late-afternoon sun filtering through garden trees, guests softly blurred behind'
  },
  {
    id: 'w2',
    title: 'Pernikahan Pantai',
    cat: 'wedding',
    tags: ['pantai', 'sumset', 'cincin'],
    scene: 'an intimate beach wedding at sunset, the couple exchanging vows barefoot on damp sand, the brides sheer dress moving in the sea breeze, ocean behind them, candles on driftwood posts'
  },
  {
    id: 'w3',
    title: 'Klasik Elegan',
    cat: 'wedding',
    tags: ['gereja', 'klasik', 'cahaya'],
    scene: 'an elegant classical wedding portrait of the couple inside a sunlit stone church, the bride in a lace gown and the groom in a simple black tuxedo, light rays through tall windows, quiet reverent mood'
  },
  {
    id: 'w4',
    title: 'Tarian Pertama',
    cat: 'wedding',
    tags: ['resepsi', 'sparkler', 'malam'],
    scene: 'the couple having their first dance at a wedding reception under strings of warm lights, guests holding sparklers in a circle around them, night sky, golden glow on their faces, joyful laughter'
  },
  {
    id: 'w5',
    title: 'Cincin Abadi',
    cat: 'wedding',
    tags: ['close-up', 'cincin', 'makro'],
    scene: 'a close-up of the couple resting their hands together with wedding rings visible, soft green garden bokeh behind them, warm sunlight, gentle and symbolic'
  },

  /* --- Vintage --- */
  {
    id: 'v1',
    title: 'Vintage 70s',
    cat: 'vintage',
    tags: ['mobil retro', '70s', 'film'],
    scene: 'the two of them leaning against a restored 1970s sedan on a quiet roadside, bell-bottom pants and retro sunglasses, faded warm tones, dusty afternoon light'
  },
  {
    id: 'v2',
    title: 'Bioskop Klasik',
    cat: 'vintage',
    tags: ['bioskop', 'glamour', 'malam'],
    scene: 'the two of them outside a classic cinema at night in vintage formal wear, glowing marquee and red velvet ropes, old-school glamour, warm tungsten light'
  },
  {
    id: 'v3',
    title: 'Piknik Retro',
    cat: 'vintage',
    tags: ['60s', 'padang', 'cerah'],
    scene: 'the two of them having a retro picnic on a checkered blanket in a sunny meadow, a vintage camera and a transistor radio beside them, 1960s clothing, soft warm tones'
  },
  {
    id: 'v4',
    title: 'Surat Cinta',
    cat: 'vintage',
    tags: ['perpustakaan', 'lampu', 'diam'],
    scene: 'the two of them reading handwritten letters together in a warm lamplit library full of old books, her smile at a line in the letter, timeless quiet mood'
  },
  {
    id: 'v5',
    title: 'Potret Hitam Putih',
    cat: 'vintage',
    tags: ['hitam putih', 'studio', 'klasik'],
    scene: 'a classic black and white studio portrait of the couple, soft key light with gentle shadow, elegant simple poses, old high-quality photography feel'
  },

  /* --- Cyberpunk / Sci-fi --- */
  {
    id: 'cy1',
    title: 'Cyberpunk Hujan',
    cat: 'cyber',
    tags: ['neon', 'hujan', 'kota'],
    scene: 'the two of them standing in a narrow neon-lit alley in heavy rain at night, purple and blue holographic signs reflecting on the wet street, futuristic utility jackets, cinematic moody light'
  },
  {
    id: 'cy2',
    title: 'Stasiun Luar Angkasa',
    cat: 'cyber',
    tags: ['sci-fi', 'hologram', 'cyan'],
    scene: 'the two of them walking through a bright space station corridor with glowing hologram panels, visors up, cyan rim light on their faces, clean futuristic architecture'
  },
  {
    id: 'cy3',
    title: 'Kota Masa Depan',
    cat: 'cyber',
    tags: ['terbang', 'dusk', 'neon'],
    scene: 'the two of them riding a shared hover vehicle above a vast futuristic city at dusk, endless neon towers below, wind blowing their hair, wide cinematic view'
  },
  {
    id: 'cy4',
    title: 'Arcade Glow',
    cat: 'cyber',
    tags: ['arcade', 'magenta', 'retro'],
    scene: 'the two of them sharing a laugh inside a retro neon arcade, the glow of screens and magenta lights on their faces, vintage arcade cabinets around them'
  },
  {
    id: 'cy5',
    title: 'Dua Astronot',
    cat: 'cyber',
    tags: ['angkasa', 'bumi', 'hanyut'],
    scene: 'the two of them floating weightlessly in matching flight suits inside a spacecraft module, the curve of Earth visible through a round window, soft starlight'
  },

  /* --- Ilustrasi & Lukisan --- */
  {
    id: 'p1',
    title: 'Aquarel Hujan',
    cat: 'art',
    tags: ['cat air', 'halus', 'romantis'],
    scene: 'a soft watercolor of the two of them sharing an umbrella on a rainy street, loose delicate brushwork, gentle color washes bleeding into the wet paper, romantic quiet mood'
  },
  {
    id: 'p2',
    title: 'Ladang Bunga Matahari',
    cat: 'art',
    tags: ['cat minyak', 'impresionis', 'emas'],
    scene: 'an impressionist oil painting of the couple walking through a sunflower field at dusk, thick visible brushstrokes, warm golden and amber palette, painterly light'
  },
  {
    id: 'p3',
    title: 'Kisah Klasik',
    cat: 'art',
    tags: ['renaissance', 'chiaroscuro', 'anggun'],
    scene: 'a classical oil portrait of the couple in refined formal attire, renaissance style, soft chiaroscuro lighting, deep warm background, timeless and dignified'
  },
  {
    id: 'p4',
    title: 'Terbang di Atas Awan',
    cat: 'art',
    tags: ['digital', 'mimpi', 'lembut'],
    scene: 'a dreamy digital illustration of the couple floating hand in hand among soft clouds at sunrise, gentle gradients, ethereal glow, serene fantasy mood'
  },
  {
    id: 'p5',
    title: 'Ilustrasi Dongeng',
    cat: 'art',
    tags: ['dongeng', 'kebun', 'hangat'],
    scene: 'a storybook illustration of the couple dancing in a glowing night garden, oversized whimsical flowers and fireflies, warm magical colors, childrens book art style'
  },

  /* --- Chibi / Kawaii --- */
  {
    id: 'k1',
    title: 'Chibi Genggam Tangan',
    cat: 'cute',
    tags: ['chibi', 'kawaii', 'stiker'],
    scene: 'a cute chibi couple holding hands and smiling, big sparkling eyes, soft pastel palette, kawaii sticker style, clean rounded lineart'
  },
  {
    id: 'k2',
    title: 'Milkshake Strawberry',
    cat: 'cute',
    tags: ['kafe', 'heart', 'pastel'],
    scene: 'a chibi couple sharing a strawberry milkshake with two straws in a pastel cafe, little hearts floating around them, adorable kawaii sticker art'
  },
  {
    id: 'k3',
    title: 'Selimut Hangat',
    cat: 'cute',
    tags: ['onesie', 'dingin', 'sofanya'],
    scene: 'a tiny chibi couple in cozy animal onesies cuddling under a knitted blanket on a sofa, mugs of hot cocoa, soft winter pastel colors'
  },
  {
    id: 'k4',
    title: 'Gelembung Cinta',
    cat: 'cute',
    tags: ['kartun', 'sparkle', 'kawaii'],
    scene: 'a kawaii cartoon couple surrounded by hearts, flowers and sparkles, soft rounded shapes, pastel pink and lavender, cute chibi style'
  },
  {
    id: 'k5',
    title: 'Petualangan Dino',
    cat: 'cute',
    tags: ['dino', 'pelangi', 'stiker'],
    scene: 'a chibi couple riding a cute dino plushie through a candy-colored pastel landscape, fluffy clouds, rainbow accents, adorable sticker illustration'
  },

  /* --- Petualangan --- */
  {
    id: 't1',
    title: 'Surga Tropis',
    cat: 'travel',
    tags: ['bali', 'sawah', 'hijau'],
    scene: 'the two of them exploring lush emerald rice terraces in Bali, holding her hand while walking along a narrow ridge, waterfalls and palm trees in the distance, bright tropical light'
  },
  {
    id: 't2',
    title: 'Jalanan Eropa',
    cat: 'travel',
    tags: ['europe', 'cobblestone', 'sore'],
    scene: 'the two of them strolling through a charming old European town street, cobblestones and flower boxes on balconies, golden afternoon light, her glancing back at a shop window'
  },
  {
    id: 't3',
    title: 'Alpen Bersalju',
    cat: 'travel',
    tags: ['salju', 'chalet', 'gunung'],
    scene: 'the two of them at an alpine ski village in winter, snow-covered peaks behind, warm lights glowing from a timber chalet, rosy cheeks and layered winter clothing'
  },
  {
    id: 't4',
    title: 'Jepang Musim Gugur',
    cat: 'travel',
    tags: ['jepang', 'maple', 'kyoto'],
    scene: 'the two of them walking under a tunnel of crimson maple leaves in Kyoto in autumn, a wooden temple gate behind them, soft diffused light, seasonal travel mood'
  },
  {
    id: 't5',
    title: 'Puncak Gunung',
    cat: 'travel',
    tags: ['gunung', 'sunrise', 'mendaki'],
    scene: 'the two of them at a mountain summit with backpacks watching sunrise above a sea of clouds, golden light breaking over distant peaks, wind and awe'
  },

  /* --- Studio & Potret --- */
  {
    id: 'u1',
    title: 'Potret Studio Profesional',
    cat: 'studio',
    tags: ['studio', 'lembut', 'smart casual'],
    scene: 'a clean professional studio portrait of the couple, soft large diffused lighting, light neutral gray backdrop, both in smart casual outfits, natural relaxed smiles, sharp focus'
  },
  {
    id: 'u2',
    title: 'Editorial Fashion',
    cat: 'studio',
    tags: ['fashion', 'dramatis', 'majalah'],
    scene: 'a high-fashion editorial photo of the couple in tailored designer looks, dramatic directional studio lighting, strong confident poses, magazine cover composition'
  },
  {
    id: 'u3',
    title: 'Hitam Putih Elegan',
    cat: 'studio',
    tags: ['hitam putih', 'rembrandt', 'fine art'],
    scene: 'an elegant black and white studio portrait of the couple, classic Rembrandt lighting, timeless simple composition, fine-art photography quality'
  },
  {
    id: 'u4',
    title: 'Kebaya Modern',
    cat: 'studio',
    tags: ['kebaya', 'batik', 'budaya'],
    scene: 'a studio portrait of the couple wearing modern Indonesian kebaya and batik, tasteful poses, clean light gray background, soft even lighting, cultural pride and elegance'
  },
  {
    id: 'u5',
    title: 'Cahaya Jendela',
    cat: 'studio',
    tags: ['window light', 'debu', 'fine art'],
    scene: 'the couple in an empty studio lit only by a large window, dramatic soft daylight, dust particles floating in the light beams, artistic candid pose, fine-art feel'
  },

  /* --- Selfie --- */
  {
    id: 'c1',
    title: 'Selfie Ketawa Nggak Siap',
    cat: 'candid',
    tags: ['tertawa', 'ponsel', 'kejutan'],
    scene: 'a spontaneous couple selfie taken at arms length with the front camera, the girl mid-laugh covering her mouth while the guy sticks out his tongue, both squeezed into the frame, real unpolished moment'
  },
  {
    id: 'c2',
    title: 'Selfie Sambil Jalan',
    cat: 'candid',
    tags: ['jalan', 'depan kamera', 'angin'],
    scene: 'a walking selfie of the couple, the guy holding the phone up while the girl leans into the frame mid-stride, the street moving behind them, wind blowing their hair, natural everyday selfie'
  },
  {
    id: 'c3',
    title: 'Selfie Cium Kejutan',
    cat: 'candid',
    tags: ['ciuman', 'lucu', 'miring'],
    scene: 'a couple selfie where the girl suddenly kisses the guy on the cheek while he is already taking the photo, his eyes wide with a laugh, the phone caught at a tilted awkward angle, spontaneous snapshot'
  },
  {
    id: 'c4',
    title: 'Selfie di Kafe',
    cat: 'candid',
    tags: ['kafe', 'ngobrol', 'dari atas'],
    scene: 'a casual selfie at a cafe table, the girl holding the phone high above both their heads, two coffee cups visible in the foreground, the guy making a funny face behind her, natural cafe lighting'
  },
  {
    id: 'c5',
    title: 'Selfie di Taman',
    cat: 'candid',
    tags: ['taman', 'menyamping', 'cerah'],
    scene: 'a bright park selfie, the couple leaning together with the phone at arms length, the guy pressing his cheek against the girls, both squinting in the sunlight, trees and a path behind them'
  },
  {
    id: 'c6',
    title: 'Selfie Jaket Dirapihin',
    cat: 'candid',
    tags: ['jaket', 'peduli', 'selfie'],
    scene: 'a selfie of the guy zipping up the girls jacket while she holds the phone out in front of them, her chin tucked in and both smiling softly, busy street softly blurred behind'
  },
  {
    id: 'c7',
    title: 'Selfie Makanan Jalanan',
    cat: 'candid',
    tags: ['makanan', 'street food', 'lucu'],
    scene: 'a selfie during street food, the couple holding their food on sticks up to the camera, the girl mid-bite and the guy making a messy eating face, authentic street food joy'
  },
  {
    id: 'c8',
    title: 'Selfie Ngantuk di Sofa',
    cat: 'candid',
    tags: ['sofa', 'tidur', 'hangat'],
    scene: 'a sleepy selfie on the sofa, the girl lying down holding the phone up, the guy with his head resting on her shoulder half asleep, a blanket around them, warm dim light'
  },
  {
    id: 'c9',
    title: 'Selfie Cermin Toko',
    cat: 'candid',
    tags: ['kaca', 'kota', 'malam'],
    scene: 'a mirror selfie outside a shop window, the couple reflecting in the glass, the guy holding the phone while the girl poses dramatically behind him, layered store reflections, evening light'
  },
  {
    id: 'c10',
    title: 'Selfie Basah Kuyup',
    cat: 'candid',
    tags: ['basah', 'tertawa', 'playful'],
    scene: 'a selfie after getting soaked, the couple dripping wet with the phone held up, both laughing with water running down their faces and hair stuck to their foreheads, playful disaster moment'
  },
  {
    id: 'c11',
    title: 'Selfie Pagi Berantakan',
    cat: 'candid',
    tags: ['pagi', 'santai', 'rumah'],
    scene: 'a morning selfie in wrinkled pajamas and messy hair, the couple squinting in bright daylight while holding the phone up, the bed visible behind them, real unglamorous morning energy'
  },
  {
    id: 'c12',
    title: 'Selfie Antre Makanan',
    cat: 'candid',
    tags: ['antre', 'gerobak', 'lapar'],
    scene: 'a selfie while queuing at a street food cart, the couple angled toward the phone, the girl pointing at the sizzling pan behind them, the guy raising his eyebrows eagerly, market light'
  },
  {
    id: 'c13',
    title: 'Selfie Zebra Cross',
    cat: 'candid',
    tags: ['zebra cross', 'kota', 'gerak'],
    scene: 'a selfie mid-crosswalk, the couple holding the phone up while walking across the zebra crossing, traffic softly blurred in motion behind them, both looking at the camera and laughing'
  },
  {
    id: 'c14',
    title: 'Selfie Tembok Rendah',
    cat: 'candid',
    tags: ['sore', 'duduk', 'akrab'],
    scene: 'a selfie sitting on a low brick wall, the guy holding the phone at arms length while the girl leans back giggling, legs swinging, soft evening light, city street behind'
  },
  {
    id: 'c15',
    title: 'Selfie Tripod Bareng',
    cat: 'candid',
    tags: ['tripod', 'timer', 'buru-buru'],
    scene: 'a couple selfie via self-timer on a small tripod, the couple half-running back into the frame mid-laugh, one slightly out of frame, candid settle-in energy, the tripod visible at the edge'
  },
  {
    id: 'c16',
    title: 'Selfie di Bis',
    cat: 'candid',
    tags: ['bis', 'perjalanan', 'sore'],
    scene: 'a bus selfie, the girl holding the phone up while resting her head on the guys shoulder, the guy making a sleepy face, seat rows and window reflections behind, afternoon light'
  },
  {
    id: 'c17',
    title: 'Selfie Jalan Malam',
    cat: 'candid',
    tags: ['malam', 'jalanan', 'lucu'],
    scene: 'a night street selfie, the couple holding the phone up, the guy swinging their joined hands a little too high into the frame, warm street lamps glowing behind them'
  },
  {
    id: 'c18',
    title: 'Selfie Rebahan di Rumput',
    cat: 'candid',
    tags: ['rumput', 'langit', 'siang'],
    scene: 'a selfie taken lying on the grass, the couple holding the phone above their faces, the guy pointing up at the sky, the girl squinting and laughing, bright sky in the background'
  },
  {
    id: 'c19',
    title: 'Selfie Berlari ke Stasiun',
    cat: 'candid',
    tags: ['stasiun', 'berlari', 'gerak'],
    scene: 'a running selfie toward the station, the couple holding the phone while jogging, backpacks bouncing, slightly blurry background with motion energy, both grinning at the camera'
  },
  {
    id: 'c20',
    title: 'Selfie Teras Senja',
    cat: 'candid',
    tags: ['teras', 'kucing', 'senja'],
    scene: 'a selfie on a doorstep at dusk, her head resting on his shoulder while he holds the phone up, warm porch light, a cat photobombing at the edge of the frame'
  },
  {
    id: 'c21',
    title: 'Selfie di Pesawat',
    cat: 'candid',
    tags: ['pesawat', 'kursi', 'tenang'],
    scene: 'an airplane selfie, the couple squeezed together in their seats holding the phone up, the girl asleep on his shoulder as he smiles at the camera, thin window light, seat row behind'
  },
  {
    id: 'c22',
    title: 'Selfie Buka Kado',
    cat: 'candid',
    tags: ['kado', 'kertas', 'heboh'],
    scene: 'a selfie right after opening a present, wrapping paper scattered everywhere, the couple holding the torn paper up to the camera, the girl mid-shout of excitement, bright living room'
  },
  {
    id: 'c23',
    title: 'Selfie di Lift',
    cat: 'candid',
    tags: ['lift', 'cermin', 'lucu'],
    scene: 'an elevator selfie, the couple squeezed in front of the mirror, the guy taking the photo while the girl tries to hide a yawn behind his shoulder, cool elevator light'
  },
  {
    id: 'c24',
    title: 'Selfie Tepi Kolam',
    cat: 'candid',
    tags: ['kolam', 'santai', 'kaki'],
    scene: 'a selfie at the pool edge with legs dangling in the water, the couple holding the phone above the surface, the guy stealing a sideways glance while the girl smiles at the camera, sparkling reflections'
  },
  {
    id: 'c25',
    title: 'Selfie Kehujanan',
    cat: 'candid',
    tags: ['hujan', 'jaket', 'basah'],
    scene: 'a selfie in light rain under a jacket, the couple holding the jacket over their heads with one hand each and the phone in the middle, rainy pavement and blurred lights behind'
  },
  {
    id: 'c26',
    title: 'Selfie Rooftop Fajar',
    cat: 'candid',
    tags: ['rooftop', 'fajar', 'kopi'],
    scene: 'a rooftop selfie at sunrise, the couple holding the phone up with coffee cups in hand, the city waking up below, the girl mid-laugh, golden morning glow'
  },
  {
    id: 'c27',
    title: 'Selfie Pulang Kerja',
    cat: 'candid',
    tags: ['pulang', 'kerja', 'sore'],
    scene: 'a selfie walking home after work, loosened ties and tired smiles, the girl holding her heels in one hand and the phone with the other, dusk street behind'
  },
  {
    id: 'c28',
    title: 'Selfie Lewat Pagar',
    cat: 'candid',
    tags: ['pagar', 'kebun', 'emas'],
    scene: 'a selfie through a garden gate, the couple holding the phone against the bars, the girl resting her chin on her hands, golden hour glow, garden softly blurred behind'
  },
  {
    id: 'c29',
    title: 'Selfie Sama Anjing',
    cat: 'candid',
    tags: ['anjing', 'taman', 'siang'],
    scene: 'a selfie with a golden retriever, the couple kneeling and holding the phone up while the dog tries to lick the lens, genuine laughter, bright park afternoon'
  },
  {
    id: 'c30',
    title: 'Selfie Pasar',
    cat: 'candid',
    tags: ['pasar', 'ramai', 'belanja'],
    scene: 'a selfie at a busy market, the girl holding the phone while the guy stands behind holding shopping bags, colorful hanging goods and vendor stalls behind them, big grins'
  },
  {
    id: 'c31',
    title: 'Selfie Matching Outfit',
    cat: 'candid',
    tags: ['matching', 'cermin', 'sehari-hari'],
    scene: 'a mirror selfie of the couple wearing matching outfits, both holding phones up and striking relaxed poses, soft bedroom light, relatable daily life vibe, taken in a modern room with a leaning mirror against the wall'
  },
  {
    id: 'c32',
    title: 'Selfie Y2K Flash',
    cat: 'candid',
    tags: ['y2k', 'flash', '2000an'],
    scene: 'a retro 2000s couple selfie with the front camera flash on, slightly blown out and grainy like an old digital camera, low-rise jeans and chunky accessories, both grinning hard at the lens, nostalgic 2000s vibe'
  },
  {
    id: 'c33',
    title: 'Selfie Camcorder 2000',
    cat: 'candid',
    tags: ['camcorder', 'vhs', 'nostalgia'],
    scene: 'a selfie styled like a still frame from a 2000s home video camcorder, the couple pressing their heads together with a date stamp in the corner, VHS grain and slight chromatic aberration, happy throwback energy'
  },
  {
    id: 'c34',
    title: 'Selfie Piyama Senada',
    cat: 'candid',
    tags: ['piyama', 'matching', 'di rumah'],
    scene: 'a cozy selfie of the couple in matching pajamas, sitting cross-legged on the bed holding the phone up, sleepy smiles and messy hair, soft morning light, comfortable at-home vibe'
  },
  {
    id: 'c35',
    title: 'Selfie Bangun Pagi',
    cat: 'candid',
    tags: ['bangun tidur', 'ranjang', 'polos'],
    scene: 'a just-woke-up couple selfie in bed, blankets pulled up to their chins, the girl holding the phone while the guy squints with a pillow crease on his cheek, soft dawn light, completely unpolished'
  },
  {
    id: 'c36',
    title: 'Selfie Road Trip di Mobil',
    cat: 'candid',
    tags: ['mobil', 'road trip', 'jendela'],
    scene: 'a car selfie during a road trip, the couple squeezed in the front seats, the guy driving one-handed while the girl holds the phone, open road and sunlight through the windshield, wind-tousled hair, genuine travel energy'
  },
  {
    id: 'c37',
    title: 'Selfie Kacamata Senada',
    cat: 'candid',
    tags: ['kacamata', 'lucu', 'musim panas'],
    scene: 'a playful selfie with matching sunglasses, the couple tilting their heads together with exaggerated duck faces, bright daylight, a street with trees behind, fun summer couple vibe'
  },
  {
    id: 'c38',
    title: 'Selfie Dagu di Bahu',
    cat: 'candid',
    tags: ['pose klasik', 'dagu', 'sederhana'],
    scene: 'the classic couple selfie pose, the girl resting her chin on the guys shoulder from behind while he holds the phone up, both smiling at the camera, natural indoor light, warm and simple'
  },
  {
    id: 'c39',
    title: 'Selfie Pelukan dari Belakang',
    cat: 'candid',
    tags: ['pelukan', 'dagu di kepala', 'sore'],
    scene: 'a back-hug selfie, the guy wrapping his arms around the girl from behind with his chin resting on top of her head, she holds the phone up, both looking at the camera with soft smiles, golden evening light'
  },
  {
    id: 'c40',
    title: 'Selfie Cipratan Air Mancur',
    cat: 'candid',
    tags: ['air mancur', 'taman', 'tertawa'],
    scene: 'a fountain selfie, the couple taking a selfie with a big fountain splash right behind them, caught mid-laugh with a few water droplets on the lens, bright playful afternoon, city park'
  },
  {
    id: 'c41',
    title: 'Selfie Lampu Senar Malam',
    cat: 'candid',
    tags: ['lampu senar', 'malam', 'pelukan'],
    scene: 'a night selfie under string fairy lights, warm glowing bulbs creating soft bokeh around the couple, the girl holding the phone while the guy presses a kiss to her temple, cozy backyard mood'
  },
  {
    id: 'c42',
    title: 'Selfie Cahaya Jendela',
    cat: 'candid',
    tags: ['cahaya alami', 'jendela', 'anti ai'],
    scene: 'a natural-light selfie by a big window, soft diffused daylight casting matching shadows on both faces, the couple leaning in close, visible skin texture, no filter, clean minimal everyday look'
  },
  {
    id: 'c43',
    title: 'POV Kencan Pertama',
    cat: 'candid',
    tags: ['pov', 'kencan pertama', 'gugup'],
    scene: 'a cute nervous first date selfie at a cafe, the couple holding the phone up together, shy but genuine smiles, fiddling with their drink cups, eyes darting between each other and the camera, soft warm cafe light, butterflies energy'
  },
  {
    id: 'c44',
    title: 'Pura-pura Gak Kenal',
    cat: 'candid',
    tags: ['pov', 'tantangan', 'lucu'],
    scene: 'a playful selfie of a couple pretending to meet for the first time, exaggerated shy grins, a formal handshake in the middle of the frame, both holding the phone together, friends laughing in the softly blurred background, casual daylight street'
  },
  {
    id: 'c45',
    title: 'Golden Retriever Boyfriend',
    cat: 'candid',
    tags: ['lucu', 'sayang', 'hangat'],
    scene: 'a selfie full of golden retriever boyfriend energy, the guy making an over-the-top happy face with tongue out and eyes squeezed shut while the girl holds the phone, both in casual streetwear, bright city background'
  },
  {
    id: 'c46',
    title: 'Matching Hoodie di Mall',
    cat: 'candid',
    tags: ['matching', 'mall', 'eskalator'],
    scene: 'a mall escalator selfie of the couple wearing matching hoodies, the girl holding the phone while the guy glances back laughing, glass railings and shop fronts behind them, bright airy mall lighting'
  },
  {
    id: 'c47',
    title: 'Foto Booth Klasik',
    cat: 'candid',
    tags: ['photobooth', 'flash', 'nostalgia'],
    scene: 'a vintage photobooth strip style selfie, the couple squeezed close together making silly faces in each frame, white flash, slight grain and color fade like an old photo booth, fun nostalgic energy'
  },
  {
    id: 'c48',
    title: 'Aesthetic di Tangga',
    cat: 'candid',
    tags: ['tangga', 'gedung', 'aesthetic'],
    scene: 'an aesthetic selfie taken from below on a wide concrete staircase, the couple standing two steps apart, the girl looking at the camera while the guy looks at her, soft diffused daylight, clean minimal architecture, editorial composition'
  },
  {
    id: 'c49',
    title: 'Pelan-pelan Nempel',
    cat: 'candid',
    tags: ['dekat', 'tenang', 'hangat'],
    scene: 'a tender selfie of the girl leaning her head on the guys shoulder while he holds the phone up, both with soft relaxed smiles, golden evening window light, cozy home setting, calm and unposed'
  },
  {
    id: 'c50',
    title: 'Mini Golf Heboh',
    cat: 'candid',
    tags: ['mini golf', 'kencan', 'heboh'],
    scene: 'a selfie at a mini golf course, the girl mid-celebration with her club raised high while the guy playfully pretends to be shocked, colorful putt-putt obstacles behind them, bright cheerful daylight'
  },
  {
    id: 'c51',
    title: 'Nonton Bioskop',
    cat: 'candid',
    tags: ['bioskop', 'popcorn', 'malam'],
    scene: 'a dark cinema selfie, the couple sharing one giant popcorn bucket, both grinning mid-chew, the glow of the movie screen lighting their faces, rows of seats dimly visible behind'
  },
  {
    id: 'c52',
    title: 'Karaoke Malam Minggu',
    cat: 'candid',
    tags: ['karaoke', 'mic', 'heboh'],
    scene: 'a karaoke room selfie, the couple singing into one microphone together, eyes squeezed shut mid-laugh, phone held up in front, colorful dim party lights and confetti in the air'
  },
  {
    id: 'c53',
    title: 'Kejar Senja',
    cat: 'candid',
    tags: ['kejar senja', 'lari', 'kota'],
    scene: 'a running selfie chasing the sunset, the couple sprinting while holding the phone up, warm orange sky behind them, city rooftops silhouetted, hair flying, motion-blurred street, joyful urgency'
  },
  {
    id: 'c54',
    title: 'Makan Warteg',
    cat: 'candid',
    tags: ['warteg', 'makanan', 'sederhana'],
    scene: 'a warm selfie at a warteg street eatery, the couple holding up their plates of rice and sambal toward the camera, plastic tablecloths, both laughing mid-bite, everyday unglamorous joy, afternoon light'
  },
  {
    id: 'c55',
    title: 'Pasar Malam',
    cat: 'candid',
    tags: ['pasar malam', 'lampu', 'nostalgia'],
    scene: 'a night market selfie, string lights and carnival booths glowing behind the couple, cotton candy held up to the lens, nostalgic playful mood, warm bokeh, genuine amusement'
  },
  {
    id: 'c56',
    title: 'Di Atas Motor',
    cat: 'candid',
    tags: ['motor', 'angin', 'liburan'],
    scene: 'a scooter selfie, the girl holding the phone while riding pillion behind the guy, both in helmets, wind blowing, the road and blue sky blurring past, carefree weekend travel energy'
  },
  {
    id: 'c57',
    title: 'Hujan di Halte',
    cat: 'candid',
    tags: ['halte', 'hujan', 'dingin'],
    scene: 'a bus stop selfie during heavy rain, the couple huddled close under the shelter, foggy breath and damp hair, rain streaming down the glass behind them, puddle reflections, warm street lights at dusk'
  },
  {
    id: 'c58',
    title: 'Abis Gym',
    cat: 'candid',
    tags: ['gym', 'lelah', 'senang'],
    scene: 'a post-workout selfie, the couple in matching gym wear with flushed tired faces, holding the phone up with happy exhaustion, gym mirrors and equipment behind them, bright functional lighting'
  },
  {
    id: 'c59',
    title: 'Study Date di Perpus',
    cat: 'candid',
    tags: ['study date', 'perpus', 'fokus'],
    scene: 'a quiet study date selfie in a library, books and notes spread across the table, the couple leaning close together whispering, both holding pens, soft desk lamp glow, hushed cozy atmosphere'
  },
  {
    id: 'c60',
    title: 'Di Konser',
    cat: 'candid',
    tags: ['konser', 'lampu', 'heboh'],
    scene: 'a concert selfie, the couple squeezed together in the crowd, phone held high above the heads, colorful stage lights and confetti around them, mouths open singing at the top of their lungs'
  },
  {
    id: 'c61',
    title: 'Es Teh Manis',
    cat: 'candid',
    tags: ['es teh', 'warung', 'simple'],
    scene: 'a selfie at a simple roadside warung with two glasses of es teh manis, the couple toasting their glasses toward the camera, plastic stools and wooden tables, bright casual afternoon'
  },
  {
    id: 'c62',
    title: 'Balon Warna',
    cat: 'candid',
    tags: ['balon', 'warna', 'ceria'],
    scene: 'a playful selfie holding a big bunch of colorful balloons, the couple grinning like kids, bright blue sky and a street fair behind them, one balloon string wrapped around the girls wrist'
  },
  {
    id: 'c63',
    title: 'Taman Bunga',
    cat: 'candid',
    tags: ['taman bunga', 'warna', 'cerah'],
    scene: 'a selfie surrounded by blooming flowers in a garden, the girl holding the phone high with petals in her hair, the guy leaning in with a big smile, bright natural sunlight, colorful blossoms behind'
  },
  {
    id: 'c64',
    title: 'Kerja Bareng di Kafe',
    cat: 'candid',
    tags: ['kerja bareng', 'laptop', 'kafe'],
    scene: 'a cozy work-together selfie at a cafe, two laptops and coffee cups on the table, the couple looking up from their screens mid-laugh, warm cafe lighting, soft busy background'
  },
  {
    id: 'c65',
    title: 'Rujak Pedes',
    cat: 'candid',
    tags: ['rujak', 'pedas', 'lucu'],
    scene: 'a selfie eating spicy rujak, the couple mid-spice-shock, one fanning their mouth while the other laughs with tears, plastic gloves and a street vendor stall behind, bright daylight'
  },
  {
    id: 'c66',
    title: 'Thrift Fitting',
    cat: 'candid',
    tags: ['thrift', 'vintage', 'fitting'],
    scene: 'a mirror selfie in a thrift store fitting room, the couple modeling funny oversized finds, one in a loud printed shirt and the other in a vintage jacket, racks of clothes behind, warm store light, hysterical laughter'
  },
  {
    id: 'c67',
    title: 'Mimik Patung Museum',
    cat: 'candid',
    tags: ['museum', 'seni', 'kaku'],
    scene: 'a playful museum selfie, the couple mimicking the dramatic pose of a statue behind them, deadpan serious faces, quiet gallery hall, one holding the phone up, soft gallery lighting'
  },
  {
    id: 'c68',
    title: 'Escape Room Panik',
    cat: 'candid',
    tags: ['escape room', 'teka-teki', 'heboh'],
    scene: 'a panicked escape room selfie, the couple huddled over a puzzle, one frantically pointing at a clue while the other stares wide-eyed, red countdown light washing over them, dramatic tension'
  },
  {
    id: 'c69',
    title: 'Camping Bareng',
    cat: 'candid',
    tags: ['camping', 'tenda', 'api unggun'],
    scene: 'a campfire selfie, the couple wrapped in one blanket by the fire, marshmallows roasting on sticks, warm firelight flickering on their faces, tent and starry night sky behind'
  },
  {
    id: 'c70',
    title: 'Ngopi Pagi di Teras',
    cat: 'candid',
    tags: ['teras', 'kopi', 'pagi'],
    scene: 'a morning selfie on a terrace with two cups of coffee, the couple squinting softly in gentle morning light, potted plants around, sleepy relaxed smiles, fresh air energy'
  },
  {
    id: 'c71',
    title: 'Selfie Gajian',
    cat: 'candid',
    tags: ['gajian', 'bahagia', 'makanan'],
    scene: 'a celebratory payday selfie at a nice restaurant, the couple toasting with drinks, wide bright smiles, warm bokeh lights around them, treating themselves mood'
  },
  {
    id: 'c72',
    title: 'Ngabuburit Sore',
    cat: 'candid',
    tags: ['ngabuburit', 'sore', 'jalanan'],
    scene: 'a late afternoon selfie waiting for sunset, the couple hanging out by the roadside with cool drinks, golden warm light on their faces, relaxed lazy weekend energy, city slowly winding down'
  },
  {
    id: 'c73',
    title: 'Kereta Jalan-jalan',
    cat: 'candid',
    tags: ['kereta', 'jendela', 'perjalanan'],
    scene: 'a train window selfie, the couple holding the phone up as the landscape blurs past behind them, the girl resting her head on the guys arm, afternoon light through the window, travel mood'
  },
  {
    id: 'c74',
    title: 'Pantai Pasir Putih',
    cat: 'candid',
    tags: ['pantai', 'tropis', 'cerah'],
    scene: 'a bright beach selfie, the couple holding the phone up with turquoise water and white sand behind them, wind in their hair, one shielding their eyes from the sun, big genuine smiles, tropical day'
  },
  {
    id: 'c75',
    title: 'Kebun Teh',
    cat: 'candid',
    tags: ['kebun teh', 'hijau', 'pagi'],
    scene: 'a selfie in a green tea plantation, rolling rows of tea bushes behind the couple, soft morning mist, the girl holding the phone while the guy does a goofy pose, fresh mountain air energy'
  },
  {
    id: 'c76',
    title: 'Mie Instan Tengah Malam',
    cat: 'candid',
    tags: ['mie instan', 'tengah malam', 'dapur'],
    scene: 'a midnight kitchen selfie, the couple holding up two steaming bowls of instant noodles with chopsticks, messy sleep clothes and bedhead, dim kitchen light, cozy late-night snack ritual'
  },
  {
    id: 'c77',
    title: 'Es Krim Bagi Dua',
    cat: 'candid',
    tags: ['es krim', 'berdua', 'lucu'],
    scene: 'a selfie sharing one cup of ice cream with two spoons, the couple leaning close, one scooping a bite for the other, playful eyes, bright cheerful dessert shop background'
  },
  {
    id: 'c78',
    title: 'Lampu Neon Malam',
    cat: 'candid',
    tags: ['neon', 'malam', 'kota'],
    scene: 'a night selfie under colorful neon signs, the couple holding the phone up, pink and blue light washing over their faces, city street at night behind them, cool urban mood'
  },
  {
    id: 'c79',
    title: 'Badminton Bareng',
    cat: 'candid',
    tags: ['badminton', 'keringat', 'heboh'],
    scene: 'a post-badminton selfie at the court, both sweaty and flushed holding rackets, the girl grinning with victory while the guy wipes his forehead with a towel, court lighting behind them'
  },
  {
    id: 'c80',
    title: 'Nonton Drama Bareng',
    cat: 'candid',
    tags: ['drama', 'selimut', 'malam'],
    scene: 'a drama marathon selfie on the sofa, the couple wrapped in one blanket with snacks scattered around, one clutching their heart dramatically at the screen while the other laughs, dim warm room'
  },
  {
    id: 'c81',
    title: 'Cium dari Belakang',
    cat: 'candid',
    tags: ['pelukan', 'cium', 'hangat'],
    scene: 'a selfie of the guy hugging the girl from behind and pressing a kiss to her cheek while she holds the phone up, both smiling softly, warm evening home light, unguarded affection'
  },
  {
    id: 'c82',
    title: 'Nungguin Mie Ayam Datang',
    cat: 'candid',
    tags: ['mie ayam', 'lapar', 'jalanan'],
    scene: 'a hungry selfie at a mie ayam stall, the couple staring eagerly at the steaming bowls being set down, holding chopsticks up, steam rising, simple street stall setting, mouth-watering anticipation'
  },
  {
    id: 'c83',
    title: 'Puncak Bukit Sore',
    cat: 'candid',
    tags: ['bukit', 'angin', 'sore'],
    scene: 'a selfie at a hilltop overlook in the late afternoon, the couple holding the phone up with sprawling hills and a winding road behind them, wind in their hair, golden light, calm content smiles'
  },
  {
    id: 'c84',
    title: 'Main Klaw Machine',
    cat: 'candid',
    tags: ['klaw machine', 'arcade', 'fokus'],
    scene: 'a claw machine selfie, the couple huddled around the machine window, one holding the joystick with intense focus while the other cheers them on, bright arcade glow, dramatic tension, playful fun'
  },
  {
    id: 'c85',
    title: 'Sepeda Santai Kampung',
    cat: 'candid',
    tags: ['sepeda', 'kampung', 'santai'],
    scene: 'a relaxed bike ride selfie down a quiet village road, the couple on one bicycle, the girl holding the phone while the guy pedals, rice fields and coconut trees passing by, soft golden light'
  },
  {
    id: 'c86',
    title: 'Naik Perahu',
    cat: 'candid',
    tags: ['perahu', 'danau', 'tenang'],
    scene: 'a lake boat selfie, the couple sitting side by side, the girl holding the phone up as the guy rows, calm water and green hills behind them, gentle afternoon sunlight'
  },
  {
    id: 'c87',
    title: 'Sate Jalanan',
    cat: 'candid',
    tags: ['sate', 'street food', 'malam'],
    scene: 'a street food sate selfie, the couple holding up skewers toward the camera, charred sate dripping with sauce, the girl mid-bite and the guy grinning, smoky grill and night market lights behind'
  },
  {
    id: 'c88',
    title: 'Kucing Kesayangan',
    cat: 'candid',
    tags: ['kucing', 'peliharaan', 'rumah'],
    scene: 'a selfie holding their cat up to the camera, the cat looking mildly unimpressed while the couple beams with pride, cozy home background, warm soft lighting'
  },
  {
    id: 'c89',
    title: 'Air Terjun',
    cat: 'candid',
    tags: ['air terjun', 'hutan', 'sejuk'],
    scene: 'a waterfall selfie, the couple holding the phone up with a misty waterfall behind them, water spray on their faces, lush green forest, both laughing and shielding the lens from mist'
  },
  {
    id: 'c90',
    title: 'Balik Kampung',
    cat: 'candid',
    tags: ['mudik', 'kampung', 'nostalgia'],
    scene: 'a mudik selfie on the way home to the hometown, the couple in the back of a car with luggage, holding the phone up, the road stretching behind them through green countryside, warm nostalgic mood'
  },
  {
    id: 'c91',
    title: 'Akhir Pekan Malas',
    cat: 'candid',
    tags: ['akhir pekan', 'malas', 'santai'],
    scene: 'a lazy weekend selfie, the couple sprawled on the sofa in casual clothes with snacks and a remote nearby, one mid-yawn and the other smiling sleepily, soft afternoon light, ultimate do-nothing mood'
  },
  {
    id: 'c92',
    title: 'Tantangan Jangan Ketawa',
    cat: 'candid',
    tags: ['jangan ketawa', 'tantangan', 'lucu'],
    scene: 'a laugh challenge selfie, the couple holding the phone up with exaggerated serious faces, the girl biting her lip and the guys lips twitching, both desperately trying not to laugh, playful tension, bright natural light'
  },

  /* --- TikTok Viral --- */
  {
    id: 'tr1',
    title: 'POV Panik Lihat Saldo',
    cat: 'viral',
    tags: ['pov', 'panik', 'lucu'],
    scene: 'a panicked couple selfie staring down at a phone screen showing a tiny balance, both grabbing their foreheads with exaggerated horror, one covering their mouth, a cafe table and drinks in front, natural light'
  },
  {
    id: 'tr2',
    title: 'Silent Walking Date',
    cat: 'viral',
    tags: ['pov', 'awkward', 'jalan'],
    scene: 'an awkward silent walking date selfie, the couple walking side by side holding the phone, the girl staring straight at the camera with a blank face while the guy looks everywhere but the lens, muted awkward tension, bright street'
  },
  {
    id: 'tr3',
    title: 'Challenge Gengsi Ketawa',
    cat: 'viral',
    tags: ['tantangan', 'ketawa', 'tahan'],
    scene: 'a selfie of the couple in a do-not-laugh standoff, the girl pressing her lips together and pinching her arm to hold it in while the guy pulls a ridiculous face just out of frame, both about to break, natural home light'
  },
  {
    id: 'tr4',
    title: 'POV Dia Sering Fotoin Aku',
    cat: 'viral',
    tags: ['pov', 'foto', 'lucu'],
    scene: 'a dramatic selfie of the guy holding the phone up while the girl rolls her eyes playfully behind him, him pointing the camera at everything else around them with an exaggerated tourist pose, city street, bright daylight'
  },
  {
    id: 'tr5',
    title: 'Ngasih Makan Gagal',
    cat: 'viral',
    tags: ['makan', 'gagal', 'lucu'],
    scene: 'a hilarious selfie of the guy feeding the girl a bite of food but missing her mouth, sauce on her cheek, both mid-laugh with the spoon in the air, a street food stall behind them, candid chaos'
  },
  {
    id: 'tr6',
    title: 'POV Jadian Pertama',
    cat: 'viral',
    tags: ['pov', 'genggam tangan', 'malu'],
    scene: 'a shy first-relationship selfie, the couple holding hands for the first time on a park bench, blushing and looking anywhere but the camera, one hiding a smile behind a hand, soft golden afternoon light'
  },
  {
    id: 'tr7',
    title: 'Belain Makanan',
    cat: 'viral',
    tags: ['snack', 'lucu', 'rumah'],
    scene: 'a protective selfie of the girl hugging a bag of snacks to her chest while the guy leans in with a mock desperate grab, both laughing, couch and soft lamp light, playful home mood'
  },
  {
    id: 'tr8',
    title: 'POV Cari Tempat Foto',
    cat: 'viral',
    tags: ['pov', 'fotografer', 'konyol'],
    scene: 'a selfie of the guy dramatically pointing at a random spot insisting it is the perfect photo spot, the girl half-covering her face in embarrassment, mall or street background, funny exaggerated energy'
  },
  {
    id: 'tr9',
    title: 'POV Ngaku Salah',
    cat: 'viral',
    tags: ['pov', 'salah', 'lucu'],
    scene: 'a selfie of the couple making fake guilty faces, one putting their hands together in apology while the other tilts their head with a sheepish smile, soft indoor light, playful sorry mood'
  },
  {
    id: 'tr10',
    title: 'Tes Seberapa Kenal',
    cat: 'viral',
    tags: ['kuis', 'tantangan', 'kafe'],
    scene: 'a quiz challenge selfie, the girl holding the phone showing a question while the guy thinks hard with a hand on his chin, both mid-laugh at a wrong answer, cafe background, natural light'
  },

  /* --- Musiman --- */
  {
    id: 'm1',
    title: 'Lebaran di Kampung',
    cat: 'seasonal',
    tags: ['lebaran', 'ketupat', 'kampung'],
    scene: 'a warm Lebaran selfie, the couple in matching modest batik and traditional Lebaran outfits, sitting at a table full of ketupat, opor and cookies, green house plants behind, soft morning light, joyful homecoming mood'
  },
  {
    id: 'm2',
    title: 'Takbiran Malam',
    cat: 'seasonal',
    tags: ['takbiran', 'malam', 'lentera'],
    scene: 'a night takbiran selfie, the couple holding glowing lanterns and candles with the lights of the mosque behind them, warm firelight on their faces, festive quiet night atmosphere'
  },
  {
    id: 'm3',
    title: 'Kembang Api Tahun Baru',
    cat: 'seasonal',
    tags: ['tahun baru', 'kembang api', 'malam'],
    scene: 'a New Year selfie with fireworks exploding in the sky above, the couple holding the phone up in a crowd, one pointing at the sky with excitement, confetti falling, warm party lights'
  },
  {
    id: 'm4',
    title: 'Natal yang Hangat',
    cat: 'seasonal',
    tags: ['natal', 'pohon', 'hangat'],
    scene: 'a cozy Christmas selfie, the couple in chunky knit sweaters in front of a decorated tree, string lights glowing around them, mugs of hot cocoa, warm golden glow, soft holiday mood'
  },
  {
    id: 'm5',
    title: 'Valentine Romantis',
    cat: 'seasonal',
    tags: ['valentine', 'makan malam', 'lilin'],
    scene: 'a romantic Valentine selfie at a candlelit dinner table, red roses and rose petals on the table, the couple leaning close holding the phone up, warm candlelight, intimate elegant mood'
  },
  {
    id: 'm6',
    title: '17 Agustus Ceria',
    cat: 'seasonal',
    tags: ['17 agustus', 'merah putih', 'lomba'],
    scene: 'a festive 17 Agustus selfie, the couple in red and white outfits surrounded by Indonesian flags and decorations, a panjat pinang pole blurred behind, big proud happy smiles, bright afternoon'
  },
  {
    id: 'm7',
    title: 'Tahun Baru Imlek',
    cat: 'seasonal',
    tags: ['imlek', 'lentera', 'merah'],
    scene: 'a Chinese New Year selfie, the couple in red traditional outfits under a canopy of red lanterns, gold decorations and a dragon dance behind them, festive warm light, cheerful celebration mood'
  },
  {
    id: 'm8',
    title: 'Halloween Couple',
    cat: 'seasonal',
    tags: ['halloween', 'kostum', 'lucu'],
    scene: 'a fun Halloween selfie, the couple in matching silly costumes, one in a panda suit and the other in a matching panda onesie, carved pumpkins and fake spider webs behind, dim orange light, playful spooky mood'
  },
  {
    id: 'm9',
    title: 'Buka Puasa Bareng',
    cat: 'seasonal',
    tags: ['buka puasa', 'kolak', 'hangat'],
    scene: 'a warm iftar selfie, the couple about to break their fast with dates, kolak and iced drinks laid out on the mat, one eyeing the food hungrily, cozy home setting, golden hour window light'
  },
  {
    id: 'm10',
    title: 'Kejutan Ulang Tahun',
    cat: 'seasonal',
    tags: ['ultah', 'kue', 'kejutan'],
    scene: 'a birthday surprise selfie, the couple holding a cake with lit candles, one mid-blow while the other snaps the photo, party hats and balloons, sparklers in the background, excited chaos'
  },

  /* --- Petualangan Indonesia --- */
  {
    id: 't6',
    title: 'Borobudur Fajar',
    cat: 'travel',
    tags: ['borobudur', 'sunrise', 'kabut'],
    scene: 'the two of them sitting on the top terrace of Borobudur temple at sunrise, soft mist over the surrounding valleys, warm golden light rising behind the stupas, quiet spiritual travel mood'
  },
  {
    id: 't7',
    title: 'Malioboro Malam',
    cat: 'travel',
    tags: ['jogja', 'angkringan', 'malam'],
    scene: 'the two of them sharing a low bench at an angkringan stall on Malioboro street at night, hot tea and skewers on the table, becak and street lanterns glowing behind them, warm nostalgic street mood'
  },
  {
    id: 't8',
    title: 'Bandung Dago',
    cat: 'travel',
    tags: ['bandung', 'dago', 'dingin'],
    scene: 'the two of them strolling through a cool green street in the Dago hills, misty mountains and pine trees behind, cozy sweaters, one holding a warm drink, fresh mountain air, afternoon light'
  },
  {
    id: 't9',
    title: 'Danau Toba',
    cat: 'travel',
    tags: ['danau toba', 'samosir', 'gunung'],
    scene: 'the two of them at the edge of Lake Toba with the island of Samosir and green mountains across the calm water, a traditional Batak house in the background, soft overcast light, peaceful travel mood'
  },
  {
    id: 't10',
    title: 'Pantai Kuta Sunset',
    cat: 'travel',
    tags: ['bali', 'kuta', 'sunset'],
    scene: 'the two of them walking along Kuta beach at sunset, surfers silhouetted in the waves, warm orange sky over the ocean, sand and beach stalls behind, relaxed holiday energy'
  },

  /* --- Vintage 90-an --- */
  {
    id: 'v6',
    title: 'Disposable Camera 90-an',
    cat: 'vintage',
    tags: ['disposable', '90s', 'overexposed'],
    scene: 'a 90s disposable camera snapshot of the couple, slightly overexposed with washed-out colors, light vignette and a faint date stamp in the corner, both grinning hard at the lens, nostalgic home video vibe'
  },
  {
    id: 'v7',
    title: 'Studio Foto Pasar Malam',
    cat: 'vintage',
    tags: ['studio', 'latar lukis', 'retro'],
    scene: 'the couple posing in front of a classic hand-painted studio backdrop of a lake and mountains, old-school flash photography with warm faded colors, formal vintage clothing, playful retro studio portrait'
  },
  {
    id: 'v8',
    title: 'Album Keluarga Jadul',
    cat: 'vintage',
    tags: ['polaroid', 'album', 'faded'],
    scene: 'a faded old Polaroid of the couple, softened edges, light scratch marks and sepia warmth, sitting on a couch in simple early 90s clothing, genuine comfortable smiles, looks like a photo from an old family album'
  }
];

/* ---------- Skenario Video (mode Video) ---------- */
var VIDEO_SCENES = [
  {
    id: 'vd1',
    title: 'Slow Motion Genggam Tangan',
    cat: 'video',
    tags: ['slow motion', 'jalan', 'golden hour'],
    scene: 'slow motion video of the couple walking hand in hand directly toward the camera, laughing softly, hair moving in the wind, golden hour backlight, steady handheld phone shot, warm natural colors'
  },
  {
    id: 'vd2',
    title: 'POV Kencan Pertama',
    cat: 'video',
    tags: ['pov', 'kencan pertama', 'gugup'],
    scene: 'POV phone video of a nervous first date, the guy awkwardly waving at the camera while the girl laughs behind the lens, they both look at each other shyly and break into smiles, cafe background, natural handheld shake'
  },
  {
    id: 'vd3',
    title: 'Lip Sync Challenge',
    cat: 'video',
    tags: ['lip sync', 'tarian', 'lucu'],
    scene: 'a fun lip sync video of the couple dancing together in a living room, mouthing a song to the camera, silly choreography, one nearly falling over laughing, warm indoor light, casual phone footage'
  },
  {
    id: 'vd4',
    title: 'Lari Hujan Tertawa',
    cat: 'video',
    tags: ['hujan', 'lari', 'tertawa'],
    scene: 'handheld video of the couple sprinting through rain and laughing, puddle splashes, wet hair and soaked clothes, the camera bouncing as they run, gray city street, joyful chaos'
  },
  {
    id: 'vd5',
    title: 'Reveal Outfit Matching',
    cat: 'video',
    tags: ['outfit', 'matching', 'reveal'],
    scene: 'a quick outfit reveal video, the couple spinning into frame in matching outfits, one striking a dramatic pose while the other laughs, bright bedroom light, energetic TikTok editing style'
  },
  {
    id: 'vd6',
    title: 'Ciuman Golden Hour',
    cat: 'video',
    tags: ['golden hour', 'cium', 'slow motion'],
    scene: 'slow motion video of the couple sharing a soft kiss at golden hour, the sun flaring behind them, dust particles floating in the light, cinematic color, dreamy warm mood, gentle camera drift'
  },
  {
    id: 'vd7',
    title: 'POV Tolak Makanan',
    cat: 'video',
    tags: ['pov', 'makanan', 'lucu'],
    scene: 'POV phone video of the girl playfully refusing food that the guy keeps pushing into the frame, her hands blocking the camera and laughing, he keeps trying with a hopeful face, warm kitchen light'
  },
  {
    id: 'vd8',
    title: 'Silent Walking Date',
    cat: 'video',
    tags: ['silent walking', 'awkward', 'pov'],
    scene: 'awkward POV video of a silent walking date, the couple walking side by side, long uncomfortable pauses, one stealing quick glances at the camera, passing streets and shops, muted everyday light'
  },
  {
    id: 'vd9',
    title: 'Kencan Netflix',
    cat: 'video',
    tags: ['netflix', 'selimut', 'malam'],
    scene: 'a cozy video of the couple cuddled under a blanket watching a show, slow camera pan from the screen to their sleepy faces, one eyeing the snacks, dim warm room light, soft intimate mood'
  },
  {
    id: 'vd10',
    title: 'Lari Pelukan',
    cat: 'video',
    tags: ['pelarian', 'pelukan', 'slow motion'],
    scene: 'slow motion video of the girl running toward the guy and jumping into his arms, spinning once in the air, golden hour park background, joyful laughter, smooth camera pan following the motion'
  },
  {
    id: 'vd11',
    title: 'Masak Bareng Kacau',
    cat: 'video',
    tags: ['masak', 'tepung', 'kacau'],
    scene: 'a chaotic baking video, flour exploding everywhere as the couple laughs, one accidentally bumping the bag of flour off the counter, both covered in white dust, fast cuts and funny zoom, bright kitchen light'
  },
  {
    id: 'vd12',
    title: 'POV Nembak Gagal',
    cat: 'video',
    tags: ['pov', 'nembak', 'malu'],
    scene: 'POV video of the guy trying to confess feelings, rehearsing and backing out three times, hands shaking, the girl holding the phone barely holding in laughter, nervous shy mood, soft evening park light'
  }
];

/* ---------- Kategori ---------- */
var CATS = [
  { key: 'all', label: 'Semua', icon: 'bx-grid-alt' },
  { key: 'candid', label: 'Selfie', icon: 'bx-camera' },
  { key: 'viral', label: 'TikTok Viral', icon: 'bxs-music' },
  { key: 'seasonal', label: 'Musiman', icon: 'bxs-calendar-heart' },
  { key: 'romantis', label: 'Romantis', icon: 'bxs-heart' },
  { key: 'anime', label: 'Anime', icon: 'bxs-magic-wand' },
  { key: 'sunset', label: 'Golden Hour', icon: 'bxs-sun' },
  { key: 'wedding', label: 'Pernikahan', icon: 'bxs-diamond' },
  { key: 'vintage', label: 'Vintage', icon: 'bxs-camera' },
  { key: 'cyber', label: 'Cyberpunk', icon: 'bx-planet' },
  { key: 'art', label: 'Ilustrasi', icon: 'bx-palette' },
  { key: 'cute', label: 'Chibi', icon: 'bxs-star' },
  { key: 'travel', label: 'Petualangan', icon: 'bxs-plane' },
  { key: 'studio', label: 'Studio', icon: 'bxs-video' }
];

var STYLIZED = { anime: 1, art: 1, cute: 1 };

function catLabel(key) {
  var cats = catsForMode();
  for (var i = 0; i < cats.length; i++) {
    if (cats[i].key === key) return cats[i].label;
  }
  return key;
}

/* ---------- Gaya kamera / film ---------- */
var CAMERAS = {
  portra: {
    label: 'Film Kodak Portra 400 (hangat & natural)',
    text: 'shot on 35mm film, Kodak Portra 400, natural colors, warm skin tones, fine film grain'
  },
  fuji: {
    label: 'Film Fujifilm Pro 400H (pastel lembut)',
    text: 'shot on Fujifilm Pro 400H film, soft pastel tones, gentle grain, natural highlights'
  },
  cinstill: {
    label: 'Film CineStill 800T (sinematik malam)',
    text: 'shot on CineStill 800T film, cinematic halation, warm highlights, cool shadows'
  },
  dslr: {
    label: 'DSLR 85mm f/1.4 (bokeh tajam)',
    text: 'shot on a DSLR with a fast 85mm prime lens at f/1.4, shallow depth of field, crisp natural detail'
  },
  smartphone: {
    label: 'Kamera HP (natural & jujur)',
    text: 'shot casually on a modern smartphone camera, natural colors, realistic exposure, everyday candid look'
  },
  bw: {
    label: 'Film Hitam Putih HP5 (klasik)',
    text: 'shot on Ilford HP5 Plus 400 black and white film, rich contrast, classic fine grain'
  },
  instax: {
    label: 'Kamera Instax / Polaroid (foto instan)',
    text: 'shot on an instant Polaroid camera, soft faded pastel colors, subtle vignette, slight soft focus, instant print look'
  },
  disposable: {
    label: 'Disposable Camera 35mm (jadul 90-an)',
    text: 'shot on a disposable 35mm film camera, slightly overexposed, muted colors, light vignette, nostalgic 1990s snapshot look'
  },
  y2kflash: {
    label: 'Flash Kamera Digital 2000-an (Y2K)',
    text: 'shot on an early 2000s digital camera with harsh direct flash, blown-out highlights, cool tones, slight grain, nostalgic Y2K look'
  }
};

var REALISM =
  'natural skin texture with subtle pores, no airbrushing, candid unposed moment, authentic spontaneous expression, realistic body proportions, natural imperfect details, soft realistic light, looks like a real photo taken by a friend';

var NEGATIVE_PHOTO =
  'overly polished, studio lighting, soft glam, perfect symmetry, commercial clean look, over-retouched skin, cartoonish, CGI, artificial lighting, HDR, cinematic color grading, oversaturated colors, plastic texture, unrealistic proportions, extra fingers, distorted hands, blurry subject, stiff pose, luxury aesthetic, staged look';

var NEGATIVE_STYLE =
  'photorealistic, realistic photo, 3D render, CGI, deformed hands, extra fingers, blurry, low quality, watermark, text, signature, messy lineart';

var STYLE_TEXT = {
  anime: 'high quality anime artwork, clean lineart, vibrant colors, detailed background',
  art: 'high quality illustration art, painterly details',
  cute: 'cute kawaii chibi illustration, sticker style, adorable details'
};

/* ---------- Rasio (ditambahkan otomatis di akhir prompt) ---------- */
var RATIOS = {
  none: { label: 'Default (ikuti generator)', text: '' },
  '916': { label: 'Vertikal 9:16 (TikTok/Reels)', text: ' --ar 9:16' },
  '45': { label: 'Potret 4:5 (Instagram)', text: ' --ar 4:5' },
  '11': { label: 'Kotak 1:1', text: ' --ar 1:1' },
  '169': { label: 'Landscape 16:9', text: ' --ar 16:9' }
};

/* ---------- Mode Video ---------- */
var VIDEO_CATS = [
  { key: 'all', label: 'Semua', icon: 'bx-grid-alt' },
  { key: 'video', label: 'Video TikTok', icon: 'bx-movie' }
];

var VIDEO_LOOK =
  'shot as a short vertical 9:16 smartphone video, natural handheld camera movement with subtle shake, realistic motion blur, smooth cinematic color, candid authentic expressions, looks like real phone footage taken by a friend';

var NEGATIVE_VIDEO =
  'still photo, static frame, freeze frame, paused video, animation, cartoon, 3D render, CGI, drawn, deformed hands, extra fingers, distorted faces, watermark, logo, text overlay, oversaturated, plastic skin, studio lighting';

/* ---------- State ---------- */
var mode = 'photo'; // 'photo' | 'video'
var activeCat = 'all';
var query = '';
var favOnly = false;
var PAGE_SIZE = 12;
var ALL_PAGE_SIZE = 4;
var visibleCount = ALL_PAGE_SIZE;
var favs = loadFavs();
var appearance = load('vanz-prompt-appearance', '');
var cameraKey = load('vanz-prompt-camera', 'portra');
var ratioKey = load('vanz-prompt-ratio', 'none');

function sourceScenes() {
  return mode === 'video' ? VIDEO_SCENES : SCENES;
}
function catsForMode() {
  return mode === 'video' ? VIDEO_CATS : CATS;
}

function pageSize() {
  return activeCat === 'all' ? ALL_PAGE_SIZE : PAGE_SIZE;
}
function resetVisible() {
  visibleCount = pageSize();
}

function load(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw === null ? fallback : raw;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
}
function loadFavs() {
  try {
    var raw = localStorage.getItem('vanz-prompt-favs');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}
function saveFavs() {
  try {
    localStorage.setItem('vanz-prompt-favs', JSON.stringify(Array.from(favs)));
  } catch (e) {}
}
function isFav(id) {
  return favs.has(id);
}
function toggleFav(id) {
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  saveFavs();
  updateFavCount();
  render();
}

/* ---------- Perakit prompt ---------- */
function appearanceText() {
  var t = (appearance || '').trim();
  if (t) return t;
  return '[deskripsi penampilan kalian berdua: sebutkan ciri fisik, tinggi, rambut, kulit, kacamata, dan gaya pakaian masing-masing]';
}
function isStylized(cat) {
  return !!STYLIZED[cat];
}
function cameraText() {
  var cam = CAMERAS[cameraKey];
  return cam ? cam.text : CAMERAS.portra.text;
}
function buildPrompt(scene) {
  var parts = [];
  parts.push(appearanceText());
  parts.push(scene.scene);
  if (mode === 'video') {
    parts.push(VIDEO_LOOK);
  } else if (isStylized(scene.cat)) {
    parts.push(STYLE_TEXT[scene.cat]);
  } else {
    parts.push(cameraText());
    parts.push(REALISM);
  }
  var out = parts.join(', ') + '.';
  var ratio = RATIOS[ratioKey];
  if (ratio && ratio.text) out += ratio.text;
  return out;
}
function catIcon(key) {
  var cats = catsForMode();
  for (var i = 0; i < cats.length; i++) {
    if (cats[i].key === key) return cats[i].icon;
  }
  return 'bxs-heart';
}
function currentNegative() {
  if (mode === 'video') return NEGATIVE_VIDEO;
  if (activeCat !== 'all' && isStylized(activeCat)) return NEGATIVE_STYLE;
  return NEGATIVE_PHOTO;
}
function negativeFor(p) {
  if (mode === 'video') return NEGATIVE_VIDEO;
  return isStylized(p.cat) ? NEGATIVE_STYLE : NEGATIVE_PHOTO;
}
function fullPrompt(p) {
  return buildPrompt(p) + '\n\nNegative prompt: ' + negativeFor(p);
}

/* ---------- Toast ---------- */
var toastTimer = null;
function toast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.innerHTML = "<i class='bx bx-check-circle'></i><span></span>";
    document.body.appendChild(t);
  }
  t.querySelector('span').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    t.classList.remove('show');
  }, 2000);
}

/* ---------- Copy ---------- */
function copyText(text, okMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      function () {
        toast(okMsg);
      },
      function () {
        fallbackCopy(text, okMsg);
      }
    );
  } else {
    fallbackCopy(text, okMsg);
  }
}
function fallbackCopy(text, okMsg) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    toast(okMsg);
  } catch (e) {
    toast('Gagal menyalin');
  }
  ta.remove();
}

/* ---------- Filter ---------- */
function matches(p) {
  if (activeCat !== 'all' && p.cat !== activeCat) return false;
  if (favOnly && !isFav(p.id)) return false;
  if (query) {
    var q = query.toLowerCase();
    var hay = (p.title + ' ' + p.scene + ' ' + p.tags.join(' ') + ' ' + catLabel(p.cat)).toLowerCase();
    if (hay.indexOf(q) === -1) return false;
  }
  return true;
}
function filtered() {
  return sourceScenes().filter(matches);
}

/* ---------- Render ---------- */
var grid = document.getElementById('promptGrid');
var emptyState = document.getElementById('emptyState');
var countLabel = document.getElementById('countLabel');

function updateFavCount() {
  var el = document.getElementById('favCount');
  if (el) el.textContent = favs.size ? '· ' + favs.size : '';
}

function renderChips() {
  var wrap = document.getElementById('catChips');
  if (!wrap) return;
  wrap.innerHTML = '';
  var cats = catsForMode();
  var src = sourceScenes();
  cats.forEach(function (c) {
    var n = c.key === 'all'
      ? src.length
      : src.filter(function (p) {
          return p.cat === c.key;
        }).length;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    if (activeCat === c.key) b.classList.add('chip-active');
    b.innerHTML = "<i class='bx " + c.icon + "'></i><span>" + c.label + '</span><span class="chip-num">' + n + '</span>';
    b.addEventListener('click', function () {
      activeCat = c.key;
      resetVisible();
      renderChips();
      render();
    });
    wrap.appendChild(b);
  });
}

function render() {
  var all = filtered();
  var items = all.slice(0, visibleCount);
  grid.innerHTML = '';
  emptyState.classList.toggle('u-hidden', all.length > 0);
  countLabel.textContent = all.length > items.length
    ? items.length + ' dari ' + all.length
    : String(all.length);

  var lmWrap = document.getElementById('loadMoreWrap');
  var lmCount = document.getElementById('loadMoreCount');
  if (lmWrap) {
    if (all.length > items.length) {
      lmWrap.classList.remove('u-hidden');
      if (lmCount) lmCount.textContent = '· ' + (all.length - items.length) + ' tersisa';
    } else {
      lmWrap.classList.add('u-hidden');
    }
  }

  items.forEach(function (p, idx) {
    var card = document.createElement('article');
    card.className = 'prompt-card lift';

    var head = document.createElement('div');
    head.className = 'prompt-card-head';

    var left = document.createElement('div');
    left.className = 'u-min-w-0';
    var title = document.createElement('h3');
    title.className = 'prompt-title';
    title.textContent = p.title;
    var catEl = document.createElement('span');
    catEl.className = 'prompt-cat';
    catEl.innerHTML = "<i class='bx " + catIcon(p.cat) + "'></i>" + catLabel(p.cat);
    left.appendChild(title);
    left.appendChild(catEl);

    var favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = 'fav-btn' + (isFav(p.id) ? ' on' : '');
    favBtn.setAttribute('aria-label', 'Favorit');
    favBtn.innerHTML = "<i class='bx bxs-heart'></i>";
    favBtn.addEventListener('click', function () {
      toggleFav(p.id);
    });

    head.appendChild(left);
    head.appendChild(favBtn);

    var body = document.createElement('div');
    body.className = 'prompt-body';
    body.textContent = buildPrompt(p);

    var tags = document.createElement('div');
    tags.className = 'prompt-tags';
    p.tags.forEach(function (t) {
      var s = document.createElement('span');
      s.className = 'prompt-tag';
      s.textContent = '#' + t;
      tags.appendChild(s);
    });

    var foot = document.createElement('div');
    foot.className = 'prompt-foot';
    var num = document.createElement('span');
    num.className = 'muted u-text-xs u-bold';
    num.textContent = String(idx + 1).padStart(2, '0');
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = "<i class='bx bx-copy-alt'></i><span>Salin</span>";
    copyBtn.addEventListener('click', function () {
      var self = this;
      copyText(fullPrompt(p), 'Prompt + negative disalin!');
      self.classList.add('done');
      self.innerHTML = "<i class='bx bx-check'></i><span>Disalin</span>";
      setTimeout(function () {
        self.classList.remove('done');
        self.innerHTML = "<i class='bx bx-copy-alt'></i><span>Salin</span>";
      }, 1600);
    });
    foot.appendChild(num);
    foot.appendChild(copyBtn);

    card.appendChild(head);
    card.appendChild(body);
    card.appendChild(tags);
    card.appendChild(foot);
    grid.appendChild(card);
  });

  requestAnimationFrame(function () {
    var cards = grid.querySelectorAll('.prompt-card');
    cards.forEach(function (c, i) {
      setTimeout(function () {
        c.classList.add('in');
      }, i * 40);
    });
  });
}

/* ---------- Acak prompt ---------- */
function showRandom() {
  var items = filtered();
  if (!items.length) return toast('Tidak ada prompt untuk diacak');
  var p = items[Math.floor(Math.random() * items.length)];
  var el = document.getElementById('randomResult');
  if (!el) return;
  el.classList.remove('u-hidden');
  el.innerHTML = '';

  var head = document.createElement('div');
  head.className = 'u-flex u-between u-center u-gap-4';
  var title = document.createElement('h3');
  title.className = 'prompt-title';
  title.textContent = p.title;
  var catEl = document.createElement('span');
  catEl.className = 'prompt-cat';
  catEl.innerHTML = "<i class='bx " + catIcon(p.cat) + "'></i>" + catLabel(p.cat);
  head.appendChild(title);
  head.appendChild(catEl);

  var body = document.createElement('div');
  body.className = 'prompt-body u-mt-4';
  body.textContent = fullPrompt(p);

  var foot = document.createElement('div');
  foot.className = 'u-flex u-between u-center u-gap-4 u-mt-5';
  var tagWrap = document.createElement('div');
  tagWrap.className = 'prompt-tags';
  p.tags.forEach(function (t) {
    var s = document.createElement('span');
    s.className = 'prompt-tag';
    s.textContent = '#' + t;
    tagWrap.appendChild(s);
  });
  var copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'copy-btn';
  copyBtn.innerHTML = "<i class='bx bx-copy-alt'></i><span>Salin</span>";
  copyBtn.addEventListener('click', function () {
    copyText(fullPrompt(p), 'Prompt + negative disalin!');
    copyBtn.innerHTML = "<i class='bx bx-check'></i><span>Disalin</span>";
    setTimeout(function () {
      copyBtn.innerHTML = "<i class='bx bx-copy-alt'></i><span>Salin</span>";
    }, 1600);
  });
  foot.appendChild(tagWrap);
  foot.appendChild(copyBtn);

  el.appendChild(head);
  el.appendChild(body);
  el.appendChild(foot);
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- Inisialisasi ---------- */
(function init() {
  /* isi select kamera */
  var camSel = document.getElementById('cameraSelect');
  if (camSel) {
    var keys = Object.keys(CAMERAS);
    keys.forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = CAMERAS[k].label;
      camSel.appendChild(o);
    });
    camSel.value = CAMERAS[cameraKey] ? cameraKey : 'portra';
    camSel.addEventListener('change', function () {
      cameraKey = camSel.value;
      save('vanz-prompt-camera', cameraKey);
      resetVisible();
      render();
    });
  }

  var ratioSel = document.getElementById('ratioSelect');
  if (ratioSel) {
    var rkeys = Object.keys(RATIOS);
    rkeys.forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = RATIOS[k].label;
      ratioSel.appendChild(o);
    });
    ratioSel.value = RATIOS[ratioKey] ? ratioKey : 'none';
    ratioSel.addEventListener('change', function () {
      ratioKey = ratioSel.value;
      save('vanz-prompt-ratio', ratioKey);
      resetVisible();
      render();
    });
  }

  var appInput = document.getElementById('appearanceInput');
  if (appInput) {
    appInput.value = appearance;
    var appTimer = null;
    appInput.addEventListener('input', function () {
      clearTimeout(appTimer);
      appTimer = setTimeout(function () {
        appearance = appInput.value;
        save('vanz-prompt-appearance', appearance);
        resetVisible();
        render();
      }, 400);
    });
  }

  renderChips();
  render();
  updateFavCount();

  var search = document.getElementById('searchInput');
  if (search) {
    var searchTimer = null;
    search.addEventListener('input', function () {
      query = search.value.trim();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        resetVisible();
        render();
      }, 180);
    });
  }

  var favToggle = document.getElementById('favToggle');
  if (favToggle) {
    favToggle.addEventListener('click', function () {
      favOnly = !favOnly;
      favToggle.classList.toggle('chip-on', favOnly);
      resetVisible();
      render();
    });
  }

  /* toggle mode Foto / Video */
  var modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var m = btn.getAttribute('data-mode');
      if (m === mode) return;
      mode = m;
      activeCat = 'all';
      if (mode === 'video' && ratioKey === 'none') {
        ratioKey = '916';
        save('vanz-prompt-ratio', ratioKey);
        var rs = document.getElementById('ratioSelect');
        if (rs) rs.value = ratioKey;
      }
      modeBtns.forEach(function (b) {
        var on = b.getAttribute('data-mode') === mode;
        b.className = 'btn btn-sm ' + (on ? 'btn-primary' : 'btn-ghost');
      });
      resetVisible();
      renderChips();
      render();
    });
  });

  var randomBtn = document.getElementById('randomBtn');
  if (randomBtn) {
    randomBtn.addEventListener('click', showRandom);
  }

  var shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var items = filtered();
      if (!items.length) return toast('Tidak ada prompt untuk dibagikan');
      var text = items.slice(0, 10).map(function (p) { return fullPrompt(p); }).join('\n\n');
      if (navigator.share) {
        navigator.share({ title: 'Prompt AI Pasangan', text: text }).catch(function () {});
      } else {
        copyText(text, 'Prompt disalin — bagikan ke temanmu!');
      }
    });
  }

  var copyFavBtn = document.getElementById('copyFavBtn');
  if (copyFavBtn) {
    copyFavBtn.addEventListener('click', function () {
      var items = sourceScenes().filter(function (p) { return isFav(p.id); });
      if (!items.length) return toast('Belum ada prompt favorit');
      copyText(
        items.map(function (p) { return fullPrompt(p); }).join('\n\n'),
        items.length + ' prompt favorit disalin!'
      );
    });
  }

  var negativeBtn = document.getElementById('negativeBtn');
  if (negativeBtn) {
    negativeBtn.addEventListener('click', function () {
      copyText(currentNegative(), 'Negative prompt disalin!');
    });
  }

  var copyAllBtn = document.getElementById('copyAllBtn');
  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', function () {
      var items = filtered();
      if (!items.length) return toast('Tidak ada prompt untuk disalin');
      copyText(
        items.map(function (p) { return fullPrompt(p); }).join('\n\n'),
        items.length + ' prompt + negative disalin!'
      );
    });
  }

  var loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      visibleCount += pageSize();
      render();
    });
  }

  /* reveal header */
  var reveals = document.querySelectorAll('[data-reveal]');
  Array.prototype.forEach.call(reveals, function (el, i) {
    setTimeout(function () {
      el.classList.add('in');
    }, i * 90);
  });

  /* loader */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('done');
    }, 350);
  });
  /* fallback bila load lama */
  setTimeout(function () {
    var loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('done')) loader.classList.add('done');
  }, 3500);
})();
