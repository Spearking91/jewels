import { ArrowLeft } from "@boxicons/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className=" min-h-screen bg-base-100 justify-center items-center flex flex-col">
      <div className="text-center">
        <div>
          <img src={"/notfound.jpg"} alt="not-found" className="h-72" />
          <h1 className="text-5xl font-bold font-great-vibes">404 Not Founf</h1>
          <p className="py-6">
            I'm sorry, the page you are looking for does not exist.
          </p>
          <Link href="/" className="btn btn-outine border-primary">
            <ArrowLeft />
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
