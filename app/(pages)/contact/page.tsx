"use client";

import {
  Instagram,
  Tiktok,
  Whatsapp,
  Copy,
  Check,
  Envelope,
} from "@boxicons/react";
import { useEffect, useState } from "react";

const QUICK_MESSAGES = [
  "Hi! I'd like to check product availability.",
  "Hello, can I get pricing details for an item?",
  "Hi! I want to place an order.",
];

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("checkout_order");
    if (savedOrder) {
      setMessage(savedOrder);
      sessionStorage.removeItem("checkout_order");
    }
  }, []);

  const whatsappNumber = "233558792803";
  const displayPhone = "055 879 2803";

  const socialLinks = [
    {
      Icon: Whatsapp,
      label: "WhatsApp Direct",
      handle: displayPhone,
      href: `https://wa.me/${whatsappNumber}`,
      badge: "Fastest Reply",
    },
    {
      Icon: Envelope,
      label: "Email",
      handle: "arthurjoyce1421@gmail.com",
      href: "arthurjoyce1421@gmail.com",
    },
    {
      Icon: Tiktok,
      label: "TikTok",
      handle: "@oyce.jewels",
      href: "https://www.tiktok.com/@oyce.jewels",
    },
  ];

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("0204227226");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const formattedText = name.trim()
      ? `Hello, my name is ${name.trim()}.\n\n${message.trim()}`
      : message.trim();

    const encodedMessage = encodeURIComponent(formattedText);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="hero bg-base-200 min-h-screen px-4 py-12">
      <div className="hero-content flex-col lg:flex-row lg:gap-16 max-w-5xl w-full">
        {/* Left Column: Info & Social Links */}
        <div className="text-center lg:text-left flex-1">
          <div className="badge badge-primary badge-outline mb-3">
            Direct Store Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Complete Your Order
          </h1>
          <p className="py-4 text-base-content/80 text-lg max-w-md mx-auto lg:mx-0">
            Your order invoice PDF has been downloaded to your device. Review
            your order details in the message box and send them to WhatsApp,
            then attach your downloaded PDF!
          </p>

          <div className="flex flex-col gap-3 mt-4 max-w-md mx-auto lg:mx-0">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-base-100 hover:bg-base-300/70 transition-all shadow-sm border border-base-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <item.Icon className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-base-content/70">
                      {item.handle}
                    </p>
                  </div>
                </div>
                {item.badge && (
                  <span className="badge badge-success badge-sm text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}

            <button
              type="button"
              onClick={handleCopyPhone}
              className="btn btn-ghost btn-sm self-center lg:self-start mt-1 text-base-content/70"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-success" />
                  <span className="text-success">Number copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Copy phone number ({displayPhone})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive WhatsApp Message Card */}
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl border border-base-300">
          <form onSubmit={handleSend} className="card-body gap-4">
            <div>
              <h2 className="card-title text-xl">WhatsApp Checkout</h2>
              <p className="text-xs text-base-content/60 mt-1">
                Your order summary is pre-filled below. Send it and attach your
                PDF invoice!
              </p>
            </div>

            {/* Optional Name Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">
                  Your Name{" "}
                  <span className="text-base-content/40">(Optional)</span>
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kwame Mensah"
                className="input input-bordered w-full"
              />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Quick Topics</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_MESSAGES.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMessage(preset)}
                    className="badge badge-outline hover:badge-primary cursor-pointer py-3 px-2.5 text-xs transition-colors"
                  >
                    {preset.slice(0, 26)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Order Message</span>
              </label>
              <textarea
                required
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Order details..."
                className="textarea textarea-bordered w-full text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className="btn btn-success text-white mt-2 w-full gap-2"
            >
              <Whatsapp className="size-5" />
              Send Order to WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
