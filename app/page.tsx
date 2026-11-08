import Navbar from "@/components/navbar";
import GalleryCard from "@/components/galleryCard";
import Gallery from "@/components/gallery";
import { JEWELRY_ITEMS } from "@/lib/db";
import Card from "@/components/Card";
import Image from "next/image";
import Imgcard from "@/components/imgcard";
import EndFooter from "@/components/endFooter";
import Reveal from "@/components/reveal";

export default function Homepage() {
  const products = JEWELRY_ITEMS;
  const coverImageUrl =
    "https://images.unsplash.com/photo-1694062045776-f48d9b6de57e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
  return (
    <main className="flex min-h-screen flex-col items-center bg-base-100 text-base-content">
      <div
        className="hero min-h-screen "
        style={{
          backgroundImage: `url(${coverImageUrl})`,
        }}
      >
        <div className="hero-overlay inset-0 bg-gradient-to-b from-[#050507]/20 via-[#050507]/50 to-[#050507]/80">
          <Navbar />
        </div>
        <div className="hero-content text-neutral-content text-center">
          <Reveal>
            <section className="border border-gray-300 p-5 w-full rounded-xl">
              <h1 className={"text-6xl text-left font-great-vibes"}>
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
                  <p className=" font-semibold text-left">
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
          <section className="border border-gray-300 w-full rounded-xl overflow-hidden">
            <div
              className="hero min-h-screen relative bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1765883591687-9256219948cd?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D)",
              }}
            >
              {/* Optional background dimming overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Content positioned precisely where you want it (top-right here) */}
              <div className="absolute inset-0 z-10 flex justify-start items-start p-10 text-neutral-content">
                <div className="max-w-md text-left">
                  <p className="text-sm font-medium">
                    Discover Beautifully Crafted Jewellery Designed For Every
                    Moment. Explore Timeless Pieces Made To Complement Your
                    Personal Style.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 z-10 flex justify-center items-center p-10 text-neutral-content">
                <div className="max-w-md text-center">
                  <p className="text-4xl font-medium font-great-vibes">
                    Jewellery That Is Simply
                    <br /> Made To Shine And <br />
                    Celebrate Your Style
                  </p>
                </div>
              </div>

              <div className="hidden md:flex absolute inset-0 z-10 flex justify-start items-end p-10 text-neutral-content">
                <Imgcard src={coverImageUrl} alt={"lady"} style={"w-50 h-70"} />
              </div>

              <div className="absolute inset-0 z-10 flex justify-end items-end p-10 text-neutral-content">
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
          <section className=" min-h-screen">
            <div className="flex flex-col items-center justify-center lg:flex-row-reverse">
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
            <h2 className="text-left text-3xl font-great-vibes">
              Explore Our Jewelry Collection
            </h2>
            <div className="w-full flex flex-wrap gap-5 justify-center mt-10">
              {products.map((product) => (
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
