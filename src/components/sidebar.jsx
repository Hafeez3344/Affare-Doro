import React from "react";

import { RxDashboard } from "react-icons/rx";
import { LuShoppingBag } from "react-icons/lu";

const Sidebar = () => {
  return (
    <div className="w-[240px] bg-white rounded-tr-[5px] mt-[30px] shadow-md px-[20px] py-[25px] flex flex-col gap-1.5">
      <div className="flex h-[48px] items-center rounded-tr-full rounded-br-full gap-5 px-[17px] text-[var(--text-color)] cursor-pointer bg-[var(--bg-color)]  border-l-[2px] border-[var(--text-color)]">
        <RxDashboard className="w-[20px] h-[20px]" />
        <p className="text-[16px] font-[500]">Dashboard</p>
      </div>
      {/* <SidebarPageTemplate icon={<RxDashboard className="w-[20px] h-[20px]" />} label={"Dashboard"} /> */}
      <SidebarPageTemplate
        icon={<LuShoppingBag className="w-[20px] h-[20px]" />}
        label={"Product"}
      />
      {/* <SidebarPageTemplate icon={<LuShoppingBag className="w-[20px] h-[20px]" />} label={"Customers"} />
      <SidebarPageTemplate icon={<HiOutlineShoppingBag className="w-[20px] h-[20px]" />} label={"Orders"} />
      <SidebarPageTemplate icon={<LuShoppingBag className="w-[20px] h-[20px]" />} label={"Shipment"} />
      <SidebarPageTemplate icon={<PiStorefront className="w-[20px] h-[20px]" />} label={"Store Settings"} />
      <SidebarPageTemplate icon={<LuShoppingBag className="w-[20px] h-[20px]" />} label={"Settings"} />
      <SidebarPageTemplate icon={<LuShoppingBag className="w-[20px] h-[20px]" />} label={"Feedback"} />
      <SidebarPageTemplate icon={<LuShoppingBag className="w-[20px] h-[20px]" />} label={"Help Store"} /> */}
    </div>
  );
};

export default Sidebar;

const SidebarPageTemplate = ({ icon, label }) => {
  return (
    <div className="flex h-[48px] text-gray-500 items-center rounded-tr-full rounded-br-full gap-5 px-[17px] hover:text-[var(--text-color)] cursor-pointer hover:bg-[var(--bg-color)]  border-l-[2px] border-white hover:border-[var(--text-color)]">
      {icon}
      <p className="text-[16px] font-[500]">{label}</p>
    </div>
  );
};
