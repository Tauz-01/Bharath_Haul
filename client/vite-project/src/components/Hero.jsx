import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import video from '../assets/WhatsApp Video 2025-12-08 at 1.16.11 PM.mp4';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            textRef.current.children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );

        gsap.to(videoRef.current, {
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
                pin: false
            },
            y: 200,
            scale: 1.1,
            ease: "none"
        });

        gsap.to(textRef.current, {
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: -100,
            ease: "none"
        });

    }, []);

    return (
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
            <video
                ref={videoRef}
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50 z-10"></div>

            <div className="relative z-20 flex items-center h-full text-white">
                <div className="mx-auto px-6 md:px-12" ref={textRef}>
                    <h1 className="text-6xl font-extrabold mb-6 ">
                        Smart Logistics for a <span className="text-red-600">Better Future</span>
                    </h1><br />
                    <p className="mb-10 ml-20 text-gray-200 text-xl">
                        Connect with trusted transport owners. AI-powered matching for load type, weight, and value.
                    </p><br />

                    <div className="flex flex-col sm:flex-row gap-4 ml-120">
                        <Link to="/signup" className=" cursor-pointer border border-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition duration-300">
                            Explore Now
                        </Link>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Hero;
