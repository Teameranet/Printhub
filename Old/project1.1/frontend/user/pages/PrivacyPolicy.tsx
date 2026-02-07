import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const PrivacyPolicy = () => {
  return (
    <PolicyLayout title="Privacy Policy of NewPrintHub and its associated apps">
      <div className="text-center mb-8">
        <h2 className="text-xl text-gray-600">We Take Your Privacy Seriously</h2>
      </div>

      <div className="space-y-6 text-gray-600">
        <p>
          At NewPrintHub, we take your personal privacy very seriously. Protecting your online privacy is important to us, not just from a business perspective, but from an ethical one as well. We therefore are proud to share with you our honest, open and 100% understandable privacy and security policy. We do not sell our database of information about you. That is NOT our revenue model.
        </p>

        <p>
          We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent and we only use your information as described in the Privacy Policy. We view protection of your privacy as a very important community principle. We understand clearly that you and Your Information is one of our most important assets. We store and process your personal Information on our servers which are protected by physical as well as technological security devices. We use third parties to verify and certify our privacy principles. If you object to your Information being transferred or used in this way please do not use the Site.
        </p>

        <p>
          We collect "personal" information from you when you provide it to us. For example, if you purchase a product from us, we may collect your name, mailing address, telephone number and email address. If you sign up to receive a newsletter, we will collect your email address. If you take advantage of special services offered by us, we may collect other personal information about you. We use your personal information for internal purposes such as processing and keeping you informed of your order.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Information Usage</h2>
        <p>
          Under no circumstances do we rent, trade or share your Personal Information that we have collected with any other company for their marketing purposes without your consent. We reserve the right to communicate your personal information to any third party that makes a legally-compliant request for its disclosure. Otherwise, however, we will not disclose your name, address and other information which identifies you personally to any third party without your consent. We reserve the right to collect general demographic and other anonymous information that does not personally identify you. This information is not associated with your personally identifiable information and cannot be linked to you personally.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Request erasure of Your Personal Data</h2>
        <p>You have the right to ask Us to delete or remove Personal Data when there is no good reason for Us to continue processing it. In order to exercise this right, you can:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Send an email request to care@newprinthub.in from your registered email id.</li>
          <li>Or through the NewPrintHub App:
            <ul className="list-disc pl-6 mt-2">
              <li>Open the side menu</li>
              <li>Navigate to your account by tapping on the cogwheel icon in the top-right corner</li>
              <li>Press "Edit", then press "Delete account", and confirm your choice</li>
            </ul>
          </li>
        </ol>
      </div>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;