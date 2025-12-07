import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
    { id: 1, name: 'Wireless Headphones', price: '$199', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Smart Watch', price: '$299', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' },
    { id: 3, name: 'Premium Camera', price: '$899', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, name: 'Running Shoes', price: '$129', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop' }
];

const Products = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const section = sectionRef.current;

        gsap.fromTo(headingRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1,
                    pin: true, // Uncomment to pin the heading while scrolling
                }
            }
        );

        cardsRef.current.forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 30%",
                        scrub: 1,
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, []);

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    return (
        <section id="products" ref={sectionRef} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 ref={headingRef} className="text-4xl font-bold text-center mb-16 text-gray-800">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            ref={addToRefs}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                <p className="text-blue-600 font-bold text-lg mb-4">{product.price}</p>
                                <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
