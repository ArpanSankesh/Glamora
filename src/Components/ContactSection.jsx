import React, { useState } from 'react';

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneNumber = '919572495969'; 

    const text = `Hello! 👋\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    
    window.open(whatsappURL, '_blank');
  };

  return (
    <section id="contact">
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center text-sm py-20">
        <p className="text-lg text-[var(--color-secondary)] font-medium md:pb-2">Contact Us</p>
        <h1 className="md:text-4xl text-2xl font-semibold text-[var(--color-accent)] pb-4">Get in touch with us</h1>

        <div className="flex flex-col md:flex-row items-center gap-8 w-[310px] md:w-[700px]">
          <div className="w-full">
            <label htmlFor="name">Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="h-12 p-2 mt-2 w-full border rounded" type="text" required />
          </div>
          <div className="w-full">
            <label htmlFor="email">Your Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 p-2 mt-2 w-full border rounded" type="email" required />
          </div>
        </div>

        <div className="mt-6 w-[310px] md:w-[700px]">
          <label htmlFor="message">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-2 p-2 h-40 border rounded resize-none" required></textarea>
        </div>

        <button type="submit" className="mt-5 bg-[var(--color-accent)] text-white font-bold h-12 w-56 px-4 rounded-xl active:scale-95 transition">
          Send Message via WhatsApp
        </button>
      </form>
    </section>
  );
};

export default ContactSection;
