"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";

import electronicLED from "@/assets/Electronic-LED.png";
import tableAction from "@/assets/svgs/table-action.svg";

const Orders = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("all");
  useEffect(() => {
    dispatch(updatePageNavigation("orders"));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <SearchOnTop />
          <div className="my-[20px] p-[30px] bg-white rounded-[8px] shadow-sm">
            <div className="flex gap-10 mb-[15px]">
              <p
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "all"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("all")}
              >
                All Orders
              </p>
              <p
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "delivered"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("delivered")}
              >
                Delivered
              </p>
              <p
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "pending"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("pending")}
              >
                Pending
              </p>
              <p
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "cancelled"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("cancelled")}
              >
                Cancelled
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px] h-[50px]">
                  <td>No</td>
                  <td>Product Name</td>
                  <td>Price</td>
                  <td>Date</td>
                  <td>Tracking No</td>
                  <td>Status</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                <tr className="h-[50px] text-[14px]">
                  <td>PK09485</td>
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image src={electronicLED} className="h-[26px] w-[26px]" />
                    Electronic LED
                  </td>
                  <td>$111.00</td>
                  <td>12 Jan, 2024</td>
                  <td>PK09485</td>
                  <td className="w-[130px]">
                    <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-delivered)] text-[10px] text-[var(--text-color-delivered)] font-[500] flex items-center justify-center">
                      Delivered
                    </p>
                  </td>
                  <td className="px-[17px]">
                    <Image src={tableAction} className="cursor-pointer" />
                  </td>
                </tr>
                <tr className="h-[50px] text-[14px]">
                  <td>PK09485</td>
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image src={electronicLED} className="h-[26px] w-[26px]" />
                    Electronic LED
                  </td>
                  <td>$111.00</td>
                  <td>12 Jan, 2024</td>
                  <td>PK09485</td>
                  <td className="w-[130px]">
                    <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-pending)] text-[10px] text-[var(--text-color-pending)] font-[500] flex items-center justify-center">
                      Pending
                    </p>
                  </td>
                  <td className="px-[17px]">
                    <Image src={tableAction} className="cursor-pointer" />
                  </td>
                </tr>
                <tr className="h-[50px] text-[14px]">
                  <td>PK09485</td>
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image src={electronicLED} className="h-[26px] w-[26px]" />
                    Electronic LED
                  </td>
                  <td>$111.00</td>
                  <td>12 Jan, 2024</td>
                  <td>PK09485</td>
                  <td className="w-[130px]">
                    <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-cancelled)] text-[10px] text-[var(--text-color-cancelled)] font-[500] flex items-center justify-center">
                      Cancelled
                    </p>
                  </td>
                  <td className="px-[17px]">
                    <Image src={tableAction} className="cursor-pointer" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
