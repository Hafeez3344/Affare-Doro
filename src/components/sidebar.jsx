import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { RxDashboard } from "react-icons/rx";
import { LuShoppingBag } from "react-icons/lu";

const Sidebar = () => {
  const navigate = useRouter();
  return (
    <div className="w-[240px] bg-white rounded-tr-[5px] mt-[30px] shadow-md px-[20px] py-[25px] flex flex-col gap-1.5">
      <SidebarPageTemplate
        icon={<RxDashboard className="w-[20px] h-[20px]" />}
        label={"Dashboard"}
        navigateTo={"dashboard"}
        navigate={navigate}
      />
      <SidebarPageTemplate
        icon={<LuShoppingBag className="w-[20px] h-[20px]" />}
        label={"Products"}
        navigateTo={"products"}
        navigate={navigate}
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

const SidebarPageTemplate = ({ icon, label, navigateTo, navigate }) => {
  const pageNavigation = useSelector((state) => state.pageNavigation);
  return (
    <div
      className={`flex h-[48px] items-center rounded-tr-full rounded-br-full gap-5 px-[17px] hover:text-[var(--text-color)] cursor-pointer hover:bg-[var(--bg-color)]  border-l-[2px] hover:border-[var(--text-color)] ${pageNavigation === navigateTo ? "text-[var(--text-color)] bg-[var(--bg-color)] border-[var(--text-color)]" : "text-gray-500 bg-transparent border-white"}`}
      onClick={() => navigate.push(`/${navigateTo}`)}
    >
      {icon}
      <p className="text-[16px] font-[500]">{label}</p>
    </div>
  );
};
