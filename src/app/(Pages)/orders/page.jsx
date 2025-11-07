"use client";
import Cookies from "js-cookie";
import { Modal, Tooltip } from "antd";
import Image from "next/image";
import { Pagination } from "antd";
import { FiEye, FiDollarSign, FiInfo } from "react-icons/fi";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [sellerBanks, setSellerBanks] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [selectedOrderForBank, setSelectedOrderForBank] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

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

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleBankModalClose = () => {
    setIsBankModalVisible(false);
    setSellerBanks([]);
    setSelectedOrderForBank(null);
  };

  // Check if 24 hours have passed since order was delivered
  const has24HoursPassed = (updatedAt) => {
    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();
    const hoursDifference = (currentDate - updatedDate) / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  // Handle withdraw sent action
  const handleWithdrawSent = async () => {
    if (!selectedOrderForBank) return;

    const sellerId = selectedOrderForBank.toUserId?._id;
    const orderId = selectedOrderForBank._id;
    const amount = selectedOrderForBank.total;

    if (!sellerId || !orderId || !amount) {
      console.error("Missing required data for withdraw");
      return;
    }

    setWithdrawLoading(true);

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${BACKEND_URL}/users/walletUpdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellerId,
          orderId,
          amount,
        }),
      });

      const data = await response.json();

      if (response.ok || data.status) {
        // Close modal
        handleBankModalClose();

        // Refresh orders
        const params = {};
        if (selectedTab === "bump") {
          params.bumpOrder = true;
        } else if (selectedTab !== "all") {
          params.bumpOrder = false;
          params.status = selectedTab;
        } else {
          params.bumpOrder = false;
        }

        const ordersResponse = await getAllOrders(params);
        if (ordersResponse.status) {
          setOrders(ordersResponse.data);
        }
      } else {
        console.error("Failed to update wallet:", data.message);
      }
    } catch (err) {
      console.error("Error updating wallet:", err);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleTransferFunds = async (order) => {
    console.log(order.toUserId?._id);
    const userId = order.toUserId?._id;

    if (!userId) {
      console.error("No toUserId found in order");
      return;
    }
    setSelectedOrderForBank(order);
    setIsBankModalVisible(true);
    setBankLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/bank/userBank/${userId}?active=true`);
      const data = await response.json();

      if (data.status === "ok" && data.data) {
        setSellerBanks(data.data);
      } else {
        setSellerBanks([]);
      }
    } catch (err) {
      console.error("Error fetching seller banks:", err);
      setSellerBanks([]);
    } finally {
      setBankLoading(false);
    }
  };

  // Filter orders based on selected tab
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "bump") return order.bumpOrder === true;
    return order.orderStatus?.toLowerCase() === selectedTab.toLowerCase();
  }).reverse(); // Reverse to show latest first

  // Calculate paginated orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get status badge color based on order status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
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
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${selectedTab === "all"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("all")}
              >
                All Orders
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${selectedTab === "delivered"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("delivered")}
              >
                Delivered
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${selectedTab === "pending"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("pending")}
              >
                Pending
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${selectedTab === "cancelled"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("cancelled")}
              >
                Cancelled
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] text-center ${selectedTab === "bump"
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
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${selectedTab === "all"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("all")}
              >
                All Orders
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${selectedTab === "delivered"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("delivered")}
              >
                Delivered
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${selectedTab === "pending"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("pending")}
              >
                Pending
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${selectedTab === "cancelled"
                  ? "text-[var(--text-color)] border-[var(--text-color)]"
                  : "text-[var(--text-color-body)] border-transparent"
                  }`}
                onClick={() => setSelectedTab("cancelled")}
              >
                Cancelled
              </div>
              <div
                className={`cursor-pointer hover:text-[var(--text-color)] font-[500] border-b-[2px] hover:border-[var(--text-color)] ${selectedTab === "bump"
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
                      <tr
                        key={order._id}
                        className={`text-gray-800 text-sm border-b ${order.paidByAdmin ? "bg-gray-100" : ""
                          }`}
                      >
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
                            {order.subTotal || "0.00"}
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => showOrderDetails(order)}
                              className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                              title="View Details"
                            >
                              <FiEye />
                            </button>
                            {!order.paidByAdmin && order.orderStatus?.toLowerCase() === "delivered" && (
                              <>
                                {has24HoursPassed(order.updatedAt) ? (
                                  <button
                                    onClick={() => handleTransferFunds(order)}
                                    className="bg-green-100 text-green-600 rounded-full px-2 py-2"
                                    title="Transfer Funds"
                                  >
                                    <FiDollarSign />
                                  </button>
                                ) : (
                                  <Tooltip title="It takes 24 hours to enable withdraw after Delivered">
                                    <button
                                      className="bg-yellow-100 text-yellow-600 rounded-full px-2 py-2 cursor-not-allowed"
                                      disabled
                                    >
                                      <FiInfo />
                                    </button>
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </div>
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

            {/* Withdraw Success Message */}
            {selectedOrder.paidByAdmin && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-green-800 font-medium text-lg">
                  Withdraw successful of this order
                </p>
              </div>
            )}

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
                  {selectedOrder.address1 || "N/A"}
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
                {selectedOrder.subTotal || "0.00"}
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

      {/* Seller Bank Accounts Modal */}
      <Modal
        title="Seller Bank Accounts"
        open={isBankModalVisible}
        onCancel={handleBankModalClose}
        footer={null}
        width={700}
      >
        <div className="p-4">
          {/* Seller Information */}
          {selectedOrderForBank && selectedOrderForBank.toUserId && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-3 font-medium">Seller Information</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {selectedOrderForBank.toUserId.image ? (
                    <Image
                      src={`${BACKEND_URL}/${selectedOrderForBank.toUserId.image}`}
                      alt={selectedOrderForBank.toUserId.username || "Seller"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedOrderForBank.toUserId.username || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrderForBank.toUserId.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* KYC Status Section */}
          {selectedOrderForBank && selectedOrderForBank.toUserId && (
            <div className={`mb-6 p-4 rounded-lg ${selectedOrderForBank.toUserId.kycApproved ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-sm text-gray-600 mb-3 font-medium">KYC Verification Status</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-semibold ${selectedOrderForBank.toUserId.kycApproved ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedOrderForBank.toUserId.kycApproved ? 'KYC Approved' : 'KYC Not Completed'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedOrderForBank.toUserId.kycApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedOrderForBank.toUserId.kycApproved ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              {!selectedOrderForBank.toUserId.kycApproved && (
                <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                  <p className="text-sm text-red-800">
                    ⚠️ Seller did not complete KYC verification. Payment cannot be processed until KYC is approved.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Withdrawal Amount Display */}
          {selectedOrderForBank && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Withdrawal Amount of this Order</p>
              <div className="flex items-center gap-2">
                <Image
                  alt="Dirham"
                  src="/dirham-sign.svg"
                  width={24}
                  height={24}
                  className="inline-block"
                />
                <p className="text-3xl font-bold text-gray-800">
                  {selectedOrderForBank.total || "0.00"}
                </p>
              </div>
            </div>
          )}

          {bankLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-[var(--text-color-body)]">
                Loading bank accounts...
              </p>
            </div>
          ) : sellerBanks.length === 0 ? (
            <div>
              <div className="flex flex-col justify-center items-center h-40">
                <p className="text-red-500 text-lg font-medium">
                  No bank added by Seller
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  The seller has not added any bank account yet.
                </p>
              </div>
              {/* Withdraw Sent Button - Disabled */}
              <div className="mt-6 pt-4 border-t flex justify-end">
                <button
                  disabled={true}
                  className="px-6 py-3 rounded-lg font-medium text-white bg-gray-400 cursor-not-allowed"
                >
                  {!selectedOrderForBank?.toUserId?.kycApproved ? "KYC Not Approved" : "No Bank Details"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Select a bank account to transfer funds:
              </p>
              {sellerBanks.map((bank, index) => (
                <div
                  key={bank._id}
                  className={`border rounded-lg p-4 ${bank.bankStatus === "active"
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Bank {index + 1}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${bank.bankStatus === "active"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                        }`}
                    >
                      {bank.bankStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-medium text-gray-800">
                        {bank.bankName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p className="font-medium text-gray-800">
                        {bank.accountHolderName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-medium text-gray-800">
                        {bank.accountNo || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IBAN</p>
                      <p className="font-medium text-gray-800">
                        {bank.iban || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Withdraw Sent Button */}
              <div className="mt-6 pt-4 border-t flex justify-end">
                <button
                  onClick={handleWithdrawSent}
                  disabled={withdrawLoading || sellerBanks.length === 0 || !selectedOrderForBank?.toUserId?.kycApproved}
                  className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${withdrawLoading || sellerBanks.length === 0 || !selectedOrderForBank?.toUserId?.kycApproved
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {withdrawLoading
                    ? "Processing..."
                    : !selectedOrderForBank?.toUserId?.kycApproved
                      ? "KYC Not Approved"
                      : sellerBanks.length === 0
                        ? "No Bank Details"
                        : "Withdraw Sent?"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
