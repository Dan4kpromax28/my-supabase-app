import React from 'react';
import Slider from 'react-slick';
import Card from './Card';
import PropTypes from 'prop-types';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


export default function CustomSlider({subscriptions}){
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 3000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="max-w-8xl mx-auto px-4 pr-10 pl-10 md:pr-15 md:pl-15 sm:pr-8 sm:pl-8 xl:pr-30 xl:pl-30">
            <Slider {...settings}>
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="px-2">
                        <Card 
                            id={sub.id}
                            name={sub.name}
                            description={sub.description}
                            price={sub.price}
                            additional_price={sub.additional_hour_price}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

CustomSlider.propTypes = {
    subscriptions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            additional_hour_price: PropTypes.number.isRequired
        })
    ).isRequired
};