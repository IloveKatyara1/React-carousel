import React, { useEffect, useState, useRef } from 'react';
import './carouselComp.scss';

const Carousel = ({ children, showSlides }) => {
    const sliderContent = useRef(null);
    const dotsRef = useRef([]);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [cantMove, setCantMove] = useState(false);
    const [lastActiveDot, setLastActiveDot] = useState(0);

    const childrenSlides = React.Children.map(children, (child) => {
        return React.cloneElement(child, {
            className: child.props.className ? `${child.props.className} carouselComp_slide` : 'carouselComp_slide',
            style: { width: `${100 / showSlides}%` },
        });
    });

    const dots = childrenSlides.map((el, i) => {
        if (i % showSlides === 0) {
            return (
                <div
                    className="carouselComp__dot"
                    ref={(ref) => dotsRef.current.push(ref)}
                    key={i}
                    onClick={() => setCurrentSlide(i)}>
                    {i}
                </div>
            );
        }
    });

    const fullChildrenList = [
        ...childrenSlides
            .slice(childrenSlides.length - showSlides, childrenSlides.length)
            .map((child, index) => React.cloneElement(child, { key: `clone-${index}` })),

        ...childrenSlides,

        ...childrenSlides
            .slice(0, showSlides)
            .map((child, index) => React.cloneElement(child, { key: `clone-${index + childrenSlides.length}` })),
    ];

    const ChangeSlideByBtn = (num) => {
        let newCurrent = currentSlide;
        newCurrent += num > 0 ? showSlides : -showSlides;

        setCurrentSlide(newCurrent);
    };

    useEffect(() => {
        if (cantMove) {
            return;
        }

        sliderContent.current.style.left = (currentSlide / -showSlides) * 100 - 100 + '%';

        if (currentSlide < 0) {
            timeoutLastFirstSlide(childrenSlides.length - showSlides);
        } else if (currentSlide >= childrenSlides.length) {
            timeoutLastFirstSlide(0);
        } else {
            changeActiveDot(currentSlide);
            setLastActiveDot(currentSlide / showSlides);
        }
    }, [currentSlide]);

    const timeoutLastFirstSlide = (frstLast) => {
        setCantMove(true);

        changeActiveDot(frstLast);
        setLastActiveDot(frstLast);

        setTimeout(() => {
            sliderContent.current.style.transition = '0s all';
            sliderContent.current.style.left = (frstLast / -showSlides) * 100 - 100 + '%';

            setCurrentSlide(frstLast);

            setTimeout(() => {
                setCurrentSlide(frstLast);
                setCantMove(false);

                sliderContent.current.style.transition = '1s all';
            }, 25);
        }, 975);
    };

    const changeActiveDot = (slide) => {
        dotsRef.current[lastActiveDot].classList.remove('carouselComp__dot_active');
        dotsRef.current[slide / showSlides].classList.add('carouselComp__dot_active');
    };

    console.log(currentSlide, 'currentSlide');

    return (
        <div className="carouselComp">
            <button className="carouselComp__prev" onClick={() => ChangeSlideByBtn(-1)}>
                prev
            </button>
            <div className="carouselComp__inner">
                <div
                    className="carouselComp__content"
                    style={{ width: (fullChildrenList.length / showSlides) * 100 + '%' }}
                    ref={sliderContent}>
                    {fullChildrenList}
                </div>
            </div>
            <div className="carouselComp__dots_wrapper">{dots}</div>
            <button className="carouselComp__next" onClick={() => ChangeSlideByBtn(1)}>
                next
            </button>
        </div>
    );
};

export default Carousel;
