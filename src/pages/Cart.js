import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getGroupedCart } = useCart();
  const navigate = useNavigate();

  const DELIVERY_FEE = 149;
  const MIN_ORDER_PER_RESTAURANT = 300;

  const grouped = getGroupedCart();
  const hasMultipleRestaurants = grouped.length > 1;

  // Calculate total delivery fees and grand total
  const totalDeliveryFees = grouped.reduce((sum, group) => {
    return sum + (group.subtotal >= MIN_ORDER_PER_RESTAURANT ? DELIVERY_FEE : 0);
  }, 0);

  const grandTotal = grouped.reduce((sum, group) => sum + group.subtotal, 0) + totalDeliveryFees;

  const formatPrice = (amount) => `Rs. ${Math.round(amount).toLocaleString()}`;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" strokeWidth={1.2} />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Add some delicious items from your favorite restaurants!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white px-10 py-4 rounded-xl font-semibold hover:bg-orange-600 transition active:scale-95 shadow-md"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-12">

      {hasMultipleRestaurants && (
        <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          <strong className="block mb-1">Multiple restaurants in cart</strong>
          Items from different restaurants will be treated as separate orders (with separate delivery fees).
        </div>
      )}

      {grouped.map((group) => {
        const deliveryFeeThis = group.subtotal >= MIN_ORDER_PER_RESTAURANT ? DELIVERY_FEE : 0;
        const needsMore = MIN_ORDER_PER_RESTAURANT - group.subtotal;
        const showMinWarning = group.subtotal < MIN_ORDER_PER_RESTAURANT;

        return (
          <div key={group.restaurantId} className="mb-10 last:mb-0">

            {/* Restaurant header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                {group.restaurantName.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-xl">{group.restaurantName}</h2>
                <p className="text-sm text-gray-600">
                  Subtotal: {formatPrice(group.subtotal)}
                </p>
              </div>
            </div>

            {/* Delivery info */}
            <div className="mb-4 text-sm">
              <p className="text-gray-700">
                Delivery fee: {deliveryFeeThis === 0 ? 'Free' : formatPrice(deliveryFeeThis)}
              </p>
              {showMinWarning && (
                <p className="text-red-600 mt-1">
                  Add Rs. {Math.round(needsMore)} more to meet minimum order
                </p>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5 border-b border-gray-100 last:border-b-0"
                >
                  {/* Placeholder image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-400">
                    🍽️
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-l-full"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-r-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Final summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-base text-gray-700">
            <span>Subtotal</span>
            <span>{formatPrice(totalSubtotal)}</span>
          </div>
          <div className="flex justify-between text-base text-gray-700">
            <span>Delivery fees</span>
            <span>{totalDeliveryFees === 0 ? 'Free' : formatPrice(totalDeliveryFees)}</span>
          </div>
          <div className="flex justify-between pt-4 border-t font-bold text-lg">
            <span>Total</span>
            <span className="text-orange-700">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        <button
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-lg transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={grandTotal === 0}
        >
          Proceed to Checkout
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Taxes and other fees may apply at checkout
        </p>
      </div>
    </div>
  );
}