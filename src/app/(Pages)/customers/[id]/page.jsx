"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import grommetIconsMoney from "@/assets/svgs/grommet-icons_money.svg";
import customer from "@/assets/customer.png"

import { FaArrowRight } from "react-icons/fa6";

const CustomersDetails = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("customers"));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px] flex flex-col xl:flex-row gap-5">
          <div className="flex-1 h-[max-content]">
            <p className="text-[20px] font-[600]">Customer View Detail</p>
            <div className="mt-[20px] grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
                <p className="text-[14px] text-[var(--text-color-body)]">
                  Total Cost Order
                </p>
                <div className="flex gap-2 items-start mt-4">
                  <Image src={grommetIconsMoney} className="mt-2" />
                  <div>
                    <p className="text-[25px] font-[600]">
                      $840,820
                      <span className="text-[var(--text-color-body)]">.84</span>
                    </p>
                    <p className="text-[12px] text-[var(--text-color-body)]">
                      All time total cost
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
                <p className="text-[14px] text-[var(--text-color-body)]">
                  Total Cost Order
                </p>
                <div className="flex gap-2 items-start mt-4">
                  <Image src={grommetIconsMoney} className="mt-2" />
                  <div>
                    <p className="text-[25px] font-[600]">
                      $840,820
                      <span className="text-[var(--text-color-body)]">.84</span>
                    </p>
                    <p className="text-[12px] text-[var(--text-color-body)]">
                      All time total cost
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
                <p className="text-[14px] text-[var(--text-color-body)]">
                  Total Cost Order
                </p>
                <div className="flex gap-2 items-start mt-4">
                  <Image src={grommetIconsMoney} className="mt-2" />
                  <div>
                    <p className="text-[25px] font-[600]">
                      $840,820
                      <span className="text-[var(--text-color-body)]">.84</span>
                    </p>
                    <p className="text-[12px] text-[var(--text-color-body)]">
                      All time total cost
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm xl:col-span-3 flex flex-col lg:flex-row gap-20">
                <div className="lg:w-[40%] xl:w-[30%]">
                  <p className="text-[var(--text-color-body)] font-[500]">
                    General Data
                  </p>
                  <div className="flex items-center gap-5 text-[15px] mt-4">
                    <p className="w-[120px]">Age</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>32</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Birthday</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>01 July 1999</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Gender</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>Male</p>
                  </div>
                </div>
                <div className="border border-gray-200"></div>
                <div className="flex-1">
                  <p className="text-[var(--text-color-body)] font-[500]">
                    General Data
                  </p>
                  <div className="flex items-center gap-5 text-[15px] mt-4">
                    <p className="w-[120px]">Age</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>32</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Birthday</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>01 July 1999</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Gender</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>Male</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-[320px] bg-white rounded-[8px] shadow-sm flex items-center flex-col px-[20px] py-[39px] h-[max-content]">
            <div className="w-[65px] h-[65px] rounded-full bg-[#E0D5C9] overflow-hidden">
              <Image src={customer} className="w-[100%] h-[100%]" />
            </div>
            <p className="font-[600] mt-3">Park Kim Ju</p>
            <p className="text-[14px] font-[500] mt-1"><span className="text-[var(--text-color-body)]">ID:CUS</span>120038299</p>
            <div className="w-[100%] flex flex-col gap-2 mt-4">
              <p className="text-[14px] text-[var(--text-color-body)]">Phone Number</p>
              <p className="font-[500] text-[15px]">+18038488482</p>
            </div>
            <div className="w-[100%] flex flex-col gap-2 mt-4">
              <p className="text-[14px] text-[var(--text-color-body)]">Email</p>
              <p className="font-[500] text-[15px]">kimparkj@gmail.com</p>
            </div>
            <div className="w-[100%] flex flex-col gap-2 mt-4">
              <p className="text-[14px] text-[var(--text-color-body)]">Shipping Address</p>
              <p className="font-[500] text-[15px]">3401 S Malcolm X Blvd, Dallas, TX 75215, United States</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersDetails;
