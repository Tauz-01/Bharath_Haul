import React, { useEffect, useRef } from 'react';
import { FaTruck, FaWallet, FaMapMarkedAlt, FaShieldAlt, FaClock, FaRupeeSign } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: <FaTruck />,
        title: 'Faster Booking',
        desc: 'Book a lorry in seconds with our streamlined flow. No calls, no negotiations — just request and go.',
        borderColor: 'border-t-blue-500'
    },
    {
        icon: <FaMapMarkedAlt />,
        title: 'Live GPS Tracking',
        desc: 'Track your cargo in real-time with live GPS updates 24/7 for complete peace of mind.',
        borderColor: 'border-t-red-500'
    },
    {
        icon: <FaRupeeSign />,
        title: 'Affordable Pricing',
        desc: 'Transparent pricing with no hidden charges. Get the best rates for your logistics needs.',
        borderColor: 'border-t-green-500'
    },
    {
        icon: <FaShieldAlt />,
        title: 'Verified Drivers',
        desc: '100% background verified and trusted driver partners for safe and secure transport.',
        borderColor: 'border-t-purple-500'
    },
    {
        icon: <FaWallet />,
        title: 'Secure Online Payments',
        desc: 'Safe and secure online transactions with multiple payment options available.',
        borderColor: 'border-t-yellow-500'
    },
    {
        icon: <FaClock />,
        title: '24/7 Customer Support',
        desc: 'Dedicated customer support team available round the clock for your assistance.',
        borderColor: 'border-t-pink-500'
    }
];

const Features = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const wheelRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 1
                },
                y: 50,
                opacity: 0,
                ease: "power3.out"
            });

            gsap.from(wheelRef.current, {
                scrollTrigger: {
                    trigger: wheelRef.current,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 1
                },
                scale: 0.8,
                opacity: 0,
                ease: "power3.out"
            });

            gsap.utils.toArray('.feature-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 40%",
                        scrub: 1
                    },
                    y: 50,
                    opacity: 0,
                    ease: "power3.out"
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-20 bg-black">
            <div className="container mx-auto px-6">
                <div ref={titleRef} className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-white">Why Choose Bharath Haul?</h2>
                    <p className="text-white max-w-2xl mx-auto">We connect you with the best logistics solutions efficiently and securely.</p>
                </div>

                { }
                <div ref={wheelRef} className="relative max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 ${feature.borderColor} overflow-hidden`}
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-3xl mb-6 mx-auto">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-center text-sm">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <button className="border border-blue-500 hover:bg-blue-500 text-white hover:text-white px-8 py-3 rounded transition-all">
                        Get Started Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Features;
