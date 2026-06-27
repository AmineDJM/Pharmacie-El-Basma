// Parapharmacie El Basma — Traductions (EN / AR) du catalogue et du contenu éditorial.
// Maps clés par slug, consommées par la couche i18n. Les noms de marques et de
// gammes déposées restent inchangés ; seuls les mots descriptifs sont traduits.
// Arabe = arabe standard moderne (MSA). Anglais = anglais marketing naturel.

// ---------------------------------------------------------------------------
// Catégories (parents avec description + sous-catégories nom seul).
// ---------------------------------------------------------------------------
export const categoryTranslations = {
  // --- Parents -------------------------------------------------------------
  'soin-du-visage': {
    en: { name: 'Facial Care', description: 'Cleansers, moisturisers, serums and anti-ageing care for radiant, protected skin.' },
    ar: { name: 'العناية بالوجه', description: 'منظفات ومرطبات وسيرومات وعناية مضادة للشيخوخة لبشرة مشرقة ومحمية.' },
  },
  'soin-du-corps': {
    en: { name: 'Body Care', description: 'Hydration, scrubs and targeted care to nourish and protect your skin every day.' },
    ar: { name: 'العناية بالجسم', description: 'ترطيب ومقشرات وعناية موجّهة لتغذية بشرتك وحمايتها يومياً.' },
  },
  'cheveux-cuir-chevelu': {
    en: { name: 'Hair & Scalp', description: 'Shampoos, masks and anti-hair-loss treatments for strong, healthy hair.' },
    ar: { name: 'الشعر وفروة الرأس', description: 'شامبوهات وأقنعة وعلاجات ضد تساقط الشعر لشعر قوي وصحي.' },
  },
  'bebe-maman': {
    en: { name: 'Baby & Mum', description: 'Everything for changing, washing and baby’s wellbeing, plus care for mum.' },
    ar: { name: 'الطفل والأم', description: 'كل ما يلزم لتغيير الحفاضات والاستحمام وراحة الطفل، ودعم الأم.' },
  },
  'complements-alimentaires': {
    en: { name: 'Food Supplements', description: 'Vitamins, minerals and supplements to support your vitality and balance.' },
    ar: { name: 'المكمّلات الغذائية', description: 'فيتامينات ومعادن ومكمّلات لدعم حيويتك وتوازنك.' },
  },
  'protection-solaire': {
    en: { name: 'Sun Protection', description: 'High-protection face and body care suited to the Algerian climate, plus after-sun.' },
    ar: { name: 'الحماية من الشمس', description: 'حماية عالية للوجه والجسم تناسب المناخ الجزائري، وعناية ما بعد الشمس.' },
  },
  'hygiene-quotidien': {
    en: { name: 'Hygiene & Daily Care', description: 'Body and oral hygiene plus deodorants for long-lasting freshness.' },
    ar: { name: 'النظافة والعناية اليومية', description: 'نظافة الجسم والفم ومزيلات العرق لانتعاش يدوم طويلاً.' },
  },
  'maquillage': {
    en: { name: 'Make-up', description: 'Dermatological complexion, lip and eye make-up that cares for your skin.' },
    ar: { name: 'مساحيق التجميل', description: 'مستحضرات تجميل للبشرة والشفاه والعيون تعتني ببشرتك.' },
  },
  'homme': {
    en: { name: 'Men', description: 'Shaving, facial care and hair care specially formulated for men.' },
    ar: { name: 'الرجال', description: 'حلاقة وعناية بالوجه وعناية بالشعر مصمّمة خصيصاً للرجال.' },
  },
  'parapharmacie-medicale': {
    en: { name: 'Medical Parapharmacy', description: 'First aid, orthopaedics, support and equipment for the whole family’s health.' },
    ar: { name: 'المستلزمات الطبية', description: 'إسعافات أولية وتقويم عظام ودعامات ومعدّات لصحة العائلة كاملة.' },
  },
  'bien-etre-aromatherapie': {
    en: { name: 'Wellbeing & Aromatherapy', description: 'Essential oils, herbal teas and natural solutions for your balance.' },
    ar: { name: 'العافية والعلاج بالروائح', description: 'زيوت أساسية وأعشاب طبيعية وحلول طبيعية لتوازنك.' },
  },
  'minceur-nutrition': {
    en: { name: 'Slimming & Nutrition', description: 'Slimming support, sports nutrition and meal replacements to reach your goals.' },
    ar: { name: 'التنحيف والتغذية', description: 'دعم التنحيف والتغذية الرياضية وبدائل الوجبات لتحقيق أهدافك.' },
  },

  // --- Sous-catégories : Soin du visage ------------------------------------
  'nettoyants-demaquillants': {
    en: { name: 'Cleansers & Make-up Removers' },
    ar: { name: 'منظفات ومزيلات المكياج' },
  },
  'cremes-hydratantes': {
    en: { name: 'Moisturising Creams' },
    ar: { name: 'كريمات مرطّبة' },
  },
  'serums-concentres': {
    en: { name: 'Serums & Concentrates' },
    ar: { name: 'سيرومات ومركّزات' },
  },
  'anti-age': {
    en: { name: 'Anti-ageing' },
    ar: { name: 'مضاد للشيخوخة' },
  },
  'contour-des-yeux': {
    en: { name: 'Eye Contour' },
    ar: { name: 'محيط العين' },
  },
  'masques-gommages': {
    en: { name: 'Masks & Scrubs' },
    ar: { name: 'أقنعة ومقشرات' },
  },

  // --- Sous-catégories : Soin du corps -------------------------------------
  'laits-cremes-corps': {
    en: { name: 'Body Lotions & Creams' },
    ar: { name: 'مستحضرات وكريمات الجسم' },
  },
  'gommages-exfoliants': {
    en: { name: 'Scrubs & Exfoliants' },
    ar: { name: 'مقشرات ومنتجات التقشير' },
  },
  'mains-pieds': {
    en: { name: 'Hands & Feet' },
    ar: { name: 'اليدان والقدمان' },
  },
  'vergetures-fermete': {
    en: { name: 'Stretch Marks & Firmness' },
    ar: { name: 'علامات التمدّد والشدّ' },
  },

  // --- Sous-catégories : Cheveux & cuir chevelu ----------------------------
  'shampoings': {
    en: { name: 'Shampoos' },
    ar: { name: 'شامبوهات' },
  },
  'masques-apres-shampoings': {
    en: { name: 'Masks & Conditioners' },
    ar: { name: 'أقنعة وبلسم' },
  },
  'anti-chute': {
    en: { name: 'Anti-Hair-Loss' },
    ar: { name: 'مضاد لتساقط الشعر' },
  },
  'antipelliculaire': {
    en: { name: 'Anti-Dandruff' },
    ar: { name: 'مضاد للقشرة' },
  },
  'colorations': {
    en: { name: 'Hair Colour' },
    ar: { name: 'صبغات الشعر' },
  },

  // --- Sous-catégories : Bébé & maman --------------------------------------
  'change-erytheme': {
    en: { name: 'Nappy Change & Rash' },
    ar: { name: 'تغيير الحفاض والتسلّخ' },
  },
  'toilette-bain': {
    en: { name: 'Washing & Bath' },
    ar: { name: 'التنظيف والاستحمام' },
  },
  'soin-hydratation-bebe': {
    en: { name: 'Baby Care & Hydration' },
    ar: { name: 'العناية بالطفل وترطيبه' },
  },
  'maman-grossesse': {
    en: { name: 'Mum & Pregnancy' },
    ar: { name: 'الأم والحمل' },
  },

  // --- Sous-catégories : Compléments alimentaires --------------------------
  'vitamines-mineraux': {
    en: { name: 'Vitamins & Minerals' },
    ar: { name: 'فيتامينات ومعادن' },
  },
  'immunite-vitalite': {
    en: { name: 'Immunity & Vitality' },
    ar: { name: 'المناعة والحيوية' },
  },
  'sommeil-stress': {
    en: { name: 'Sleep & Stress' },
    ar: { name: 'النوم والتوتر' },
  },
  'articulations-os': {
    en: { name: 'Joints & Bones' },
    ar: { name: 'المفاصل والعظام' },
  },
  'minceur-detox': {
    en: { name: 'Slimming & Detox' },
    ar: { name: 'التنحيف والتخلّص من السموم' },
  },

  // --- Sous-catégories : Protection solaire --------------------------------
  'solaire-visage': {
    en: { name: 'Face Sun Care' },
    ar: { name: 'واقي شمس للوجه' },
  },
  'solaire-corps': {
    en: { name: 'Body Sun Care' },
    ar: { name: 'واقي شمس للجسم' },
  },
  'apres-soleil': {
    en: { name: 'After-Sun' },
    ar: { name: 'ما بعد الشمس' },
  },
  'solaire-bebe-enfant': {
    en: { name: 'Baby & Child Sun Care' },
    ar: { name: 'واقي شمس للأطفال والرضّع' },
  },

  // --- Sous-catégories : Hygiène & quotidien -------------------------------
  'hygiene-bucco-dentaire': {
    en: { name: 'Oral Hygiene' },
    ar: { name: 'نظافة الفم والأسنان' },
  },
  'hygiene-corporelle': {
    en: { name: 'Body Hygiene' },
    ar: { name: 'نظافة الجسم' },
  },
  'deodorants': {
    en: { name: 'Deodorants' },
    ar: { name: 'مزيلات العرق' },
  },
  'hygiene-intime': {
    en: { name: 'Intimate Hygiene' },
    ar: { name: 'النظافة الحميمة' },
  },

  // --- Sous-catégories : Maquillage ----------------------------------------
  'teint': {
    en: { name: 'Complexion' },
    ar: { name: 'كريم الأساس' },
  },
  'levres': {
    en: { name: 'Lips' },
    ar: { name: 'الشفاه' },
  },
  'yeux': {
    en: { name: 'Eyes' },
    ar: { name: 'العيون' },
  },
  'ongles': {
    en: { name: 'Nails' },
    ar: { name: 'الأظافر' },
  },

  // --- Sous-catégories : Homme ---------------------------------------------
  'rasage-barbe': {
    en: { name: 'Shaving & Beard' },
    ar: { name: 'الحلاقة واللحية' },
  },
  'soin-visage-homme': {
    en: { name: 'Men’s Facial Care' },
    ar: { name: 'العناية بوجه الرجل' },
  },
  'cheveux-corps-homme': {
    en: { name: 'Men’s Hair & Body' },
    ar: { name: 'شعر وجسم الرجل' },
  },

  // --- Sous-catégories : Parapharmacie médicale ----------------------------
  'premiers-soins': {
    en: { name: 'First Aid' },
    ar: { name: 'الإسعافات الأولية' },
  },
  'orthopedie-contention': {
    en: { name: 'Orthopaedics & Support' },
    ar: { name: 'تقويم العظام والدعامات' },
  },
  'tension-diabete': {
    en: { name: 'Blood Pressure & Diabetes' },
    ar: { name: 'ضغط الدم والسكري' },
  },
  'materiel-medical': {
    en: { name: 'Medical Equipment' },
    ar: { name: 'المعدّات الطبية' },
  },

  // --- Sous-catégories : Bien-être & aromathérapie -------------------------
  'huiles-essentielles': {
    en: { name: 'Essential Oils' },
    ar: { name: 'الزيوت الأساسية' },
  },
  'tisanes-infusions': {
    en: { name: 'Herbal Teas & Infusions' },
    ar: { name: 'الأعشاب والمنقوعات' },
  },
  'complements-naturels': {
    en: { name: 'Natural Supplements' },
    ar: { name: 'مكمّلات طبيعية' },
  },

  // --- Sous-catégories : Minceur & nutrition -------------------------------
  'brule-graisses-drainage': {
    en: { name: 'Fat Burners & Drainage' },
    ar: { name: 'حارقات الدهون والتصريف' },
  },
  'substituts-de-repas': {
    en: { name: 'Meal Replacements' },
    ar: { name: 'بدائل الوجبات' },
  },
  'nutrition-sportive': {
    en: { name: 'Sports Nutrition' },
    ar: { name: 'التغذية الرياضية' },
  },
};

// ---------------------------------------------------------------------------
// Produits (name + shortDescription). Marques et gammes inchangées.
// ---------------------------------------------------------------------------
export const productTranslations = {
  // --- Soin du visage ------------------------------------------------------
  'eau-micellaire-sensibio-h2o-500ml': {
    en: { name: 'Sensibio H2O Micellar Water 500ml', shortDescription: 'Iconic micellar make-up remover for sensitive skin; cleanses gently with no rinsing.' },
    ar: { name: 'ماء ميسيلار Sensibio H2O 500ml', shortDescription: 'مزيل مكياج ميسيلار أيقوني للبشرة الحساسة، ينظّف بلطف دون شطف.' },
  },
  'gel-moussant-purifiant-effaclar-400ml': {
    en: { name: 'Effaclar Purifying Foaming Gel 400ml', shortDescription: 'Foaming cleanser for oily, blemish-prone skin; purifies without drying out.' },
    ar: { name: 'جل رغوي منقّي Effaclar 400ml', shortDescription: 'منظّف رغوي للبشرة الدهنية المعرّضة للشوائب، ينقّي دون أن يجفّف.' },
  },
  'hydrabio-creme-hydratante-40ml': {
    en: { name: 'Hydrabio Moisturising Cream 40ml', shortDescription: 'Long-lasting moisturising care for dehydrated skin, with an instant glow.' },
    ar: { name: 'كريم مرطّب Hydrabio 40ml', shortDescription: 'عناية مرطّبة طويلة الأمد للبشرة الجافة، مع إشراقة فورية.' },
  },
  'toleriane-sensitive-creme-40ml': {
    en: { name: 'Tolériane Sensitive Cream 40ml', shortDescription: 'Soothing prebiotic care for sensitive skin; reinforces the skin barrier.' },
    ar: { name: 'كريم Tolériane Sensitive 40ml', shortDescription: 'عناية مهدّئة بالبريبايوتيك للبشرة الحساسة، تقوّي حاجز البشرة.' },
  },
  'serum-vitamine-c-pure-30ml': {
    en: { name: 'Pure Vitamin C Serum 30ml', shortDescription: 'Antioxidant radiance concentrate that evens the complexion and smooths the skin.' },
    ar: { name: 'سيروم فيتامين C النقي 30ml', shortDescription: 'مركّز مضاد للأكسدة يوحّد لون البشرة ويُنعّمها ويمنحها الإشراق.' },
  },
  'hyalu-b5-serum-repulpant-30ml': {
    en: { name: 'Hyalu B5 Plumping Serum 30ml', shortDescription: 'Pure hyaluronic acid and vitamin B5 to plump and repair the skin.' },
    ar: { name: 'سيروم Hyalu B5 المالئ 30ml', shortDescription: 'حمض الهيالورونيك النقي وفيتامين B5 لملء البشرة وإصلاحها.' },
  },
  'liftactiv-collagen-specialist-50ml': {
    en: { name: 'Liftactiv Collagen Specialist 50ml', shortDescription: 'Comprehensive anti-ageing care that corrects wrinkles and firmness for younger-looking skin.' },
    ar: { name: 'Liftactiv Collagen Specialist 50ml', shortDescription: 'عناية شاملة مضادة للشيخوخة تصحّح التجاعيد وتشدّ البشرة لمظهر أكثر شباباً.' },
  },
  'time-filler-creme-anti-rides-50ml': {
    en: { name: 'Time-Filler Anti-Wrinkle Cream 50ml', shortDescription: 'Absolute multi-correction wrinkle care inspired by aesthetic medicine.' },
    ar: { name: 'كريم Time-Filler المضاد للتجاعيد 50ml', shortDescription: 'عناية مطلقة متعدّدة التصحيح للتجاعيد مستوحاة من طب التجميل.' },
  },
  'contour-des-yeux-aquapower-15ml': {
    en: { name: 'Aquapower Eye Contour 15ml', shortDescription: 'Energising eye care that revives and hydrates the eye contour.' },
    ar: { name: 'محيط العين Aquapower 15ml', shortDescription: 'عناية منشّطة للعين تزيل التعب وترطّب محيط العين.' },
  },
  'masque-hydratant-hydrance-50ml': {
    en: { name: 'Hydrance Moisturising Mask 50ml', shortDescription: 'Thirst-quenching cream mask for plumped, soothed skin.' },
    ar: { name: 'قناع مرطّب Hydrance 50ml', shortDescription: 'قناع كريمي مرطّب لبشرة ممتلئة ومهدّأة.' },
  },

  // --- Soin du corps -------------------------------------------------------
  'lait-hydratant-lipikar-lait-400ml': {
    en: { name: 'Lipikar Lait Moisturising Milk 400ml', shortDescription: 'Anti-dryness relipidating milk for dry skin of the body and face.' },
    ar: { name: 'حليب مرطّب Lipikar Lait 400ml', shortDescription: 'حليب معيد للدهون مضاد للجفاف لبشرة الجسم والوجه الجافة.' },
  },
  'cold-cream-corps-nourrissant-400ml': {
    en: { name: 'Cold Cream Nourishing Body Care 400ml', shortDescription: 'Intense nourishing care for very dry skin, with immediate comfort.' },
    ar: { name: 'كولد كريم مغذٍّ للجسم 400ml', shortDescription: 'عناية مغذّية مكثّفة للبشرة شديدة الجفاف، براحة فورية.' },
  },
  'gcommage-corps-energisant-200ml': {
    en: { name: 'Energising Body Scrub 200ml', shortDescription: 'Melting sugar-grain scrub for soft, glowing skin.' },
    ar: { name: 'مقشّر منشّط للجسم 200ml', shortDescription: 'مقشّر ذائب بحبيبات السكر لبشرة ناعمة ومشرقة.' },
  },
  'creme-mains-reparatrice-50ml': {
    en: { name: 'Repairing Hand Cream 50ml', shortDescription: 'Concentrated care that repairs very dry hands from the first application.' },
    ar: { name: 'كريم يدين مُصلِح 50ml', shortDescription: 'عناية مركّزة تُصلح اليدين شديدتي الجفاف من أول استخدام.' },
  },
  'huile-vergetures-bi-oil-200ml': {
    en: { name: 'Bi-Oil Stretch Mark Oil 200ml', shortDescription: 'Specialised care to reduce the appearance of stretch marks and scars.' },
    ar: { name: 'زيت علامات التمدّد Bi-Oil 200ml', shortDescription: 'عناية متخصّصة لتخفيف مظهر علامات التمدّد والندوب.' },
  },

  // --- Cheveux -------------------------------------------------------------
  'shampoing-doux-frequence-400ml': {
    en: { name: 'Fréquence Gentle Shampoo 400ml', shortDescription: 'Oat-based shampoo for frequent use, suitable for all hair types.' },
    ar: { name: 'شامبو لطيف Fréquence 400ml', shortDescription: 'شامبو بالشوفان للاستخدام المتكرّر، يناسب جميع أنواع الشعر.' },
  },
  'shampoing-anti-chute-anaphase-200ml': {
    en: { name: 'Anaphase+ Anti-Hair-Loss Shampoo 200ml', shortDescription: 'Shampoo to complement anti-hair-loss treatments; strengthens and adds volume.' },
    ar: { name: 'شامبو ضد التساقط Anaphase+ 200ml', shortDescription: 'شامبو مكمّل لعلاجات تساقط الشعر، يقوّي ويمنح كثافة.' },
  },
  'masque-nutritif-cheveux-secs-200ml': {
    en: { name: 'Nourishing Mask for Dry Hair 200ml', shortDescription: 'Repairing mango mask that nourishes dry, damaged hair.' },
    ar: { name: 'قناع مغذٍّ للشعر الجاف 200ml', shortDescription: 'قناع مُصلِح بالمانجو يغذّي الشعر الجاف والتالف.' },
  },
  'shampoing-antipelliculaire-squanorm-200ml': {
    en: { name: 'Squanorm Anti-Dandruff Shampoo 200ml', shortDescription: 'Removes dry dandruff and soothes an itchy scalp.' },
    ar: { name: 'شامبو ضد القشرة Squanorm 200ml', shortDescription: 'يزيل القشرة الجافة ويهدّئ فروة الرأس المتهيّجة.' },
  },
  'serum-anti-chute-triphasic-3x40ml': {
    en: { name: 'Triphasic Anti-Hair-Loss Serum 3x40ml', shortDescription: 'Intensive anti-hair-loss treatment that targets the causes of hair loss.' },
    ar: { name: 'سيروم ضد التساقط Triphasic 3x40ml', shortDescription: 'علاج مكثّف ضد التساقط يستهدف أسباب تساقط الشعر.' },
  },

  // --- Bébé & maman --------------------------------------------------------
  'liniment-oleo-calcaire-500ml': {
    en: { name: 'Oleo-Calcareous Liniment 500ml', shortDescription: 'Gently cleanses baby’s bottom and helps prevent nappy rash.' },
    ar: { name: 'لينيمنت زيتي كلسي 500ml', shortDescription: 'ينظّف مؤخّرة الطفل بلطف ويساعد على الوقاية من التسلّخ.' },
  },
  'creme-change-1-2-3-100ml': {
    en: { name: '1 2 3 Nappy Change Cream 100ml', shortDescription: 'Protective care that soothes and repairs redness in the nappy area.' },
    ar: { name: 'كريم الحفاض 1 2 3 بحجم 100ml', shortDescription: 'عناية واقية تهدّئ احمرار منطقة الحفاض وتُصلحه.' },
  },
  'gel-lavant-bebe-corps-cheveux-500ml': {
    en: { name: 'Baby Body & Hair Cleansing Gel 500ml', shortDescription: 'Gentle soap-free cleansing gel for baby’s body and hair.' },
    ar: { name: 'جل غسول للطفل للجسم والشعر 500ml', shortDescription: 'جل غسول لطيف خالٍ من الصابون لجسم الطفل وشعره.' },
  },
  'creme-hydratante-bebe-cold-cream-50ml': {
    en: { name: 'Baby Cold Cream Moisturiser 50ml', shortDescription: 'Nourishes and protects baby’s dry, fragile skin.' },
    ar: { name: 'كريم مرطّب للطفل Cold Cream 50ml', shortDescription: 'يغذّي ويحمي بشرة الطفل الجافة والرقيقة.' },
  },
  'vergetures-creme-prevention-maman-150ml': {
    en: { name: 'Mum Stretch Mark Prevention Cream 150ml', shortDescription: 'Sweet-almond oil-cream that helps preserve skin elasticity.' },
    ar: { name: 'كريم الوقاية من علامات التمدّد للأم 150ml', shortDescription: 'زيت-كريم باللوز الحلو يساعد على الحفاظ على مرونة البشرة.' },
  },

  // --- Compléments alimentaires --------------------------------------------
  'vitamine-d3-boite-30-capsules': {
    en: { name: 'Vitamin D3 Box of 30 Capsules', shortDescription: 'Supports immunity, bones and mood; ideal during the winter months.' },
    ar: { name: 'فيتامين D3 علبة 30 كبسولة', shortDescription: 'يدعم المناعة والعظام والمزاج، مثالي في فصل الشتاء.' },
  },
  'magnesium-marin-b6-60-gelules': {
    en: { name: 'Marine Magnesium + B6 60 Capsules', shortDescription: 'Reduces fatigue and stress; promotes relaxation and nervous balance.' },
    ar: { name: 'مغنيسيوم بحري + B6 بـ 60 كبسولة', shortDescription: 'يقلّل التعب والتوتر ويعزّز الاسترخاء والتوازن العصبي.' },
  },
  'multivitamines-vitalite-30-comprimes': {
    en: { name: 'Vitalité Multivitamins 30 Tablets', shortDescription: 'Complete vitamin and mineral complex for a daily boost.' },
    ar: { name: 'مالتي فيتامين Vitalité بـ 30 قرص', shortDescription: 'مركّب كامل من الفيتامينات والمعادن لدفعة طاقة يومية.' },
  },
  'omega-3-1000mg-60-capsules': {
    en: { name: 'Omega-3 1000mg 60 Capsules', shortDescription: 'Essential fatty acids for the heart, brain and vision.' },
    ar: { name: 'أوميغا-3 1000mg بـ 60 كبسولة', shortDescription: 'أحماض دهنية أساسية للقلب والدماغ والبصر.' },
  },
  'collagene-articulations-30-sticks': {
    en: { name: 'Joint Collagen 30 Sticks', shortDescription: 'Joint comfort and suppleness thanks to collagen and vitamin C.' },
    ar: { name: 'كولاجين للمفاصل 30 ظرفاً', shortDescription: 'راحة ومرونة للمفاصل بفضل الكولاجين وفيتامين C.' },
  },
  'fer-vitamine-b9-30-comprimes': {
    en: { name: 'Iron + Vitamin B9 30 Tablets', shortDescription: 'Fights fatigue linked to iron deficiency and supports vitality.' },
    ar: { name: 'حديد + فيتامين B9 بـ 30 قرص', shortDescription: 'يكافح التعب المرتبط بنقص الحديد ويدعم الحيوية.' },
  },
  'probiotiques-flore-intestinale-30-gelules': {
    en: { name: 'Gut Flora Probiotics 30 Capsules', shortDescription: 'Rebalances the gut flora and supports natural defences.' },
    ar: { name: 'بروبيوتيك للفلورا المعوية 30 كبسولة', shortDescription: 'يعيد توازن الفلورا المعوية ويدعم الدفاعات الطبيعية.' },
  },

  // --- Solaire -------------------------------------------------------------
  'anthelios-uvmune-fluide-spf50-50ml': {
    en: { name: 'Anthelios UVMune Fluid SPF50+ 50ml', shortDescription: 'Very high invisible facial protection, ideal for the Algerian climate.' },
    ar: { name: 'Anthelios UVMune سائل SPF50+ 50ml', shortDescription: 'حماية عالية جداً وغير مرئية للوجه، مثالية للمناخ الجزائري.' },
  },
  'lait-solaire-spf50-corps-200ml': {
    en: { name: 'Body Sun Milk SPF50+ 200ml', shortDescription: 'Very high water-resistant protection for the whole family.' },
    ar: { name: 'حليب واقٍ من الشمس للجسم SPF50+ 200ml', shortDescription: 'حماية عالية جداً مقاومة للماء لجميع أفراد العائلة.' },
  },
  'spray-solaire-enfant-spf50-200ml': {
    en: { name: 'Children’s Sun Spray SPF50+ 200ml', shortDescription: 'Easy-to-apply child photoprotection with high tolerance.' },
    ar: { name: 'بخّاخ واقٍ من الشمس للأطفال SPF50+ 200ml', shortDescription: 'حماية ضوئية للأطفال سهلة التطبيق وعالية التحمّل.' },
  },
  'apres-soleil-hydratant-400ml': {
    en: { name: 'Moisturising After-Sun 400ml', shortDescription: 'Prolongs the tan and soothes the skin after sun exposure.' },
    ar: { name: 'مرطّب ما بعد الشمس 400ml', shortDescription: 'يطيل سمرة البشرة ويهدّئها بعد التعرّض للشمس.' },
  },

  // --- Hygiène -------------------------------------------------------------
  'dentifrice-quotidien-protection-75ml': {
    en: { name: 'Daily Protection Toothpaste 75ml', shortDescription: 'Effectively protects against dental plaque and cavities.' },
    ar: { name: 'معجون أسنان للحماية اليومية 75ml', shortDescription: 'يحمي بفعالية من البلاك والتسوّس.' },
  },
  'bain-de-bouche-sans-alcool-500ml': {
    en: { name: 'Alcohol-Free Mouthwash 500ml', shortDescription: 'Soothes and cleanses the mouth for long-lasting fresh breath.' },
    ar: { name: 'غسول فم خالٍ من الكحول 500ml', shortDescription: 'يهدّئ الفم وينظّفه لنفَس منعش يدوم طويلاً.' },
  },
  'gel-douche-surgras-dermatologique-500ml': {
    en: { name: 'Superfatted Dermatological Shower Gel 500ml', shortDescription: 'Cleanses while respecting the hydrolipidic film of sensitive skin.' },
    ar: { name: 'جل استحمام مغذٍّ بالدهون للبشرة 500ml', shortDescription: 'ينظّف مع احترام الطبقة الدهنية المائية للبشرة الحساسة.' },
  },
  'deodorant-soin-48h-roll-on-50ml': {
    en: { name: '48h Care Roll-on Deodorant 50ml', shortDescription: 'Long-lasting efficacy that respects sensitive, shaved skin.' },
    ar: { name: 'مزيل عرق كروي 48 ساعة 50ml', shortDescription: 'فعالية طويلة الأمد تحترم البشرة الحساسة والمحلوقة.' },
  },

  // --- Maquillage ----------------------------------------------------------
  'fond-de-teint-correcteur-dermablend-30ml': {
    en: { name: 'Dermablend Corrective Foundation 30ml', shortDescription: 'High 16h long-wear coverage; enhanced, SPF-protected skin.' },
    ar: { name: 'كريم أساس مصحّح Dermablend 30ml', shortDescription: 'تغطية عالية تدوم 16 ساعة لبشرة موحّدة ومحمية بعامل SPF.' },
  },
  'stick-levres-cicaplast-baume-75ml': {
    en: { name: 'Cicaplast Baume Lip Stick 7.5ml', shortDescription: 'Repairs and nourishes lips and dry areas; multi-purpose.' },
    ar: { name: 'بلسم شفاه Cicaplast Baume 7.5ml', shortDescription: 'يُصلح ويغذّي الشفاه والمناطق الجافة، متعدّد الاستعمالات.' },
  },
  'mascara-sensitif-yeux-sensibles': {
    en: { name: 'Sensitive Mascara for Sensitive Eyes', shortDescription: 'High-tolerance mascara for lens wearers and sensitive eyes.' },
    ar: { name: 'ماسكارا للعيون الحساسة', shortDescription: 'ماسكارا عالية التحمّل لمن يضعون العدسات وأصحاب العيون الحساسة.' },
  },

  // --- Homme ---------------------------------------------------------------
  'gel-de-rasage-peaux-sensibles-150ml': {
    en: { name: 'Sensitive Skin Shaving Gel 150ml', shortDescription: 'Smooth, comfortable shave that prevents razor burn and irritation.' },
    ar: { name: 'جل حلاقة للبشرة الحساسة 150ml', shortDescription: 'حلاقة انسيابية ومريحة تمنع حرق الشفرة والتهيّج.' },
  },
  'soin-hydratant-visage-homme-50ml': {
    en: { name: 'Men’s Facial Moisturiser 50ml', shortDescription: 'Hydrates, mattifies and revives men’s skin every day.' },
    ar: { name: 'مرطّب وجه للرجال 50ml', shortDescription: 'يرطّب ويمنح مظهراً غير لامع وينعش بشرة الرجل يومياً.' },
  },

  // --- Parapharmacie médicale ----------------------------------------------
  'thermometre-frontal-sans-contact': {
    en: { name: 'Contactless Forehead Thermometer', shortDescription: 'Fast, hygienic temperature reading; ideal for the whole family.' },
    ar: { name: 'ميزان حرارة جبهي بدون تلامس', shortDescription: 'قياس سريع وصحّي للحرارة، مثالي لكل أفراد العائلة.' },
  },
  'tensiometre-bras-automatique': {
    en: { name: 'Automatic Arm Blood Pressure Monitor', shortDescription: 'Reliable at-home blood pressure measurement with result memory.' },
    ar: { name: 'جهاز قياس ضغط الدم الآلي للذراع', shortDescription: 'قياس موثوق لضغط الدم في المنزل مع حفظ النتائج.' },
  },
  'bande-de-contention-cheville': {
    en: { name: 'Ankle Support Bandage', shortDescription: 'Holds and supports the ankle during minor sprains.' },
    ar: { name: 'رباط دعم للكاحل', shortDescription: 'يثبّت الكاحل ويدعمه عند الالتواءات الخفيفة.' },
  },
  'pansements-cicatrisants-assortis': {
    en: { name: 'Assorted Healing Plasters', shortDescription: 'Protection and healing for everyday minor wounds.' },
    ar: { name: 'لصقات شفائية متنوّعة', shortDescription: 'حماية والتئام للجروح الصغيرة اليومية.' },
  },

  // --- Bien-être & aromathérapie -------------------------------------------
  'huile-essentielle-lavande-vraie-10ml': {
    en: { name: 'True Lavender Essential Oil 10ml', shortDescription: 'Soothing and relaxing; promotes calm and restful sleep.' },
    ar: { name: 'زيت اللافندر الحقيقي الأساسي 10ml', shortDescription: 'مهدّئ ومريح، يعزّز الاسترخاء والنوم الهادئ.' },
  },
  'tisane-digestion-detente-20-sachets': {
    en: { name: 'Digestion & Relaxation Herbal Tea 20 Sachets', shortDescription: 'Plant infusion to aid digestion and relaxation.' },
    ar: { name: 'شاي أعشاب للهضم والاسترخاء 20 كيساً', shortDescription: 'منقوع نباتي يسهّل الهضم ويعزّز الاسترخاء.' },
  },
  'gummies-sommeil-melatonine-60u': {
    en: { name: 'Melatonin Sleep Gummies 60u', shortDescription: 'Helps reduce the time to fall asleep for restful nights.' },
    ar: { name: 'حلوى نوم بالميلاتونين 60 وحدة', shortDescription: 'يساعد على تقليل وقت الخلود إلى النوم لليالٍ مريحة.' },
  },

  // --- Minceur -------------------------------------------------------------
  'bruleur-de-graisses-xtraslim-120-gelules': {
    en: { name: 'XtraSlim Fat Burner 120 Capsules', shortDescription: 'Intensive slimming programme that targets fat and drains.' },
    ar: { name: 'حارق دهون XtraSlim بـ 120 كبسولة', shortDescription: 'برنامج تنحيف مكثّف يستهدف الدهون ويصرّف السوائل.' },
  },
  'substitut-de-repas-chocolat-10-sachets': {
    en: { name: 'Chocolate Meal Replacement 10 Sachets', shortDescription: 'Balanced high-protein meal to support weight loss.' },
    ar: { name: 'بديل وجبة بالشوكولاتة 10 أكياس', shortDescription: 'وجبة متوازنة عالية البروتين لدعم خسارة الوزن.' },
  },
};

