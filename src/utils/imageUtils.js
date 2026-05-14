// src/utils/imageUtils.js

const IMAGE_MAP = {
  // Categories
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&auto=format&fit=crop',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800&q=80&auto=format&fit=crop',
  'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop',
  'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop',
  'desserts': 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&q=80&auto=format&fit=crop',
  'dessert': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80&auto=format&fit=crop',
  'chinese': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80&auto=format&fit=crop',
  'fast food': 'https://images.unsplash.com/photo-1626229652216-e5bb7f511917?w=800&q=80&auto=format&fit=crop',
  'drinks': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80&auto=format&fit=crop',
  'beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80&auto=format&fit=crop',
  'bbq': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format&fit=crop',
  'karahi': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80&auto=format&fit=crop',
  'shawarma': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80&auto=format&fit=crop',
  'appetizers': 'https://images.unsplash.com/photo-1541014741259-df529411b96a?w=800&q=80&auto=format&fit=crop',
  'appetizer': 'https://images.unsplash.com/photo-1541014741259-df529411b96a?w=800&q=80&auto=format&fit=crop',
  'apetizer': 'https://images.unsplash.com/photo-1541014741259-df529411b96a?w=800&q=80&auto=format&fit=crop',

  'biryanis': 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800&q=80&auto=format&fit=crop',
  'ice cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80&auto=format&fit=crop',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop',
  'tea': 'https://images.unsplash.com/photo-1544787210-229f65c713e7?w=800&q=80&auto=format&fit=crop',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80&auto=format&fit=crop',
  'pasta': 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&q=80&auto=format&fit=crop',
  'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80&auto=format&fit=crop',
  'seafood': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80&auto=format&fit=crop',
  'mutton': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80&auto=format&fit=crop',
  'beef': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&q=80&auto=format&fit=crop',
  'rolls': 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&q=80&auto=format&fit=crop',
  // New category images
  'sushi': 'https://images.unsplash.com/photo-1553621042-f82733b0d1b1?w=800&q=80&auto=format&fit=crop',
  'steak': 'https://images.unsplash.com/photo-1546241071-87a1c5d360ee?w=800&q=80&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80&auto=format&fit=crop'
};

// Enhanced image utility with flexible fallback for category keys
export const getCategoryImage = (category) => {
  if (!category) return IMAGE_MAP.default;
  const key = category.toLowerCase().trim();
  // Direct match
  if (IMAGE_MAP[key]) return IMAGE_MAP[key];
  // Try singular form (remove trailing 's')
  const singular = key.endsWith('s') ? key.slice(0, -1) : key;
  if (IMAGE_MAP[singular]) return IMAGE_MAP[singular];
  // Try alternative common misspellings
  const alternatives = ['apetizer', 'appetizer', 'appetizers'];
  if (alternatives.includes(key) && IMAGE_MAP['appetizer']) return IMAGE_MAP['appetizer'];
  // Fallback to default image
  return IMAGE_MAP.default;
};



export const imageMap = IMAGE_MAP;
export default IMAGE_MAP;
