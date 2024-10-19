import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { TiThMenu } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdPin } from "react-icons/io";
import { FaStar } from "react-icons/fa";

import './offcanvas-main.css';

function MenuMain() {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <TiThMenu className="button" variant="primary" onClick={handleShow} size={30} />

            <Offcanvas show={show} onHide={handleClose} placement='end' className="offcanvas-show">
                <Offcanvas.Header closeButton className='close-button'>
                    <Offcanvas.Title>
                        <img src={require('../img/bruno-profile.png')} alt="Foto de perfil" className="profile-main" />
                        <div className='username'>
                            Bruno da Silva
                        </div>
                        <AiOutlineLoading3Quarters className='xp-bar' />
                        <div className='level'>Nv 10</div>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p className='information'>
                        <IoMdPin className='profile-pin-icon' size={35} />
                        <div className='information-background'>Pins colocados: 13</div>
                    </p>
                    <p className='information'>
                        <FaStar className='profile-star-icon' size={30} />
                        <div className='information-background'>Pins avaliados: 22</div>
                    </p>
                    <p className='information'>
                        Reputação: <b className='user-status'>Confiável</b>
                    </p>

                    <ul>
                        <Button className="button-menu">
                            Configurações
                        </Button>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default MenuMain;
