"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SearchOnTop from "@/components/SearchOnTop";
import { BiSolidEditAlt } from "react-icons/bi";
import tableAction from "@/assets/svgs/table-action.svg";
import { IoEye } from "react-icons/io5";
import { useRouter } from "next/navigation";
import BACKEND_URL, { getAllOrders } from "@/api/api";
import { Modal } from "antd";

const Orders = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [selectedTab, setSelectedTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("orders"));

    // Fetch orders data
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        if (response.status) {
          setOrders(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth, dispatch, router]);

  const fn_viewDetails = (id) => {
    if (id === selectedCustomer) {
      return setSelectedCustomer(0);
    }
    setSelectedCustomer(id);
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Filter orders based on selected tab
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    return order.orderStatus?.toLowerCase() === selectedTab.toLowerCase();
  });

  // Get status badge color based on order status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "ready-to-delivered":
        return "bg-blue-100 text-blue-800";
      case "shipping":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <SearchOnTop />

          {/* Orders Section */}
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
                  selectedTab === "completed"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Completed
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

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-[var(--text-color-body)]">
                  Loading orders...
                </p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredOrders?.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-[var(--text-color-body)]">No orders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredOrders?.map((order, index) => (
                  <div
                    key={order?._id}
                    className="flex flex-col p-6 border rounded-lg shadow-md bg-white h-[600px]"
                  >
                    {/* Top - Image */}
                    <div className="w-full h-80 rounded-lg bg-gray-200 overflow-hidden mb-4">
                      {order.productId && order.productId.length > 0 ? (
                        <Image
                          src={`${BACKEND_URL}/${order.productId[0].image?.[0]}`}
                          alt={order.productId[0].name || "Product"}
                          width={400}
                          height={256}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>

                    {/* Bottom - Order Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="space-y-3">
                          <p className="text-gray-600">
                            <span className="font-medium">Customer:</span>{" "}
                            {order.fullName || "N/A"}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {order.email || "N/A"}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-medium">Total:</span>
                            <span className="text-lg font-semibold text-teal-600">
                              ${order.total || "0.00"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={` rounded-lg px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => showOrderDetails(order)}
                          className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer shadow-lg"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        title={`Order ID #${selectedOrder?._id?.slice(-6) || ""}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                  selectedOrder.orderStatus
                )}`}
              >
                {selectedOrder.orderStatus || "Unknown"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">
                  Customer Information
                </h3>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedOrder.fullName || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedOrder.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedOrder.phone || "N/A"}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">
                  Shipping Information
                </h3>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium">City:</span>{" "}
                  {selectedOrder.city || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {selectedOrder.country || "N/A"}
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">Product Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
                <div>
                  <p className="font-medium">
                    Product ID:{" "}
                    {selectedOrder.productId &&
                    selectedOrder.productId.length > 0
                      ? selectedOrder.productId[0]
                      : "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Product details will be fetched separately
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Payment Information</h3>
              <p>
                <span className="font-medium">Total:</span> $
                {selectedOrder.total || "0.00"}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {selectedOrder.paymentMethod || "N/A"}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {selectedOrder.paymentStatus || "N/A"}
              </p>
              <p>
                <span className="font-medium">Order Date:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
