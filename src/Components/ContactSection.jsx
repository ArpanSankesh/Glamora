import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCopy, faCheck, faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const phoneNumber = '919288302255';
  const displayNumber = '+91 92883 02255';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const text = `Hello! 👋\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappURL, '_blank');
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(displayNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = displayNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--color-accent)] mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to book an appointment? Send us a message via WhatsApp or give us a call!
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* WhatsApp Button */}
              <button
                type="submit"
                className="flex items-center gap-3 bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Send Message via WhatsApp
              </button>

              {/* Copy Number Button */}
              <button
                type="button"
                onClick={handleCopyNumber}
                className={`flex items-center gap-3 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 active:scale-95 ${
                  copied ? 'bg-green-500 border-green-500 text-white' : ''
                }`}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                {copied ? 'Copied!' : `Copy ${displayNumber}`}
              </button>
            </div>

            {/* Additional Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Or call us directly:</p>
                <a
                  href={`tel:${displayNumber}`}
                  className="inline-flex items-center gap-2 text-[var(--color-secondary)] hover:text-[var(--color-accent)] font-semibold text-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faPhone} />
                  {displayNumber}
                </a>
              </div>
            </div>
          </form>
        </div>

        
      </div>
    </section>
  );
};

export default ContactSection;