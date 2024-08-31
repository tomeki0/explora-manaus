import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

//comentario pra funfar o git add dessa page 
const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbGltYWRldiIsImEiOiJjbTBkYmc4aDcwYm12MnFweGEyY283cmhtIn0.1S4flGeLkg8EI2H2-OjDLw';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-60.0217, -3.1174], // Centro aproximado de Manaus
            zoom: 15
        });

        // Adicionar controle de pesquisa
        mapRef.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );

        // Definir os limites de Manaus (substitua por coordenadas mais precisas se necessário)
        const bounds = [
            [-60.2906, -3.2070], // SW coordenadas (latitude, longitude)
            [-59.7570, -2.9860]  // NE coordenadas (latitude, longitude)
        ];

        // Ajustar o mapa para os limites de Manaus
        mapRef.current.fitBounds(bounds, { padding: 10 });

        // Impedir zoom out fora dos limites definidos
        mapRef.current.setMaxBounds(bounds);

        return () => mapRef.current.remove();
    }, []);

    return <div ref={mapContainerRef} style={{ height: '75%' }} />;
};

export default MapboxExample;
