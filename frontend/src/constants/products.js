import butacaNordica from '../assets/images/products/butaca-nordica.jpg';
import butacaSevilla from '../assets/images/products/butaca-sevilla.jpg';
import butacaSevillaRodero from '../assets/images/products/butaca-sevilla-rodero.jpg';

// id, name and price must stay in sync with backend/app/services/product_service.py,
// which validates every checkout line against its own catalog.
export const products = [
  {
    id: 'butaca-nordica-oslo',
    slug: 'butaca-nordica-oslo',
    name: 'Butaca Nórdica Oslo',
    category: 'Butaca',
    price: 249,
    tone: 'rose',
    purchasable: true,
    image: butacaNordica,
    imageAlt: 'Butaca Nórdica Oslo en tono suave con patas de madera',
    shortDescription: 'Una butaca ligera y elegante para salones serenos y rincones de lectura.',
    description:
      'La Butaca Nórdica Oslo combina líneas suaves, patas de madera y un tapizado amable para crear una pieza luminosa, cómoda y muy fácil de integrar en interiores contemporáneos.',
    materials: ['Tapizado textil suave', 'Estructura interior reforzada', 'Patas de madera natural'],
    dimensions: '82 x 74 x 90 cm',
    style: 'Nórdico moderno',
    availability: 'Disponible bajo pedido',
    features: ['Respaldo envolvente', 'Asiento firme y confortable', 'Ideal para salón, dormitorio o estudio'],
  },
  {
    id: 'sillon-relax-premium',
    slug: 'sillon-relax-premium',
    name: 'Sillón Relax Premium',
    category: 'Sillón',
    price: 499,
    tone: 'plum',
    purchasable: true,
    image: butacaSevillaRodero,
    imageAlt: 'Sillón Relax Premium tapizado en tono malva',
    shortDescription: 'Un sillón de apoyo generoso pensado para el descanso y una presencia premium.',
    description:
      'El Sillón Relax Premium aporta una postura cómoda, un volumen elegante y una silueta envolvente, perfecta para espacios donde el confort debe ir unido a una imagen cuidada.',
    materials: ['Tapizado premium', 'Base estructural de alta resistencia', 'Apoyabrazos acolchados'],
    dimensions: '88 x 82 x 103 cm',
    style: 'Relax contemporáneo',
    availability: 'Entrega estimada en 7 días',
    features: ['Asiento amplio', 'Apoyabrazos redondeados', 'Presencia elegante para estancias principales'],
  },
  {
    id: 'butaca-vintage-retro',
    slug: 'butaca-vintage-retro',
    name: 'Butaca Vintage Retro',
    category: 'Butaca',
    price: 199,
    tone: 'wine',
    purchasable: true,
    image: butacaSevilla,
    imageAlt: 'Butaca Vintage Retro en color burdeos',
    shortDescription: 'Una pieza con carácter cálido para ambientes clásicos y acogedores.',
    description:
      'La Butaca Vintage Retro reinterpreta formas tradicionales con una presencia sobria y un color intenso que eleva la estancia sin perder la sensación de hogar.',
    materials: ['Tapizado aterciopelado', 'Bastidor compacto', 'Patas de madera oscura'],
    dimensions: '80 x 78 x 106 cm',
    style: 'Vintage elegante',
    availability: 'Últimas unidades',
    features: ['Respaldo alto', 'Volumen tradicional', 'Acabado con identidad visual marcada'],
  },
  {
    id: 'sillon-moderno-milano',
    slug: 'sillon-moderno-milano',
    name: 'Sillón Moderno Milano',
    category: 'Sillón',
    price: 349,
    tone: 'gold',
    purchasable: false,
    image: null,
    imageAlt: 'Representación visual del Sillón Moderno Milano',
    shortDescription: 'Líneas limpias y acento dorado para la próxima colección.',
    description:
      'El Sillón Moderno Milano llegará como pieza de referencia de una línea urbana, refinada y muy adaptable a espacios contemporáneos. Escríbenos si quieres reservarlo antes de su lanzamiento.',
    materials: ['Tapizado premium de colección', 'Estructura estable', 'Detalle metalizado decorativo'],
    dimensions: '84 x 79 x 96 cm',
    style: 'Moderno premium',
    availability: 'Próximo lanzamiento',
    features: ['Diseño depurado', 'Presencia sofisticada', 'Ideal para proyectos decorativos de alto impacto'],
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id) {
  return products.find((product) => product.id === id);
}
