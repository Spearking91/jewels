import { Facebook, TwitterX, Whatsapp, X } from "@boxicons/react";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-base-100 text-base-content items-center p-4 px-10">
      <aside className="items-center">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>

        <p>All right reserved © 2026 Jewel</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a>
          <TwitterX className="size-7" />
        </a>
        <a>
          <Whatsapp className="size-7" />
        </a>
        <a>
          <Facebook className="size-7" />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
