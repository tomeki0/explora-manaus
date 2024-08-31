import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbGltYWRldiIsImEiOiJjbTBkYmc4aDcwYm12MnFweGEyY283cmhtIn0.1S4flGeLkg8EI2H2-OjDLw';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-60.0217, -3.1174], // Centro aproximado de Manaus
            zoom: 16
        });

        // Adicionar controle de pesquisa
        mapRef.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );

        // Definir os limites de Manaus com coordenadas mais próximas
        const bounds = [
            [-60.1055, -3.1673], // SW coordenadas próximas à área "Compensa"
            [-59.9083, -2.9916]  // NE coordenadas próximas à área "Lago Azul"
        ];

        // Ajustar o mapa para os limites de Manaus
        mapRef.current.fitBounds(bounds, { padding: 20 });

        // Impedir zoom out fora dos limites definidos
        mapRef.current.setMaxBounds(bounds);

        return () => mapRef.current.remove();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div ref={mapContainerRef} style={{ width: '70%', height: '85%' }} />
        </div>
    );
};

export default MapboxExample;
