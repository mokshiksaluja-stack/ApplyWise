import React from 'react';
import Layout from '../components/Layout';

const PlaceholderPage = ({ title }) => {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-col h-64 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">This module is part of the interactive dashboard layout but currently under construction.</p>
      </div>
    </Layout>
  );
};

export default PlaceholderPage;
