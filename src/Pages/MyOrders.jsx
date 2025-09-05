import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, "orders");
    // If orderBy+where needs an index, remove orderBy or create the index in Firestore console.
    const q = query(
      ordersRef,
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        // Fallback: try without orderBy if it errors due to index
        const q2 = query(ordersRef, where("userId", "==", currentUser.uid));
        onSnapshot(
          q2,
          (snap2) => {
            const data2 = snap2.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setOrders(data2);
            setLoading(false);
          },
          (err2) => {
            console.error("Fallback query failed:", err2);
            setLoading(false);
          }
        );
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const toggleExpanded = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (loading) {
    return (
      <div className="w-full h-screen items-center md:text-4xl text-xl py-32 flex justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="w-full h-screen items-center md:text-4xl text-xl py-32 flex justify-center">
        <p className="text-gray-500">Please log in to view your orders.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full h-screen items-center md:text-4xl text-xl py-32 flex justify-center">
        <p className="text-gray-500">You don't have any orders yet.</p>
      </div>
    );
  }

  // Separate active, cancelled, and history orders
  const activeOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");
  const historyOrders = orders.filter((o) => o.status === "Delivered");

  const OrderCard = ({ order, isHistory = false, isCancelled = false }) => {
    const isExpanded = expandedOrders.has(order.id);
    
    return (
      <div
        className={`bg-white border border-gray-200 shadow-sm rounded-2xl p-6 cursor-pointer transition-all ${
          isHistory || isCancelled ? "opacity-75" : ""
        }`}
        onClick={() => toggleExpanded(order.id)}
      >
        {/* Collapsed View */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">Order #{order.id.substring(0, 8)}...</p>
            <p className="text-gray-500 text-sm">
              {order.createdAt?.toDate
                ? order.createdAt.toDate().toLocaleString()
                : "Pending..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "Confirmed"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status || "Pending"}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-6 space-y-4">
            {/* Full Order ID */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-600">Full Order ID:</p>
              <p className="text-sm text-gray-800 break-all">{order.id}</p>
            </div>

            {/* Services */}
            <div>
              <p className="font-medium text-gray-800 mb-2">Services:</p>
              <ul className="space-y-3">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || "https://placehold.co/60x60?text=Service"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p>{item.name} × {item.quantity || 1}</p>
                      <p className="text-sm text-gray-600">
                        ₹{(item.offerPrice ?? item.price) * (item.quantity || 1)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-gray-600 text-sm space-y-1">
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                {order.instruction && (
                  <p><strong>Instructions:</strong> {order.instruction}</p>
                )}
              </div>
              
              <div className="text-gray-600 text-sm space-y-1">
                <p><strong>Service Date:</strong> {order.date}</p>
                <p><strong>Time Slot:</strong> {order.time}</p>
                <div className="bg-gray-50 border rounded p-3 mt-3">
                  <p>Subtotal: ₹{order.subtotal}</p>
                  {order.discount > 0 && (
                    <p className="text-green-600">Discount: -₹{order.discount.toFixed(0)}</p>
                  )}
                  <p className="font-bold text-lg">Total: ₹{order.total}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-28 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-accent)]">
        My Orders
      </h1>

      <div className="space-y-8">
        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Active Orders</h2>
            <div className="flex flex-col gap-6">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Cancelled Orders */}
        {cancelledOrders.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Cancelled Orders</h2>
            <div className="flex flex-col gap-6">
              {cancelledOrders.map((order) => (
                <OrderCard key={order.id} order={order} isCancelled={true} />
              ))}
            </div>
          </section>
        )}

        {/* Order History */}
        {historyOrders.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Order History</h2>
            <div className="flex flex-col gap-6">
              {historyOrders.map((order) => (
                <OrderCard key={order.id} order={order} isHistory={true} />
              ))}
            </div>
          </section>
        )}

        {/* No Orders Message */}
        {activeOrders.length === 0 && historyOrders.length === 0 && cancelledOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;