"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";
import { BiSolidEditAlt } from "react-icons/bi";

import electronicLED from "@/assets/Electronic-LED.png";
import tableAction from "@/assets/svgs/table-action.svg";
import { IoEye } from "react-icons/io5";

import data from "@/components/customers";
import { useRouter } from "next/navigation";

const Orders = () => {
  const dispatch = useDispatch();
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [selectedTab, setSelectedTab] = useState("all");
  useEffect(() => {
    dispatch(updatePageNavigation("orders"));
  }, [dispatch]);
  const fn_viewDetails = (id) => {
    if (id === selectedCustomer) {
      return setSelectedCustomer(0);
    }
    setSelectedCustomer(id);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <SearchOnTop />
          
          {/* from customer */}
          <div className="my-[20px] p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-[94vw] md:w-[67vw] lg:w-[75vw] xl:w-auto">
            <div className="flex gap-10 mb-[15px] w-[max-content]">
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
            <table className="w-[1000px] xl:w-[100%]">
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
                {data?.map((item) => (
                  <tr key={item.id} className="h-[50px] text-[14px]">
                    <td>PK09485</td>
                    <td className="flex items-center gap-1.5 h-[50px]">
                      <Image
                        alt=""
                        src={electronicLED}
                        className="h-[26px] w-[26px]"
                      />
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
                    <td className="px-[17px] relative">
                      <Image
                        alt=""
                        src={tableAction}
                        className="cursor-pointer"
                        onClick={() => fn_viewDetails(item.id)}
                      />
                      {selectedCustomer === item.id && (
                        <ViewDetails id={item.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

const ViewDetails = ({ id }) => {
  const navigate = useRouter();
  return (
    <div className="absolute py-[10px] px-[10px] flex flex-col items-center text-[var(--text-color-body)] bg-white rounded-[8px] shadow-md border border-gray-100 w-[max-content] left-[-145px] top-[13px] cursor-pointer">
      <div
        className="flex items-center gap-2.5 w-full px-2 py-1.5 hover:bg-gray-100 rounded-sm"
        onClick={() => navigate.push(`/orders/${id}`)}
      >
        <IoEye className="w-[20px] h-[20px]" />
        <p className="text-[14px]">View Details</p>
      </div>
      <div className="flex items-center gap-2.5 w-full px-2 py-1.5 hover:bg-gray-100 rounded-sm">
        <BiSolidEditAlt className="w-[20px] h-[20px]" />
        <p className="text-[14px]">Edit Order</p>
      </div>
      <div className="flex items-center gap-2.5 w-full px-2 py-1.5 hover:bg-gray-100 rounded-sm">
        <IoEye className="w-[20px] h-[20px]" />
        <p className="text-[14px]">Cancel Order</p>
      </div>
    </div>
  );
};
