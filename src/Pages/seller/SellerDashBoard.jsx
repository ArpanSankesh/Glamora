import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBoxOpen, faTags, faClipboardList, faCommentDots, faPlus, faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const SellerDashBoard = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const sidebarLinks = [
        { name: "List Services", path: "/seller/list-services", icon: <FontAwesomeIcon icon={faList} /> },
        { name: "Orders", path: "/seller", icon: <FontAwesomeIcon icon={faCommentDots} /> },
        { name: "Add Service", path: "/seller/add-services", icon: <FontAwesomeIcon icon={faPlus} /> },
        { name: "Add Package", path: "/seller/add-package", icon: <FontAwesomeIcon icon={faBoxOpen} /> },
        { name: "Add Categories", path: "/seller/add-category", icon: <FontAwesomeIcon icon={faTags} /> },
        { name: "Add Offer", path: "/seller/add-offer", icon: <FontAwesomeIcon icon={faClipboardList} /> },
        { name: "Add Testimonial", path: "/seller/add-testimonial", icon: <FontAwesomeIcon icon={faQuoteLeft} /> },
        { name: "Manage Reviews", path: "/seller/manage-testimonials", icon: <FontAwesomeIcon icon={faStar} /> },
    ];

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <h1 onClick={() => navigate('/')} className='cursor-pointer text-2xl font-bold text-[var(--color-accent)]'>PrettyNbeauty</h1>
                <div className="flex items-center gap-5 text-[var(--color-accent)]">
                   <p>Welcome Back</p>
                </div>
            </div>
            <div className='flex'>
                <div className="xl:w-64 w-16 border-r h-screen text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item, index) => (
                        <Link to={item.path} key={index}
                            className={`flex items-center py-3 px-4 gap-3 
                            ${location.pathname === item.path
                                ? "border-r-4 xl:border-r-[6px] bg-indigo-500/10 border-[var(--color-secondary)] text-[var(--color-secondary)]"
                                : "hover:bg-gray-100/90 border-transparent text-gray-700"
                            }`
                            }
                        >
                            {item.icon}
                            {/* Show name only on xl screens */}
                            <p className="xl:block hidden text-center">{item.name}</p>
                        </Link>
                    ))}
                </div>
                <div className="flex-1 bg-gray-50 overflow-y-auto">
                  <Outlet />
                </div>
            </div>
        </>
    );
}

export default SellerDashBoard;