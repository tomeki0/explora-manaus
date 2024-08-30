import React from 'react';
import '../components/aboutpage.css';
import {Card, Container, Row, Col} from 'react-bootstrap';
import teamImage from '../img/card-manaus.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function AboutPage() {
  return (
    <div className='about-page'>
        <Container>
            <h1 className='text-center my-4'>Sobre o Projeto</h1>

            <div className='text-center mb-4'>
                <img src={teamImage} alt='Equipe do Projeto' className='team-image'/>
            </div>

            <p className='description'>
            Explora Manaus é uma plataforma desenvolvida para permitir que usuários compartilhem
            eventos, locais e informações relevantes sobre a cidade de Manaus. O projeto foi criado
            com o objetivo de conectar pessoas e destacar o que há de melhor na cidade, promovendo
            cultura, turismo e interação social.
            </p>

            <Row className='nt-5'>
                <Col md={4} className='mb-4'>
                    <Card className='text-center h-100'>
                        <Card.Body>
                            <Card.Title>Programação</Card.Title>
                            <i className='fas fa-keyboard fa-3x mb-3'></i>
                            <Card.Text>
                                Equipe de Programação
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className='mb-4'>
                    <Card className='text-center h-100'>
                        <Card.Body>
                            <Card.Title>Trabalho Escrito</Card.Title>
                            <i className='fas fa-paint-brush fa-3x mb-3'></i>
                            <Card.Text>
                                Equipe do tranalho escrito
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className='mb-4'>
                    <Card className='text-center h-100'>
                        <Card.Body>
                            <Card.Title>Banner</Card.Title>
                            <i className='fas fa-image fa-3x mb-3'></i>
                            <Card.Text>
                                Equipe de criação do banner
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
 );
}

export default AboutPage;
