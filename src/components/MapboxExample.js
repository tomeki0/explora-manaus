import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose, IoMdMenu, IoMdPin } from "react-icons/io";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MdCancel } from "react-icons/md";

import './mapbox-extra.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import locationsData from '../data/locationData';
import eventsData from '../data/eventsData';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [selectedAddress, setSelectedAddress] = useState({
        street: "S/L",
        number: "S/N",
        neighborhood: "S/L",
        cep: "S/N",
    }); // Endereço padrão ao carregar a página
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        category: '',
        date: '',
        time: '',
        isPaid: false,  // Adicionando isPaid
        price: ''       // Adicionando price
    });

    const [eventCategories] = useState(['Cultura e Entretenimento', 'Esportes', 'Tecnologia e Inovação', 'Negócios e Educação', 'Gastronomia e Lazer']);
    const [locationCategories] = useState(['Restaurantes e Bares', 'Hotéis e Acomodações', 'Comércios Locais', 'Entretenimento e Centros Culturais']);
    const [selectedEventCategories, setSelectedEventCategories] = useState([]);
    const [selectedLocationCategories, setSelectedLocationCategories] = useState([]);
    const [savedLocations, setSavedLocations] = useState(locationsData);
    const [savedEvents, setSavedEvents] = useState(eventsData);
    const [isEventForm, setIsEventForm] = useState(true);
    const currentMarkerRef = useRef(null);
    const [markers, setMarkers] = useState([]); // Definindo markers antes de usá-lo

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbGltYWRldiIsImEiOiJjbTBkYmc4aDcwYm12MnFweGEyY283cmhtIn0.1S4flGeLkg8EI2H2-OjDLw';
    
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12', // Estilo que suporta prédios em 3D
            center: [-60.0217, -3.1174],
            zoom: 10, // Zoom inicial para visualizar prédios em 3D
            pitchWithRotate: false, // Inclinação inicial do mapa para 3D
            pitch: 50, // Inclinação inicial do mapa para 3D
            bearing: -17.6, // Rotação inicial do mapa
            minZoom: 11,
            dragRotate: true,
            touchZoomRotate: true,
            maxBounds: [
                [-60.118532, -3.160522], // SW
                [-59.816644, -2.922472]  // NE
            ]
        });
    
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            bbox: [-60.2906, -3.2070, -59.7570, -2.9860],
            proximity: {
                longitude: -60.0217,
                latitude: -3.1174
            },
        });
    
        mapRef.current.addControl(geocoder);

        mapRef.current.on('load', () => {
            const map = mapRef.current;

            // Alterar a cor dos prédios para #69767d
            map.addLayer({
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                paint: {
                    'fill-extrusion-color': '#bfab95', // Cor dos prédios
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 0.5
                }
            });

            // Alterar a cor das ruas para #7d7d7d
            map.setPaintProperty('road', 'line-color', '#7d7d7d');
        });

    
        // Evento de clique no mapa
        mapRef.current.on('click', (event) => {
            const { lng, lat } = event.lngLat;
    
            // Verifica se o clique foi diretamente em cima de um marcador
            const elementsAtClick = document.elementsFromPoint(event.originalEvent.clientX, event.originalEvent.clientY);
            const clickedOnMarker = elementsAtClick.some(el => el.classList.contains('mapboxgl-marker'));
    
            if (clickedOnMarker) {
                console.log('Clique em um marcador existente, mostrando popup.');
                return;
            }
    
            // Adiciona o novo pin normalmente
            setSelectedCoordinates([lng, lat]);
    
            if (currentMarkerRef.current) {
                currentMarkerRef.current.remove();
            }
    
            const newMarker = new mapboxgl.Marker({ color: '#177245' })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);
    
            currentMarkerRef.current = newMarker;
    
            // Obter informações de endereço usando a API do Mapbox Geocoding
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                    if (data.features.length > 0) {
                        const address = data.features[0];
                        const context = address.context || [];
    
                        const street = address.text || 'Não disponível';
                        const number = address.address || 'S/N';
                        const neighborhood = context.find(c => c.id.includes('neighborhood'))?.text || 'Não disponível';
                        const cep = context.find(c => c.id.includes('postcode'))?.text || 'Não disponível';
    
                        setSelectedAddress({ street, number, neighborhood, cep });
                    } else {
                        setSelectedAddress(null);
                    }
                });
        });
    
        // Cleanup ao desmontar o componente
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);
    

    const handleAddEvent = (e) => {
        e.preventDefault();
    
        if (eventData.name && eventData.description && selectedCoordinates) {
            const marker = new mapboxgl.Marker({ 
                color: isEventForm ? '#FF5733' : '#0079FE' 
            })
                .setLngLat(selectedCoordinates)
                .addTo(mapRef.current);
    
            let popupContent;
            
            if (isEventForm) {
                // Popup para eventos
                popupContent = `
                    <div class="event-popup">
                        <p class="popup-title">${eventData.name}</p>
                        <p class="popup-description">${eventData.description}</p>
                        <p class="popup-datetime">
                            ${eventData.date ? `Data: ${eventData.date}` : ''} <br>
                            ${eventData.time ? `Hora: ${eventData.time}` : ''}    
                        </p>
                        <p class="popup-price">
                            ${eventData.isPaid && eventData.price ? `Preço: R$${eventData.price}` : 'Gratuito'}
                        </p>
                        <span class="popup-category">${eventData.category}</span>
                        ${eventData.pageLink ? `<br><a href="${eventData.pageLink}" class="event-link" target="_blank">Ir para a página do evento</a>` : ''}
                    </div>
                `;
            } else {
                // Popup para locais
                function generateStars(rating = 0, reviews = 0) {
                    const fullStar = '&#9733;';
                    const emptyStar = '&#9734;';
                    const stars = fullStar.repeat(Math.floor(rating)) + emptyStar.repeat(5 - Math.floor(rating));
                    return `${stars} <span style="font-size: 0.8rem; color: #555">(${reviews} avaliações)</span>`;
                }
    
                popupContent = `
                    <div class="location-popup">
                        <p class="popup-title">${eventData.name}</p>
                        <p class="popup-description">${eventData.description}</p>
                        <div class="star-rating">${generateStars(eventData.rating, eventData.reviews)}</div>
                        ${eventData.image ? `<img src="${eventData.image}" alt="${eventData.name}" style="width: 100%; height: auto; max-height: 100px; margin: 5px 0;" onerror="this.onerror=null; this.src='caminho/para/imagem-padrao.jpg';" />` : ''}
                        <p class="popup-price">
                            ${eventData.isPaid && eventData.price ? `Preço: R$${eventData.price}` : 'Gratuito'}
                        </p>
                        <span class="popup-category">${eventData.category}</span>
                        ${eventData.pageLink ? `<br><a href="${eventData.pageLink}" class="event-link" target="_blank">Ir para a página do local</a>` : ''}
                    </div>
                `;
            }
    
            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false,
                maxWidth: '300px'
            }).setHTML(popupContent);
    
            marker.setPopup(popup);
    
            // Salva o evento/local no estado apropriado
            if (isEventForm) {
                setSavedEvents(prevEvents => [
                    ...prevEvents,
                    { ...eventData, coordinates: selectedCoordinates }
                ]);
            } else {
                setSavedLocations(prevLocations => [
                    ...prevLocations,
                    { ...eventData, coordinates: selectedCoordinates }
                ]);
            }
    
            // Reseta o formulário e o marcador atual
            setEventData({
                name: '',
                description: '',
                category: '',
                date: '',
                time: '',
                isPaid: false,
                price: ''
            });
            setIsFormVisible(false);
            setSelectedAddress(null);
            setSelectedCoordinates(null);
            
            if (currentMarkerRef.current) {
                currentMarkerRef.current.remove();
            }
        }
    };
    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const toggleForm = () => {
        setIsEventForm(!isEventForm);
    };

    const handleCategoryChange = (categoryType, category) => {
        if (categoryType === 'event') {
            setSelectedEventCategories(prev => prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]);
        } else {
            setSelectedLocationCategories(prev => prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]);
        }
    };

    // Modificação na função handleFilter
