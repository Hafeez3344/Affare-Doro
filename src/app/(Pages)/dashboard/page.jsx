"use client";

import Image from "next/image";
import { notification } from "antd";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { GoDotFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import BACKEND_URL, { getProducts } from "@/api/api";
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
import { ShoppingCart } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }

    // Always update the page navigation for dashboard
    dispatch(updatePageNavigation("dashboard"));

    if (auth && !sessionStorage.getItem("dashboardWelcomeShown")) {
      api.success({
        message: "Welcome to Dashboard",
        description: "You have successfully logged into your admin account.",
        placement: "topRight",
        duration: 3,
        style: {
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      });

      sessionStorage.setItem("dashboardWelcomeShown", "true");
    }
  }, [auth, dispatch, router, api]);

  // New useEffect for fetching favorite products
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        if (response?.status && Array.isArray(response?.data)) {
          // Sort by some criteria (e.g., price) and take top 5
          const topProducts = response.data
            .sort((a, b) => b.price - a.price) // Sort by price descending
            .slice(0, 5); // Take top 5
          setFavoriteProducts(topProducts);
        } else {
          throw new Error(response?.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        api.error({
          message: "Error",
          description: error.message || "Failed to fetch products",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [api]);

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
                  Total Orders
                </p>
                <Image alt="" src={ordersIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">00</p>
              </div>
            </div>
            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Completed Orders
                </p>
                <ShoppingCart size={24} className="text-gray-700" />
              </div>

              <div>
                <p className="text-[32px] font-[600] text-black">00</p>
              </div>
            </div>

            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Total Sales
                </p>
                <Image alt="" src={revenueIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">$ 00.00</p>
              </div>
            </div>
            <div className="min-w-[250px] flex-1 h-[152px] rounded-[10px] bg-white shadow-sm flex flex-col justify-between p-[20px]">
              <div className="flex justify-between">
                <p className="text-[15px] font-[500] text-[var(--text-color-body)]">
                  Cancelled Orders
                </p>
                <Image alt="" src={returnIcon} />
              </div>
              <div>
                <p className="text-[32px] font-[600] text-black">00</p>
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
                <p className="text-[20px] font-[600]">Products</p>
                <button
                  onClick={() => router.push("/products")}
                  className="w-[135px] h-[32px] text-[var(--text-color-body)] rounded-[4px] border-black border-[1px] py-[6px] px-[12px] text-[13px] font-[500]"
                >
                  See All Products
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                  Loading...
                </div>
              ) : (
                favoriteProducts.map((product) => (
                  <div key={product._id} className="flex gap-5">
                    <Image
                      alt={product.name}
                      src={
                        product.image?.[0]
                          ? `${BACKEND_URL}/${product.image[0]}`
                          : productOne
                      }
                      className="w-[67px] h-[67px] object-cover"
                      width={67}
                      height={67}
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <div className="flex flex-col gap-1.5">
                        <p className="font-[500] leading-[24px]">
                          {product.name}
                        </p>
                        <p className="text-[14px] text-[var(--text-color-body)]">
                          {product.sales || 0} Sales
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[12px] text-[var(--text-color-body-plus)] flex items-center gap-1">
                          <GoDotFill />
                          {product.status || "Available"}
                        </p>
                        <p className="text-[var(--text-color-body)] text-[11px] ps-[15px]">
                          {product.stock || 0} Stocks
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
