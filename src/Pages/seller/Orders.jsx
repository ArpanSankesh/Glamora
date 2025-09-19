import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const statusOptions = ["Pending", "Confirmed", "Delivered", "Cancelled"];

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        const unsub2 = onSnapshot(
          ordersRef,
          (snap2) => {
            const data2 = snap2.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setOrders(data2);
            setLoading(false);
          },
          (err2) => {
            console.error("Fallback fetch failed:", err2);
            setLoading(false);
          }
        );
        return () => unsub2();
      }
    );

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast.success(`Order #${orderId.substring(0, 5)}… updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const toggleExpanded = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleCopyToClipboard = (order) => {
  const servicesText = order.items
    .map((item) => {
      let text = `${item.name} x ${item.quantity || 1}`;
       
      if (item.services && item.services.length > 0) {
        text += "\n";
        text += item.services.map(s => ` • ${s.name}`).join("\n");
      } else if (item.items && item.items.length > 0) {
        text += "\n";
        text += item.items.map(s => ` • ${s.name}`).join("\n");
      }
       
      return text;
    })
    .join("\n\n");

  const billingDetails = `💰 BILLING: Subtotal: ₹${order.subtotal || 0} ${(order.discount || 0) > 0 ? `Discount: -₹${order.discount}\n` : ''}${order.serviceCharge !== undefined ? `Service Charge: ₹${order.serviceCharge}\n` : ''}Total Amount: ₹${order.total || 0}`;

  const clipboardText = `SERVICES: ${servicesText}

📅 APPOINTMENT DETAILS: Client Name: ${order.customerName || "N/A"} Address: ${order.address || "N/A"} Phone: ${order.phone || "N/A"} Preferred Date: ${order.date || "N/A"} Preferred Time: ${order.time || "N/A"} ⏰ Total Service Duration: ${order.totalDuration ? order.totalDuration + " min" : "Duration not specified"}

${billingDetails} `;

  navigator.clipboard.writeText(clipboardText).then(() => {
    toast.success("Order details copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    toast.error("Failed to copy details.");
  });
};
  if (loading) {
    return <div className="py-32 flex justify-center text-gray-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="py-32 flex justify-center text-gray-500">No orders found.</div>;
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery.trim()) return true;
    return order.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeOrders = filteredOrders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
  const cancelledOrders = filteredOrders.filter((o) => o.status === "Cancelled");
  const historyOrders = filteredOrders.filter((o) => o.status === "Delivered");

  const OrderCard = ({ order, muted = false, isCancelled = false }) => {
    const isExpanded = expandedOrders.has(order.id);

    return (
      <div
        className={`max-w-7xl mx-auto rounded-md border ${muted || isCancelled ? "bg-gray-50" : "bg-white"
          } ${isCancelled ? "border-red-200" : "border-gray-200"
          } text-gray-800 shadow-sm cursor-pointer transition-all`}
        onClick={() => toggleExpanded(order.id)}
      >
        {/* Collapsed View */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <p className="font-semibold text-lg">Order #{order.id?.substring(0, 8) || "N/A"}...</p>
              <p className="text-gray-500 text-sm">
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Customer ID:</span>
              <span className="px-2 py-1 rounded bg-gray-100 text-xs">
                {order.userId ? order.userId.substring(0, 8) + "..." : "N/A"}
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

          {/* Quick Info in Collapsed View */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <div>
              <span className="font-semibold">{order.customerName || "Unknown Customer"}</span> - {order.phone || "No phone"}
            </div>
            <div className="flex items-center gap-3">
              <span>Service: {order.date || "N/A"} at {order.time || "N/A"}</span>
              <span className="text-gray-500">Duration: {order.totalDuration || "N/A"} min</span>
              <span className="font-bold">₹{order.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="px-5 pb-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Full Order ID and Customer ID */}
            <div className="bg-gray-50 rounded p-3 text-sm">
              <p><strong>Full Order ID:</strong> {order.id || "N/A"}</p>
              <p><strong>Full Customer ID:</strong> {order.userId || "N/A"}</p>
            </div>

            {/* Items */}
            <div>
              <p className="font-medium mb-3">Services Ordered:</p>
              <ul className="space-y-3">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="border rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.imageUrl || item.packageImageUrl || "https://placehold.co/60x60"}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">
                            {item.name}
                          </p>
                          <span className={`${(item.quantity || 1) < 2 ? "hidden" : "text-indigo-600"}`}>
                            × {item.quantity || 1}
                          </span>
                          {item.isFree && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              FREE
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {item.isFree ? "₹0" : `₹${(item.offerPrice ?? item.price) * (item.quantity || 1)}`}
                        </p>

                        {/* FIX: Display sub-services from packages */}
                        {(item.services && item.services.length > 0) ? (
                          <div className="mt-2 p-2 bg-blue-50 rounded">
                            <p className="text-xs font-medium text-blue-800 mb-1">Services included:</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                              {item.services.map((service, serviceIdx) => (
                                <li key={serviceIdx} className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-blue-600 rounded-full flex-shrink-0"></span>
                                  {service.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (item.items && item.items.length > 0) && (
                          <div className="mt-2 p-2 bg-blue-50 rounded">
                            <p className="text-xs font-medium text-blue-800 mb-1">Services included:</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                              {item.items.map((service, serviceIdx) => (
                                <li key={serviceIdx} className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-blue-600 rounded-full flex-shrink-0"></span>
                                  {service.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )) || <li className="text-gray-500">No items found</li>}
              </ul>
            </div>

            {/* Customer Info & Service Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-semibold text-base">{order.customerName || "Unknown Customer"}</p>
                  <p className="text-gray-600">{order.phone || "No phone"}</p>
                </div>
                <div>
                  <p className="font-medium">Service Address:</p>
                  <p className="text-gray-600">{order.address || "No address provided"}</p>
                </div>
                {order.instruction && (
                  <div>
                    <p className="font-medium">Special Instructions:</p>
                    <p className="text-gray-600">{order.instruction}</p>
                  </div>
                )}
              </div>

              <div className="text-sm space-y-2">
                <div>
        <p className="font-medium">Service Details:</p>
        <p>Date: {order.date || "N/A"}</p>
        <p>Time Slot: {order.time || "N/A"}</p>
        <p className="font-medium">Total Duration: {order.totalDuration || "N/A"} min</p>
    </div>
                <div className="bg-gray-50 border rounded p-3">
                  <p>Subtotal: ₹{order.subtotal || 0}</p>
                  {(order.discount || 0) > 0 && (
                    <p className="text-green-600">Discount: -₹{(order.discount || 0).toFixed(0)}</p>
                  )}
                  {order.serviceCharge !== undefined && (
                    <p>Service Charge: ₹{order.serviceCharge}</p>
                  )}
                  <p className="font-bold text-lg">Total: ₹{order.total || 0}</p>
                </div>
              </div>
            </div>

            {/* Status Update & Copy Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                Update Status
              </label>

              <div className="relative">
                <select
                  value={order.status || "Pending"}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`
                    appearance-none px-4 py-2.5 pr-10 rounded-lg border-2 text-sm font-medium
                    cursor-pointer transition-all duration-200 min-w-[140px]
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${order.status === "Pending"
                      ? "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border-yellow-200 hover:border-yellow-300 focus:ring-yellow-200"
                      : order.status === "Confirmed"
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 hover:border-blue-300 focus:ring-blue-200"
                        : order.status === "Cancelled"
                          ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 hover:border-red-300 focus:ring-red-200"
                          : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200 hover:border-green-300 focus:ring-green-200"
                    }
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s} className="bg-white text-gray-800 font-medium">
                      {s}
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`w-4 h-4 transition-colors ${order.status === "Pending" ? "text-yellow-600"
                      : order.status === "Confirmed" ? "text-blue-600"
                        : order.status === "Cancelled" ? "text-red-600"
                          : "text-green-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${order.status === "Pending" ? "bg-yellow-400"
                    : order.status === "Confirmed" ? "bg-blue-400"
                      : order.status === "Cancelled" ? "bg-red-400"
                        : "bg-green-400"
                  }`}></div>
              </div>
              <button
                onClick={() => handleCopyToClipboard(order)}
                className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Copy Details
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-10 px-4 space-y-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none w-full sm:w-80"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600">
            {filteredOrders.length === 0 ? (
              <p>No orders found matching "{searchQuery}"</p>
            ) : (
              <p>Found {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} matching "{searchQuery}"</p>
            )}
          </div>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Active Orders</h2>
        {activeOrders.length === 0 ? (
          <p className="text-gray-500">
            {searchQuery ? `No active orders found matching "${searchQuery}"` : "No active orders"}
          </p>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Cancelled Orders</h2>
        {cancelledOrders.length === 0 ? (
          <p className="text-gray-500">
            {searchQuery ? `No cancelled orders found matching "${searchQuery}"` : "No cancelled orders"}
          </p>
        ) : (
          <div className="space-y-4">
            {cancelledOrders.map((order) => (
              <OrderCard key={order.id} order={order} isCancelled />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Order History</h2>
        {historyOrders.length === 0 ? (
          <p className="text-gray-500">
            {searchQuery ? `No delivered orders found matching "${searchQuery}"` : "No delivered orders yet"}
          </p>
        ) : (
          <div className="space-y-4">
            {historyOrders.map((order) => (
              <OrderCard key={order.id} order={order} muted />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;