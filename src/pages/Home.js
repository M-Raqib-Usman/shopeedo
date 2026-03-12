export default function Home() {
  return (
    <div className="pt-4">

      {/* Hero / Promo Banner (placeholder) */}
      <div className="mx-4 mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 text-center shadow-md">
        <h2 className="text-2xl font-bold mb-2">Hungry? Get 50% OFF</h2>
        <p className="text-sm opacity-90">Use code: FIRST50 • Min order Rs.300</p>
      </div>

      {/* Categories (horizontal scroll on mobile) */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3">What are you craving?</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {['Pizza', 'Biryani', 'Burgers', 'Groceries', 'Desserts', 'Chinese', 'Fast Food', 'Drinks'].map((cat) => (
            <div 
              key={cat}
              className="flex-shrink-0 snap-center w-24 text-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-orange-400 transition"
            >
              <div className="text-3xl mb-1">🍔</div> {/* Replace with real icons later */}
              <p className="text-sm font-medium">{cat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Restaurants Section */}
      <div className="px-4 mb-8">
        <h3 className="text-lg font-bold mb-3">Popular near Fort Abbas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="h-40 bg-gray-200" /> {/* Placeholder image */}
              <div className="p-3">
                <h4 className="font-semibold">Restaurant {i}</h4>
                <p className="text-sm text-gray-600">Biryani • Fast Food</p>
                <div className="flex items-center gap-1 mt-1 text-sm">
                  <span className="text-green-600 font-medium">4.5 ★</span>
                  <span>• 20-35 min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add more sections later: Fast delivery, Grocery stores, etc. */}

    </div>
  );
}