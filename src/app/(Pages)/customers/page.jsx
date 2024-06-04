"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";

import tableNameImg from "@/assets/profile.jpeg";
import electronicLED from "@/assets/Electronic-LED.png";
import tableAction from "@/assets/svgs/table-action.svg";

import { IoEye } from "react-icons/io5";

import data from "@/components/customers";
import { useRouter } from "next/navigation";

const Customers = () => {
  const dispatch = useDispatch();
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  useEffect(() => {
    dispatch(updatePageNavigation("customers"));
  }, []);
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
          <div className="my-[20px] p-[30px] bg-white rounded-[8px] shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px]">
                  <td>Name</td>
                  <td>Email Address</td>
                  <td>Phone Number</td>
                  <td>Recent Orders</td>
                  <td>Order Status</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr className="h-[50px] text-[14px]">
                    <td className="flex items-center gap-1.5 h-[50px]">
                      <Image
                        src={tableNameImg}
                        className="h-[26px] w-[26px] rounded-[5px]"
                      />
                      John Due
                    </td>
                    <td>john-due@gmail.com</td>
                    <td>+01 755776544 66</td>
                    <td className="flex items-center gap-1.5 h-[50px]">
                      <Image
                        src={electronicLED}
                        className="h-[26px] w-[26px]"
                      />
                      Electronic LED
                    </td>
                    <td className="w-[150px] ps-[20px]">
                      <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-delivered)] text-[10px] text-[var(--text-color-delivered)] font-[500] flex items-center justify-center">
                        Delivered
                      </p>
                    </td>
                    <td className="px-[17px] relative">
                      <Image
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
                {/* <tr className="h-[50px] text-[14px]">
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image
                      src={tableNameImg}
                      className="h-[26px] w-[26px] rounded-[5px]"
                    />
                    John Due
                  </td>
                  <td>john-due@gmail.com</td>
                  <td>+01 755776544 66</td>
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image src={electronicLED} className="h-[26px] w-[26px]" />
                    Electronic LED
                  </td>
                  <td className="w-[150px] ps-[20px]">
                    <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-pending)] text-[10px] text-[var(--text-color-pending)] font-[500] flex items-center justify-center">
                      Pending
                    </p>
                  </td>
                  <td className="px-[17px]">
                    <Image src={tableAction} className="cursor-pointer" />
                  </td>
                </tr>
                <tr className="h-[50px] text-[14px]">
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image
                      src={tableNameImg}
                      className="h-[26px] w-[26px] rounded-[5px]"
                    />
                    John Due
                  </td>
                  <td>john-due@gmail.com</td>
                  <td>+01 755776544 66</td>
                  <td className="flex items-center gap-1.5 h-[50px]">
                    <Image src={electronicLED} className="h-[26px] w-[26px]" />
                    Electronic LED
                  </td>
                  <td className="w-[150px] ps-[20px]">
                    <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-cancelled)] text-[10px] text-[var(--text-color-cancelled)] font-[500] flex items-center justify-center">
                      Cancelled
                    </p>
                  </td>
                  <td className="px-[17px]">
                    <Image src={tableAction} className="cursor-pointer" />
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;

const ViewDetails = ({ id }) => {
  const navigate = useRouter();
  return (
    <div
      className="absolute h-[50px] px-[20px] flex items-center gap-2 text-[var(--text-color-body)] bg-white rounded-[8px] shadow-md border border-gray-100 w-[max-content] left-[-145px] top-[13px] cursor-pointer"
      onClick={() => navigate.push(`/customers/${id}`)}
    >
      <IoEye className="w-[20px] h-[20px]" />
      <p className="text-[14px]">View Details</p>
    </div>
  );
};
