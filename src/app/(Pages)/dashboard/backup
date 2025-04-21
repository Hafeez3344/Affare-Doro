"use client";

import Image from "next/image";
import { notification } from "antd";
import React, { useEffect } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { GoDotFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import salesIcon from "@/assets/svgs/dashboard-sales.svg";
import productOne from "@/assets/dashboard-product-1.png";
import productTwo from "@/assets/dashboard-product-2.png";
import { updatePageNavigation } from "@/features/features";
import ordersIcon from "@/assets/svgs/dashboard-orders.svg";
import returnIcon from "@/assets/svgs/dashboard-return.svg";
import productThree from "@/assets/dashboard-product-3.png";
import revenueIcon from "@/assets/svgs/dashboard-revenue.svg";
import dashboardTableImg from "@/assets/svgs/dashboard-table-img.svg";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);

  const [api, contextHolder] = notification.useNotification();

  // useEffect(() => {
  //   if (!auth) {
  //     router.push("/login");
  //     return;
  //   }
  //   dispatch(updatePageNavigation("dashboard"));

  //   // Show welcome notification
  //   api.success({
  //     message: 'Welcome to Dashboard',
  //     description: 'You have successfully logged into your admin account.',
  //     placement: 'topRight',
  //     duration: 3,
  //     style: {
  //       borderRadius: '8px',
  //       boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  //     },
  //   });
  // }, [auth, dispatch, router, api]);


  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
  
    // Check if the user is visiting the dashboard for the first time
    if (auth && !sessionStorage.getItem("dashboardWelcomeShown")) {
      dispatch(updatePageNavigation("dashboard"));
  
      // Show welcome notification
      api.success({
        message: 'Welcome to Dashboard',
        description: 'You have successfully logged into your admin account.',
        placement: 'topRight',
        duration: 3,
        style: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      });
  
      // Mark the notification as shown
      sessionStorage.setItem("dashboardWelcomeShown", "true");
    }
  }, [auth, dispatch, router, api]);
  const data = {
    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Order",
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#00A1FF",
        borderRadius: 5,
      },
      {
        label: "Revenue",
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#06E775",
        borderRadius: 5,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {contextHolder}
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px] overflow-y-auto">
          {/* boxes */}
          <div className="flex flex-col sm:flex-row justify-between sm:flex-wrap gap-5">
            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Total Sales
                </p>
                <Image alt="" src={salesIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">$ 00.00</p>
                <p className="text-[12px] font-[500] text-[var(--text-color-body-plus)]">
                  + 0 % From last month
                </p>
              </div>
            </div>
            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Total Orders
                </p>
                <Image alt="" src={ordersIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">00</p>
                <p className="text-[12px] font-[500] text-[var(--text-color-body-minus)]">
                  - 0 % From last month
                </p>
              </div>
            </div>
            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Lifetime Revenue
                </p>
                <Image alt="" src={revenueIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">$ 00.00</p>
                <p className="text-[12px] font-[500] text-[var(--text-color-body-plus)]">
                  + 0 % From last month
                </p>
              </div>
            </div>
            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Return Orders
                </p>
                <Image alt="" src={returnIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">00</p>
                <p className="text-[12px] font-[500] text-[var(--text-color-body-minus)]">
                  - 0 % From last month
                </p>
              </div>
            </div>
          </div>
          {/* graphs and products */}
          <div className="mt-[30px] flex gap-5 flex-col xl:flex-row">
            {/* graph */}
            <div className="xl:w-[55%] bg-white shadow-sm rounded-[10px] p-[20px]">
              <div className="flex justify-between items-center">
                <p className="text-[20px] font-[600]">Revenue Trend</p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-[15px]">
                    <GoDotFill className="text-[var(--text-color-body-plus)]" />
                    Revenue
                  </div>
                  <div className="flex items-center gap-1 text-[15px]">
                    <GoDotFill className="text-[var(--text-color-body-order)]" />
                    Order
                  </div>
                </div>
              </div>
              <div className="w-[100%]">
                <Bar data={data} options={options}></Bar>
              </div>
            </div>
            {/* products */}
            <div className="xl:w-[45%] bg-white shadow-sm rounded-[10px] px-[20px] py-[25px] flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <p className="text-[20px] font-[600]">Customer Favorite</p>
                <button className="w-[135px] h-[32px] text-[var(--text-color-body)] rounded-[4px] border-black border-[1px] py-[6px] px-[12px] text-[13px] font-[500]">
                  See All Products
                </button>
              </div>
              <div className="flex gap-5">
                <Image alt="" src={productOne} className="w-[67px] h-[67px]" />
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-[500] leading-[24px]">
                      Premium Wireless Headphones
                    </p>
                    <p className="text-[14px] text-[var(--text-color-body)]">
                      00 Sales
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-[var(--text-color-body-plus)] flex items-center gap-1">
                      <GoDotFill />
                      Available
                    </p>
                    <p className="text-[var(--text-color-body)] text-[11px] ps-[15px]">
                      00 Stocks
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <Image alt="" src={productTwo} className="w-[67px] h-[67px]" />
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-[500] leading-[24px]">
                      Smart Watch Series X
                    </p>
                    <p className="text-[14px] text-[var(--text-color-body)]">
                      00 Sales
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-[var(--text-color-body-plus)] flex items-center gap-1">
                      <GoDotFill />
                      Available
                    </p>
                    <p className="text-[var(--text-color-body)] text-[11px] ps-[15px]">
                      00 Stocks
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <Image alt="" src={productThree} className="w-[67px] h-[67px]" />
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-[500] leading-[24px]">
                      4K Ultra HD Smart TV
                    </p>
                    <p className="text-[14px] text-[var(--text-color-body)]">
                      00 Sales
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-[var(--text-color-body-plus)] flex items-center gap-1">
                      <GoDotFill />
                      Available
                    </p>
                    <p className="text-[var(--text-color-body)] text-[11px] ps-[15px]">
                      00 Stocks
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <Image alt="" src={productTwo} className="w-[67px] h-[67px]" />
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-[500] leading-[24px]">
                      Portable Power Bank 20000mAh
                    </p>
                    <p className="text-[14px] text-[var(--text-color-body)]">
                      00 Sales
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-[var(--text-color-body-plus)] flex items-center gap-1">
                      <GoDotFill />
                      Available
                    </p>
                    <p className="text-[var(--text-color-body)] text-[11px] ps-[15px]">
                      00 Stocks
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <Image alt="" src={productOne} className="w-[67px] h-[67px]" />
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-[500] leading-[24px]">
                      Wireless Gaming Mouse
                    </p>
                    <p className="text-[14px] text-[var(--text-color-body)]">
                      00 Sales
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-[var(--text-color-body-plus)] flex items-center gap-1">
                      <GoDotFill />
                      Available
                    </p>
                    <p className="text-[var(--text-color-body)] text-[11px] ps-[15px]">
                      00 Stocks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* table */}
          <div className="dashboard-table bg-white rounded-[10px] shadow-sm px-[20px] py-[25px] mt-[20px] flex flex-col gap-5 overflow-x-auto">
            <div className="flex w-full">
              <p className="w-[10%] font-[500] text-[var(--text-color-body)]">
                No
              </p>
              <p className="w-[20%] font-[500] text-[var(--text-color-body)]">
                Product Name
              </p>
              <p className="w-[12%] font-[500] text-[var(--text-color-body)]">
                Price
              </p>
              <p className="w-[18%] font-[500] text-[var(--text-color-body)]">
                Customer Name
              </p>
              <p className="w-[15%] font-[500] text-[var(--text-color-body)]">
                Date
              </p>
              <p className="w-[15%] font-[500] text-[var(--text-color-body)]">
                Payment
              </p>
              <p className="w-[10%] font-[500] text-[var(--text-color-body)]">
                Status
              </p>
            </div>
            <div className="flex w-full">
              <p className="w-[10%] text-[14px]">PK00000</p>
              <p className="w-[20%] text-[14px] flex items-center gap-2">
                <Image alt="" src={dashboardTableImg} />
                Smart Watch Series X
              </p>
              <p className="w-[12%] text-[14px]">$00.00</p>
              <p className="w-[18%] text-[14px]">Emma Wilson</p>
              <p className="w-[15%] text-[14px]">00 Jan, 2024</p>
              <p className="w-[15%] text-[14px]">Credit Card</p>
              <div className="w-[10%] text-[14px]">
                <p className="text-[var(--text-color-body-plus)] font-[500] text-[10px] bg-green-100 w-[62px] h-[22px] rounded-[4px] flex justify-center items-center">
                  Delivered
                </p>
              </div>
            </div>
            <div className="flex w-full">
              <p className="w-[10%] text-[14px]">PK00000</p>
              <p className="w-[20%] text-[14px] flex items-center gap-2">
                <Image alt="" src={dashboardTableImg} />
                4K Ultra HD Smart TV
              </p>
              <p className="w-[12%] text-[14px]">$00.00</p>
              <p className="w-[18%] text-[14px]">Michael Chen</p>
              <p className="w-[15%] text-[14px]">00 Jan, 2024</p>
              <p className="w-[15%] text-[14px]">Transfer</p>
              <div className="w-[10%] text-[14px]">
                <p className="text-[var(--text-color-body-pending)] font-[500] text-[10px] bg-orange-100 w-[62px] h-[22px] rounded-[4px] flex justify-center items-center">
                  Pending
                </p>
              </div>
            </div>
            <div className="flex w-full">
              <p className="w-[10%] text-[14px]">PK00000</p>
              <p className="w-[20%] text-[14px] flex items-center gap-2">
                <Image alt="" src={dashboardTableImg} />
                Premium Wireless Headphones
              </p>
              <p className="w-[12%] text-[14px]">$00.00</p>
              <p className="w-[18%] text-[14px]">Sarah Johnson</p>
              <p className="w-[15%] text-[14px]">00 Jan, 2024</p>
              <p className="w-[15%] text-[14px]">PayPal</p>
              <div className="w-[10%] text-[14px]">
                <p className="text-[var(--text-color-body-plus)] font-[500] text-[10px] bg-green-100 w-[62px] h-[22px] rounded-[4px] flex justify-center items-center">
                  Delivered
                </p>
              </div>
            </div>
            <div className="flex w-full">
              <p className="w-[10%] text-[14px]">PK00000</p>
              <p className="w-[20%] text-[14px] flex items-center gap-2">
                <Image alt="" src={dashboardTableImg} />
                Portable Power Bank
              </p>
              <p className="w-[12%] text-[14px]">$00.00</p>
              <p className="w-[18%] text-[14px]">Alex Martinez</p>
              <p className="w-[15%] text-[14px]">00 Jan, 2024</p>
              <p className="w-[15%] text-[14px]">Credit Card</p>
              <div className="w-[10%] text-[14px]">
                <p className="text-[var(--text-color-body-pending)] font-[500] text-[10px] bg-orange-100 w-[62px] h-[22px] rounded-[4px] flex justify-center items-center">
                  Pending
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
