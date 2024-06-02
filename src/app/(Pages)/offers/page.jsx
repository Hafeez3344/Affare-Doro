"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";

import offerImg from "@/assets/offer-img.png";
import fillStar from "@/assets/svgs/Star.svg";
import grayStar from "@/assets/svgs/Gray-Star.svg";
import fvrtIcon from "@/assets/svgs/Favourite-icon.svg";
import whiteStar from "@/assets/svgs/white-star.svg";
import offerLike from "@/assets/svgs/offer-like.svg";

const Offers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("offers"));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <SearchOnTop />
          <div className="flex gap-5 flex-wrap py-[30px]">
            {/* product */}
            <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
              <div className="rounded-[8px] flex justify-center pt-[10px] pb-[15px] flex-col relative">
                <Image
                  src={offerImg}
                  className="h-[260px] rounded-[8px] object-cover w-[100%] px-[10px]"
                />
                <div className="px-[17px] absolute w-[340px] top-[17px] flex justify-between">
                  <div className="font-[300] flex gap-1 items-center bg-[#F69B26] w-[max-content] px-[5px] py-[3px] rounded-[7px] text-white">
                    4.8 (342)
                    <Image src={whiteStar} className="mt-[-2px]" />
                  </div>
                  <Image src={offerLike} />
                </div>
              </div>
              <div className="px-[20px]">
                <p className="capitalize text-[20px] text-center">
                  capttain pure by kapil dev xtra pure 18
                </p>
                <p className="mt-[17px] mb-[5px] text-center text-[32px] font-[600]">
                  ₹400{" "}
                </p>
                <p className="text-[var(--text-color-body)] text-[25px] text-center">
                  <span className="line-through">₹400</span>
                  &nbsp;&nbsp;
                  <span className="text-[#4FAD2E] font-[600]">20% off</span>
                </p>
              </div>
            </div>
            {/* product */}
            <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
              <div className="rounded-[8px] flex justify-center pt-[10px] pb-[15px] flex-col relative">
                <Image
                  src={offerImg}
                  className="h-[260px] rounded-[8px] object-cover w-[100%] px-[10px]"
                />
                <div className="px-[17px] absolute w-[340px] top-[17px] flex justify-between">
                  <div className="font-[300] flex gap-1 items-center bg-[#F69B26] w-[max-content] px-[5px] py-[3px] rounded-[7px] text-white">
                    4.8 (342)
                    <Image src={whiteStar} className="mt-[-2px]" />
                  </div>
                  <Image src={offerLike} />
                </div>
              </div>
              <div className="px-[20px]">
                <p className="capitalize text-[20px] text-center">
                  capttain pure by kapil dev xtra pure 18
                </p>
                <p className="mt-[17px] mb-[5px] text-center text-[32px] font-[600]">
                  ₹400{" "}
                </p>
                <p className="text-[var(--text-color-body)] text-[25px] text-center">
                  <span className="line-through">₹400</span>
                  &nbsp;&nbsp;
                  <span className="text-[#4FAD2E] font-[600]">20% off</span>
                </p>
              </div>
            </div>
            {/* product */}
            <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
              <div className="rounded-[8px] flex justify-center pt-[10px] pb-[15px] flex-col relative">
                <Image
                  src={offerImg}
                  className="h-[260px] rounded-[8px] object-cover w-[100%] px-[10px]"
                />
                <div className="px-[17px] absolute w-[340px] top-[17px] flex justify-between">
                  <div className="font-[300] flex gap-1 items-center bg-[#F69B26] w-[max-content] px-[5px] py-[3px] rounded-[7px] text-white">
                    4.8 (342)
                    <Image src={whiteStar} className="mt-[-2px]" />
                  </div>
                  <Image src={offerLike} />
                </div>
              </div>
              <div className="px-[20px]">
                <p className="capitalize text-[20px] text-center">
                  capttain pure by kapil dev xtra pure 18
                </p>
                <p className="mt-[17px] mb-[5px] text-center text-[32px] font-[600]">
                  ₹400{" "}
                </p>
                <p className="text-[var(--text-color-body)] text-[25px] text-center">
                  <span className="line-through">₹400</span>
                  &nbsp;&nbsp;
                  <span className="text-[#4FAD2E] font-[600]">20% off</span>
                </p>
              </div>
            </div>
            {/* product */}
            <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
              <div className="rounded-[8px] flex justify-center pt-[10px] pb-[15px] flex-col relative">
                <Image
                  src={offerImg}
                  className="h-[260px] rounded-[8px] object-cover w-[100%] px-[10px]"
                />
                <div className="px-[17px] absolute w-[340px] top-[17px] flex justify-between">
                  <div className="font-[300] flex gap-1 items-center bg-[#F69B26] w-[max-content] px-[5px] py-[3px] rounded-[7px] text-white">
                    4.8 (342)
                    <Image src={whiteStar} className="mt-[-2px]" />
                  </div>
                  <Image src={offerLike} />
                </div>
              </div>
              <div className="px-[20px]">
                <p className="capitalize text-[20px] text-center">
                  capttain pure by kapil dev xtra pure 18
                </p>
                <p className="mt-[17px] mb-[5px] text-center text-[32px] font-[600]">
                  ₹400{" "}
                </p>
                <p className="text-[var(--text-color-body)] text-[25px] text-center">
                  <span className="line-through">₹400</span>
                  &nbsp;&nbsp;
                  <span className="text-[#4FAD2E] font-[600]">20% off</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
