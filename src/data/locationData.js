// src/data/locationsData.js
import musa from '../img/musa.jpg'
import basq from '../img/basq.jpg'
import teatro_amazonas from '../img/teatro-amazonas.jpg'
import povos from '../img/povos.jpg'
import adolfo from '../img/adolfo.jpg'

const locationsData = [
    {
        name: 'Mercado Municipal Adolpho Lisboa',
        description: 'Um mercado histórico com produtos locais, frutas exóticas e comidas típicas.',
        category: 'Comércios Locais',
        price: '20.00  - 40.00',
        rating: 4.5,
        reviews: 500,
        image: adolfo,
        coordinates: [-60.02372998465607, -3.139336112461147]
    },
    {
        name: 'Teatro Amazonas',
        description: 'Um dos mais belos teatros do Brasil, famoso por sua arquitetura e apresentações culturais.',
        category: 'Entretenimento e Centros Culturais',
        price: '15.00  - 100.00',
        rating: 5.0,
        reviews: 5000,
        image: teatro_amazonas,
        coordinates: [-60.0234098119285, -3.13026305152821]
    },
    {
        name: 'Centro Cultural dos Povos da Amazônia',
        description: 'Um espaço dedicado à cultura e à história dos povos amazônicos.',
        category: 'Entretenimento e Centros Culturais',
        price: '10.00  - 50.00',
        rating: 4.0,
        reviews: 5000,
        image: povos,
        coordinates: [-59.98737518465607, -3.1324245062407603]
    },
    {
        name: 'Basquiat',
        description: 'Bar alternativo',
        category: 'Restaurantes e Bares',
        price: '15.00  - 50.00',
        rating: 5.0,
        reviews: 10,
        image: basq,
        coordinates: [-60.02515204361498, -3.1248667068520075]
    },
    {
        name: 'MUSA - Museu da Amazônia',
        description: 'Museu a céu aberto localizado na Reserva Ducke, com torre de observação de 42m de altura que permite vista panorâmica da floresta. Oferece trilhas educativas, jardim de orquídeas e exposições sobre a biodiversidade amazônica.',
        category: 'Entretenimento e Centros Culturais',
        price: '15.00  - 40.00',
        image: musa,
        rating: 5.0,
        reviews: 1000,
        coordinates: [-59.93994170485279, -3.0071272709917243]
    },
    {
        name: 'Ponta Negra',
        description: 'Um calçadão à beira do rio com praias, bares, restaurantes e áreas para caminhada.',
        category: 'Restaurantes e Bares',
        price: 'Gratuito',
        rating: 4.7,
        reviews: 1200,
        image: '',
        coordinates: [-60.103858453573274, -3.0640898982118205]
    },
    {
        name: 'Bosque da Ciência',
        description: 'Um espaço verde com trilhas, animais da fauna amazônica e exposições educativas.',
        category: 'Entretenimento e Centros Culturais',
        price: '5.00 - 10.00',
        rating: 4.5,
        reviews: 800,
        image: '',
        coordinates: [-59.98782273445791, -3.0974270310573297]
    },
    {
        name: 'Praça da Saudade',
        description: 'Uma praça histórica com arquitetura clássica, frequentada por moradores e turistas.',
        category: 'Entretenimento e Centros Culturais',
        price: 'Gratuito',
        rating: 4.3,
        reviews: 250,
        image: '',
        coordinates: [-60.02595539212965, -3.127301328260174]
    },
    {
        name: 'Praça do Relógio',
        description: 'Local icônico no centro da cidade com um relógio histórico e vista para o Rio Negro.',
        category: 'Entretenimento e Centros Culturais',
        price: 'Gratuito',
        rating: 4.4,
        reviews: 180,
        image: '',
        coordinates: [-60.02503647678554, -3.1359755563684852]
    },
    {
        name: 'Galeria dos Remédios',
        description: 'Um dos maiores centros comerciais da cidade, com lojas que oferecem desde roupas a eletrônicos.',
        category: 'Comércios Locais',
        price: 'Gratuito',
        rating: 4.2,
        reviews: 320,
        image: '',
        coordinates: [-60.02377809239394, -3.138553063619553]
    },
    {
        name: 'Bar do Armando',
        description: 'Tradicional bar de Manaus famoso pelo ambiente boêmio e pela culinária típica.',
        category: 'Restaurantes e Bares',
        price: '10.00 - 50.00',
        rating: 4.6,
        reviews: 410,
        image: '',
        coordinates: [-60.022216775554114, -3.1298399798665035]
    },
    {
        name: 'Parque dos Bilhares',
        description: 'Um parque com áreas de lazer, quadras esportivas e espaços para eventos culturais.',
        category: 'Entretenimento e Centros Culturais',
        price: 'Gratuito',
        rating: 4.3,
        reviews: 620,
        image: '',
        coordinates: [-60.02436121715002, 3.1010582374110367] // Zona Centro-Sul
    },
    {
        name: 'Parque Estadual Sumaúma',
        description: 'Única unidade de conservação estadual em área urbana, com trilhas e atividades educativas.',
        category: 'Entretenimento e Centros Culturais',
        price: '5.00 - 15.00',
        rating: 4.4,
        reviews: 320,
        image: '',
        coordinates: [-59.98063388842677, -3.034915503904753] // Zona Norte
    },
    {
        name: 'Centro de Convivência da Família Magdalena Arce Daou',
        description: 'Espaço cultural com eventos, feiras e atividades recreativas.',
        category: 'Entretenimento e Centros Culturais',
        price: 'Gratuito',
        rating: 4.5,
        reviews: 280,
        image: '',
        coordinates: [-60.0373787209657, -3.113549140875657] // Zona Oeste
    },
    {
        name: 'Feira do Mutirão',
        description: 'Feira popular com grande variedade de produtos locais, de frutas a artesanato.',
        category: 'Comércios Locais',
        price: 'Gratuito',
        rating: 4.2,
        reviews: 190,
        image: '',
        coordinates: [-59.945407301515374, -3.0451368497904263] // Zona Leste
    },
];

export default locationsData;
