import butacaNordica from '../assets/images/products/butaca-nordica.jpg';
import butacaSevilla from '../assets/images/products/butaca-sevilla.jpg';
import butacaSevillaRodero from '../assets/images/products/butaca-sevilla-rodero.jpg';

export const products = [
  {
    id: 'butaca-nordica-oslo',
    slug: 'butaca-nordica-oslo',
    name: 'Butaca Nordica Oslo',
    category: 'Butaca',
    price: 249,
    tone: 'rose',
    image: butacaNordica,
    imageAlt: 'Butaca Nordica Oslo en tono suave con patas de madera',
    shortDescription: 'Una butaca ligera y elegante para salones serenos y rincones de lectura.',
    description:
      'La Butaca Nordica Oslo combina lineas suaves, patas de madera y un tapizado amable para crear una pieza luminosa, comoda y muy facil de integrar en interiores contemporaneos.',
    materials: ['Tapizado textil suave', 'Estructura interior reforzada', 'Patas de madera natural'],
    dimensions: '82 x 74 x 90 cm',
    style: 'Nordico moderno',
    availability: 'Disponible bajo pedido',
    features: ['Respaldo envolvente', 'Asiento firme y confortable', 'Ideal para salon, dormitorio o estudio'],
  },
  {
    id: 'sillon-relax-premium',
    slug: 'sillon-relax-premium',
    name: 'Sillon Relax Premium',
    category: 'Sillon',
    price: 499,
    tone: 'plum',
    image: butacaSevillaRodero,
    imageAlt: 'Sillon Relax Premium tapizado en tono malva',
    shortDescription: 'Un sillon de apoyo generoso pensado para descanso y presencia premium.',
    description:
      'El Sillon Relax Premium aporta una postura comoda, un volumen elegante y una silueta envolvente perfecta para espacios donde el confort debe ir unido a una imagen cuidada.',
    materials: ['Tapizado premium', 'Base estructural de alta resistencia', 'Apoyabrazos acolchados'],
    dimensions: '88 x 82 x 103 cm',
    style: 'Relax contemporaneo',
    availability: 'Entrega estimada en 7 dias',
    features: ['Asiento amplio', 'Apoyabrazos redondeados', 'Presencia elegante para estancias principales'],
  },
  {
    id: 'butaca-vintage-retro',
    slug: 'butaca-vintage-retro',
    name: 'Butaca Vintage Retro',
    category: 'Butaca',
    price: 199,
    tone: 'wine',
    image: butacaSevilla,
    imageAlt: 'Butaca Vintage Retro en color burdeos',
    shortDescription: 'Una pieza con caracter calido para ambientes clasicos y acogedores.',
    description:
      'La Butaca Vintage Retro reinterpreta formas tradicionales con una presencia sobria y un color intenso que eleva la estancia sin perder sensacion de hogar.',
    materials: ['Tapizado aterciopelado', 'Bastidor compacto', 'Patas de madera oscura'],
    dimensions: '80 x 78 x 106 cm',
    style: 'Vintage elegante',
    availability: 'Ultimas unidades',
    features: ['Respaldo alto', 'Volumen tradicional', 'Acabado con identidad visual marcada'],
  },
  {
    id: 'sillon-moderno-milano',
    slug: 'sillon-moderno-milano',
    name: 'Sillon Moderno Milano',
    category: 'Sillon',
    price: 349,
    tone: 'gold',
    image: null,
    imageAlt: 'Representacion visual del Sillon Moderno Milano',
    shortDescription: 'Una propuesta sofisticada para una futura coleccion de lineas limpias y acento dorado.',
    description:
      'El Sillon Moderno Milano se presenta como una pieza de referencia para ampliar la coleccion con una linea urbana, refinada y muy adaptable a espacios contemporaneos.',
    materials: ['Tapizado premium de coleccion', 'Estructura estable', 'Detalle metalizado decorativo'],
    dimensions: '84 x 79 x 96 cm',
    style: 'Moderno premium',
    availability: 'Proximo lanzamiento',
    features: ['Diseno depurado', 'Presencia sofisticada', 'Ideal para proyectos decorativos de alto impacto'],
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id) {
  return products.find((product) => product.id === id);
}
