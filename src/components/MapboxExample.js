import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './mapbox-extra.css'; // Importa o arquivo CSS com a regra para o cursor
import { IoMdPin } from "react-icons/io";
import { MdCancel } from "react-icons/md";

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [isFormVisible1, setIsFormVisible1] = useState(false);
    const [isFormVisible2, setIsFormVisible2] = useState(false);
    const [eventData1, setEventData1] = useState({ name: '', description: '' });
    const [eventData2, setEventData2] = useState({ name: '', description: '' });
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

            //DESCULPA PELO CODIGO MERDA MAS SO FUNCIONOU ASSIM AAAAAAAAAAAAAAAAAAAAAAA
            if (suggestions) {
                const suggestionCount = response.features ? response.features.length : 0;

                if (suggestionCount === 1) {
                    suggestions.style.top = '24px'; // Posição para 1 sugestão
                    suggestions.style.display = 'block';
                } else if (suggestionCount === 2) {
                    suggestions.style.top = '37px'; // Posição para 2 sugestões
                    suggestions.style.display = 'block';
                } else if (suggestionCount === 3) {
                    suggestions.style.top = '52px'; // Posição para 3 sugestões
                    suggestions.style.display = 'block';
                } else if (suggestionCount === 4) {
                    suggestions.style.top = '67px'; // Posição para 4 sugestões
                    suggestions.style.display = 'block';
                } else if (suggestionCount >= 5) {
                    suggestions.style.top = '81px'; // Posição para 5 ou mais sugestões
                    suggestions.style.display = 'block';
                } else {
                    suggestions.style.display = 'none'; // Esconde a lista se não houver sugestões
                }

                /* IGNORA ISSO NAO SEI MAIS O QUE FAZER// Configurações comuns para todas as quantidades de sugestões
                if (suggestionCount > 0) {
                    suggestions.style.left = '0px';
                    suggestions.style.zIndex = 5;
                }*/
            }
        });

        /*CODIGO DE BACKUP
        if (suggestions) {
                // Se houver resultados, ajusta a lista de sugestões
                if (response.features && response.features.length >= 5) {
                    suggestions.style.top = '80px'; // Ajuste a posição para 80px
                    suggestions.style.left = '0px';
                    suggestions.style.zIndex = 5;
                    suggestions.style.display = 'block'; // Mostra a lista de sugestões
                } 
                // Se houver entre 1 e 4 sugestões, ajusta o top para 150px
                else if (response.features && response.features.length > 0 && response.features.length < 5) {
                    suggestions.style.top = '50px'; // Ajuste a posição para 150px
                    suggestions.style.left = '0px';
                    suggestions.style.zIndex = 5;
                    suggestions.style.display = 'block'; // Mostra a lista de sugestões
                } 
                // Se não houver sugestões, esconde a lista
                else {
                    suggestions.style.display = 'none'; // Esconde a lista de sugestões
                }
            }
        }); */

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

    const showEventForm1 = () => {
        setIsFormVisible1(true);
    };

    const showEventForm2 = () => {
        setIsFormVisible2(true);
    };

    const handleAddEvent1 = (e) => {
        e.preventDefault();

        if (eventData1.name && eventData1.description && selectedCoordinates) {
            const marker = new mapboxgl.Marker({ color: '#FF6347' })
                .setLngLat(selectedCoordinates)
                .addTo(mapRef.current);

            marker.getElement().addEventListener('click', () => {
                alert(`Evento: ${eventData1.name}\nDescrição: ${eventData1.description}`);
            });

            setEventData1({ name: '', description: '' });
            setIsFormVisible1(false);
            setSelectedAddress(null);
            setSelectedCoordinates(null);
        }
    };

    const handleAddEvent2 = (e) => {
        e.preventDefault();

        if (eventData2.name && eventData2.description && selectedCoordinates) {
            const marker = new mapboxgl.Marker({ color: '#FF6347' })
                .setLngLat(selectedCoordinates)
                .addTo(mapRef.current);

            marker.getElement().addEventListener('click', () => {
                alert(`Evento: ${eventData2.name}\nDescrição: ${eventData2.description}`);
            });

            setEventData2({ name: '', description: '' });
            setIsFormVisible2(false);
            setSelectedAddress(null);
            setSelectedCoordinates(null);
        }
    };

    const handleCancel1 = () => {
        setIsFormVisible1(false);
    };

    const handleCancel2 = () => {
        setIsFormVisible2(false);
    };

    //aaaaa hhhkkkk
    
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
                    <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                        <button
                            onClick={showEventForm1}
                            style={{
                                backgroundColor: '#0079FE',
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
                        <button
                            onClick={showEventForm2}
                            style={{
                                backgroundColor: '#0079FE',
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
                </div>
            )}

            {isFormVisible1 && (
                <div className='caixa-submit'>
                    <form onSubmit={handleAddEvent1}>
                        <div>
                            <label>Nome do Local:</label>
                            <input
                                type="text" className='inputbox'
                                value={eventData1.name}
                                onChange={(e) => setEventData1({ ...eventData1, name: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label>Descrição:</label>
                            <textarea className='inputbox'
                                value={eventData1.description}
                                onChange={(e) => setEventData1({ ...eventData1, description: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className='button-left' type="submit" style={{
                                backgroundColor: '#0079FE',
                                border: 'none',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '50px',
                                cursor: 'pointer'
                            }}
                                title='Cancelar'>
                                <IoMdPin className='icon-submit' size={25} />
                            </button>
                            <button className='button-right'
                                type="button"
                                onClick={handleCancel1}
                                style={{
                                    backgroundColor: '#FF873D',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '50px',
                                    cursor: 'pointer'
                                }}>
                                <MdCancel className='icon-submit' size={25} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isFormVisible2 && (
                <div className='caixa-submit'>
                    <form onSubmit={handleAddEvent2}>
                        <div>
                            <label>Nome do Evento:</label>
                            <input
                                type="text" className='inputbox'
                                value={eventData2.name}
                                onChange={(e) => setEventData2({ ...eventData2, name: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label>Descrição:</label>
                            <textarea className='inputbox'
                                value={eventData2.description}
                                onChange={(e) => setEventData2({ ...eventData2, description: e.target.value })}
                                required
                                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className='button-left' type="submit" style={{
                                backgroundColor: '#0079FE',
                                border: 'none',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '50px',
                                cursor: 'pointer'
                            }}>
                                <IoMdPin className='icon-submit' size={25} />
                            </button>
                            <button className='button-right'
                                type="button"
                                onClick={handleCancel2}
                                style={{
                                    backgroundColor: '#FF873D',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}>
                                <MdCancel className='icon-submit' size={25} />
                            </button>
                        </div>
                    </form>
                </div >
            )}
        </div >
    );
};

export default MapboxExample;
