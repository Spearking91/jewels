import { CompanyName } from "@/lib/constants";
import {
  Facebook,
  Instagram,
  Snapchat,
  TwitterX,
  Whatsapp,
  X,
} from "@boxicons/react";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-base-100 text-base-content items-center p-4 px-10">
      <aside className="items-center">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover" href="/about">
            About us
          </a>
          <a className="link link-hover" href="/contact">
            Contact
          </a>
        </nav>

        <p>All right reserved © 2026 {CompanyName}</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="https://wa.me/233558792803" target="_blank">
          <Whatsapp className="size-7" />
        </a>
        <a href="https://facebook.com/mart.oyce" target="_blank">
          <Facebook className="size-7" />
        </a>

        <a href="https://www.instagram.com/mart.oyce" target="_blank">
          <Instagram className="size-7" />
        </a>
        <a href="https://snapchat.com/add/p_bhite2020" target="_blank">
          <Snapchat className="size-7" />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
