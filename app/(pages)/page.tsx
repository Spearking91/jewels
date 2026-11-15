import Navbar from "@/components/navbar";
import GalleryCard from "@/components/galleryCard";
import Gallery from "@/components/gallery";
import { JEWELRY_ITEMS } from "@/lib/db";
import Card from "@/components/Card";
import Image from "next/image";
import Imgcard from "@/components/imgcard";
import EndFooter from "@/components/endFooter";
import Reveal from "@/components/reveal";
import Home from "@/components/home";
import { ArrowRight } from "@boxicons/react";
import Link from "next/link";

export default function Homepage() {
  const products = JEWELRY_ITEMS;
  const currentProducts = products.slice(0, 5);
  const coverImageUrl =
    "https://images.unsplash.com/photo-1694062045776-f48d9b6de57e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
  return (
    <main className="flex min-h-screen flex-col items-center bg-base-100 text-base-content">
      <Home />
      <div
        className="hero min-h-screen "
        style={{
          backgroundImage: `url(${coverImageUrl})`,
        }}
      >
        <div className="hero-overlay inset-0 bg-gradient-to-b from-[#050507] via-[#050507]/80 via-[#050507]/30 to-[#050507]/80">
          {/* <Navbar /> */}
        </div>
        <div className="hero-content text-neutral-content text-center">
          <Reveal>
            <section className="border border-gray-300 p-5 w-full rounded-xl">
              <h1
                className={"text-6xl text-left text-primary font-great-vibes"}
              >
                Discover Modern <br />
                Jewellery
              </h1>
              <div className="w-full flex flex-row items-center gap-5">
                {/* {Display background window} */}
                <div className="hidden lg:flex">
                  <Imgcard src={coverImageUrl} alt={"lady"} style={undefined} />
                </div>
                <div className="w-full flex flex-col gap-5">
                  <Gallery />
                  <p className=" font-semibold text-left text-base-content/80">
                    Explore Timeless Jewellery Crafted To Elevate Every Look.
                    Discover Elegant Pieces Designed With Detail, Beauty, And
                    Modern Style In
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="px-5 w-full ">
        {/* {spiral} */}
        <Reveal>
          <section className=" min-h-screen flex justify-center items-center w-full md:p-5">
            <div
              className="  overflow-hidden border border-gray-300 rounded-lg min-h-screen lg:max-w-3/4 relative w-full bg-cover bg-center"
              style={{
                backgroundImage: "url(/jewel_box.jpeg)",
              }}
            >
              {/* Optional background dimming overlay */}
              <div className="absolute inset-0 bg-black/70" />

              {/* Content positioned precisely where you want it (top-right here) */}
              <div className="absolute inset-0 z-10 flex justify-start items-start p-10 text-base-content">
                <div className="max-w-md text-left">
                  <p className="text-sm font-medium">
                    Discover Beautifully Crafted Jewellery Designed For Every
                    Moment. Explore Timeless Pieces Made To Complement Your
                    Personal Style.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 z-10 flex justify-center items-center p-10 text-primary">
                <div className="max-w-md text-center">
                  <p className="text-4xl font-medium font-great-vibes">
                    Jewellery That Is Simply
                    <br /> Made To Shine And <br />
                    Celebrate Your Style
                  </p>
                </div>
              </div>

              <div className="hidden md:flex absolute inset-0 z-10 flex justify-start items-end p-10 text-base-content">
                <Imgcard
                  src={"/jewel_bag.jpeg"}
                  alt={"lady"}
                  style={"w-50 h-70"}
                />
              </div>

              <div className="absolute inset-0 z-10 flex justify-end items-end p-10 text-base-content">
                <div className="max-w-md text-right ">
                  {/* <Imgcard src={coverImageUrl} alt={"lady"} style={"w-50 h-70"} /> */}
                  <p className="text-xs font-medium">
                    Discover Elegant Jewellery Designed For Every Moment, <br />
                    Crafted To Add A Touch Of Timeless Beauty.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
        <Reveal>
          <section className=" min-h-screen flex items-center justify-center">
            <div className="flex flex-col max-w-2/3  lg:flex-row-reverse">
              <img
                alt="bracelet"
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                className="max-w-sm rounded-lg shadow-2xl"
              />
              <div>
                <h1 className="text-5xl font-bold font-great-vibes">
                  Chosen Specially for you
                </h1>
                <p className="mt-4 text-left">
                  Welcome to our jewellery store! We are passionate about
                  creating exquisite pieces that capture the essence of elegance
                  and style. Our collection features a wide range of modern
                  jewellery designs, from timeless classics to contemporary
                  statement pieces. Each piece is crafted with precision and
                  care, using high-quality materials to ensure lasting beauty.
                  Whether you're looking for a special gift or a treat for
                  yourself, we have something for everyone. Explore our
                  collection and discover the perfect piece to complement your
                  unique style.
                </p>
              </div>
            </div>
          </section>
        </Reveal>
        <Reveal>
          <section className="flex min-h-screen flex-col items-center bg-base-100 text-base-content border border-gray-300 py-20 w-full rounded-xl mt-10 ">
            <div className="flex flex-row justify-between px-20 w-full">
              <h2 className="text-left text-3xl font-great-vibes">
                Explore Our Jewelry Collection
              </h2>
              <Link href="/products" className="flex flex-row gap-2">
                View all <ArrowRight />
              </Link>
            </div>
            <div className="w-full flex flex-wrap gap-5 justify-center mt-10">
              {currentProducts.map((product) => (
                <Card
                  key={product.id}
                  thumbUrl={product.thumbUrl}
                  title={product.title}
                  subtitle={product.subtitle}
                  description={product.description}
                  category={product.category}
                  gemstone={product.gemstone}
                  metal={product.metal}
                  price={product.price}
                  redirectUrl={`/products/${encodeURIComponent(product.id)}`}
                />
              ))}
            </div>
          </section>
        </Reveal>

        <EndFooter />
      </div>
    </main>
  );
}
