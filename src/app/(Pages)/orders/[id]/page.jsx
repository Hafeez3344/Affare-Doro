"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { updatePageNavigation } from "@/features/features";
import { getAllOrders } from "@/api/api";

import { BiSolidEditAlt } from "react-icons/bi";
import { FaMoneyCheckDollar, FaCreditCard } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { PiVan } from "react-icons/pi";
import { SiHackthebox } from "react-icons/si";
import { CgNotes } from "react-icons/cg";

import img from "@/assets/profile.jpeg";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(updatePageNavigation("orders"));
    
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        if (response.status) {
          // Find the specific order by ID
          const foundOrder = response.data.find(order => order._id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setError("Order not found");
          }
        } else {
          setError(response.message || "Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [dispatch, orderId]);

  // Get status badge color based on order status
  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-[var(--bg-color-delivered)] text-[var(--text-color-delivered)]';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'ready-to-delivered':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 mt-[30px] px-[22px]">
            <div className="bg-white rounded-[8px] font-[66] px-[20px] py-[25px] shadow-sm">
              <p className="text-center py-10">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 mt-[30px] px-[22px]">
            <div className="bg-white rounded-[8px] font-[66] px-[20px] py-[25px] shadow-sm">
              <p className="text-center py-10 text-red-500">{error || "Order not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="bg-white rounded-[8px] font-[66] px-[20px] py-[25px] shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-[600] text-[20px]">Order ID #{order._id.slice(-6)}</p>
              <p className={`h-[23px] w-[100px] rounded-[5px] text-[10px] font-[500] flex items-center justify-center ${getStatusBadgeClass(order.orderStatus)}`}>
                {order.orderStatus || "Unknown"}
              </p>
            </div>
            <div className="mt-[25px] border border-gray-200 rounded-[8px] shadow-sm px-[20px] py-[30px] flex flex-col xl:flex-row gap-8 xl:gap-10 justify-between">
              <div>
                <p className="text-[20px] w-[500] font-[500] mb-4">
                  Order Summary
                </p>
                <div className="flex gap-10 xl:gap-3">
                  <Image
                    alt=""
                    src={img}
                    className="w-[100px] h-[100px] rounded-full"
                  />
                  <div className="flex flex-col justify-center gap-2">
                    <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                      <BiSolidEditAlt className="h-[22px] w-[22px]" />
                      {order.fullName || "N/A"}
                    </div>
                    <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                      <FaMoneyCheckDollar className="h-[22px] w-[22px]" />
                      ${order.total || "0.00"}
                    </div>
                    <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                      <FaCreditCard className="h-[22px] w-[22px]" />
                      {order.paymentMethod || "N/A"} ({order.paymentStatus || "N/A"})
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block border border-gray-200"></div>
              <div>
                <p className="text-[20px] w-[500] font-[500] mb-4">
                  Shipping Details
                </p>
                <div className="flex flex-col justify-center gap-2">
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <CiLocationOn className="h-[22px] w-[22px]" />
                    {order.city || "N/A"}, {order.country || "N/A"}
                  </div>
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <PiVan className="h-[22px] w-[22px]" />
                    {order.orderStatus === "shipping" ? "In Transit" : order.orderStatus === "ready-to-delivered" ? "Ready for Delivery" : "Standard"}
                  </div>
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <SiHackthebox className="h-[22px] w-[22px]" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="hidden xl:block border border-gray-200"></div>
              <div>
                <p className="text-[20px] w-[500] font-[500] mb-4">
                  Order Notes
                </p>
                <div className="flex flex-col justify-center gap-2">
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <CgNotes className="h-[22px] w-[22px]" />
                    {order.cancelReason ? `Cancellation reason: ${order.cancelReason}` : "No special instructions"}
                  </div>
                  <div className="text-[var(--text-color-body)] font-[400] flex items-center gap-2">
                    <CgNotes className="h-[22px] w-[22px]" />
                    {order.bumpOrder ? "Priority order" : "Standard order"}
                  </div>
                </div>
              </div>
              <div className="hidden xl:block"></div>
            </div>
            <div className="mt-[25px] border border-gray-200 rounded-[8px] shadow-sm px-[20px] py-[30px]">
              <p className="text-[20px] w-[500] font-[500] mb-4">Product</p>
              <div className="flex flex-col gap-5">
                {order.productId && order.productId.length > 0 ? (
                  <div className="flex justify-between">
                    <div className="flex gap-7 items-center">
                      <div className="w-[75px] h-[75px] rounded-[9px] bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                      <div>
                        <p className="text-[18px] font-[500]">
                          Product ID: {order.productId[0]}
                        </p>
                        <p className="font-[400] text-[var(--text-color-body)]">
                          Product details will be fetched separately
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[24px] font-[500]">${order.total || "0.00"}</p>
                      <p className="font-[400] text-[var(--text-color-body)]">
                        Qty: 1
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div className="flex gap-7 items-center">
                      <div className="w-[75px] h-[75px] rounded-[9px] bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                      <div>
                        <p className="text-[18px] font-[500]">
                          No Product
                        </p>
                        <p className="font-[400] text-[var(--text-color-body)]">
                          No product details available
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[24px] font-[500]">${order.total || "0.00"}</p>
                      <p className="font-[400] text-[var(--text-color-body)]">
                        Qty: 1
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="h-[50px] font-[500] rounded-[8px] text-white px-[20px] lg:px-[70px] bg-[#FE4242] mt-[25px]">
              {order.orderStatus === "pending" ? "Process Order" : 
               order.orderStatus === "shipping" ? "Mark as Delivered" : 
               order.orderStatus === "ready-to-delivered" ? "Complete Delivery" : 
               "View Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
