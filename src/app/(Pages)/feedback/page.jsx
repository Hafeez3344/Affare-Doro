"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";

import cancel from "@/assets/svgs/cancel.svg";
import submit from "@/assets/svgs/submit.svg";

const Feedback = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("feedback"));
  }, [dispatch]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <SearchOnTop />
          <div className="my-[20px] px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
            <p className="text-[21px] font-[600]">Help us improve Grazle</p>
            <p className="text-[15px] text-[var(--text-color-body)] mt-2">
              We are always working to improve the app and your feedback is an
              important part of that process.
            </p>
            <div className="flex flex-col gap-5 pb-2 mt-5">
              <div className="flex flex-col gap-1">
                <label className="text-[#777777]">Title</label>
                <input
                  placeholder="Title"
                  className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#777777]">Your Feedback</label>
                <textarea
                  placeholder="What's going well? What could be better?"
                  className="focus:outline-none border-[2px] border-gray-200 py-2 rounded-[8px] px-[15px] h-[100px] text-[15px]"
                />
              </div>
              <p className="text-[16px] text-[var(--text-color-body)] mt-2">
                Your feedback will help us make the app better for everyone.
              </p>
              <div className="flex justify-end gap-5 mt-5 flex-col sm:flex-row items-center sm:items-start">
                <Image alt="" src={cancel} className="cursor-pointer" />
                <Image alt="" src={submit} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
