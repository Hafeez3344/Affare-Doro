"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import saveChanges from "@/assets/svgs/save-changes.svg";
import { Input } from "antd";

const Settings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("settings"));
  }, [dispatch]);
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
                  <label className="text-[#777777]">Email Address</label>
                  <input
                    placeholder="ABCgmail.com"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Password</label>
                  <Input.Password
                    type="password"
                    placeholder="Enter Password"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-300 hover:border-blue-300"
                    visibilityToggle={true}
                  />
                </div>
              </div>
            </div>
            {/* <div>
              <Image
                alt=""
                src={saveChanges}
                className="mt-8 mb-3 cursor-pointer"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
