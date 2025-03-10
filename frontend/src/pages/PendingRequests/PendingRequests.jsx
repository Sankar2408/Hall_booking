import React from "react";
import useRequestStore from "../../Dummy/requestStore";
import { Clock, MapPin, User, FileText, Calendar, CheckCircle, XCircle, Building } from "lucide-react";

const PendingRequests = () => {
  const { requests, approveRequest, rejectRequest } = useRequestStore();
  const pendingRequests = requests.filter((req) => req.status === "Pending");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Requests</h1>
          <p className="text-gray-600 mt-1">Review and process hall reservation requests</p>
        </div>
        <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
          {pendingRequests.length} Pending
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Clock className="text-blue-500" size={28} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">All requests have been processed. Check back later for new requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingRequests.map((request) => (
            <div key={request.hallId} className="bg-white rounded-lg shadow overflow-hidden border-t-4 border-blue-500">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Building className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{request.hallName}</h3>
                      <p className="text-gray-500 text-sm">ID: {request.hallId}</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-600 py-1 px-2 rounded text-xs font-medium">
                    Pending
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3">
                    <User className="text-gray-400 mt-1" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Staff:</span> {request.staffName}
                      </p>
                      <p className="text-xs text-gray-500">ID: {request.staffId}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={16} />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {request.location}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-gray-400 mt-1" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Time Slot:</span> {request.timeSlot}
                      </p>
                      <p className="text-xs text-gray-500">Requested on: {request.requestedTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="text-gray-400 mt-1" size={16} />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex border-t border-gray-200">
                <button 
                  className="flex-1 py-3 px-4 bg-white hover:bg-green-50 text-green-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset flex items-center justify-center gap-2"
                  onClick={() => approveRequest(request.hallId)}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <div className="w-px bg-gray-200"></div>
                <button 
                  className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-red-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset flex items-center justify-center gap-2"
                  onClick={() => rejectRequest(request.hallId)}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;