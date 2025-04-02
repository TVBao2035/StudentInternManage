import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ items, isMobile, active = null }) => {
    return (
      <>
        {items.map((item, index) => {
          const Type =
            item.type === "link" ? Link : item.type === "navlink" ? NavLink : "a";
  
          return (
            <Type
              key={index}
              to={item.href}
              className={`${
                isMobile
                  ? "block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
                  : `text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white flex items-center ${
                      active === item.id ? "active" : ""
                    }`
              }`}
              onClick={item.onClick || (() => {})}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </Type>
          );
        })}
      </>
    );
  };
  
  Navbar.propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["link", "navlink", "text"]),
        icon: PropTypes.element,
        id: PropTypes.any,
        onClick: PropTypes.func,
      })
    ).isRequired,
    isMobile: PropTypes.bool,
    active: PropTypes.any,
  };

// Khong dung proptypes
// const Navbar = ({ items = [], isMobile = false, active = null }) => {
//   return (
//     <>
//       {items.map((item, index) => {
//         const Type =
//           item.type === "link" ? Link : item.type === "navlink" ? NavLink : "a";

//         return (
//           <Type
//             key={index}
//             to={item.href}
//             className={`${
//               isMobile
//                 ? "block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
//                 : `text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white flex items-center ${
//                     active === item.id ? "active" : ""
//                   }`
//             }`}
//             onClick={item.onClick || (() => {})}
//           >
//             {item.icon && <span className="mr-2">{item.icon}</span>}
//             {item.title}
//           </Type>
//         );
//       })}
//     </>
//   );
// };

export default Navbar;
