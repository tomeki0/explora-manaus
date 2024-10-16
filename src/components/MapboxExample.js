import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { IoMdPin } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

import { locationData } from './data/locationData'; // Importando os dados de locais
import { eventsData } from './data/eventsData'; // Importando os dados de eventos

import './mapbox-extra.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

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
        time: ''
    });

    const [eventCategories] = useState(['Cultura e Entretenimento', 'Esportes', 'Tecnologia e Inovação', 'Negócios e Educação', 'Gastronomia e Lazer']);
    const [locationCategories] = useState(['Restaurantes e Bares', 'Hotéis e Acomodações', 'Comércios Locais', 'Entretenimento e Centros Culturais']);
    const [selectedEventCategories, setSelectedEventCategories] = useState([]);
    const [selectedLocationCategories, setSelectedLocationCategories] = useState([]);
    const [savedEvents, setSavedEvents] = useState(eventsData); // Usando dados importados
    const [savedLocations, setSavedLocations] = useState(locationData); // Usando dados importados

    const [isEventForm, setIsEventForm] = useState(true);
    const currentMarkerRef = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN_HERE';

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

        geocoder.on('results', (response) => {
            const geocoderElement = document.querySelector('.mapboxgl-ctrl-geocoder');
            const suggestions = geocoderElement?.querySelector('.suggestions-wrapper');
            if (suggestions) {
                const suggestionCount = response.features ? response.features.length : 0;
                suggestions.style.top = `${24 + (suggestionCount - 1) * 15}px`;
                suggestions.style.display = 'block';
            }
        });

        mapRef.current.addControl(geocoder);
        mapRef.current.addControl(new mapboxgl.NavigationControl({ showZoom: true, showCompass: false }));

        const bounds = [
            [-60.118532, -3.160522], // SW
            [-59.816644, -2.922472]  // NE
        ];

        mapRef.current.fitBounds(bounds, { padding: 20 });
        mapRef.current.setMaxBounds(bounds);

        mapRef.current.on('click', async (event) => {
            const { lng, lat } = event.lngLat;
            setSelectedCoordinates([lng, lat]);

            if (currentMarkerRef.current) {
                currentMarkerRef.current.remove();
            }

            const newMarker = new mapboxgl.Marker({ color: '#0079FE' })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);

            currentMarkerRef.current = newMarker;

            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
            const data = await response.json();
            if (data.features.length > 0) {
                setSelectedAddress(data.features[0].place_name);
            } else {
                setSelectedAddress('Endereço não encontrado');
            }
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

            // Remove o marcador após 5 segundos
            setTimeout(() => {
                marker.remove();
            }, 3000);

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

    return (
        <div>
            <div ref={mapContainerRef} className="map-container" />
            {isFormVisible && (
                <div className="form-popup">
                    <form onSubmit={handleAddEvent}>
                        <h2>{isEventForm ? 'Adicionar Evento' : 'Adicionar Local'}</h2>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={eventData.name}
                            onChange={e => setEventData({ ...eventData, name: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Descrição"
                            value={eventData.description}
                            onChange={e => setEventData({ ...eventData, description: e.target.value })}
                            required
                        />
                        {isEventForm ? (
                            <>
                                <select
                                    onChange={e => setEventData({ ...eventData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione a categoria</option>
                                    {eventCategories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    onChange={e => setEventData({ ...eventData, date: e.target.value })}
                                    required
                                />
                                <input
                                    type="time"
                                    onChange={e => setEventData({ ...eventData, time: e.target.value })}
                                    required
                                />
                            </>
                        ) : (
                            <select
                                onChange={e => setEventData({ ...eventData, category: e.target.value })}
                                required
                            >
                                <option value="">Selecione a categoria</option>
                                {locationCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        )}
                        <button type="submit">{isEventForm ? 'Adicionar Evento' : 'Adicionar Local'}</button>
                        <button type="button" onClick={handleCancel}><MdCancel /> Cancelar</button>
                    </form>
                </div>
            )}
            <button onClick={() => setIsFormVisible(!isFormVisible)}>
                <FaPlus /> {isFormVisible ? 'Fechar Formulário' : 'Adicionar Evento/Local'}
            </button>
            <div className="category-filters">
                <h3>Filtrar Eventos</h3>
                {eventCategories.map((category, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            checked={selectedEventCategories.includes(category)}
                            onChange={() => handleCategoryChange('event', category)}
                        />
                        {category}
                    </label>
                ))}
                <h3>Filtrar Locais</h3>
                {locationCategories.map((category, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            checked={selectedLocationCategories.includes(category)}
                            onChange={() => handleCategoryChange('location', category)}
                        />
                        {category}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default MapboxExample;
