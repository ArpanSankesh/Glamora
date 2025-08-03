import React from 'react'

const AboutPoster = () => {
    return (

        <section className=" flex items-center justify-center gap-10 max-md:px-4 pb-20">
            {/* <div className="w-[500px] h-[500px] relative rounded-2xl overflow-hidden shrink-0 mt-20">
                <video
                    className="w-full h-full object-cover rounded-2xl max-h-[400px] shadow-xl border border-[var(--color-accent)]"
                    src="./src/assets/ShowReel.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                ></video>
            </div> */}
            <div className=" text-sm text-slate-600 max-w-lg">
                <h1 className="text-xl uppercase font-semibold text-[var(--color-accent)]">What we do?</h1>
                <div className="w-24 h-[3px] rounded-full bg-[var(--color-opaque)]"></div>
                <p className="mt-8">PrettyNbeauty makes beauty effortless by blending professional care with personalized styling. </p>

                <p className="mt-4">Whether you're prepping for a special event, refreshing your everyday look, or simply indulging in self-care, our curated salon services are designed to bring out your natural glow.</p>

                <p className="mt-4">From flawless hair transformations to relaxing spa treatments, we help you look beautiful, feel confident, and shine effortlessly.</p>
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