const handleFilter = () => {
    // Remove todos os marcadores do mapa
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    // Função para gerar estrelas (mantida igual)
    function generateStars(rating, reviews) {
        const fullStar = '&#9733;';
        const emptyStar = '&#9734;';
        const stars = fullStar.repeat(Math.floor(rating)) + emptyStar.repeat(5 - Math.floor(rating));
        return `${stars} <span style="font-size: 0.8rem; color: #555">(${reviews} avaliações)</span>`;
    }

    // Filtra os eventos e locais
    const filteredEvents = savedEvents.filter(event =>
        selectedEventCategories.includes(event.category)
    );
    const filteredLocations = savedLocations.filter(location =>
        selectedLocationCategories.includes(location.category)
    );

    // Adiciona os eventos filtrados ao mapa
    filteredEvents.forEach(event => {
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
        }).setHTML(`
            <div class="event-popup">
                <p class="popup-title">${event.name}</p>
                <p class="popup-description">${event.description}</p>
                <p class="popup-datetime">
                    ${event.date ? `Data: ${event.date}` : ''} <br>
                    ${event.time ? `Hora: ${event.time}` : ''}    
                </p>
                <p class="popup-price">
                    ${event.price === undefined || event.price === null || event.price === 0 || event.price === 'free' ? 'Gratuito' : `Preço: R$${event.price}`}
                </p>
                <span class="popup-category">${event.category}</span> <br>
                <a href="${event.pageLink}" class="event-link" target="_blank">Ir para a página do evento</a>
            </div>
        `);

        const marker = new mapboxgl.Marker({ color: '#FF5733' })
            .setLngLat(event.coordinates)
            .setPopup(popup)
            .addTo(mapRef.current);

        setMarkers(prev => [...prev, marker]);
    });

    // Adiciona os locais filtrados ao mapa
    filteredLocations.forEach(location => {
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
        }).setHTML(`
            <div class="location-popup">
                <p class="popup-title">${location.name}</p>
                <p class="popup-description">${location.description}</p>
                <div class="star-rating">${generateStars(location.rating, location.reviews)}</div>
                <img src="${location.image}" alt="${location.name}" style="width: 100%; height: auto; max-height: 100px; margin: 5px 0;" onerror="this.onerror=null; this.src='caminho/para/imagem-padrao.jpg';" />
                <p class="popup-price">${location.price === undefined || location.price === null || location.price === 0 || location.price === 'free' ? 'Gratuito' : `Preço: R$${location.price}`}</p>
                <span class="popup-category">${location.category}</span> <br>
                <a href="${location.pageLink}" class="event-link" target="_blank">Ir para a página do local</a>
            </div>
        `);

        const marker = new mapboxgl.Marker({ color: '#0079FE' })
            .setLngLat(location.coordinates)
            .setPopup(popup)
            .addTo(mapRef.current);

        setMarkers(prev => [...prev, marker]);
    });
};

        const [isFilterVisible, setIsFilterVisible] = useState(false); // Estado para visibilidade do menu de filtro
        const [isAddressVisible, setIsAddressVisible] = useState(false); // Estado para visibilidade da barra de endereço

        const handleToggleFilter = () => {
            setIsFilterVisible(prevState => !prevState);
        };

        const handleToggleAddress = () => {
            setIsAddressVisible(prevState => !prevState);
        };
    
    {/* ISSO AQUI MUDA O MENU DE FILTRO */}
    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {/* Contêiner do mapa com a barra de filtro e a barra de endereço */}
            <div style={{ position: 'relative', width: '100%' }}>
                {/* Mapa */}
                <div ref={mapContainerRef} className="map-container" style={{ width: '100%', height: '80vh' }} />

                {/* Botão para abrir/fechar o menu de filtro */}
                <button
                    onClick={handleToggleFilter}
                    style={{
                        position: 'absolute',
                        bottom: '60%',
                        right: '1%',
                        zIndex: 20,
                        backgroundColor: isFilterVisible ? '#FF5733' : '#007bff',
                        color: 'white',
                        width: '50px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {isFilterVisible ? (
                        <IoMdClose size={24} /> // Ícone de fechar
                    ) : (
                        <IoMdMenu size={24} /> // Ícone de abrir
                    )}
                </button>

                {/* Menu de Filtro dentro do mapa */}
                <div
                    className="filter-menu"
                    style={{
                        opacity: isFilterVisible ? 1 : 0,
                        pointerEvents: isFilterVisible ? 'auto' : 'none',
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    <div className="category-group">
                        <h3>
                            <IoMdPin style={{ color: '#FF5733', marginRight: '8px', position: 'relative', top: '-4px' }} />
                            Eventos
                        </h3>
                        {eventCategories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={selectedEventCategories.includes(category)}
                                    onChange={() => handleCategoryChange('event', category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>

                    <div className="category-group">
                        <h3>
                            <IoMdPin style={{ color: '#0079FE', marginRight: '8px', position: 'relative', top: '-4px' }} />
                            Locais
                        </h3>
                        {locationCategories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={selectedLocationCategories.includes(category)}
                                    onChange={() => handleCategoryChange('location', category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>

                    <button className="filter-button" onClick={handleFilter}>
                        Filtrar
                    </button>
                </div>

                {/* Botão para abrir/fechar a barra de endereço */}
                <button
                    onClick={handleToggleAddress}
                    style={{
                        position: 'absolute',
                        bottom: '45%',
                        right: '1%',
                        zIndex: 20,
                        backgroundColor: isAddressVisible ? '#FF873D' : '#007bff',
                        color: 'white',
                        width: '50px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {isAddressVisible ? (
                        <IoMdClose size={24} /> // Ícone de fechar
                    ) : (
                        <IoMdPin size={24} /> // Ícone de abrir
                    )}
                </button>

                {/* Barra de endereço dentro do mapa */}
                <div
                    className="address-bar"
                    style={{
                        opacity: isAddressVisible ? 1 : 0,
                        pointerEvents: isAddressVisible ? 'auto' : 'none',
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    {selectedAddress && (
                        <div className="address-content">
                            <div className="address-details">
                                <div>
                                    <strong>Rua:</strong> {selectedAddress.street}
                                </div>
                                <div>
                                    <strong>Número:</strong> {selectedAddress.number}
                                </div>
                                <div>
                                    <strong>Bairro:</strong> {selectedAddress.neighborhood}
                                </div>
                                <div>
                                    <strong>CEP:</strong> {selectedAddress.cep}
                                </div>
                            </div>
                            <button onClick={() => setIsFormVisible(true)} className="add-pin-button">
                                Adicionar Pin
                            </button>
                        </div>
                    )}
                </div>
            </div>

                {isFormVisible && (
                <div className='caixa-submit'>
                    <form onSubmit={handleAddEvent}>
                        {/* Campos comuns para evento e local */}
                        <div>
                            <label>{isEventForm ? 'Nome do Evento:' : 'Nome do Local:'}</label>
                            <input className='inputbox'
                                type="text"
                                value={eventData.name}
                                onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label>{isEventForm ? 'Descrição:' : 'Descrição:'}</label>
                            <textarea className='inputbox'
                                value={eventData.description}
                                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%', resize: 'none' }}
                            />
                        </div>

                        {isEventForm && (
                            <>
                                {/* Campos adicionais para eventos */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Data:</label>
                                        <input className='inputbox'
                                            type="date"
                                            value={eventData.date}
                                            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                            required
                                            style={{ display: 'block', width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>Hora:</label>
                                        <input className='inputbox'
                                            type="time"
                                            value={eventData.time}
                                            onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                            required
                                            style={{ display: 'block', width: '100%' }}
                                        />
                                    </div>
                                </div>

                            {/* Checkbox e campo de preço para eventos */}
                            <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
            type="checkbox"
            checked={eventData.isPaid}
            onChange={(e) => setEventData({ ...eventData, isPaid: e.target.checked })}
            style={{ marginRight: '8px' }} // Espaço entre a checkbox e o texto
        />
        Evento pago?
        
        {eventData.isPaid && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <label style={{ marginRight: '8px' }}>Valor:</label>
                <input
                    className='inputbox'
                    type="number"
                    value={eventData.price}
                    onChange={(e) => setEventData({ ...eventData, price: e.target.value })}
                    required={eventData.isPaid}
                    style={{ width: '100px' }}
                />
            </div>
        )}
    </label>
</div>

                        </>
                        )}

                        <div>
                            <label>Categoria:</label>
                            <select className='inputbox'
                                value={eventData.category}
                                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            >
                                {(isEventForm ? eventCategories : locationCategories).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botões de ação */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IoMdPin size={25} type="button"
                                onClick={handleAddEvent} className='button-left'
                            />
                            <MdCancel size={25} type="button"
                                onClick={handleCancel} className='button-right'
                            />
                        </div>

                        {/* Botão para alternar formulário */}
                        <div className='form-changer' style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <button type="button" onClick={toggleForm} className="filter-button">
                                {isEventForm ? 'Local' : 'Evento'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MapboxExample;