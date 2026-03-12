// src/pages/CategoryPage.js

import { useParams, useNavigate } from 'react-router-dom';

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  // You can later fetch real data filtered by category
  // For now – simple placeholder + back button

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
          {name}
        </h1>
      </div>

      <p className="text-gray-600 mb-8">
        Showing restaurants and items in the <strong>{name}</strong> category...
      </p>

      {/* Placeholder content – later replace with real filtered list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Example Restaurant 1</h3>
          <p className="text-sm text-gray-600">Best {name.toLowerCase()} in Jahanian</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Example Restaurant 2</h3>
          <p className="text-sm text-gray-600">Fast delivery • High rated</p>
        </div>

        {/* Add more placeholder cards or fetch real data */}
      </div>

      <div className="mt-10 text-center text-gray-500">
        <p>More restaurants coming soon...</p>
      </div>
    </div>
  );
}