import Footer from "@/components/Footer";
// import Image from "next/image";
import Link from "next/link";
import { Play, Film, Tv, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section className="w-full relative bg-[url('/hero-flix1.jpeg')] bg-cover bg-center bg-no-repeat h-47 flex flex-col items-center justify-center ">
        {/* Navigation Bar */}
        <div className="absolute top-10 w-9/10 flex items-center justify-between px-6 py-4 z-20">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold ml-2">MyFlix</span>
          </div>
          {/* Sign In Button */}
          <Link href="/login">
            <button className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition duration-300">
              Sign In
            </button>
          </Link>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 "></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center ">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Welcome to MyFlix
          </h1>
          <p className="text-xl md:text-3xl mb-6 text-white">
            Unlimited movies, TV shows, and more.
          </p>
          <p className="text-lg md:text-xl mb-6">
            Watch anywhere. Cancel anytime.
          </p>
          <Link href={`/content/`}>
            <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition duration-300">
              Start Watching
            </button>
          </Link>
        </div>

        {/* Custom Shape Divider */}
        <div className="custom-shape-divider-bottom-1725277913 absolute bottom-0 w-full ">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 pt-2 w-9/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-[80px]">Why Choose MyFlix?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Film className="w-16 h-16 mx-auto mb-6 text-purple-500" />
              <h3 className="text-xl font-semibold mb-4">
                Unlimited Movies & TV Shows
              </h3>
              <p>
                Enjoy a vast library of entertainment, from blockbusters to
                hidden gems.
              </p>
            </div>
            <div>
              <Tv className="w-16 h-16 mx-auto mb-6 text-purple-500" />
              <h3 className="text-xl font-semibold mb-4">
                Watch Anytime, Anywhere
              </h3>
              <p>
                Stream on any device, anywhere in the world, anytime you want.
              </p>
            </div>
            <div>
              <Zap className="w-16 h-16 mx-auto mb-6 text-purple-500" />
              <h3 className="text-xl font-semibold mb-4">Affordable Plans</h3>
              <p>
                Choose from a variety of plans to suit your needs and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Join MyFlix Today</h2>
        <p className="text-xl mb-6">
          Sign up now and start enjoying unlimited entertainment.
        </p>
        <Link href={`/signup`}>
          <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded hover:bg-gray-200 transition duration-300">
            Sign Up Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
