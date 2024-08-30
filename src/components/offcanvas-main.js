import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { TiThMenu } from "react-icons/ti";

import './offcanvas-main.css'

function MenuMain() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="button" variant="primary" onClick={handleShow}>
                <TiThMenu size={30} className='button-icon' />
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement='end' className="offcanvas-show">
                <Offcanvas.Header closeButton className='close-button'>
                    <Offcanvas.Title>
                        <img src={require('../img/logo.png')} alt="Logo Explora Manaus" className="logo-main" />
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                        <li>Item 4</li>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default MenuMain;