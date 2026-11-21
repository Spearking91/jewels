"use client";

import { CompanyImageUrl, CompanyName, CompanySlogan } from "@/lib/constants";
import { MenuRight, ShoppingBagAlt } from "@boxicons/react";
import Link from "next/link";
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

  const closeMobileMenu = () => {
    const toggle = document.getElementById(
      "navbar-1-toggle",
    ) as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
  };

  const handleNavigate = (href: string) => {
    closeMobileMenu();
    router.push(href);
  };

  return (
    <header className="max-lg:collapse w-full bg-base-200/85 backdrop-blur-md border-b border-primary/15 mb-4 lg:mb-14">
      <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 z-20 hidden max-lg:peer-checked:block bg-black/30"
      ></label>

      <div className="collapse-title navbar  max-w-7xl mx-auto px-4 lg:px-8 py-3 min-h-0 items-center">
        {/* Left: Mobile Menu Trigger & Brand Mark */}
        <div className="navbar-start flex items-center gap-2">
          <label
            htmlFor="navbar-1-toggle"
            className="btn btn-ghost btn-sm btn-square lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <MenuRight className="size-5" />
          </label>

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-base-100/50 transition-colors"
          >
            <img
              src={CompanyImageUrl}
              alt={`${CompanyName} logo`}
              className="h-9 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs lg:text-sm font-bold tracking-[0.2em] text-base-content">
                {CompanyName.toUpperCase()}
              </span>
              <span className="font-great-vibes text-primary text-base lg:text-lg leading-none mt-0.5">
                {CompanySlogan}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="navbar-center hidden lg:flex"
        >
          <ul className="flex items-center gap-7">
            {listItems.map((item) => {
              const isActive = isTabActive(item.href);
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    className={`relative py-2 text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer ${
                      isActive
                        ? "text-primary"
                        : "text-base-content/75 hover:text-base-content"
                    }`}
                  >
                    {item.tabs}
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-primary rounded-full transition-transform duration-200 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* End: Desktop Shopping Bag */}
        <div className="navbar-end hidden lg:flex">
          <label
            htmlFor="cart-drawer-toggle"
            className="btn btn-ghost btn-sm rounded-full px-3.5 gap-2 border border-base-content/10 hover:border-primary/40 hover:text-primary cursor-pointer transition-colors"
            aria-label="Open shopping bag"
          >
            <ShoppingBagAlt className="size-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider">
              Bag
            </span>
          </label>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <div className="collapse-content relative z-30 lg:hidden px-4 pb-4 pt-1">
        <div className="bg-base-100/95 border border-base-content/10 rounded-2xl p-2 shadow-xl space-y-1">
          {listItems.map((item) => {
            const isActive = isTabActive(item.href);
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-[0.16em] uppercase transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-primary/15 text-primary font-bold"
                    : "text-base-content/80 hover:bg-base-200/70"
                }`}
              >
                <span>{item.tabs}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}

          <div className="pt-1 mt-1 border-t border-base-content/10">
            <label
              htmlFor="cart-drawer-toggle"
              onClick={closeMobileMenu}
              className="w-full btn btn-ghost btn-sm justify-between rounded-xl px-4 cursor-pointer text-xs font-semibold tracking-[0.14em] uppercase"
            >
              <span className="flex items-center gap-2">
                <ShoppingBagAlt className="size-4 text-primary" />
                Shopping Bag
              </span>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TitleBar;
