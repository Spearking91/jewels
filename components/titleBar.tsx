"use client";

import { CompanyImageUrl, CompanyName, CompanySlogan } from "@/lib/constants";
import { MenuRight, ShoppingBagAlt } from "@boxicons/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const TitleBar = () => {
  const listItems = [
    { tabs: "HOME", href: "/" },
    { tabs: "COLLECTION", href: "/products" },
    { tabs: "ABOUT", href: "/about" },
    { tabs: "CONTACT", href: "/contact" },
  ];

  const router = useRouter();
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="max-lg:collapse bg-base-200 mb-2 lg:mb-18 w-full rounded-md border-b-1 border-gradient-to-b from-primary to-secondary">
      <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 hidden max-lg:peer-checked:block"
      ></label>

      <div className="collapse-title navbar p-3 lg:p-5 items-center">
        {/* Left: Brand & Mobile Toggle */}
        <div className="navbar-start flex items-center gap-2">
          <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
            <MenuRight />
          </label>

          <a
            href="/"
            className="btn btn-ghost h-auto py-1 px-2 flex flex-col items-center text-left"
          >
            <img
              src={CompanyImageUrl}
              alt="Logo"
              className="h-10 lg:h-12 w-auto object-contain"
            />
            <span className="text-xs lg:text-sm font-bold tracking-wide mt-1">
              {CompanyName.toUpperCase()}
            </span>
            <span className="font-great-vibes text-primary text-base lg:text-lg leading-none">
              {CompanySlogan}
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 items-center font-bold gap-2">
            {listItems.map((item, index) => {
              const isActive = isTabActive(item.href);
              return (
                <li key={index}>
                  <button
                    onClick={() => router.push(item.href)}
                    className={`rounded-none transition-all ${
                      isActive
                        ? "border-b-2 border-primary text-primary"
                        : "border-b-2 border-transparent hover:border-base-content/30"
                    }`}
                  >
                    {item.tabs}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* End: Desktop Shopping Bag */}
        <div className="navbar-end hidden lg:flex">
          <label
            htmlFor="cart-drawer-toggle"
            className="btn btn-ghost btn-circle cursor-pointer"
            aria-label="Open shopping cart"
          >
            <ShoppingBagAlt className="size-5" />
          </label>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className="collapse-content lg:hidden z-10">
        <ul className="menu bg-base-200 rounded-box p-2">
          {listItems.map((item, index) => {
            const isActive = isTabActive(item.href);
            return (
              <li key={index}>
                <button
                  onClick={() => {
                    const toggle = document.getElementById(
                      "navbar-1-toggle",
                    ) as HTMLInputElement | null;
                    if (toggle) toggle.checked = false;
                    router.push(item.href);
                  }}
                  className={`rounded-none ${
                    isActive ? "font-extrabold text-primary bg-base-300" : ""
                  }`}
                >
                  {item.tabs}
                </button>
              </li>
            );
          })}
          <li>
            <label
              htmlFor="cart-drawer-toggle"
              className="btn btn-ghost btn-sm justify-start cursor-pointer gap-2"
            >
              <ShoppingBagAlt className="size-5" />
              <span>Cart</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TitleBar;
