// src/components/ErrorPage.jsx
import { Link } from "react-router";
import PageHeader from "../Components/Shared/PageHeader";
import errorImg from "../assets/error404.png";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 ">
      <PageHeader title="404 Error" />
      <div className="text-center max-w-md my-16">
        {/* Big 404 heading */}
        <img src={errorImg} alt="Error Image" className="animate-hang" />
        <h1 className="text-5xl font-rajdhani font-extrabold text-gradient my-8">
          404 Error
        </h1>
        {/* Short message */}
        <p className="text-xl md:text-2xl font-semibold mb-4 text-[#4A6CF7] dark:text-[#2CD4C6]">
          Oops! The page you're looking for was not found.
        </p>
        {/* Optional extra explanation */}
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">
          It might have been moved or deleted, or you may have typed the URL
          incorrectly.
        </p>
        {/* Button back home */}
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded font-medium bg-gradient hover:opacity-90 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
