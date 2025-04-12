import React from "react";
import { Link } from "react-router-dom";
import { BookOpenIcon, ClipboardListIcon } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Welcome back, Admin
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-6 p-8">
          <Link 
            to="/hall-review" 
            className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="bg-blue-50 rounded-2xl p-6 text-center border-2 border-blue-100 hover:border-blue-300 shadow-lg">
              <div className="flex justify-center mb-4">
                <BookOpenIcon 
                  className="w-16 h-16 text-blue-500 group-hover:text-blue-600 transition-colors" 
                />
              </div>
              <p className="text-xl font-semibold text-blue-800 group-hover:text-blue-900 transition-colors">
                Hall Review
              </p>
            </div>
          </Link>
          
          <Link 
            to="/requests" 
            className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="bg-purple-50 rounded-2xl p-6 text-center border-2 border-purple-100 hover:border-purple-300 shadow-lg">
              <div className="flex justify-center mb-4">
                <ClipboardListIcon 
                  className="w-16 h-16 text-purple-500 group-hover:text-purple-600 transition-colors" 
                />
              </div>
              <p className="text-xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">
                Requests
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;