// ---------------------------------------------------------------------------
// Articles "Conseils Santé" (title + excerpt).
// ---------------------------------------------------------------------------
export const articleTranslations = {
  'routine-soin-visage-type-peau': {
    en: {
      title: 'Facial Care Routine: Finding Yours by Skin Type',
      excerpt: 'Dry, oily, combination or sensitive skin: discover how to build a simple, effective facial care routine tailored to your real needs.',
    },
    ar: {
      title: 'روتين العناية بالوجه: اختياره وفق نوع بشرتك',
      excerpt: 'بشرة جافة أو دهنية أو مختلطة أو حساسة: اكتشف كيف تبني روتين عناية بالوجه بسيطاً وفعّالاً يناسب احتياجاتك الحقيقية.',
    },
  },
  'protection-solaire-spf-bons-gestes-algerie': {
    en: {
      title: 'Protecting Your Skin from the Sun in Algeria: SPF Ratings and Best Practices',
      excerpt: 'Under the Algerian sun, sun protection is not optional. SPF ratings, reapplication frequency, good habits: everything to protect your skin.',
    },
    ar: {
      title: 'حماية بشرتك من الشمس في الجزائر: معاملات SPF والعادات الصحيحة',
      excerpt: 'تحت الشمس الجزائرية، الحماية من الشمس ليست خياراً. معاملات SPF وتكرار التطبيق والعادات السليمة: كل ما يلزم لحماية بشرتك.',
    },
  },
  'soins-peau-bebe-essentiels': {
    en: {
      title: 'Caring for Baby’s Skin: The Essentials to Know',
      excerpt: 'Baby’s skin is thin and fragile. Bath, nappy change, hydration, suitable products: our essential tips to care for it gently.',
    },
    ar: {
      title: 'العناية ببشرة الطفل: الأساسيات التي يجب معرفتها',
      excerpt: 'بشرة الطفل رقيقة وحساسة. الاستحمام وتغيير الحفاض والترطيب والمنتجات المناسبة: نصائحنا الأساسية للعناية بها بلطف.',
    },
  },
  'complements-alimentaires-bien-choisir-besoins': {
    en: {
      title: 'Food Supplements: Choosing Well According to Your Needs',
      excerpt: 'Vitamins, iron, magnesium: faced with so many supplements, how do you choose what truly suits you? Our essential pointers.',
    },
    ar: {
      title: 'المكمّلات الغذائية: حسن الاختيار وفق احتياجاتك',
      excerpt: 'فيتامينات وحديد ومغنيسيوم: أمام وفرة المكمّلات الغذائية، كيف تختار ما يناسبك حقاً؟ إليك معاييرنا الأساسية.',
    },
  },
  'renforcer-immunite-naturellement-hiver': {
    en: {
      title: 'Boosting Your Immunity Naturally, Especially in Winter',
      excerpt: 'Sleep, diet, vitamin D: winter tests our defences. Discover how to support your immunity naturally every day.',
    },
    ar: {
      title: 'تعزيز مناعتك بشكل طبيعي، خاصة في الشتاء',
      excerpt: 'النوم والتغذية وفيتامين D: يضع الشتاء دفاعاتنا على المحكّ. اكتشف كيف تدعم مناعتك بشكل طبيعي يومياً.',
    },
  },
  'chute-cheveux-fortifier-cuir-chevelu': {
    en: {
      title: 'Hair Loss: How to Strengthen the Scalp',
      excerpt: 'Seasonal or more pronounced hair loss? Discover the common causes and the right steps to strengthen the scalp and limit shedding.',
    },
    ar: {
      title: 'تساقط الشعر: كيف تقوّي فروة الرأس',
      excerpt: 'تساقط موسمي أو أكثر وضوحاً؟ اكتشف الأسباب الشائعة والخطوات الصحيحة لتقوية فروة الرأس والحدّ من التساقط.',
    },
  },
};
