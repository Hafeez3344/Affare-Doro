"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { IoSearch } from "react-icons/io5";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Manage from "./Manage";
import Statics from "./Statics";

const Products = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("manage");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(updatePageNavigation("products"));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="mb-6">
            <div className="w-full">
              <div className="bg-white h-[50px] rounded-[8px] flex items-center px-[25px] gap-3 shadow-sm">
                <IoSearch className="text-[var(--text-color-body)] text-[20px]" />
                <input
                  className="flex-1 focus:outline-none text-[15px]"
                  placeholder="Search Here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-10 my-[15px]">
            {/* <p
              className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                selectedTab === "manage"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
              }`}
              onClick={() => setSelectedTab("manage")}
            >
              Manage
            </p>
            <p
              className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                selectedTab === "createNew"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
              }`}
              onClick={() => setSelectedTab("createNew")}
            >
              Create New
            </p>
            <p
              className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                selectedTab === "statics"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
              }`}
              onClick={() => setSelectedTab("statics")}
            >
              Statics
            </p> */}
          </div>
          {selectedTab === "manage" ? <Manage searchQuery={searchQuery} /> : <Statics />}
        </div>
      </div>
    </div>
  );
};

export default Products;
