import { useParams } from 'react-router-dom';

export default function RestaurantDetail() {
  const { id } = useParams();

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant ID: {id}</h1>
      <p className="text-gray-600">Menu and details coming soon...</p>
      {/* Later: fetch restaurant by id, show menu items with add to cart */}
    </div>
  );
}