import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuMain from '../components/offcanvas-main';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../components/mainpage.css';

// Importe o componente MapboxExample
import MapboxExample from '../components/MapboxExample.js';

function MainPage() {

  const navigate = useNavigate();

  return (
    <div className='main-page'>
      <div className='caixa'>
        <h1>Placeholder</h1>
      </div>
        <MenuMain />
            <Button onClick={() => navigate('/')} className='menu-main-button'>
              Voltar para a home
            </Button>
            <MapboxExample></MapboxExample>
      </div>
       
  );
}

export default MainPage;