import { CompanyImageUrl, CompanyName } from "@/lib/constants";
import { DiamondAlt, LocationAlt, MailOpen, Phone } from "@boxicons/react";
import React from "react";

const EndFooter = () => {
  const info = [
    { icon: MailOpen, text: "Hello@Jewelryhub.Com" },
    { icon: LocationAlt, text: "Ahodwo, Kumasi, Ghana" },
    { icon: Phone, text: "+233 123 456 789" },
  ];
  return (
    <section className="footer sm:footer-horizontal border-b p-10">
      <aside>
        <div className="flex flex-row items-center gap-2 text-lg font-semibold">
          <img src={CompanyImageUrl} alt="Logo" className="h-10 w-auto" />
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
            <a key={index} className="flex flex-row items-center gap-2" href="">
              <div className="bg-primary text-primary-content rounded-full p-2">
                <item.icon className="size-6" />
              </div>
              <span className="text-sm">{item.text}</span>
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
};

export default EndFooter;
