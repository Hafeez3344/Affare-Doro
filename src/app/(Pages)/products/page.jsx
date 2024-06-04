"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";
import Manage from "./Manage";
import CreateNew from "./CreateNew";
import Statics from "./Statics";

const Products = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("manage");
  useEffect(() => {
    dispatch(updatePageNavigation("products"));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <SearchOnTop />
          <div className="flex gap-10 my-[20px]">
            <p
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
            </p>
          </div>
          {selectedTab === "manage" ? <Manage /> : selectedTab === "createNew" ? <CreateNew /> : <Statics />}
        </div>
      </div>
    </div>
  );
};

export default Products;
