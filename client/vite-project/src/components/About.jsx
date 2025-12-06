import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                end: "bottom 75%",
                toggleActions: "play none none reverse"
            }
        });

        tl.fromTo(imageRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
        )
            .fromTo(textRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
                "-=0.8"
            );

    }, []);

    return (
        <section id="about" ref={containerRef} className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center cursor-default">
                <div ref={imageRef} className="w-full md:w-1/2 mb-10 md:mb-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
                        alt="About Us"
                        className="rounded-lg shadow-2xl w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div ref={textRef} className="w-full md:w-1/2 md:pl-12">
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        Founded in 2024, we started with a simple mission: to make high-quality products accessible to everyone.
                        We believe in the power of good design and sustainable practices. Each item in our collection is handpicked
                        to ensure it meets our rigorous standards for quality and style.
                    </p>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Our team is passionate about delivering an exceptional shopping experience. From our seamless online store
                        to our dedicated customer support, we are here to help you find exactly what you need.
                    </p>
                    <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-lg flex items-center gap-2 group">
                        Learn More
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default About;
