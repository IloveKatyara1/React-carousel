import React, { useEffect, useState, useRef } from 'react';
import './carouselComp.scss';

const Carousel = ({ children, showSlides }) => {
    const sliderContent = useRef(null);

    const [currentSlide, setCurrentSlide] = useState(0);

    const childrenSlides = React.Children.map(children, (child) => {
        return React.cloneElement(child, {
            className: child.props.className ? `${child.props.className} carouselComp_slide` : 'carouselComp_slide',
            style: { width: `${100 / showSlides}%` },
        });
    });

    const ChangeSlideByBtn = (num) => {
        let newCurrent = currentSlide;
        newCurrent += num > 0 ? showSlides : -showSlides;

        setCurrentSlide(newCurrent);
    };

    useEffect(() => {
        sliderContent.current.style.left = (currentSlide / -showSlides) * 100 + '%';
    }, [currentSlide]);

    console.log(currentSlide, 'currentSlide');

    return (
        <div className="carouselComp">
            <button className="carouselComp__prev" onClick={() => ChangeSlideByBtn(-1)}>
                prev
            </button>
            <div className="carouselComp__inner">
                <div
                    className="carouselComp__content"
                    style={{ width: (childrenSlides.length / showSlides) * 100 + '%' }}
                    ref={sliderContent}>
                    {childrenSlides}
                </div>
            </div>
            <button className="carouselComp__next" onClick={() => ChangeSlideByBtn(1)}>
                next
            </button>
        </div>
    );
};

export default Carousel;
