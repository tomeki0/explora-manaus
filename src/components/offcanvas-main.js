import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { TiThMenu } from "react-icons/ti";

import './offcanvas-main.css';

function MenuMain() {
    const [show, setShow] = useState(false);
    const [buttons, setButtons] = useState(['Perfil', 'Log in', 'Log out']);

    const handleClose = () => {
        setShow(false);
        resetButtons();
    };

    const handleShow = () => setShow(true);

    const handleProfileClick = () => {
        setButtons(['Configurações', 'Voltar']);
    };

    const handleBackClick = () => {
        resetButtons();
    };

    const resetButtons = () => {
        setButtons(['Perfil', 'Log in']);
    };

    return (
        <>
            <TiThMenu className="button" variant="primary" onClick={handleShow} size={30} />

            <Offcanvas show={show} onHide={handleClose} placement='end' className="offcanvas-show">
                <Offcanvas.Header closeButton className='close-button'>
                    <Offcanvas.Title>
                        <img src={require('../img/profile-icon.png')} alt="Foto de perfil" className="profile-main" />
                        <div className='username'>
                            Nome
                        </div>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul>
                        <Button className={`button-menu ${buttons[0] === 'Configurações' ? 'button-menu-back' : ''}`} onClick={handleProfileClick}>
                            {buttons[0]}
                        </Button>
                        <Button className={`button-menu ${buttons[1] === 'Voltar' ? 'button-menu-back' : ''}`} onClick={buttons[1] === 'Voltar' ? handleBackClick : undefined}>
                            {buttons[1]}
                        </Button>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default MenuMain;
