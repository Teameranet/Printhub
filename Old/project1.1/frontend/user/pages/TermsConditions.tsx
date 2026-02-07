import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const TermsConditions = () => {
  return (
    <PolicyLayout title="Terms & Conditions">
      <div className="space-y-6 text-gray-600">
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <p className="font-medium">
            PLEASE READ THESE TERMS AND CONDITIONS OF USE CAREFULLY. THESE TERMS AND CONDITIONS ("T&C") MAY HAVE CHANGED SINCE YOUR LAST VISIT TO THE SITE. BY USING THE SITE, YOU INDICATE YOUR ACCEPTANCE OF THESE T&C. IF YOU DO NOT ACCEPT THESE T&C, THEN PLEASE REFRAIN FROM USING THIS SITE.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">Account and Registration Obligations</h2>
          <p>
            "Your Information" is defined as any information you provide to us in the registration, buying or listing process, in the feedback area or through any email feature. We will protect Your Information according to our Privacy Policy. If you use the Site, you are responsible for maintaining the confidentiality of Your Account and Password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under Your Account or Password.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">You also agree to:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide true, accurate, current and complete information about yourself as prompted by NewPrintHub's registration form</li>
            <li>Maintain and promptly update the Registration Data to keep it true, accurate, current and complete</li>
            <li>Accept that NewPrintHub has the right to suspend or terminate your membership if any provided information is untrue, inaccurate, not current or incomplete</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Product Availability</h2>
          <p>
            NewPrintHub does reasonable efforts to deliver all products ordered in accordance with the agreement but if for any reason the item you have ordered should be out of stock, we will endeavor to inform you within 48 hours, and let you know when the item will be back in stock or No Stock. NewPrintHub has the authority to cancel the order and the refund the amount as per refund policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cookies</h2>
          <p>
            "Cookies" are small encrypted data files that may write to your hard drive once you have accessed a website. NewPrintHub uses cookies to enhance your shopping experience with us. Cookies are used to keep track of your shopping cart and to save your password so you do not have to re-enter it each time you visit the Site.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default TermsConditions;