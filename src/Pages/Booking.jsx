import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext'


const Booking = () => {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');

    const { cartItems, removeFromCart } = useCart();

    const handleBookingSubmit = (e) => {
  e.preventDefault();

  if (!name || !phone || !date || !time || cartItems.length === 0) {
    alert("Please fill in all fields and add at least one service.");
    return;
  }

  const services = cartItems.map(item => `• ${item.name} - ₹${item.offerPrice}`).join("%0A");
  const total = cartItems.reduce((sum, item) => sum + (item.offerPrice * (item.quantity || 1)), 0);

  const message = `
 Booking Request

👤 Name: ${name}
📞 Phone: ${phone}
📅 Date: ${date}
⏰ Time: ${time}

💅 Services:
${cartItems.map(item => `• ${item.name} - ₹${item.offerPrice}`).join("\n")}

💰 Total Amount: ₹${total}
`.trim();


  const whatsappNumber = "919572495969"; 
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};



    return (
        <div className="flex flex-col md:flex-row py-40 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-[var(--color-accent)]">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartItems.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <p className="hidden md:block font-semibold">{product.time} min</p>
                            </div>
                        </div>
                        <p className="text-center">₹{product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product.id)} className="cursor-pointer mx-auto">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>)
                )}

                <button onClick={() => (navigate('/services'))} className="group cursor-pointer flex items-center mt-8 gap-2 text-[var(--color-accent)] font-medium">
                    Continue Shopping
                </button>

            </div>
            {/* book */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 rounded-md">
                <h2 className="text-xl font-semibold text-[var(--color-accent)] mb-4">Book Your Appointment</h2>

                <form
                    onSubmit={handleBookingSubmit}
                    className="flex flex-col gap-4"
                >
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
                        <label className="text-sm text-gray-700">Preferred Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]} // prevents past dates
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