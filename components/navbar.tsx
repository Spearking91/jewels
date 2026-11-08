import { DiamondAlt } from "@boxicons/react";

const Navbar = () => {
  return (
    <div className="max-lg:collapse bg-transparent lg:mb-48  w-full rounded-md">
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
            <DiamondAlt className="size-7" />
          </button>
          <div className="divider divider-primary w-full px-20 hidden lg:flex" />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
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
        <div className="navbar-end gap-5">
          <div className="divider divider-primary w-full px-20 hidden lg:flex" />
          {/* <input type="text" placeholder="Search" className="input w-64 lg:w-auto" /> */}
          <button>WISHLIST</button>
          <button>CART</button>
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

export default Navbar;
