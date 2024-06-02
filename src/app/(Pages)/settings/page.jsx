"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import saveChanges from "@/assets/svgs/save-changes.svg";

const Settings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("settings"));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="bg-white rounded-[8px] shadow-sm p-[20px]">
            <div className="border-[2px] border-gray-200 rounded-[8px] p-[20px]">
              <p className="text-[20px] font-[500]">Profile</p>
              <div className="flex flex-col gap-5 pb-2 mt-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Your Name</label>
                  <input
                    placeholder="John Due"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Email Address</label>
                  <input
                    placeholder="john_due@gmail.com"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Phone Number</label>
                  <input
                    placeholder="+9856575775"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">City</label>
                  <input
                    placeholder="Select an option"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">State</label>
                  <input
                    placeholder="Select an option"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Address</label>
                  <input
                    placeholder="Street 23, Apartment Sector"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Pin Code</label>
                  <input
                    placeholder="Pin Code"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">About</label>
                  <textarea
                    placeholder="Write Here"
                    className="focus:outline-none py-2 border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[100px] text-[15px]"
                  />
                </div>
              </div>
            </div>
            <div>
                <Image src={saveChanges} className="mt-8 mb-3 cursor-pointer" />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
