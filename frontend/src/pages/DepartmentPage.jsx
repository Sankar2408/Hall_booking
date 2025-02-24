// pages/DepartmentPage.jsx
import React from 'react';
import DepartmentSelect from '../components/DepartmentSelect';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DepartmentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DepartmentSelect />
      <Footer />
    </div>
  );
};

export default DepartmentPage;
