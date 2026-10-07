// =============================================================================
// CATÁLOGO DE PRODUTOS — SleepWell
// =============================================================================
// Ponto de integração futura: este array poderá ser substituído por uma
// chamada fetch() a um endpoint REST da sua plataforma de e-commerce
// ou sistema de estoque. Exemplo:
//   fetch('/api/produtos')
//     .then(r => r.json())
//     .then(data => { catalog = data; });
// =============================================================================

var catalog = [
  {
    id: 'p1',
    name: 'Colchão SleepFlex Solteiro',
    sizeCategory: 'Solteiro',
    size: 'Solteiro · 88x188 cm',
    firmness: 'Firme',
    height: '22 cm',
    oldPrice: 'De R$ 1.199,00',
    price: 'R$ 899,00',
    priceNum: 899,
    terms: '10x de R$ 89,90 sem juros',
    desc: 'Espuma D33 de alta densidade, excelente sustentação postural e tecido antialérgico respirável.',
    badge: 'Econômico',
    stars: '★★★★☆',
    gradient: 'linear-gradient(135deg,#132840 0%,#091320 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="34" width="100" height="24" rx="4" fill="#1b3a5c"/>
      <rect x="5" y="34" width="100" height="7" rx="3" fill="#2b5585"/>
      <rect x="5" y="41" width="100" height="3" fill="#18324f" opacity="0.6"/>
      <rect x="5" y="44" width="100" height="14" rx="3" fill="#102339"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#0b1725"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#0b1725"/>
      <rect x="8" y="24" width="94" height="12" rx="3" fill="#3b75b5" opacity="0.8"/>
      <text x="55" y="33" text-anchor="middle" font-size="7" fill="#cde4ff" font-family="Inter,sans-serif" font-weight="600">ESPUMA D33 FIRME</text>
    </svg>`
  },
  {
    id: 'p2',
    name: 'Colchão DreamZone Solteiro Pro',
    sizeCategory: 'Solteiro',
    size: 'Solteiro · 88x188 cm',
    firmness: 'Intermediário',
    height: '26 cm',
    oldPrice: 'De R$ 1.599,00',
    price: 'R$ 1.249,00',
    priceNum: 1249,
    terms: '12x de R$ 104,08 sem juros',
    desc: 'Molas ensacadas individuais com Pillow Top soft, alívio de pressão e zero transferência de vibração.',
    badge: 'Mais Vendido Solteiro',
    stars: '★★★★★',
    gradient: 'linear-gradient(135deg,#123826 0%,#081e13 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="32" width="100" height="26" rx="4" fill="#1b5237"/>
      <rect x="5" y="32" width="100" height="9" rx="3" fill="#297851"/>
      <rect x="5" y="40" width="100" height="3" fill="#16432d" opacity="0.6"/>
      <rect x="5" y="43" width="100" height="15" rx="3" fill="#0f2f1f"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#091c12"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#091c12"/>
      <rect x="8" y="22" width="94" height="12" rx="3" fill="#38a370" opacity="0.8"/>
      <text x="55" y="31" text-anchor="middle" font-size="7" fill="#d1fae5" font-family="Inter,sans-serif" font-weight="600">POCKET PILLOW SOFT</text>
    </svg>`
  },
  {
    id: 'p3',
    name: 'Colchão Comfort Plus Casal',
    sizeCategory: 'Casal',
    size: 'Casal · 138x188 cm',
    firmness: 'Intermediário',
    height: '28 cm',
    oldPrice: 'De R$ 2.499,00',
    price: 'R$ 1.899,00',
    priceNum: 1899,
    terms: '12x de R$ 158,25 sem juros',
    desc: 'Conforto intermediário, excelente suporte lombar e acabamento premium em malha belga importada.',
    badge: 'Mais Vendido Casal',
    stars: '★★★★★',
    gradient: 'linear-gradient(135deg,#1f2d4d 0%,#0f172a 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="30" width="100" height="28" rx="4" fill="#2a3d66"/>
      <rect x="5" y="30" width="100" height="9" rx="3" fill="#3d5891"/>
      <rect x="5" y="38" width="100" height="3" fill="#233355" opacity="0.6"/>
      <rect x="5" y="41" width="100" height="17" rx="3" fill="#18233b"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#0c121e"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#0c121e"/>
      <rect x="8" y="20" width="94" height="12" rx="3" fill="#5276c2" opacity="0.8"/>
      <text x="55" y="29" text-anchor="middle" font-size="7" fill="#e0e7ff" font-family="Inter,sans-serif" font-weight="600">MALHA BELGA &amp; MOLAS</text>
    </svg>`
  },
  {
    id: 'p4',
    name: 'Colchão Ortopedic Master Casal',
    sizeCategory: 'Casal',
    size: 'Casal · 138x188 cm',
    firmness: 'Firme',
    height: '25 cm',
    oldPrice: 'De R$ 1.899,00',
    price: 'R$ 1.449,00',
    priceNum: 1449,
    terms: '12x de R$ 120,75 sem juros',
    desc: 'Estrutura ortopédica reforçada com tecnologia de alinhamento espinhal para noites tranquilas e sem dores.',
    badge: 'Saúde da Coluna',
    stars: '★★★★☆',
    gradient: 'linear-gradient(135deg,#333538 0%,#1c1d1f 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="32" width="100" height="26" rx="4" fill="#44474b"/>
      <rect x="5" y="32" width="100" height="8" rx="3" fill="#5d6166"/>
      <rect x="5" y="39" width="100" height="3" fill="#36383b" opacity="0.6"/>
      <rect x="5" y="42" width="100" height="16" rx="3" fill="#282a2c"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#141516"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#141516"/>
      <rect x="8" y="22" width="94" height="12" rx="3" fill="#7a7f85" opacity="0.8"/>
      <text x="55" y="31" text-anchor="middle" font-size="7" fill="#f3f4f6" font-family="Inter,sans-serif" font-weight="600">ORTOPÉDICO REFORÇADO</text>
    </svg>`
  },
  {
    id: 'p5',
    name: 'Colchão CloudRest Confort Queen',
    sizeCategory: 'Queen',
    size: 'Queen · 158x198 cm',
    firmness: 'Macio',
    height: '32 cm',
    oldPrice: 'De R$ 3.199,00',
    price: 'R$ 2.490,00',
    priceNum: 2490,
    terms: '12x de R$ 207,50 sem juros',
    desc: 'Camada dupla de espuma viscoelástica Nasa com molas ensacadas e sensação relaxante de gravidade zero.',
    badge: 'Mais Desejado',
    stars: '★★★★★',
    gradient: 'linear-gradient(135deg,#133745 0%,#091d26 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="28" width="100" height="30" rx="4" fill="#1b4b5e"/>
      <rect x="5" y="28" width="100" height="10" rx="3" fill="#2b7391"/>
      <rect x="5" y="37" width="100" height="3" fill="#173f4f" opacity="0.6"/>
      <rect x="5" y="40" width="100" height="18" rx="3" fill="#102f3b"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#081920"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#081920"/>
      <rect x="8" y="17" width="94" height="13" rx="3" fill="#44a4cc" opacity="0.8"/>
      <text x="55" y="26" text-anchor="middle" font-size="7" fill="#e0f2fe" font-family="Inter,sans-serif" font-weight="600">VISCOELÁSTICO NASA</text>
    </svg>`
  },
  {
    id: 'p6',
    name: 'Colchão Royal Titanium Queen',
    sizeCategory: 'Queen',
    size: 'Queen · 158x198 cm',
    firmness: 'Intermediário',
    height: '30 cm',
    oldPrice: 'De R$ 2.899,00',
    price: 'R$ 2.190,00',
    priceNum: 2190,
    terms: '12x de R$ 182,50 sem juros',
    desc: 'Molas pocket de aço temperado com borda perimetral reforçada e malha refrescante com fios de bambu.',
    badge: 'Termo-Cool',
    stars: '★★★★★',
    gradient: 'linear-gradient(135deg,#232e3d 0%,#121921 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="29" width="100" height="29" rx="4" fill="#2d3d52"/>
      <rect x="5" y="29" width="100" height="10" rx="3" fill="#415775"/>
      <rect x="5" y="38" width="100" height="3" fill="#263445" opacity="0.6"/>
      <rect x="5" y="41" width="100" height="17" rx="3" fill="#1b2532"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#0e131a"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#0e131a"/>
      <rect x="8" y="18" width="94" height="13" rx="3" fill="#5c7aa3" opacity="0.8"/>
      <text x="55" y="27" text-anchor="middle" font-size="7" fill="#e2e8f0" font-family="Inter,sans-serif" font-weight="600">TITANIUM BAMBU COOL</text>
    </svg>`
  },
  {
    id: 'p7',
    name: 'Colchão LuxeSleep Pro King',
    sizeCategory: 'King',
    size: 'King · 193x203 cm',
    firmness: 'Intermediário',
    height: '35 cm',
    oldPrice: 'De R$ 4.799,00',
    price: 'R$ 3.890,00',
    priceNum: 3890,
    terms: '12x de R$ 324,17 sem juros',
    desc: 'Híbrido de látex natural com molas ensacadas de 7 zonas zonais, amplitude monumental e padrão 5 estrelas.',
    badge: 'Premium Hotel',
    stars: '★★★★★',
    gradient: 'linear-gradient(135deg,#311c47 0%,#180e24 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="26" width="100" height="32" rx="4" fill="#452764"/>
      <rect x="5" y="26" width="100" height="11" rx="3" fill="#643991"/>
      <rect x="5" y="36" width="100" height="3" fill="#3a2154" opacity="0.6"/>
      <rect x="5" y="39" width="100" height="19" rx="3" fill="#2a183d"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#140b1d"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#140b1d"/>
      <rect x="8" y="15" width="94" height="13" rx="3" fill="#884dc4" opacity="0.8"/>
      <text x="55" y="24" text-anchor="middle" font-size="7" fill="#f3e8ff" font-family="Inter,sans-serif" font-weight="600">LÁTEX NATURAL 7 ZONAS</text>
      <circle cx="94" cy="21" r="5" fill="#d4a843"/>
      <text x="94" y="24" text-anchor="middle" font-size="5" fill="#180e24" font-weight="bold">PRO</text>
    </svg>`
  },
  {
    id: 'p8',
    name: 'Colchão Grand Imperial King',
    sizeCategory: 'King',
    size: 'King · 193x203 cm',
    firmness: 'Firme',
    height: '34 cm',
    oldPrice: 'De R$ 4.299,00',
    price: 'R$ 3.390,00',
    priceNum: 3390,
    terms: '12x de R$ 282,50 sem juros',
    desc: 'Sustentação robusta para até 150 kg por pessoa, Euro Pillow de alta densidade e tratamento antiácaro total.',
    badge: 'Alta Resistência',
    stars: '★★★★★',
    gradient: 'linear-gradient(135deg,#3d2b17 0%,#20160b 100%)',
    svgBed: `<svg width="110" height="72" viewBox="0 0 110 72" fill="none">
      <rect x="5" y="27" width="100" height="31" rx="4" fill="#573d21"/>
      <rect x="5" y="27" width="100" height="10" rx="3" fill="#7a572f"/>
      <rect x="5" y="36" width="100" height="3" fill="#47311a" opacity="0.6"/>
      <rect x="5" y="39" width="100" height="19" rx="3" fill="#332413"/>
      <rect x="7" y="58" width="5" height="9" rx="2" fill="#181109"/>
      <rect x="98" y="58" width="5" height="9" rx="2" fill="#181109"/>
      <rect x="8" y="16" width="94" height="13" rx="3" fill="#a47743" opacity="0.8"/>
      <text x="55" y="25" text-anchor="middle" font-size="7" fill="#fef3c7" font-family="Inter,sans-serif" font-weight="600">EURO PILLOW EXTRA FIRME</text>
    </svg>`
  }
];

// Alias para compatibilidade com o restante do código
var products = catalog;
