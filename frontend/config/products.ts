import type { Product } from '@/types/commerce';

export const PRODUCTS: Product[] = [
  {
    id: 'biotin-gummies',
    slug: 'biotin-gummies',
    sku: 'SHF-BTN-001',
    arabicName: 'علكات البيوتين لدعم صحة الشعر',
    category: 'hair',
    headline: 'روتين يومي بسيط لشعر أقوى ومظهر أكثف',
    subheadline:
      'علكات البيوتين من الشفاء تساعدك تدعمي صحة شعرك من الداخل، بطعم سهل وروتين تقدري تلتزمي به يوميا.',
    defaultOffer: 3,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'argan-oil', priceDa: 999 },
    rating: 4.8,
    reviewCount: 124,
    scarcity: 'كمية محدودة من دفعة اليوم',
    crossSells: ['argan-oil', 'marine-collagen', 'shea-butter'],
    benefits: [
      'يدعم صحة الشعر من الداخل',
      'روتين يومي سهل الالتزام',
      'طعم محبب ومريح',
      'يساعد على تقوية الأظافر',
      'مكونات طبيعية مختارة',
    ],
    ingredients: ['بيوتين', 'فيتامين C', 'زنك', 'بانتوثينيك أسيد', 'فولات'],
    howToUse: 'تناولي علكتين يومياً مع وجبة الفطور أو في أي وقت من اليوم.',
    disclaimer:
      'هذا المنتج مكمل غذائي وليس دواء. يُنصح باستشارة الطبيب قبل الاستخدام في حالة الحمل أو الرضاعة.',
  },
  {
    id: 'marine-collagen',
    slug: 'marine-collagen',
    sku: 'SHF-MCL-002',
    arabicName: 'مشروب الكولاجين البحري لدعم نضارة البشرة',
    category: 'skin',
    headline: 'نضارة يومية ولمسة عناية من الداخل',
    subheadline:
      'مشروب كولاجين بحري لروتين جمال بسيط يساعد على دعم مرونة البشرة ومظهرها الصحي مع الاستعمال المنتظم.',
    defaultOffer: 3,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'shea-butter', priceDa: 999 },
    rating: 4.8,
    reviewCount: 98,
    scarcity: 'الأكثر طلبا هذا الأسبوع',
    crossSells: ['shea-butter', 'argan-oil', 'honey-with-nuts'],
    benefits: [
      'يساعد على دعم مرونة البشرة',
      'مشروب سهل التحضير',
      'مصدر طبيعي من البحر',
      'يدعم صحة الشعر والأظافر',
      'نتائج تدريجية مع الاستمرار',
    ],
    ingredients: ['كولاجين بحري', 'فيتامين C', 'حمض الهيالورونيك', 'زنك', 'بيوتين'],
    howToUse: 'أذيبي محتوى الكيس في كوب ماء أو عصير يومياً.',
    disclaimer:
      'هذا المنتج مكمل غذائي وليس دواء. يُنصح باستشارة الطبيب قبل الاستخدام.',
  },
  {
    id: 'honey-nuts',
    slug: 'honey-with-nuts',
    sku: 'SHF-HNY-003',
    arabicName: 'عسل بالمكسرات',
    category: 'food',
    headline: 'عسل بالمكسرات لطاقة طبيعية ولمّة عائلية',
    subheadline: 'مذاق غني، مكونات طبيعية، وإحساس بالشبع والطاقة مع الفطور.',
    defaultOffer: 2,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'sesame-seeds', priceDa: 999 },
    rating: 4.7,
    reviewCount: 87,
    scarcity: 'دفعة طازجة محدودة',
    crossSells: ['sesame-seeds', 'desert-herbs'],
    benefits: [
      'طاقة طبيعية من المكسرات',
      'مذاق غني يناسب الفطور',
      'مكونات طبيعية بدون إضافات',
      'مصدر جيد للمعادن',
      'مناسب للعائلة',
    ],
    ingredients: ['عسل طبيعي', 'لوز', 'جوز', 'فستق', 'بندق'],
    howToUse: 'تناول ملعقة أو ملعقتين مع الفطور أو كوجبة خفيفة في أي وقت.',
    disclaimer: 'غير مناسب للأطفال دون سن 3 سنوات. يُحفظ بعيداً عن الحرارة والرطوبة.',
  },
  {
    id: 'shea-butter',
    slug: 'shea-butter',
    sku: 'SHF-SHB-004',
    arabicName: 'زبدة الشيا',
    category: 'skin',
    headline: 'زبدة الشيا لعناية طبيعية بالبشرة',
    subheadline: 'ملمس غني وروتين بسيط للمناطق الجافة مثل اليدين والقدمين.',
    defaultOffer: 2,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'argan-oil', priceDa: 999 },
    rating: 4.7,
    reviewCount: 73,
    scarcity: 'متوفر بكمية محدودة',
    crossSells: ['argan-oil', 'marine-collagen'],
    benefits: [
      'يرطب البشرة الجافة بعمق',
      'ملمس غني وناعم',
      'مناسب لليدين والقدمين والوجه',
      'مكون طبيعي 100%',
      'خالي من الكيماويات الضارة',
    ],
    ingredients: ['زبدة الشيا الخام', 'فيتامين E', 'أحماض دهنية طبيعية'],
    howToUse: 'ضعي كمية صغيرة على المناطق الجافة ودليكيها بلطف حتى تتشرب.',
    disclaimer: 'للاستخدام الخارجي فقط. أجري اختبار حساسية قبل الاستخدام.',
  },
  {
    id: 'argan-oil',
    slug: 'argan-oil',
    sku: 'SHF-ARG-005',
    arabicName: 'زيت الأرغان',
    category: 'beauty',
    headline: 'زيت الأرغان لجمال الشعر والبشرة',
    subheadline:
      'قطرات قليلة تكفي لإضافة لمعة طبيعية للشعر ولمسة عناية للبشرة الجافة.',
    defaultOffer: 2,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'shea-butter', priceDa: 999 },
    rating: 4.8,
    reviewCount: 91,
    scarcity: 'الأكثر إضافة مع منتجات الشعر',
    crossSells: ['biotin-gummies', 'shea-butter'],
    benefits: [
      'يضفي لمعة طبيعية على الشعر',
      'يرطب البشرة الجافة',
      'قطرات قليلة تكفي',
      'مستخرج من أرغان المغرب',
      'يحمي الشعر من التكسر',
    ],
    ingredients: ['زيت الأرغان الخالص', 'فيتامين E', 'أحماض دهنية أوميغا'],
    howToUse:
      'ضعي 3-5 قطرات على راحة اليد ودليكيها على الشعر الرطب أو الجاف. للبشرة: قطرتان على المناطق الجافة.',
    disclaimer: 'للاستخدام الخارجي فقط. أجري اختبار حساسية قبل الاستخدام.',
  },
  {
    id: 'sesame-seeds',
    slug: 'sesame-seeds',
    sku: 'SHF-SES-006',
    arabicName: 'جلجلان طبيعي',
    category: 'food',
    headline: 'جلجلان طبيعي لغذاء يومي غني',
    subheadline:
      'إضافة بسيطة للأكل، العسل، أو الخلطات التقليدية بمذاق معروف في بيوتنا.',
    defaultOffer: 2,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'honey-with-nuts', priceDa: 999 },
    rating: 4.6,
    reviewCount: 55,
    scarcity: 'اختيار عائلي ممتاز',
    crossSells: ['honey-with-nuts', 'desert-herbs'],
    benefits: [
      'غني بالكالسيوم والمعادن',
      'يضاف للأكل والحلويات',
      'مذاق مألوف في البيوت الجزائرية',
      'مصدر طبيعي للطاقة',
      'يستعمل في الخلطات التقليدية',
    ],
    ingredients: ['جلجلان طبيعي مقشر', '100% نقي'],
    howToUse: 'أضف ملعقة للعسل، أو رشيه على الأكل، أو استخدمه في خلطاتك التقليدية.',
    disclaimer: 'يُحفظ في مكان بارد وجاف. قد يحتوي على آثار مكسرات.',
  },
  {
    id: 'desert-herbs',
    slug: 'desert-herbs',
    sku: 'SHF-HRB-007',
    arabicName: 'أعشاب الصحراء',
    category: 'herbs',
    headline: 'أعشاب مختارة بروح الصحراء',
    subheadline:
      'أعشاب طبيعية مختارة بعناية، مستوحاة من استعمالات تقليدية معروفة في بيوت الجزائر والصحراء.',
    defaultOffer: 2,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'honey-with-nuts', priceDa: 999 },
    rating: 4.7,
    reviewCount: 68,
    scarcity: 'كمية محدودة من دفعة اليوم',
    crossSells: ['honey-with-nuts', 'sesame-seeds'],
    benefits: [
      'أعشاب طبيعية مختارة',
      'استعمالات تقليدية موروثة',
      'رائحة عطرية أصيلة',
      'مجففة ومعبأة بعناية',
      'مناسبة للشاي والنقيع',
    ],
    ingredients: ['شيح', 'قيصوم', 'عرار', 'حلبة', 'يانسون'],
    howToUse: 'أضف ملعقة صغيرة إلى كوب ماء مغلي واتركه ينقع 5 دقائق.',
    disclaimer:
      'هذه الأعشاب للاستخدام العام. يُنصح باستشارة الطبيب في حالة الحمل أو الرضاعة.',
  },
  {
    id: 'ashwagandha',
    slug: 'ashwagandha',
    sku: 'SHF-ASH-008',
    arabicName: 'أشواغاندا طبيعية',
    category: 'herbs',
    headline: 'هدوء وتوازن في روتينك اليومي',
    subheadline:
      'نبتة معروفة في الاستعمال التقليدي، مناسبة لروتين مساء هادئ ومتوازن.',
    defaultOffer: 2,
    prices: { 1: 1999, 2: 2790, 3: 3490 },
    upsell: { slug: 'honey-with-nuts', priceDa: 999 },
    rating: 4.6,
    reviewCount: 61,
    scarcity: 'طلب مرتفع هذا الأسبوع',
    crossSells: ['honey-with-nuts', 'desert-herbs'],
    benefits: [
      'يدعم الهدوء والتوازن',
      'مناسب لروتين المساء',
      'مستخرج من نبتة طبيعية',
      'استعمال تقليدي موثق',
      'يساعد على روتين نوم صحي',
    ],
    ingredients: ['مستخلص أشواغاندا', 'جذور مجففة طبيعية'],
    howToUse:
      'تناول الكمية الموصى بها مساءً مع كوب حليب دافئ أو ماء.',
    disclaimer:
      'هذا المنتج مكمل غذائي وليس دواء. يُنصح باستشارة الطبيب قبل الاستخدام.',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCrossSellProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return product.crossSells
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}
