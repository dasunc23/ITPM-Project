import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-white mb-2">
          ITPM PROJECT
        </h1>
        <p className="text-lg text-center text-gray-400">
          itpm
        </p>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-green-400">
          Tailwind is Working 🚀
        </h1>
      </div>

    </div>
  );
}

export default App;