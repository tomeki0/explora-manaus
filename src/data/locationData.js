// src/data/locationsData.js
import img1 from '../img/cidade-manaus.png';

const locationsData = [
    {
        name: 'Restaurante do Chef',
        description: 'Culinária internacional com pratos exclusivos.',
        category: 'Restaurantes e Bares',
        price: '35.50  - 60.00' ,
        rating: 4.3,
        reviews: 160,
        date: '2024-21-12',
        coordinates: [-60.0456, -3.1024]
    },
    {
        name: 'Hotel Manaus Palace',
        description: 'Conforto e elegância no coração da cidade.',
        category: 'Hotéis e Acomodações',
        coordinates: [-60.0203, -3.1034]
    },
    {
        name: 'Mercado Municipal Adolpho Lisboa',
        description: 'Um mercado histórico com produtos locais, frutas exóticas e comidas típicas.',
        category: 'Comércios Locais',
        coordinates: [-60.02372998465607, -3.139336112461147]
    },
    {
        name: 'Teatro Amazonas',
        description: 'Um dos mais belos teatros do Brasil, famoso por sua arquitetura e apresentações culturais.',
        category: 'Entretenimento e Centros Culturais',
        image: img1,
        coordinates: [-60.0234098119285, -3.13026305152821]
    },
    {
        name: 'Centro Cultural dos Povos da Amazônia',
        description: 'Um espaço dedicado à cultura e à história dos povos amazônicos.',
        category: 'Entretenimento e Centros Culturais',
        coordinates: [-59.98737518465607, -3.1324245062407603]
    },
    {
        name: 'Basquiat',
        description: 'Bar alternativo',
        category: 'Restaurantes e Bares',
        coordinates: [-60.02515204361498, -3.1248667068520075]
    },
];

export default locationsData;
