import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

function HomePage(){
    const navigate = useNavigate();

    const handleEnterClick = () => {
        navigate('/main');
    } ;

    return(
        <div className='home-page'>
            <h1>Bem Vindo(a) ao Explora Manaus</h1>
            <button onClick={handleEnterClick} className="btn btn-primary btn-lg">
                Entrar
            </button>
        </div>
    );
}

export default HomePage;