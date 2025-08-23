import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';

const Booking = () => {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [address, setAddress] = React.useState('');

    const [couponCode, setCouponCode] = React.useState('');
    const [discount, setDiscount] = React.useState(0);
    const [appliedCoupon, setAppliedCoupon] = React.useState(null);
    const [offers, setOffers] = React.useState([]);

    const { cartItems, removeFromCart, updateQuantity } = useCart();

    // ✅ Fetch offers from Firebase on component mount
    React.useEffect(() => {
        const fetchOffers = async () => {
            try {
                const offersSnap = await getDocs(collection(db, 'offers'));
                const offersData = offersSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOffers(offersData);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    // ✅ Calculate Subtotal
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.offerPrice ?? item.price ?? 0;
        const quantity = item.quantity ?? 1;
        return sum + price * quantity;
    }, 0);

    // ✅ Calculate Grand Total (after discount)
    const total = Math.max(subtotal - discount, 0);

    // ✅ Apply Coupon (fetches from Firebase)
    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();

        // Check against Firebase offers
        const found = offers.find((offer) => {
            const offerCode = offer.useCode || offer.coupon;
            return offerCode && offerCode.toUpperCase() === code;
        });

        if (found) {
            let calculatedDiscount = 0;

            // Check if offer is still valid
            const now = Date.now();
            if (found.validDate && found.validDate < now) {
                alert("⚠️ This coupon has expired.");
                return;
            }

            // Handle percentage discount from Firebase
            if (found.discountPercentage) {
                calculatedDiscount = (subtotal * found.discountPercentage) / 100;
                setDiscount(calculatedDiscount);
                setAppliedCoupon(found);
                alert(`✅ Coupon Applied: ${found.discountPercentage}% Off`);
            }
            // Handle legacy structure (if any)
            else if (found.type === "percent") {
                calculatedDiscount = (subtotal * found.discountValue) / 100;
                setDiscount(calculatedDiscount);
                setAppliedCoupon(found);
                alert(`✅ Coupon Applied: ${found.discountValue}% Off`);
            }
            else if (found.type === "flat") {
                if (found.minAmount && subtotal < found.minAmount) {
                    alert(`⚠️ Minimum order ₹${found.minAmount} required for this coupon.`);
                    return;
                }
                setDiscount(found.discountValue);
                setAppliedCoupon(found);
                alert(`✅ Coupon Applied: ₹${found.discountValue} Off`);
            }
            else {
                // Default to 10% if no specific discount found
                calculatedDiscount = (subtotal * 10) / 100;
                setDiscount(calculatedDiscount);
                setAppliedCoupon(found);
                alert(`✅ Coupon Applied: 10% Off`);
            }
        } else {
            setDiscount(0);
            setAppliedCoupon(null);
            alert("❌ Invalid Coupon Code");
        }
    };

    // Remove applied coupon
    const removeCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();

        if (!name || !phone || !date || !time || !address || cartItems.length === 0) {
            alert("Please fill in all fields and add at least one package.");
            return;
        }

        // ✅ Total Duration
        const totalDuration = cartItems.reduce((sum, item) => {
            const quantity = item.quantity ?? 1;
            if (item.services && item.services.length > 0) {
                const serviceSum = item.services.reduce((s, service) => s + (service.duration ?? 0), 0);
                return sum + serviceSum * quantity;
            } else {
                return sum + (item.duration ?? 0) * quantity;
            }
        }, 0);

        // ✅ WhatsApp Message
        const message = `SERVICES:
${cartItems.map((item) => {
            const quantity = item.quantity ?? 1;
            if (item.services && item.services.length > 0) {
                return `${item.name} x ${quantity}
Total Duration: ${item.duration ?? "Varies"}
${item.services.map((s) => `• ${s.name}${s.duration ? ` (${s.duration} mins)` : ""}`).join("\n")}`;
            } else {
                return `${item.name} x ${quantity} : ₹ ${item.offerPrice ?? item.price ?? 0}`;
            }
        }).join("\n\n")}

Client Name:
${name}

Address:
${address}

Phone: ${phone}

Appointment Date: ${date}
Appointment Time: ${time}

Subtotal: ${subtotal} INR
${appliedCoupon ? `Coupon (${appliedCoupon.useCode || appliedCoupon.coupon}): -${discount} INR` : ''}
${discount > 0 ? `Discount: -${discount} INR` : ''}
Total Billing Amount: ${total} INR

`;

        const whatsappNumber = "919288302255";
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(url, "_blank");

        // ✅ Clear cart after booking
        cartItems.forEach((item) => removeFromCart(item.id));

        // ✅ Reset form
        setName('');
        setPhone('');
        setDate('');
        setTime('');
        setAddress('');
        setCouponCode('');
        setDiscount(0);
        setAppliedCoupon(null);

        alert("Your booking has been placed! Cart cleared.");
        navigate('/');
    };

    return (
        <div className="flex flex-col md:flex-row py-40 max-w-6xl w-full px-6 mx-auto">
            {/* Cart Section */}
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-[var(--color-accent)]">{cartItems.length} {cartItems.length === 1 ? 'Package' : 'Packages'}</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Package Details</p>
                    <p className="text-center">Price</p>
                    <p className="text-center">Action</p>
                </div>

                {cartItems.map((product) => (
                    <div key={product.id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-start text-sm md:text-base font-medium pt-3">
                        <div className="flex flex-col md:flex-row items-start md:items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden bg-gray-50">
                                {/* ✅ Fixed image display with fallback */}
                                {product.image || product.imageUrl ? (
                                    <img
                                        className="max-w-full h-full object-cover"
                                        src={product.image || product.imageUrl}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                {/* Fallback placeholder */}
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center" style={{ display: (product.image || product.imageUrl) ? 'none' : 'flex' }}>
                                    No Image
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                <div className='flex items-center mt-2'>
                                    <span className="mr-2">Qty:</span>
                                    <select
                                        value={product.quantity || 1}
                                        onChange={e => updateQuantity(product.id, Number(e.target.value))}
                                        className='outline-none border rounded px-2 py-1'
                                    >
                                        {[...Array(10)].map((_, idx) => (
                                            <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                {product.services && product.services.length > 0 && (
                                    <ul className="text-gray-600 text-sm mt-1">
                                        {product.services.map((s) => (
                                            <li key={s.id}>• {s.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <p className="text-center">
                            ₹{(product.offerPrice !== undefined ? product.offerPrice : product.price) * (product.quantity || 1)}
                        </p>

                        {/* Remove */}
                        <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-red-500 text-sm mx-auto hover:text-red-700"
                        >
                            ❌
                        </button>
                    </div>
                ))}

                {/* Coupon Section */}
                <div className="mt-6">
                    {!appliedCoupon ? (
                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter Coupon Code"
                                className="flex-1 p-2 border rounded focus:outline-none focus:border-[var(--color-accent)]"
                            />
                            <button
                                type="button"
                                onClick={applyCoupon}
                                disabled={!couponCode.trim()}
                                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-secondary)] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded max-w-md">
                            <span className="text-green-700 font-medium">
                                ✅ {appliedCoupon.title || 'Coupon Applied'} ({appliedCoupon.useCode || appliedCoupon.coupon})
                            </span>
                            <button
                                onClick={removeCoupon}
                                className="text-red-500 hover:text-red-700 ml-auto"
                            >
                                ❌
                            </button>
                        </div>
                    )}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-1 mt-6 p-4 bg-gray-50 rounded border lg:mr-10">
                    <div className="flex justify-between">
                        <span className="text-lg font-medium">Subtotal:</span>
                        <span className="text-lg font-medium">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-₹{discount.toFixed(0)}</span>
                        </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span>₹{total}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/services')}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-[var(--color-accent)] font-medium hover:text-[var(--color-secondary)] transition"
                >
                    ← Continue Shopping
                </button>
            </div>

            {/* Booking Form */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 rounded-md">
                <h2 className="text-xl font-semibold text-[var(--color-accent)] mb-4">Book Your Appointment</h2>

                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-700">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-accent)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-accent)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-accent)]"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Preferred Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Preferred Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-secondary)] transition rounded"
                        disabled={cartItems.length === 0}
                    >
                        {cartItems.length === 0 ? 'Add Items to Cart' : 'Book Appointment'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Booking