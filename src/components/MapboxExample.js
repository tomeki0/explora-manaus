import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [eventData, setEventData] = useState({ name: '', description: '' });
    const currentMarkerRef = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbGltYWRldiIsImEiOiJjbTBkYmc4aDcwYm12MnFweGEyY283cmhtIn0.1S4flGeLkg8EI2H2-OjDLw';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [-60.0217, -3.1174],
            zoom: 12
        });

        mapRef.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );

        mapRef.current.addControl(new mapboxgl.NavigationControl());

        const bounds = [
            [-60.2906, -3.2070],
            [-59.7570, -2.9860]
        ];

        mapRef.current.fitBounds(bounds, { padding: 20 });
        mapRef.current.setMaxBounds(bounds);

        mapRef.current.flyTo({
            center: [-60.0217, -3.1174],
            zoom: 14,
            speed: 0.8,
            curve: 1
        });

        mapRef.current.on('click', async (event) => {
            const { lng, lat } = event.lngLat;
            setSelectedCoordinates([lng, lat]);

            // Remover o marcador existente, se houver
            if (currentMarkerRef.current) {
                currentMarkerRef.current.remove();
            }

            // Criar novo marcador na posição clicada
            const newMarker = new mapboxgl.Marker({ color: '#FF6347' })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);

            // Armazenar o novo marcador na referência
            currentMarkerRef.current = newMarker;

            // Usar o serviço de geocodificação reversa para obter o endereço
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
    }, []); // Sem dependências, para que o mapa só seja inicializado uma vez

    const showEventForm = () => {
        setIsFormVisible(true);
    };

    const handleAddEvent = (e) => {
        e.preventDefault();

        if (eventData.name && eventData.description && selectedCoordinates) {
            const marker = new mapboxgl.Marker({ color: '#FF6347' })
                .setLngLat(selectedCoordinates)
                .addTo(mapRef.current);

            marker.getElement().addEventListener('click', () => {
                alert(`Evento: ${eventData.name}\nDescrição: ${eventData.description}`);
            });

            setEventData({ name: '', description: '' });
            setIsFormVisible(false);
            setSelectedAddress(null);
            setSelectedCoordinates(null);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', position: 'relative' }}>
            <div ref={mapContainerRef} style={{ width: '80%', height: '100%' }} />

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
                        onClick={showEventForm}
                        style={{
                            marginLeft: '10px',
                            backgroundColor: '#FF6347',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            fontSize: '18px'
                        }}>
                        +
                    </button>
                </div>
            )}

            {isFormVisible && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}>
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
                        <button type="submit" style={{ backgroundColor: '#FF6347', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
                            Adicionar Evento
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MapboxExample;
