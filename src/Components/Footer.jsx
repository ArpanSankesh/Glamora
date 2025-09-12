import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
  return (
    <footer className="bg-[var(--color-accent)] px-6 pt-8 md:px-16 lg:px-36 w-full text-[var(--color-text)]">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
        
        {/* Logo + About */}
        <div className="md:max-w-96">
          <div className="flex items-center gap-2">
            <img alt="PrettyNbeauty Logo" className="h-11" src="/assets/logo_Croped.jpg" />
            <h1 className="text-3xl font-bold">PrettyNbeauty</h1>
          </div>
          <p className="mt-6 text-sm">
            Get the best salon at home services in Jamshedpur. From facials, hair care & grooming to bridal packages, our experts bring luxury beauty care to your doorstep.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
              alt="Google Play"
              className="h-10 w-auto border border-white rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row items-start justify-center md:justify-end gap-10">
          <div>
      <h2 className="font-semibold mb-5">Quick Links</h2>
      <ul className="text-sm space-y-2">
        <li><button className='cursor-pointer' onClick={() => navigate('/')}>Home</button></li>
        <li><button className='cursor-pointer' onClick={() => navigate('/about')}>About Us</button></li>
        <li><button className='cursor-pointer' onClick={() => navigate('/services')}>Services</button></li>
        <li><button className='cursor-pointer' onClick={() => navigate('/contact')}>Contact Us</button></li>
        <li><button className='cursor-pointer' onClick={() => navigate('/privacy-policy')}>Privacy Policy</button></li>
        <li><button className='cursor-pointer' onClick={() => navigate('/terms-and-conditions')}>Terms & Conditions</button></li>
      </ul>
    </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold mb-5">Get in Touch</h2>
            <div className="text-sm space-y-2">
              <p>📞 +91-9288302255</p>
              <p>✉ bookingprettynbeauty@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © PrettyNbeauty. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
