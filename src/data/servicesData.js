const products = [
  {
    id: 1,
    name: "Facial",
    description: "Our signature facial is more than just a skin treatment — it’s a rejuvenating ritual. This deep-cleansing therapy begins with gentle steam to open pores, followed by thorough exfoliation to remove dead cells and impurities. A nourishing mask is applied to hydrate and replenish your skin, while a relaxing facial massage stimulates circulation, relieves tension, and leaves you with a natural, healthy glow. We use professional-grade products tailored to your skin type, ensuring that your complexion feels refreshed, supple, and radiantly youthful. Perfect for combating pollution damage, reducing dullness, and indulging in a well-deserved moment of self-care.",
    category: "Skin",
    time: 45,
    price: 1200,
    offerPrice: 899,
    image: "/assets/facial.jpg"
  },
  {
    id: 2,
    name: "Korean Glass Skin",
    description: "Experience the luxury of the coveted Korean “glass skin” effect with this multi-step treatment that delivers luminous, smooth, and flawlessly hydrated skin. The process includes double cleansing, gentle exfoliation, hydrating toners, nutrient-rich serums, and skin-soothing masks — all working in harmony to deeply nourish and restore skin health. Each step is carefully designed to enhance elasticity, improve skin tone, and give you that translucent, light-reflecting glow seen in K-beauty icons. Whether you have an upcoming event or simply want to pamper yourself, this treatment transforms tired, dull skin into a radiant masterpiece.",
    category: "Skin",
    time: 60,
    price: 2000,
    offerPrice: 1599,
    image: "/assets/hero2.jpg"
  },
  {
    id: 3,
    name: "Bleach",
    description: "Our professional bleach treatment is the quick confidence boost your skin deserves. It works by lightening facial and body hair, blending it seamlessly with your natural skin tone, and instantly reducing the appearance of tanning. The result is a brighter, more even complexion without harsh scrubbing or irritation. We use skin-safe formulas that are gentle yet effective, leaving your skin feeling smooth, fresh, and rejuvenated. Ideal for last-minute events, festive occasions, or simply when you want that instant brightness.",
    category: "Skin",
    time: 30,
    price: 500,
    offerPrice: 399,
    image: "/assets/bleach.jpg"
  },
  {
    id: 4,
    name: "Hair Style",
    description: "Turn heads wherever you go with a hairstyle crafted just for you. Whether you’re looking for an elegant updo for a wedding, bouncy curls for a date night, or a sleek, polished look for the office, our expert stylists blend creativity with precision to deliver your perfect style. We consider your hair texture, face shape, and outfit to ensure your look complements you completely. Using high-quality styling tools and professional hair products, we create results that not only look stunning but also hold up throughout the day (or night).",
    category: "Hair",
    time: 40,
    price: 800,
    offerPrice: 599,
    image: "/assets/hairStyle.jpg"
  },
  {
    id: 5,
    name: "Pre Bridal",
    description: "Your big day deserves nothing less than perfection — and our pre-bridal package ensures you’re picture-ready from head to toe. This indulgent session combines multiple treatments, including deep-cleansing facials for radiant skin, hair spa for silky tresses, body polishing for a smooth glow, and meticulous grooming for flawless detailing. We pamper you with care, reducing pre-wedding stress and enhancing your natural beauty so that you shine with confidence on your wedding day. Every treatment is customized to your skin type and personal preferences, making you feel relaxed, refreshed, and truly special.",
    category: "Bridal",
    time: 120,
    price: 3500,
    offerPrice: 2999,
    image: "/assets/prebridal.jpg"
  },
  {
    id: 6,
    name: "Makeup",
    description: "Transform your look and feel like the star of the evening with our professional makeup artistry. Whether it’s for a wedding, party, photoshoot, or special celebration, our certified makeup artists work with your skin tone, facial features, and personal style to create a flawless finish. We use high-quality, skin-friendly products that provide long-lasting coverage without feeling heavy. From natural and glowing to bold and glamorous, every brushstroke is precise, enhancing your beauty while keeping you comfortable. The experience also includes skin prep to ensure your makeup looks fresh and radiant for hours.",
    category: "Makeup",
    time: 90,
    price: 3000,
    offerPrice: 2499,
    image: "/assets/makeup.jpg"
  },
  {
    id: 7,
    name: "O3+ Adv. Facial",
    description: "A luxurious upgrade to the classic facial, this treatment harnesses the power of O3+ professional skincare products to deliver visible results in just one session. It begins with deep cleansing to remove impurities, followed by advanced exfoliation and serum infusion to target dullness, uneven tone, and early signs of aging. Rich in antioxidants and vitamins, the O3+ range nourishes your skin at a cellular level, leaving it brighter, smoother, and more youthful. The session also includes a gentle massage to relax facial muscles and promote healthy blood flow. Perfect before big events or whenever your skin needs a radiant revival.",
    category: "Skin",
    time: 60,
    price: 1800,
    offerPrice: 1499,
    image: "/assets/o3.jpg"
  },
  {
    id: 8,
    name: "De-Tan",
    description: "Say goodbye to stubborn sun tan and uneven skin tone with our effective de-tan treatment. Specially formulated to penetrate deep into the skin, it breaks down pigmentation caused by sun exposure while soothing and cooling the skin. The process gently exfoliates dead cells, revealing a lighter, fresher complexion underneath. Ideal for the face, arms, or other exposed areas, this treatment restores your skin’s natural radiance without harsh bleaching agents, leaving it smooth, even-toned, and well-hydrated.",
    category: "Skin",
    time: 30,
    price: 600,
    offerPrice: 499,
    image: "/assets/bodypolish.jpg"
  },
  {
    id: 9,
    name: "Threading",
    description: "Precision and artistry come together in our threading service to give you perfectly shaped brows and smooth skin. Using the ancient technique of cotton thread hair removal, we create clean lines that frame your face beautifully, while being gentle on sensitive skin. This method is chemical-free and suitable for all skin types, removing even the finest hair from the root for long-lasting results. In just a few minutes, you’ll notice the difference — more defined features, a polished look, and a boost of confidence.",
    category: "Skin",
    time: 15,
    price: 150,
    offerPrice: 99,
    image: "/assets/threading.jpg"
  },
  {
    id: 10,
    name: "RICA Wax",
    description: "Indulge in a smoother, more comfortable waxing experience with our premium RICA wax service. Made from natural, nourishing ingredients like vegetable oils and free from harsh chemicals, RICA wax is gentle on the skin while effectively removing hair from the root. It minimizes redness and irritation, making it ideal even for sensitive skin types. The process leaves your skin feeling silky, hydrated, and refreshed for weeks. Whether it’s a full body wax or specific areas, our skilled professionals ensure precision, hygiene, and a truly pampering experience.",
    category: "Skin",
    time: 60,
    price: 1300,
    offerPrice: 1099,
    image: "/assets/rica.jpg"
  },
  {
    id: 11,
    name: "Normal Wax",
    description: "Our classic full-body waxing service delivers silky-smooth skin that lasts for weeks. Using high-quality warm wax, we gently yet effectively remove hair from the root, leaving the skin soft and free from stubble. This method also exfoliates dead skin cells, enhancing your skin’s natural glow. Ideal for those who want a fuss-free, reliable hair removal solution, our process is quick, hygienic, and performed by trained professionals who ensure minimal discomfort. Perfect for keeping your skin event-ready at all times.",
    category: "Skin",
    time: 45,
    price: 1000,
    offerPrice: 799,
    image: "/assets/normalwax.jpg"
  },
  {
    id: 12,
    name: "Face Wax",
    description: "Designed specifically for the delicate skin on your face, this gentle waxing service removes fine hair from the cheeks, jawline, forehead, and neck. The process leaves your complexion smooth, bright, and makeup-ready, allowing foundation to blend flawlessly. Our premium wax formulas are chosen for their skin-soothing properties, ensuring that even sensitive skin feels calm and comfortable after the treatment. It’s the quickest way to achieve a polished, glowing look without irritation.",
    category: "Skin",
    time: 20,
    price: 400,
    offerPrice: 299,
    image: "/assets/facewax.jpg"
  },
  {
    id: 13,
    name: "Bikini Wax",
    description: "Experience the confidence of perfectly smooth skin with our hygienic and professional bikini waxing service. We use high-quality, skin-safe wax that removes hair efficiently while being gentle on sensitive areas. The treatment is carried out with the utmost discretion and care, ensuring your comfort and privacy at every step. Regular sessions can lead to finer, sparser hair growth, making maintenance easier over time. Whether you’re preparing for a beach holiday or simply want to feel fresh and confident, this service is tailored for you.",
    category: "Skin",
    time: 30,
    price: 700,
    offerPrice: 599,
    image: "/assets/normalwax.jpg"
  },
  {
    id: 14,
    name: "RICA Black",
    description: "This luxurious waxing treatment uses a unique charcoal-infused RICA wax formula that not only removes unwanted hair but also purifies the skin. The activated charcoal works as a deep cleanser, drawing out impurities while the nourishing oils hydrate and protect. Gentle yet powerful, RICA Black wax is especially effective for coarse or stubborn hair and leaves skin incredibly smooth with a healthy glow. It’s a premium choice for those who want hair removal combined with skin care benefits in one treatment.",
    category: "Skin",
    time: 60,
    price: 1400,
    offerPrice: 1199,
    image: "/assets/rica.jpg"
  },
  {
    id: 15,
    name: "Hair Cut",
    description: "Transform your look with a professional haircut tailored specifically to your unique facial structure, hair texture, and lifestyle. In this 30-minute session, our expert stylists begin with a style consultation to understand your preferences and desired outcome. We use precision cutting techniques to create a shape that not only complements your face but also works effortlessly with your hair’s natural movement. Whether you’re seeking a bold transformation, a refreshing trim, or a timeless classic cut, every detail is handled with care to ensure you leave with a style that’s both flattering and easy to maintain.",
    category: "Hair",
    time: 30,
    price: 600,
    offerPrice: 499,
    image: "/assets/haircut.jpg"
  },
  {
    id: 16,
    name: "Pedicure",
    description: "Indulge in a 40-minute pedicure that blends relaxation with professional foot care. Begin with a warm, aromatic foot soak that softens skin and melts away tension. This is followed by gentle exfoliation to remove dead skin cells and calluses, restoring smoothness to your feet. Our skilled therapist then provides a stress-relieving foot and calf massage to improve circulation and release muscle tightness. Nail care includes careful trimming, shaping, and cuticle treatment, finished with your choice of polish or a natural buff. The result is beautifully refreshed feet that feel as good as they look.",
    category: "Nails",
    time: 40,
    price: 700,
    offerPrice: 599,
    image: "/assets/pedicure.jpg"
  },
  {
    id: 17,
    name: "Manicure",
    description: "Experience the ultimate in hand and nail care with our 40-minute manicure. The treatment begins with a warm soak to soften skin, followed by gentle exfoliation to smooth roughness and remove impurities. Nails are expertly shaped, and cuticles are tidied for a polished appearance. A hydrating hand massage follows, leaving your skin nourished and silky. Choose from a curated selection of high-quality polishes for a flawless finish, or opt for a natural shine. Perfect for maintaining healthy, beautiful hands that make a lasting impression.",
    category: "Nails",
    time: 40,
    price: 700,
    offerPrice: 599,
    image: "/assets/manicure.jpg"
  },
  {
    id: 18,
    name: "Hair Spa",
    description: "This 45-minute hair spa treatment is a rejuvenating ritual designed to restore health, softness, and shine to tired, damaged, or frizzy hair. We begin with a gentle scalp massage using nutrient-rich oils or masks that stimulate blood circulation, encourage hair growth, and deeply nourish the roots. This is followed by a steam treatment that allows essential ingredients to penetrate deeply into the hair shaft, repairing dryness and damage from within. The session concludes with a hydrating rinse and expert blow-dry, leaving your hair looking silky, smooth, and vibrant with renewed life.",
    category: "Hair",
    time: 45,
    price: 1000,
    offerPrice: 799,
    image: "/assets/hairspa.jpg"
  },
  {
    id: 19,
    name: "Massage",
    description: "Immerse yourself in a deeply soothing 60-minute full-body massage designed to melt away stress, tension, and fatigue. Using a combination of long, flowing strokes, gentle kneading, and targeted pressure techniques, our therapist works to improve blood circulation, release muscle stiffness, and restore your body’s natural balance. Warm aromatic oils enhance the experience, relaxing your mind while nourishing your skin. Whether you’re seeking pure relaxation or relief from sore muscles, this massage leaves you feeling lighter, calmer, and completely revitalized.",
    category: "Body",
    time: 60,
    price: 1500,
    offerPrice: 1199,
    image: "/assets/massage.jpg"
  },
  {
    id: 20,
    name: "Hair Straightening",
    description: "Achieve effortlessly smooth, sleek, and frizz-free hair that lasts for weeks with our 90-minute professional hair straightening service. We use high-quality, ammonia-free products that are gentle on your hair while delivering long-lasting results. The process begins with a thorough cleanse to remove impurities, followed by expert application of the straightening formula and precise heat sealing to lock in smoothness. Your hair is then finished with a nourishing serum that adds shine and protects from future damage. Ideal for those who want a polished, low-maintenance style with minimal daily effort.",
    category: "Hair",
    time: 90,
    price: 2500,
    offerPrice: 2199,
    image: "/assets/haircut.jpg"
  },
  {
    id: 21,
    name: "Hair Color",
    description: "Transform your look with vibrant, multidimensional hair color applied by expert stylists in this 75-minute session. We begin with a personalized color consultation to determine the perfect shade for your skin tone, personality, and lifestyle. Using only premium, ammonia-free products, we ensure rich pigmentation while maintaining hair health. Whether you’re looking for subtle highlights, bold fashion colors, or complete coverage, our application technique ensures even results with a luminous finish. Every coloring session concludes with a nourishing mask to seal in shine and softness.",
    category: "Hair",
    time: 75,
    price: 2000,
    offerPrice: 1799,
    image: "/assets/hairStyle.jpg"
  },
  {
    id: 22,
    name: "Back Facial Body Polishing",
    description: "In this 50-minute rejuvenating treatment, your back and body receive the care they deserve. We begin with a gentle cleansing to remove impurities, followed by a customized exfoliation that polishes away dull, dead skin cells. A brightening mask is applied to enhance skin clarity, while a relaxing back massage eases tension and improves circulation. The treatment concludes with a deep hydration step, leaving your skin smooth, supple, and visibly more radiant. Perfect before special occasions or for a confidence boost in your favorite outfits.",
    category: "Body",
    time: 50,
    price: 1600,
    offerPrice: 1399,
    image: "/assets/bodypolish.jpg"
  },
  {
    id: 23,
    name: "Saree Draping",
    description: "Step into sophistication with our 25-minute professional saree draping service, designed to ensure every pleat, tuck, and fold is perfectly in place. Whether it’s for a wedding, festive celebration, or formal event, our experts style your saree to complement your body shape and the occasion’s mood. We work with all saree fabrics—silk, chiffon, georgette, cotton—and can create both traditional and contemporary drapes. The result is a graceful, comfortable fit that stays flawless throughout your event, so you can move with confidence and poise.",
    category: "Bridal",
    time: 25,
    price: 500,
    offerPrice: 399,
    image: "/assets/saree.jpg"
  },
];

export default products;
