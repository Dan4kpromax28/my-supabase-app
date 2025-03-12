import React from 'react';
import Slider from 'react-slick';
import Card from '../components/Card';

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
        autoplaySpeed: 2000,
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
        <div className="max-w-6xl mx-auto px-4">
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