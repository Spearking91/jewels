// import { DiamondAlt } from "@boxicons/react";

// const TitleBar = () => {
//   const listItems = ["SHOP", "NEW ARRIVALS", "EARRINGS", "ABOUT", "CONTACT"];
//   return (
//     <div className="max-lg:collapse bg-base-200 lg:mb-48  w-full rounded-md border-b-1 border-gradient-to-b from-primary to-secondary">
//       <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
//       <label
//         htmlFor="navbar-1-toggle"
//         className="fixed inset-0 hidden max-lg:peer-checked:block"
//       ></label>
//       <div className="collapse-title navbar p-5">
//         <div className="navbar-start">
//           <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
//             <svg
//               aria-label="Menu"
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h8m-8 6h16"
//               />
//             </svg>
//           </label>
//           <button className="btn btn-ghost text-xl">
//             <img src="/logo.jpeg" alt="Logo" className="h-20 w-auto" />
//           </button>
//         </div>
//         <div className="navbar-center hidden lg:flex">
//           <ul className="menu menu-horizontal px-1 font-bold">
//             {listItems.map((item) => (
//               <li key={item}>
//                 <button>{item}</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="collapse-content lg:hidden z-1">
//         <ul className="menu">
//           {listItems.map((item) => (
//             <li key={item}>
//               <button>{item}</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TitleBar;

"use client";

import { CompanyImageUrl } from "@/lib/constants";
import React, { useState } from "react";

const TitleBar = () => {
  const listItems = ["SHOP", "NEW ARRIVALS", "EARRINGS", "ABOUT", "CONTACT"];

  // Track the currently active link (defaulting to the first item "SHOP")
  const [activeItem, setActiveItem] = useState("SHOP");

  return (
    <div className="max-lg:collapse bg-base-200 mb-10 lg:mb-18 w-full rounded-md border-b-1 border-gradient-to-b from-primary to-secondary">
      <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 hidden max-lg:peer-checked:block"
      ></label>

      <div className="collapse-title navbar p-5">
        <div className="navbar-start">
          <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
            <svg
              aria-label="Menu"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <button className="btn btn-ghost text-xl">
            <img src={CompanyImageUrl} alt="Logo" className="h-20 w-auto" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-bold gap-2">
            {listItems.map((item) => {
              const isActive = activeItem === item;
              return (
                <li key={item}>
                  <button
                    onClick={() => setActiveItem(item)}
                    className={`rounded-none transition-all ${
                      isActive
                        ? "border-b-2 border-primary text-primary"
                        : "border-b-2 border-transparent hover:border-base-content/30"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className="collapse-content lg:hidden z-1">
        <ul className="menu">
          {listItems.map((item) => {
            const isActive = activeItem === item;
            return (
              <li key={item}>
                <button
                  onClick={() => setActiveItem(item)}
                  className={`rounded-none ${
                    isActive ? "font-extrabold text-primary bg-base-300" : ""
                  }`}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TitleBar;
