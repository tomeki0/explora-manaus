import React, { useState, useEffect } from 'react';
import '../components/aboutpage.css';
import { Card, Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import teamImage1 from '../img/card-manaus.png';
import teamImage2 from '../img/card-manaus.png';
import teamImage3 from '../img/card-manaus.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
    const navigate = useNavigate();
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        const img3 = new Image();

        img1.src = teamImage1;
        img2.src = teamImage2;
        img3.src = teamImage3;

        Promise.all([img1, img2, img3].map(img => new Promise(resolve => {
            img.onload = resolve;
        }))).then(() => setImagesLoaded(true));
    }, []);

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="about-page">
            <Button className="back-button" onClick={handleBackToHome}>
                Voltar para home
            </Button>
            <Container>
                <h1 className="text-center my-4">Sobre o Projeto</h1>

                <div className={`text-center mb-4 ${imagesLoaded ? 'loaded' : 'loading'}`}>
                    {imagesLoaded ? (
                        <Carousel interval={3000}>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 team-image"
                                    src={teamImage1}
                                    alt="Equipe do Projeto 1"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 team-image"
                                    src={teamImage2}
                                    alt="Equipe do Projeto 2"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 team-image"
                                    src={teamImage3}
                                    alt="Equipe do Projeto 3"
                                />
                            </Carousel.Item>
                        </Carousel>
                    ) : (
                        <div style={{ height: '200px', backgroundColor: '#f0f0f0' }}></div>
                    )}
                </div>

                <p className="description">
                    Explora Manaus é uma plataforma desenvolvida para permitir que usuários compartilhem
                    eventos, locais e informações relevantes sobre a cidade de Manaus. O projeto foi criado
                    com o objetivo de conectar pessoas e destacar o que há de melhor na cidade, promovendo
                    cultura, turismo e interação social.
                </p>

                <Row className="nt-5">
                    <Col md={4} className="mb-4">
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Title>Programação</Card.Title>
                                <i className="fas fa-keyboard fa-3x mb-3 icon"></i>
                                <Card.Text>
                                    <ul>
                                        <li>João Campos</li>
                                        <li>Guilherme Lima</li>
                                        <li>Luiz Guilherme</li>
                                        <li>Gustavo Mattos</li>
                                        <li>Gustavo Lopes</li>
                                        <li>Hamilton Melo</li>
                                        <li>Felipe Carvalho</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Title>Trabalho Escrito</Card.Title>
                                <i className="fas fa-paint-brush fa-3x mb-3 icon"></i>
                                <Card.Text>
                                    <ul>
                                        <li>Rickson Cavalcante</li>
                                        <li>Sara Oliveira</li>
                                        <li>Yan Carlo</li>
                                        <li>Lucas Gabriel</li>
                                        <li>Kezia Frazão</li>
                                        <li>Yanne</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="text-center h-100">
                            <Card.Body>
                                <Card.Title>Banner</Card.Title>
                                <i className="fas fa-image fa-3x mb-3 icon"></i>
                                <Card.Text>
                                    <ul>
                                        <li>Kayki Lins</li>
                                        <li>Layana Cibele</li>
                                        <li>Abe Samuel</li>
                                    </ul>
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
