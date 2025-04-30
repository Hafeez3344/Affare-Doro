import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Badge, ListChecks, Maximize2, Package, Palette, StoreIcon } from "lucide-react";
import { RxDashboard } from "react-icons/rx";
import { LuShoppingBag, LuShoppingBasket } from "react-icons/lu";
import {
  RiUserStarLine,
  RiDiscountPercentLine,
  RiStore2Line,
} from "react-icons/ri";
import { IoBagRemoveOutline } from "react-icons/io5";
import { FiSettings, FiShoppingBag } from "react-icons/fi";
import {
  HiOutlineExclamationCircle,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { updateSidebar, updateAuth } from "@/features/features";
import { LuLogOut } from "react-icons/lu";
import Cookies from "js-cookie";

const Sidebar = ({ showModal }) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.showSidebar);
  
  const fn_sidebarControl = () => {
    dispatch(updateSidebar(!showSidebar));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(updateAuth(false));
    navigate.push('/login');
  };

  return (
    <>
      <div
        className={`${showSidebar ? "absolute md:relative flex h-[85%] min-h-[550px] md:h-auto" : "absolute md:relative hidden md:flex md:h-auto"
          } w-[215px] bg-white rounded-tr-[8px] mt-[30px] shadow-2xl md:shadow-md px-[10px] py-[20px] flex-col gap-0.5 z-[9] ${
          showModal ? "opacity-50 pointer-events-none" : "opacity-100"
        } relative`}
      >
        <button
          className="absolute md:hidden text-[var(--text-color)] right-5 scale-[1.5] top-2"
          onClick={fn_sidebarControl}
        >
          <FaArrowAltCircleLeft />
        </button>
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
        {/* <SidebarPageTemplate
          icon={<RiUserStarLine className="w-[20px] h-[20px]" />}
          label={"Customers"}
          navigateTo={"customers"}
          navigate={navigate}
        /> */}
        <SidebarPageTemplate
          icon={<IoBagRemoveOutline className="w-[21px] h-[21px]" />}
          label={"Orders"}
          navigateTo={"orders"}
          navigate={navigate}
        />
        {/* <SidebarPageTemplate
          icon={<RiDiscountPercentLine className="w-[20px] h-[20px]" />}
          label={"Offers"}
          navigateTo={"offers"}
          navigate={navigate}
        /> */}
        {/* <SidebarPageTemplate
          icon={<RiStore2Line className="w-[20px] h-[20px]" />}
          label={"Store Settings"}
          navigateTo={"store-settings"}
          navigate={navigate}
        /> */}
        <SidebarPageTemplate
          icon={<LuShoppingBasket className="w-[20px] h-[20px]" />}
          label={"Categories"}
          navigateTo={"categories"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<Badge className="w-[20px] h-[20px]" />}
          label={"Brands"}
          navigateTo={"brands"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<Palette className="w-[20px] h-[20px]" />}
          label={"Product Colors"}
          navigateTo={"colors"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<Maximize2 className="w-[20px] h-[20px]" />}
          label={"Product Size"}
          navigateTo={"size"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<ListChecks className="w-[20px] h-[20px]" />}
          label={"Product Conditions"}
          navigateTo={"conditions"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<StoreIcon className="w-[20px] h-[20px]" />}
          label={"Product Materials"}
          navigateTo={"materials"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<Package className="w-[20px] h-[20px]" />}
          label={"Package Size"}
          navigateTo={"packages"}
          navigate={navigate}
        />
          <SidebarPageTemplate
          icon={<FiShoppingBag  className="w-[20px] h-[20px]" />}
          label={"Bump Products"}
          navigateTo={"bump"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={<FiSettings className="w-[20px] h-[19px]" />}
          label={` Settings`}
          navigateTo={"settings"}
          navigate={navigate}
        />
        {/* <SidebarPageTemplate
          icon={
            <HiOutlineExclamationCircle className="w-[20px] h-[20px] scale-[1.15]" />
          }
          label={`Feedback`}
          navigateTo={"feedback"}
          navigate={navigate}
        />
        <SidebarPageTemplate
          icon={
            <HiOutlineQuestionMarkCircle className="w-[20px] h-[20px] scale-[1.15]" />
          }
          label={`Help Store`}
          navigateTo={"help-store"}
          navigate={navigate}
        /> */}
        <div 
          onClick={handleLogout}
          className={`flex h-[48px] items-center gap-3 px-[10px] hover:text-[var(--text-color)] cursor-pointer hover:bg-[var(--bg-color)] border-l-[2px] hover:border-[var(--text-color)] w-full text-gray-500 bg-transparent border-white absolute bottom-0`}
        >
          <div className="flex-shrink-0">
            <LuLogOut className="w-[20px] h-[20px] rotate-180" />
          </div>
          <p className="text-[13px] font-[500] whitespace-nowrap">Logout</p>
        </div>
      </div>
      <button
        className={`${showSidebar ? "hidden" : "absolute"} md:hidden text-[var(--text-color)] left-5 scale-[1.5] top-[77px]`}
        onClick={fn_sidebarControl}
      >
        <FaArrowAltCircleRight />
      </button>
    </>
  );
};

export default Sidebar;

const SidebarPageTemplate = ({ icon, label, navigateTo, navigate }) => {
  const pageNavigation = useSelector((state) => state.pageNavigation);
  return (
    <div
      className={`flex h-[48px] items-center gap-3 px-[10px] hover:text-[var(--text-color)] cursor-pointer hover:bg-[var(--bg-color)] border-l-[2px] hover:border-[var(--text-color)] w-full ${pageNavigation === navigateTo
        ? "text-[var(--text-color)] bg-[var(--bg-color)] border-[var(--text-color)]"
        : "text-gray-500 bg-transparent border-white"
        }`}
      onClick={() => navigate.push(`/${navigateTo}`)}
    >
      <div className="flex-shrink-0">{icon}</div>
      <p className="text-[13px] font-[500] whitespace-nowrap">{label}</p>
    </div>
  );
};
