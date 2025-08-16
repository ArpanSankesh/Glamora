import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'

const Booking = () => {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [address, setAddress] = React.useState('');

    const { cartItems, removeFromCart } = useCart();

    const handleBookingSubmit = (e) => {
        e.preventDefault();

        if (!name || !phone || !date || !time || !address || cartItems.length === 0) {
            alert("Please fill in all fields and add at least one package.");
            return;
        }

        // ✅ Always pick offerPrice if available, else price
        const total = cartItems.reduce((sum, item) => {
            const price = item.offerPrice !== undefined ? Number(item.offerPrice) : Number(item.price) || 0;
            return sum + price;
        }, 0);

        // ✅ Total Duration
        const totalDuration = cartItems.reduce((sum, item) => {
            if (item.services && item.services.length > 0) {
                return sum + item.services.reduce((s, service) => s + (service.duration || 0), 0);
            }
            return sum + (item.duration || 0);
        }, 0);

        // ✅ WhatsApp Message Format
        const message = `SERVICES:
${cartItems.map((item) => {
    if (item.services && item.services.length > 0) {
        return `${item.name}
Total Duration: ${item.duration || "Varies"}
${item.services.map((s) => `• ${s.name}${s.duration ? ` (${s.duration} mins)` : ""}`).join("\n")}`;
    } else {
        return `${item.name} : ₹ ${item.offerPrice !== undefined ? item.offerPrice : item.price}`;
    }
}).join("\n\n")}

Client Name:
${name}

Address:
${address}

Phone: ${phone}

Appointment Date: ${date}
Appointment Time: ${time}

Total Billing Amount: ${total} INR

Service Duration:
${totalDuration} MIN`;

        const whatsappNumber = "919288302255";
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(url, "_blank");

        // ✅ Clear cart after booking
        cartItems.forEach((item) => removeFromCart(item.id));

        // ✅ Optionally reset form
        setName('');
        setPhone('');
        setDate('');
        setTime('');
        setAddress('');

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

                {cartItems.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-start text-sm md:text-base font-medium pt-3">
                        <div className="flex flex-col md:flex-row items-start md:items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image} alt={product.name} />
                            </div>
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                {product.services && product.services.length > 0 && (
                                    <ul className="text-gray-600 text-sm mt-1">
                                        {product.services.map((s) => (
                                            <li key={s.id}>• {s.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-center">₹{product.offerPrice !== undefined ? product.offerPrice : product.price}</p>
                        <button onClick={() => removeFromCart(product.id)} className="cursor-pointer mx-auto">
                            ❌
                        </button>
                    </div>
                ))}

                <button onClick={() => navigate('/services')} className="group cursor-pointer flex items-center mt-8 gap-2 text-[var(--color-accent)] font-medium">
                    Continue Shopping
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
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
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
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Preferred Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-secondary)] transition rounded"
                    >
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Booking
