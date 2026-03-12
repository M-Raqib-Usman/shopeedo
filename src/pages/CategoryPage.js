import { useParams } from 'react-router-dom';

export default function CategoryPage() {
  const { name } = useParams();

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Category: {name}</h1>
      <p className="text-gray-600">Showing restaurants & items in {name} category...</p>
      {/* Later: fetch & show filtered restaurants or menu items */}
    </div>
  );
}