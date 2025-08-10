import React from 'react'

const AboutPoster = () => {
    return (

        <section className=" flex items-center justify-center gap-10 max-md:px-4 pb-20">
            <div className=" text-sm text-slate-600 max-w-lg">
                <h1 className="text-xl uppercase font-semibold text-[var(--color-accent)]">What we do?</h1>
                <div className="w-24 h-[3px] rounded-full bg-[var(--color-opaque)]"></div>
                <p className="mt-8">Tired of salon appointments and traffic? PrettyNbeauty offer a range of beauty and hair treatments in the comfort of your home. Our skilled stylists and beauty experts use top-quality products and techniques to deliver exceptional results, tailored to your individual style and preferences." </p>

                <p className="mt-4">We believe that beauty is a personal expression. Our mission is to empower clients to feel confident and radiant by providing exceptional hair, nail, and skincare services in their own space. We offer a wide range of services, from cutting-edge haircuts and vibrant color treatments to relaxing facials and flawless makeup applications. Our experienced team is dedicated to delivering personalized experiences tailored to each client's unique needs and preferences. We are passionate about staying ahead of the latest trends and techniques to ensure our clients receive the highest quality service and leave feeling refreshed and rejuvenated."</p>

                <button
                    className="flex items-center gap-2 mt-8 hover:-translate-y-0.5 transition bg-[var(--color-accent)] py-3 px-8 rounded-full text-white">
                    <span>Book Now</span>
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                            fill="#fff" />
                    </svg>
                </button>
            </div>

        </section>

    )
}

export default AboutPoster