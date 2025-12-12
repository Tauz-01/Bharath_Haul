import React, { useEffect, useRef } from 'react';
import { FaMapMarkedAlt, FaTruck, FaWallet } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const lineRef = useRef(null);
    const stepsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            
            if (lineRef.current) {
                gsap.fromTo(lineRef.current,
                    { height: 0 },
                    {
                        height: '100%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top center',
                            end: 'bottom center',
                            scrub: 1 
                        }
                    }
                );
            }

            stepsRef.current.forEach((step, index) => {
                const q = gsap.utils.selector(step);

                
                gsap.from(step, {
                    scrollTrigger: {
                        trigger: step,
                        start: "top 80%",
                        scrub: 1
                    },
                    opacity: 0.5,
                    x: index % 2 === 0 ? -50 : 50,
                    duration: 1
                });

                
                gsap.to(q('.step-icon'), {
                    scrollTrigger: {
                        trigger: step,
                        start: "top 60%",
                        toggleActions: "play reverse play reverse"
                    },
                    scale: 1.2,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !stepsRef.current.includes(el)) {
            stepsRef.current.push(el);
        }
    };

    return (
        <section id="howitworks" ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-600">3 simple steps to move your goods.</p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    { }
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform md:-translate-x-1/2 hidden md:block">
                        <div ref={lineRef} className="w-full bg-blue-500 origin-top"></div>
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        { }
                        <div ref={addToRefs} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                            { }
                            <div className="w-full md:w-5/12 text-left md:text-right pr-0 md:pr-12 mb-6 md:mb-0 order-2 md:order-1">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">1. Select & Request</h3>
                                <p className="text-gray-600">Enter pickup and drop locations and choose the right vehicle for your cargo.</p>
                            </div>
                            { }
                            <div className="step-icon relative z-10 w-16 h-16 rounded-full bg-white border-4 border-blue-500 text-blue-500 flex items-center justify-center text-2xl shadow-lg order-1 md:order-2 mb-6 md:mb-0">
                                <FaMapMarkedAlt />
                            </div>
                            { }
                            <div className="w-full md:w-5/12 pl-0 md:pl-12 order-3"></div>
                        </div>

                        { }
                        <div ref={addToRefs} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                            <div className="w-full md:w-5/12 pr-0 md:pr-12 mb-6 md:mb-0 order-2 md:order-1 hidden md:block"></div>
                            { }
                            <div className="step-icon relative z-10 w-16 h-16 rounded-full bg-white border-4 border-blue-500 text-blue-500 flex items-center justify-center text-2xl shadow-lg order-1 md:order-2 mb-6 md:mb-0">
                                <FaTruck />
                            </div>
                            { }
                            <div className="w-full md:w-5/12 text-left pl-0 md:pl-12 order-2 md:order-3">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">2. Connect With Driver</h3>
                                <p className="text-gray-600">Nearest verified driver accepts your request and shares live tracking instantly.</p>
                            </div>
                        </div>

                        { }
                        <div ref={addToRefs} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                            { }
                            <div className="w-full md:w-5/12 text-left md:text-right pr-0 md:pr-12 mb-6 md:mb-0 order-2 md:order-1">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">3. Track & Pay</h3>
                                <p className="text-gray-600">Track the trip in real-time and pay securely after completion.</p>
                            </div>
                            { }
                            <div className="step-icon relative z-10 w-16 h-16 rounded-full bg-white border-4 border-blue-500 text-blue-500 flex items-center justify-center text-2xl shadow-lg order-1 md:order-2 mb-6 md:mb-0">
                                <FaWallet />
                            </div>
                            <div className="w-full md:w-5/12 pl-0 md:pl-12 order-3"></div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-20">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                        Start Booking
                    </button>
                    <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">No waiting | No negotiation | No surprises</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
