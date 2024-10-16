import React, {useState} from 'react';

const Carousel = ({images}) => {
    const [currentImage, setCurrentImage] = useState(0);

    const nextSlide = () => {
        setCurrentSlide ((prevSlide) =>
            prevSlide === images.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0? images.length - 1 : prevSlide - 1
        );
    };

    return (
        <div className="carousel-container">
            <button className='prev' onClick={prevSlide}>
                &#10094;
            </button>

            <div className='carousel-slide'>
                <img
                src={images[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
            </div>

            <button className='next' onClick={nextSlide}>
                &#10095;
            </button>
        </div>
    );
};

export default Carousel;