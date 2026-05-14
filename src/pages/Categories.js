import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { getCategories } from '../services/api';

export default function Categories() {
  const navigate = useNavigate();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Emoji mapping for known category names
  const emojiMap = {
    'pizza': '🍕', 'biryani': '🍲', 'burgers': '🍔', 'burger': '🍔',
    'groceries': '🛒', 'desserts': '🍰', 'dessert': '🍰', 'chinese': '🥡',
    'fast food': '🍟', 'drinks': '🥤', 'beverages': '🥤', 'bbq': '🍖',
    'karahi': '🍛', 'paratha': '🫓', 'shawarma': '🌯', 'sandwich': '🥪',
    'pasta': '🍝', 'ice cream': '🍦', 'tea': '🍵', 'coffee': '☕',
    'main course': '🍽️', 'appetizers': '🥗', 'sides': '🥙', 'starters': '🥗',
    'seafood': '🦐', 'desi': '🍛', 'pakistani': '🇵🇰', 'naan': '🫓',
    'rice': '🍚', 'salad': '🥗', 'soup': '🍜', 'juices': '🧃',
    'smoothies': '🥤', 'chicken': '🍗', 'rolls': '🌯', 'wraps': '🌮',
  };

  // Static fallback categories
  const staticCategories = [
    { name: 'Pizza', emoji: '🍕' }, { name: 'Biryani', emoji: '🍲' },
    { name: 'Burgers', emoji: '🍔' }, { name: 'Karahi', emoji: '🍛' },
    { name: 'BBQ', emoji: '🍖' }, { name: 'Shawarma', emoji: '🌯' },
    { name: 'Sandwich', emoji: '🥪' }, { name: 'Pasta', emoji: '🍝' },
    { name: 'Chinese', emoji: '🥡' }, { name: 'Fast Food', emoji: '🍟' },
    { name: 'Desserts', emoji: '🍰' }, { name: 'Ice Cream', emoji: '🍦' },
    { name: 'Drinks', emoji: '🥤' }, { name: 'Coffee', emoji: '☕' },
    { name: 'Groceries', emoji: '🛒' }, { name: 'Seafood', emoji: '🦐' },
    { name: 'Salad', emoji: '🥗' }, { name: 'Smoothies', emoji: '🥤' }
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const categoryData = await getCategories();
        if (categoryData && categoryData.length > 0) {
          const mapped = categoryData.map(cat => ({
            name: cat,
            emoji: emojiMap[cat.toLowerCase()] || '🍴'
          }));
          setDynamicCategories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const categoriesToShow = dynamicCategories.length > 0 ? dynamicCategories : staticCategories;

  if (loading) {
    return <div className="pt-12 text-center text-lg">Loading categories...</div>;
  }

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">All Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categoriesToShow.map((item) => {
            const name = typeof item === 'string' ? item : item.name;
            const emoji = typeof item === 'string' ? emojiMap[item.toLowerCase()] : item.emoji;
            return (
              <button
                key={name}
                onClick={() => navigate(`/category/${name.toLowerCase()}`)}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition aspect-square"
              >
                {emoji ? <span className="text-3xl mb-3">{emoji}</span> : <Store size={32} className="text-gray-500 mb-2" />}
                <span className="mt-1 text-sm font-medium capitalize text-gray-800 text-center">{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
