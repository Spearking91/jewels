"use client";

import { ArrowLeft, ArrowRight } from "@boxicons/react";

interface CounterProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const Counter = ({ quantity, onIncrement, onDecrement }: CounterProps) => {
  return (
    <div className="join flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onDecrement}
        className="btn btn-ghost join-item px-4 text-white hover:bg-white/10"
        aria-label="Decrease quantity"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <span className="px-6 text-sm font-mono text-amber-100 font-semibold select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="btn btn-ghost join-item px-4 text-white hover:bg-white/10"
        aria-label="Increase quantity"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Counter;