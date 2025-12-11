import { Link } from "react-router";
import headerImg from "../../assets/dashboard-header.jpg";
import { FaGreaterThan } from "react-icons/fa6";

export default function PageHeader({ title, subtitle }) {
  return (
    <div
      className="relative w-full h-32 md:h-40 flex items-center justify-center"
      style={{
        backgroundImage: `url(${headerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#1a1b29]/70 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <h1 className="font-rajdhani text-3xl md:text-4xl lg:text-5xl font-bold">
          {title}
        </h1>

        {/* Breadcrumb */}
        <div className="mt-2 flex justify-center items-center space-x-2 text-sm md:text-base">
          <Link
            to="/dashboard"
            className="text-gray-200 hover:text-[#3BADE3] duration-200"
          >
            Dashboard
          </Link>
          <span className="text-gray-200">
            <FaGreaterThan />
          </span>
          <span className="text-[#2CD4C6] font-semibold">{title}</span>
          {subtitle && (
            <>
              <span className="text-gray-200">
                <FaGreaterThan />
              </span>
              <span className="text-[#2CD4C6] font-semibold">{subtitle}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
