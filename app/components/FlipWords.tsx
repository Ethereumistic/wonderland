import React from "react";
import { FlipWords } from "./ui/flip-words";

export function FlipWordsNav() {
  const words = ["bitcoin","crypto", "crypto", "crypto", "crypto", "crypto", "crypto", "crypto"];

  return (
    <div className=" flex justify-center items-center px-4 ">
      <div className="text-2xl font-russo mx-auto  font-normal text-neutral-800 dark:text-neutral-100">
    <div className=" flex">
        Test
        <div className="">
        <FlipWords words={words} />
        </div> <br />
        </div>
      </div>
    </div>
  );
}
