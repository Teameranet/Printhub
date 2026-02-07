import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const DeliveryPolicy = () => {
  return (
    <PolicyLayout title="Delivery & Return Policy">
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-2xl font-bold mb-4">Highlights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cash on Delivery not available</li>
            <li>Delivery charges depend on the location and weight of the order</li>
            <li>2-3 business days for deliveries to Metro cities (Bangalore, Chennai, Delhi, Kolkata & Mumbai)</li>
            <li>3-7 business days for deliveries to the rest of India</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Details of our delivery service</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Refund Policy</h3>
          <p>
            If an order is placed on our website and your payment is deducted, but your order is cancelled for any reason (Personal Request, Design Issue, etc.), we will reimburse your money within 7-10 working days.
          </p>
          <p className="mt-2">
            However, if you cancel your order to place a reorder with different job, then we will transfer your money as "Re-Order Token" to your account, which you may use to place future order with us.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Return</h3>
          <p>Only if the package is being damaged/incorrect product being sent return is acceptable and the same has to be mentioned to the carrier while accepting the product.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Damaged Product being received</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>If the product received has the exterior box/cover tampered with, DO NOT ACCEPT IT. Instead, snap a picture and share it with us while rejecting it, which may help us place a fresh order before the damaged one is returned to us for inquiry.</li>
            <li>If the product is received in fine condition but the inside product is damaged, we will assist you in managing it; however, if the opening video is available, we will assist you in sending the replacement order without question.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Products</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Print Products</h3>
              <ul className="space-y-2">
                <li>Business Cards</li>
                <li>Brochures</li>
                <li>Flyers</li>
                <li>Banners</li>
                <li>Posters</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Promotional Items</h3>
              <ul className="space-y-2">
                <li>T-Shirts</li>
                <li>Mugs</li>
                <li>Pens</li>
                <li>Keychains</li>
                <li>Calendars</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Corporate Gifts</h3>
              <ul className="space-y-2">
                <li>Custom Notebooks</li>
                <li>Power Banks</li>
                <li>USB Drives</li>
                <li>Award Plaques</li>
                <li>Gift Sets</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default DeliveryPolicy;