import React from "react";
import icon from "../../../public/favicon.png";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="perspective">
        <div className="cube animate-cube-rotate">
          <img src={icon} className="cube-face face-front" alt="" />
          <img src={icon} className="cube-face face-right" alt="" />
          <img src={icon} className="cube-face face-back" alt="" />
          <img src={icon} className="cube-face face-left" alt="" />
        </div>
      </div>
    </div>
  );
}
