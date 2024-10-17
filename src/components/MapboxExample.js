import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { IoMdPin } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

import './mapbox-extra.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import locationsData from '../data/locationData';
import eventsData from '../data/eventsData';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [selectedAddress, setSelectedAddress] = useState(null);
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
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-60.0217, -3.1174],
            zoom: 12,
            minZoom: 11.3,
            pitchWithRotate: false,
            dragRotate: false,
            touchZoomRotate: false
        });
    
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            bbox: [-60.2906, -3.2070, -59.7570, -2.9860],
            proximity: {
                longitude: -60.0217,
                latitude: -3.1174
            }
        });
    
        mapRef.current.addControl(geocoder);
        mapRef.current.addControl(new mapboxgl.NavigationControl({ showZoom: true, showCompass: false }));
    
        mapRef.current.on('click', (event) => {
            const { lng, lat } = event.lngLat;
        
            // Verifica se o clique foi diretamente em cima de um marcador
            const elementsAtClick = document.elementsFromPoint(event.originalEvent.clientX, event.originalEvent.clientY);
            const clickedOnMarker = elementsAtClick.some(el => el.classList.contains('mapboxgl-marker'));
        
            // Se o clique foi em um marcador existente, não adicionar um novo
            if (clickedOnMarker) {
                console.log('Clique em um marcador existente, mostrando popup.');
                return;
            }
        
            // Adiciona o novo pin normalmente
            setSelectedCoordinates([lng, lat]);
        
            if (currentMarkerRef.current) {
                currentMarkerRef.current.remove();
            }
        
            const newMarker = new mapboxgl.Marker({ color: '#0079FE' })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);
        
            currentMarkerRef.current = newMarker;
        
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                    setSelectedAddress(data.features.length > 0 ? data.features[0].place_name : 'Endereço não encontrado');
                });
        });
        
        
    
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);
    

    const handleAddEvent = (e) => {
        e.preventDefault();

        if (eventData.name && eventData.description && selectedCoordinates) {
            const marker = new mapboxgl.Marker({ color: '#FF6347' })
                .setLngLat(selectedCoordinates)
                .addTo(mapRef.current);

            const popupContent = `
                <div class="popup-pin-set">
                    <p class="popup-title">${eventData.name}</p>
                    <p class="popup-description">${eventData.description}</p>
                    <p class="popup-datetime">${eventData.date ? `Data: ${eventData.date}` : ''} <br> ${eventData.time ? `Hora: ${eventData.time}` : ''}</p>
                    <span style="background-color: #${eventData.category.replace(' ', '').toLowerCase()};">
                        ${eventData.category}
                    </span>
                </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(popupContent)
                .addTo(mapRef.current);

            marker.setPopup(popup);

            // Salva o evento no estado
            setSavedEvents(prevEvents => [
                ...prevEvents,
                { ...eventData, coordinates: selectedCoordinates }
            ]);

            // Reseta o formulário e o marcador atual
            setEventData({
                name: '',
                description: '',
                category: '',
                date: '',
                time: ''
            });
            setIsFormVisible(false);
            setSelectedAddress(null);
            setSelectedCoordinates(null);
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

    const handleFilter = () => {
        // Remove todos os marcadores do mapa
        markers.forEach(marker => marker.remove());
        setMarkers([]); // Limpa o array de marcadores
    
        // Filtra os eventos e locais com base nas categorias selecionadas
        const filteredEvents = savedEvents.filter(event =>
            selectedEventCategories.includes(event.category)
        );
        const filteredLocations = savedLocations.filter(location =>
            selectedLocationCategories.includes(location.category)
        );
    
        // Adiciona os eventos filtrados ao mapa
        filteredEvents.forEach(event => {
            const marker = new mapboxgl.Marker({ color: '#FF5733' })
                .setLngLat(event.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div class="popup-pin-set">
                        <p class="popup-title">${event.name}</p>
                        <p class="popup-description">${event.description}</p>
                        <p class="popup-datetime">${event.date ? `Data: ${event.date}` : ''} <br> ${event.time ? `Hora: ${event.time}` : ''}</p>
                        <span style="background-color: #${event.category.replace(' ', '').toLowerCase()};">
                            ${event.category}
                        </span>
                    </div>
                `))
                .addTo(mapRef.current);
            setMarkers(prev => [...prev, marker]); // Adiciona o marcador ao array de marcadores
        });
    
        // Exibe os locais filtrados no mapa
        filteredLocations.forEach(location => {
            const marker = new mapboxgl.Marker({ color: '#0079FE' })
                .setLngLat(location.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div class="popup-pin-set">
                        <p class="popup-title">${location.name}</p>
                        <p class="popup-description">${location.description}</p>
                        <span style="background-color: #${location.category.replace(' ', '').toLowerCase()};">
                            ${location.category}
                        </span>
                    </div>
                `))
                .addTo(mapRef.current);
            setMarkers(prev => [...prev, marker]); // Adiciona o marcador ao array de marcadores
        });
    };
    


    {/* ISSO AQUI MUDA O MENU DE FILTRO */}
    return (
        <div style={{ display: 'flex', height: '80vh', position: 'relative' }}>
            <div className="filter-menu">
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
            <button className='filter-button' onClick={handleFilter}>Filtrar</button>
        </div>

            {/*AQUI QUE ALTERA O TAMANHO DO MAPA PPRT*/}
            <div ref={mapContainerRef} className="map-container" style={{ width: '150vh', height: '80vh' }} />

            {selectedAddress && (
                <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '64%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                    <span>{selectedAddress}</span>
                    <FaPlus className='select-adress'
                        onClick={() => setIsFormVisible(true)}
                        style={{
                            position: 'relative',
                            backgroundColor: '#0079FE',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50px',
                            minWidth: '30px',
                            minHeight: '30px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }} />
                </div>
            )}

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
                                style={{
                                    backgroundColor: '#0079FE',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px',
                                    height: '50px',
                                    width: '50px',
                                    borderRadius: '50px',
                                    cursor: 'pointer'
                                }} />
                            <MdCancel size={25} type="button"
                                onClick={handleCancel} className='button-right'
                                style={{
                                    backgroundColor: '#FF6347',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px',
                                    height: '50px',
                                    width: '50px',
                                    borderRadius: '50px',
                                    cursor: 'pointer'
                                }} />
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