import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Bookmark, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const DepartmentSelect = () => {
  const navigate = useNavigate();
  const departments = [
    { 
      id: 1, 
      name: 'Computer Science', 
      code: 'CS', 
      students: 450,
      description: 'Innovating technology and software solutions'
    },
    { 
      id: 2, 
      name: 'Electronics', 
      code: 'ECE', 
      students: 380,
      description: 'Advancing electronic and communication technologies'
    },
    { 
      id: 3, 
      name: 'Mechanical', 
      code: 'MECH', 
      students: 320,
      description: 'Designing and engineering mechanical systems'
    },
    { 
      id: 4, 
      name: 'Civil', 
      code: 'CIVIL', 
      students: 290,
      description: 'Building infrastructure for the future'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Department Selection
          </h1>
          <p className="text-xl text-gray-600">
            Choose a department to proceed with your hall booking
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8"
        >
          {departments.map((dept) => (
            <motion.div
              key={dept.id}
              variants={itemVariants}
              whileHover="hover"
              onClick={() => navigate(`/booking/${dept.id}`)}
              className="bg-white shadow-lg rounded-2xl overflow-hidden 
                         cursor-pointer transform transition-all 
                         hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {dept.name}
                    </h2>

                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {dept.description}
                </p>

                <div className="flex justify-between items-center border-t pt-4 mt-4">

                  <button 
                    className="bg-blue-100 text-blue-600 p-2 rounded-full 
                               hover:bg-blue-200 hover:text-blue-700 
                               transition-all"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentSelect;