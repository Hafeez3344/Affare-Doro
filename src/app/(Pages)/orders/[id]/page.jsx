"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { updatePageNavigation } from "@/features/features";

import { BiSolidEditAlt } from "react-icons/bi";
import { FaMoneyCheckDollar, FaCreditCard } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { PiVan } from "react-icons/pi";
import { SiHackthebox } from "react-icons/si";
import { CgNotes } from "react-icons/cg";

import img from "@/assets/profile.jpeg";
import productOne from "@/assets/dashboard-product-1.png";
import productTwo from "@/assets/dashboard-product-2.png";
import productThree from "@/assets/dashboard-product-3.png";

const OrderDetails = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatePageNavigation("orders"));
  }, [dispatch]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="bg-white rounded-[8px] font-[66] px-[20px] py-[25px] shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-[600] text-[20px]">Order ID #123456</p>
              <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-delivered)] text-[10px] text-[var(--text-color-delivered)] font-[500] flex items-center justify-center">
                Delivered
              </p>
            </div>
            <div className="mt-[25px] border border-gray-200 rounded-[8px] shadow-sm px-[20px] py-[30px] flex flex-col xl:flex-row gap-8 xl:gap-10 justify-between">
              <div>
                <p className="text-[20px] w-[500] font-[500] mb-4">
                  Order Summary
                </p>
                <div className="flex gap-10 xl:gap-3">
                  <Image
                    alt=""
                    src={img}
                    className="w-[100px] h-[100px] rounded-full"
                  />
                  <div className="flex flex-col justify-center gap-2">
                    <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                      <BiSolidEditAlt className="h-[22px] w-[22px]" />
                      Patrick Thomas
                    </div>
                    <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                      <FaMoneyCheckDollar className="h-[22px] w-[22px]" />
                      $250
                    </div>
                    <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                      <FaCreditCard className="h-[22px] w-[22px]" />
                      Credit Card
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block border border-gray-200"></div>
              <div>
                <p className="text-[20px] w-[500] font-[500] mb-4">
                  Shipping Details
                </p>
                <div className="flex flex-col justify-center gap-2">
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <CiLocationOn className="h-[22px] w-[22px]" />
                    Main St, Anytown, CA 123
                  </div>
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <PiVan className="h-[22px] w-[22px]" />
                    Standard
                  </div>
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <SiHackthebox className="h-[22px] w-[22px]" />
                    May 20, 2024
                  </div>
                </div>
              </div>
              <div className="hidden xl:block border border-gray-200"></div>
              <div>
                <p className="text-[20px] w-[500] font-[500] mb-4">
                  Notes By Customer
                </p>
                <div className="flex flex-col justify-center gap-2">
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <CgNotes className="h-[22px] w-[22px]" />
                    Customer requested gift wrapping
                  </div>
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <CgNotes className="h-[22px] w-[22px]" />I perfer
                    eco-friendly packaging
                  </div>
                </div>
              </div>
              <div className="hidden xl:block"></div>
            </div>
            <div className="mt-[25px] border border-gray-200 rounded-[8px] shadow-sm px-[20px] py-[30px]">
              <p className="text-[20px] w-[500] font-[500] mb-4">Product</p>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <div className="flex gap-7 items-center">
                    <Image
                      alt=""
                      src={productOne}
                      className="w-[75px] h-[75px] rounded-[9px]"
                    />
                    <div>
                      <p className="text-[18px] font-[500]">
                        Wireless Headphone
                      </p>
                      <p className="font-[400] text-[var(--text-color-body)]">
                        Red color
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[24px] font-[500]">$100</p>
                    <p className="font-[400] text-[var(--text-color-body)]">
                      Qty : 1
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-7 items-center">
                    <Image
                      alt=""
                      src={productTwo}
                      className="w-[75px] h-[75px] rounded-[9px]"
                    />
                    <div>
                      <p className="text-[18px] font-[500]">Cool Perfume</p>
                      <p className="font-[400] text-[var(--text-color-body)]">
                        135 In stock
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[24px] font-[500]">$100</p>
                    <p className="font-[400] text-[var(--text-color-body)]">
                      Qty : 1
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-7 items-center">
                    <Image
                      alt=""
                      src={productThree}
                      className="w-[75px] h-[75px] rounded-[9px]"
                    />
                    <div>
                      <p className="text-[18px] font-[500]">Charging Fan</p>
                      <p className="font-[400] text-[var(--text-color-body)]">
                        135 In stock
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[24px] font-[500]">$100</p>
                    <p className="font-[400] text-[var(--text-color-body)]">
                      Qty : 1
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button className="h-[50px] font-[500] rounded-[8px] text-white px-[20px] lg:px-[70px] bg-[#FE4242] mt-[25px]">Active Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
