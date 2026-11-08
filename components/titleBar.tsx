import { DiamondAlt } from "@boxicons/react";

const TitleBar = () => {
  return (
    <div className="max-lg:collapse bg-base-200 lg:mb-48  w-full rounded-md border-b-1 border-gradient-to-b from-primary to-secondary">
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
            <img src="/logo.jpeg" alt="Logo" className="h-20 w-auto" />
          </button>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-bold">
            <li>
              <button>SHOP</button>
            </li>

            <li>
              <button>NEW ARRIVALS</button>
            </li>
            <li>
              <button>EARRINGS</button>
            </li>
            <li>
              <button>ABOUT</button>
            </li>
            <li>
              <button>CONTACT</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="collapse-content lg:hidden z-1">
        <ul className="menu">
          <li>
            <button>SHOP</button>
          </li>

          <li>
            <button>ABOUT</button>
          </li>
          <li>
            <button>PRODUCT</button>
          </li>
          <li>
            <button>SERVICE</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TitleBar;
