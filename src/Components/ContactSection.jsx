import React from 'react'

const ContactSection = () => {
  return (
     <form className="flex flex-col items-center justify-center text-sm py-20">
            <p className="text-lg text-[var(--color-secondary)] font-medium md:pb-2">Contact Us</p>
            <h1 className="md:text-4xl text-2xl font-semibold text-[var(--color-accent)] pb-4">Get in touch with us</h1>
            
            <div className="flex flex-col md:flex-row items-center gap-8 w-[310px] md:w-[700px]">
                <div className="w-full">
                    <label className="text-black/70" htmlFor="name">Your Name</label>
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-[var(--color-secondary)]" type="text" required />
                </div>
                <div className="w-full">
                    <label className="text-black/70" htmlFor="name">Your Email</label>
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-[var(--color-secondary)]" type="email" required />
                </div>
            </div>
        
            <div className="mt-6 w-[310px] md:w-[700px]">
                <label className="text-black/70" htmlFor="name">Message</label>
                <textarea className="w-full mt-2 p-2 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-[var(--color-secondary)]" required></textarea>
            </div>
        
            <button type="submit" className="mt-5 bg-[var(--color-accent)] text-white font-bold h-12 w-56 px-4 rounded-xl active:scale-95 transition">Send Message</button>
        </form>
  )
}

export default ContactSection