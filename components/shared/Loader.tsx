"use client";

import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const Loader = () => {
  const animationURL = "/animations/loadingAnimation.json";

  return (
    <div className="h-screen w-full flex justify-center items-center bg-dark-4">
      <Player
        src={animationURL}
        autoplay
        speed={1}
        style={{
          height: "350px",
          width: "350px",
        }}
      />
      ;
    </div>
  );
};

export default Loader;
