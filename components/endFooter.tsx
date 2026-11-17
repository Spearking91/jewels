import { CompanyImageLogoUrl, CompanyName } from "@/lib/constants";
import {
  DiamondAlt,
  Envelope,
  LocationAlt,
  MailOpen,
  Phone,
} from "@boxicons/react";
import React from "react";

const EndFooter = () => {
  const info = [
    { icon: Envelope, text: "arthurjoyce1421@gmail.com", href: ""},
    { icon: LocationAlt, text: "A-line, Kumasi, Ghana" },
    { icon: Phone, text: "0558792803", subtext: "0597288409" },
  ];
  return (
    <section className="footer sm:footer-horizontal border-b p-10">
      <aside>
        <div className="flex flex-row items-center gap-2 text-lg font-semibold">
          <img src={CompanyImageLogoUrl} alt="Logo" className="h-10 w-auto" />
          <h2>{CompanyName.toUpperCase()}</h2>
        </div>
        <p>
          <br />
          Discover Elegant Jewelry Designed To Celebrate Every Moment. Explore
          <br className="hidden sm:block" />
          Timeless Pieces, Refined Details, And Effortless Style That
          <br className="hidden sm:block" />
          Complements Your Unique Taste.
        </p>
      </aside>
      <nav>
        {/* <h6 className="footer-title">Social</h6> */}
        <div className="grid grid-flow-row gap-4">
          {info.map((item, index) => (
            <a key={index} className="flex flex-row items-center gap-2" href={item.href}>
              <div className="bg-primary text-primary-content rounded-full p-2">
                <item.icon className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm">{item.text}</span>
                <span className="text-sm">{item.subtext}</span>
              </div>
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
};

export default EndFooter;
