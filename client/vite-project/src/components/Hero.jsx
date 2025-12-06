import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(heroRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1 }
        )
            .fromTo(textRef.current.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 }
            )
            .fromTo(buttonRef.current,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );

    }, []);

    return (
        <section
            ref={heroRef}
            className="relative h-screen flex items-center justify-start text-gray-900 overflow-hidden"
        >
            <div className="relative z-10 text-left px-4 max-w-4xl ml-4 md:ml-32">
                <div ref={textRef}>
                    <h1 className="text-6xl font-semibold mb-6">
                        Discover the Future of Shopping
                    </h1>
                    <br />
                    <p className="text-lg md:text-xl text-gray-600 mb-8">
                        Experience premium products with a touch of magic. Curated just for you.
                    </p>
                </div>
                <button
                    ref={buttonRef}
                    className="border hover:bg-gray-600 hover:text-white transition duration-500 px-4 py-2.5 focus:outline-none"
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    Shop Now
                </button>
            </div>
            <div className='relative right-20 '>
                <img width={400} height={400} src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQORqCE2NNobtGJVl9AQQ_l5eHDVDYuzadRjjeJDQ502wTGPBMn-PYPaM5z5WoVu3MoVLGAHYs8m0qSSyha70nzGp7VnOEEu6Drk9UQMCF6iASn9XCgLF9EgUQ" style={{ transform: "rotate(-20deg)" }} />
            </div>
        </section>
    );
};

export default Hero;
