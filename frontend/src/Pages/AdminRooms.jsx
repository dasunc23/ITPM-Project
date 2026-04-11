import React from 'react';
import Sidebar from '../Components/Sidebar';

function AdminRooms() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Rooms Management</h1>
          <p className="text-gray-600">Manage active game rooms and configurations.</p>
          <div className="mt-8 bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <p>Rooms management interface coming soon...</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminRooms;
