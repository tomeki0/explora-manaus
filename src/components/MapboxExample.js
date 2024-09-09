import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './mapbox-extra.css'; // Importa o arquivo CSS com a regra para o cursor
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [eventData, setEventData] = useState({ name: '', description: '', category: 'Categoria 1' });
    const [categories] = useState(['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5']);
    const currentMarkerRef = useRef(null);

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

        // Código adicionado para ajustar a posição das sugestões de pesquisa
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
            [-60.2906, -3.2070],
            [-59.7570, -2.9860]
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
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <strong>${eventData.name}</strong>
                    <p>${eventData.description}</p>
                    <span style="background-color: #${eventData.category.replace(' ', '').toLowerCase()}; color: white; padding: 2px 5px; border-radius: 5px;">
                        ${eventData.category}
                    </span>
                </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(popupContent)
                .addTo(mapRef.current);

            marker.setPopup(popup);

            setEventData({ name: '', description: '', category: 'Categoria 1' });
            setIsFormVisible(false);
            setSelectedAddress(null);
            setSelectedCoordinates(null);
        }
    };

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', position: 'relative' }}>
            <div ref={mapContainerRef} className="map-container" style={{ width: '80%', height: '100%' }} />

            {selectedAddress && (
                <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                    <span>{selectedAddress}</span>
                    <button
                        onClick={() => setIsFormVisible(true)}
                        style={{
                            backgroundColor: '#0079FE',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            marginLeft: '10px'
                        }}>
                        +
                    </button>
                </div>
            )}

            {isFormVisible && (
                <div className='caixa-submit'>
                    <form onSubmit={handleAddEvent}>
                        <div>
                            <label>Nome do Evento:</label>
                            <input
                                type="text"
                                value={eventData.name}
                                onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label>Descrição:</label>
                            <textarea
                                value={eventData.description}
                                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label>Categoria:</label>
                            <select
                                value={eventData.category}
                                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="submit" style={{
                                backgroundColor: '#0079FE',
                                border: 'none',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '50px',
                                cursor: 'pointer'
                            }}>
                                Adicionar Evento
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: '#FF873D',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MapboxExample;
