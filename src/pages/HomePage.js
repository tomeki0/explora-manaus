import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/homepage.css';
import Button from 'react-bootstrap/Button';

function HomePage() {
  const navigate = useNavigate();

  const handleEnterClick = () => {
    navigate('/main');
  };

  return (
    <div className='home-page'>
      <div className='container text-center'>
        <h1 className='display-3 mb-4'>Bem Vindo(a) ao Explora Manaus</h1>
        <Button onClick={handleEnterClick} className='custom-button' size='lg'>
          Entrar
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
