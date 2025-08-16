import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-25 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-6">
        At <strong>PrettyNbeauty</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our services.
      </p>

      <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect the following types of information:
      </p>
      <ul className="list-disc ml-6 mb-6">
        <li>Personal details such as name, email, and phone number.</li>
        <li>Payment and billing information.</li>
        <li>Website usage data and analytics.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
      <p className="mb-6">
        Your information is used to provide, improve, and personalize our services, process transactions, and communicate with you.
      </p>

      <h2 className="text-xl font-semibold mb-2">3. Data Protection</h2>
      <p className="mb-6">
        We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure.
      </p>

      <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
      <p className="mb-6">
        We do not sell or rent your personal data. We may share information with trusted third parties who assist in operating our services, under strict confidentiality agreements.
      </p>

      <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
      <p className="mb-6">
        You have the right to access, update, or delete your personal information by contacting us directly.
      </p>

      <h2 className="text-xl font-semibold mb-2">6. Changes to This Policy</h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
      </p>

      <p className="mt-10">
        If you have any questions, please contact us at:
        <br />
        <strong>Email:</strong> bookingprettynbeauty@gmail.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;
