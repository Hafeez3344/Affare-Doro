"use client";
import { Modal } from "antd";
import Image from "next/image";
import { Pagination } from "antd";
import { FiEye } from "react-icons/fi";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import SearchOnTop from "@/components/SearchOnTop";
import React, { useEffect, useState } from "react";
import BACKEND_URL, { getAllOrders } from "@/api/api";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";

const Orders = () => {
  const itemsPerPage = 20;
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
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
        let params = {};
        
        // Set parameters based on selected tab
        if (selectedTab === "bump") {
          params.bumpOrder = true;
        } else if (selectedTab !== "all") {
          params.bumpOrder = false;
          params.status = selectedTab;
        } else {
          params.bumpOrder = false;
        }

        const response = await getAllOrders(params);
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
  }, [auth, dispatch, router, selectedTab]);

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
  const filteredOrders = orders
    .filter((order) => {
      if (selectedTab === "all") return true;
      if (selectedTab === "bump") return order.bumpOrder === true;
      return order.orderStatus?.toLowerCase() === selectedTab.toLowerCase();
    })
    .reverse(); // Reverse to show latest first

  // Calculate paginated orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {/* <SearchOnTop /> */}
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-gray-800">Product Orders</p>
          </div>

          {/* Orders Section */}
          <div className="my-[20px] p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-[94vw] md:w-[67vw] lg:w-[75vw] xl:w-auto">
            {/* Mobile View */}
            <div className="flex flex-col gap-4 mb-[15px] md:hidden">
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${
                  selectedTab === "all"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("all")}
              >
                All Orders
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${
                  selectedTab === "completed"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Completed
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${
                  selectedTab === "pending"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("pending")}
              >
                Pending
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${
                  selectedTab === "cancelled"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("cancelled")}
              >
                Cancelled
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${
                  selectedTab === "bump"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("bump")}
              >
                Product Bump Orders
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex gap-10 mb-[15px] w-[max-content]">
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "all"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("all")}
              >
                All Orders
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "completed"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Completed
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "pending"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("pending")}
              >
                Pending
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "cancelled"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("cancelled")}
              >
                Cancelled
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${
                  selectedTab === "bump"
                    ? "text-[var(--text-color)] border-[var(--text-color)]"
                    : "text-[var(--text-color-body)] border-transparent"
                }`}
                onClick={() => setSelectedTab("bump")}
              >
                Product Bump Orders
              </div>
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
              <div className="p-[3px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-full">
                <table className="min-w-full border">
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                      <th className="p-4 font-[500] text-nowrap">S.No</th>
                      <th className="p-4 font-[500] text-nowrap">
                        {selectedTab === "bump" ? "Seller Name" : "Customer Name"}
                      </th>
                      <th className="p-4 font-[500] text-nowrap">Product</th>
                      <th className="p-4 font-[500]">Total</th>
                      <th className="p-4 font-[500]">Status</th>
                      <th className="p-4 font-[500]">Created Date</th>
                      <th className="p-4 font-[500]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders?.map((order, index) => (
                      <tr key={order._id} className="text-gray-800 text-sm border-b">
                        <td className="p-4 text-[13px]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-4 text-[13px]">
                          {selectedTab === "bump" 
                            ? (order.fromUserId?.fullName || "N/A")
                            : (order.fullName || "N/A")
                          }
                        </td>
                        <td className="p-4 text-[13px] flex items-center gap-2">
                          {order.productId && order.productId.length > 0 ? (
                            <>
                              <Image
                                src={`${BACKEND_URL}/${order.productId[0].image}`}
                                alt={order.productId[0].name || "Product"}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                              <span>{order.productId[0].name || "N/A"}</span>
                            </>
                          ) : (
                            <span className="text-gray-500">No Product</span>
                          )}
                        </td>
                        <td className="p-4 text-[13px]">
                          <div className="flex items-center">
                            <Image
                              alt=""
                              src="/dirham-sign.svg"
                              width={16}
                              height={16}
                              className="inline-block mr-1 mb-0.5"
                            />
                            {order.total || "0.00"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 w-[130px] rounded-[20px] text-[11px] flex items-center justify-center ${getStatusBadgeClass(order.orderStatus)}`}>
                            {order.orderStatus || "Unknown"}
                          </span>
                        </td>
                        <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => showOrderDetails(order)}
                            className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <Pagination
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                    total={filteredOrders.length}
                    pageSize={itemsPerPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        title={` `}
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
                  {selectedTab === "bump" ? "Seller Information" : "Customer Information"}
                </h3>
                <p>
                  <span className="font-medium">{selectedTab === "bump" ? "Seller Name:" : "Name:"}</span>{" "}
                  {selectedTab === "bump" 
                    ? (selectedOrder.fromUserId?.fullName || "N/A")
                    : (selectedOrder.fullName || "N/A")
                  }
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedTab === "bump"
                    ? (selectedOrder.fromUserId?.email || "N/A")
                    : (selectedOrder.email || "N/A")
                  }
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedTab === "bump"
                    ? (selectedOrder.fromUserId?.phone || "N/A")
                    : (selectedOrder.phone || "N/A")
                  }
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
                <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                  {selectedOrder.productId &&
                  selectedOrder.productId.length > 0 &&
                  selectedOrder.productId[0].image ? (
                    <Image
                      src={`${BACKEND_URL}/${selectedOrder.productId[0].image}`}
                      alt={selectedOrder.productId[0].name || "Product"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">No Image</span>
                  )}
                </div>
                <div>
                  {/* <p className="font-medium">
                    Product ID:{" "}
                    {selectedOrder.productId &&
                    selectedOrder.productId.length > 0
                      ? selectedOrder.productId[0]._id || "N/A"
                      : "N/A"}
                  </p> */}
                  <p className="font-medium">
                    Product Name:{" "}
                    {selectedOrder.productId &&
                    selectedOrder.productId.length > 0
                      ? selectedOrder.productId[0].name || "N/A"
                      : "N/A"}
                  </p>
                  <p className="font-medium flex items-center">
                    Product Price:{" "}
                    {selectedOrder.productId && selectedOrder.productId.length > 0 ? (
                      <>
                        <Image 
                          alt="Dirham"
                          src="/dirham-sign.svg"
                          width={15}
                          height={15}
                          className="inline-block mx-1"
                        />
                        {selectedOrder.productId[0].price || "0.00"}
                      </>
                    ) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Payment Information</h3>
              <p>
                <span className="font-medium">Total:</span>{" "}
                <Image
                  alt=""
                  src="/dirham-sign.svg"
                  width={15}
                  height={15}
                  className="inline-block mr-1 mb-1"
                />
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
