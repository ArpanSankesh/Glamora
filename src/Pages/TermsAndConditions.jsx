import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-25 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-6">
        Welcome to <strong>PrettyNbeauty</strong>. By using our website and services, you agree to the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mb-2">1. Use of Our Services</h2>
      <p className="mb-6">
        You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of our services.
      </p>

      <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
      <p className="mb-6">
        All content, trademarks, and materials on this website are owned by PrettyNbeauty and protected under copyright laws.
      </p>

      <h2 className="text-xl font-semibold mb-2">3. Purchases & Payments</h2>
      <p className="mb-6">
        When you purchase products or services from us, you agree to provide accurate billing and payment information.
      </p>

      <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
      <p className="mb-6">
        We are not liable for any indirect, incidental, or consequential damages resulting from your use of our services.
      </p>

      <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
      <p className="mb-6">
        We reserve the right to suspend or terminate your access to our services at our discretion, without prior notice, if you violate these terms.
      </p>

      <h2 className="text-xl font-semibold mb-2">6. Changes to These Terms</h2>
      <p className="mb-6">
        We may revise these terms at any time. Changes will be posted on this page, and continued use of our services indicates your acceptance.
      </p>

      <p className="mt-10">
        If you have questions about these terms, please contact us at:
        <br />
        <strong>Email:</strong> contact@example.com
      </p>
    </div>
  );
};

export default TermsAndConditions;
