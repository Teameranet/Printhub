import React from 'react';

interface PolicyLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PolicyLayout = ({ title, children }: PolicyLayoutProps) => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold mb-8 text-purple-600">{title}</h1>
          <div className="prose max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;