import React from "react";
import PictureCard from "./pictureCard";
import { Sparkle } from "@boxicons/react";
import TitleBar from "./titleBar";

const Home = () => {
  const Design = ({ style }: { style?: any }) => (
    <div className={`${style} flex flex-row items-center w-full gap-5`}>
      <div className="border-1 w-full text-5xl font-bold" />
      <Sparkle className="size-10" />
      <div className="border-1 w-full text-5xl font-bold" />
    </div>
  );
  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center text-base-content w-full px-5">
        <TitleBar />
        <div className=" flex w-full justify-center items-center flex-col-reverse gap-5 lg:flex-row-reverse">
          <div className=" flex justify-between items-center flex-col ">
            <div className="h-50 w-full flex flex-col justify-between items-center hidden lg:flex">
              <Design />
              <Design />
            </div>
            <PictureCard
              src={"/golden-ear.jpeg"}
              description={"GOLD HOOP DROP EARRINGS"}
              price={"98"}
            />
          </div>
          <div className=" flex w-full lg:w-2/3 justify-between items-center flex-col  gap-5 lg:flex-row-reverse">
            <PictureCard
              src={"/gold_chain.jpeg"}
              description={"GOLD LINK CHAIN NECKLACE"}
              price={"189"}
            />
            <div>
              <h1 className="text-5xl font-bold">TIMLESS GOLD</h1>
              <p className="py-6 font-serif text-lg">
                Discover our curated collection of <br />
                handcrafted gold jewellery, designed
                <br /> for the modern individual.
              </p>
              <button className="btn btn-primary">Shop Now</button>
              <p className="py-6 text-primary font-bolds">
                FREE SHIPPING ON ORDERS OVER $100 • 1 YEAR WARRANTY
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
