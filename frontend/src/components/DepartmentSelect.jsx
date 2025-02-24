import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Bookmark, Users } from 'lucide-react';

const DepartmentSelect = () => {
  const navigate = useNavigate();
  const departments = [
    { id: 1, name: 'Computer Science', code: 'CS', students: 450, color: 'blue' },
    { id: 2, name: 'Electronics', code: 'ECE', students: 380, color: 'indigo' },
    { id: 3, name: 'Mechanical', code: 'MECH', students: 320, color: 'orange' },
    { id: 4, name: 'Civil', code: 'CIVIL', students: 290, color: 'green' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Department Selection</h1>
        <p className="text-gray-600">Choose a department to continue with your booking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {departments.map((dept) => {
          const colorClass = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100',
            indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100',
            orange: 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100',
            green: 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
          }[dept.color];

          return (
            <div
              key={dept.id}
              onClick={() => navigate(`/booking/${dept.id}`)}
              className={`rounded-xl border p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${colorClass}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className={`h-10 w-10 mr-4`} />
                  <div>
                    <h2 className="text-xl font-bold">{dept.name}</h2>
                    <div className="flex items-center mt-1">
                      <Bookmark className="h-4 w-4 mr-1" />
                      <span className="text-sm">Code: {dept.code}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{dept.students} Students</span>
                </div>
                <button className={`flex items-center justify-center rounded-full p-2 bg-white shadow-sm`}>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentSelect;