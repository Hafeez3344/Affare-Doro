"use client"

import Image from "next/image";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FiEye, FiDollarSign } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import BACKEND_URL, { getAllReturnOrders, getUserActiveBanks, updateReturnOrderWithdrawalStatus } from "@/api/api";
import { updatePageNavigation } from "@/features/features";

const ReturnOrders = () => {

    const itemsPerPage = 20;
    const router = useRouter();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [customerBanks, setCustomerBanks] = useState([]);
    const [banksLoading, setBanksLoading] = useState(false);
    const [withdrawalProcessing, setWithdrawalProcessing] = useState(false);

    useEffect(() => {
        if (!auth) {
            router.push("/login");
            return;
        }
        dispatch(updatePageNavigation("return-orders"));

        fetchReturnOrders();
    }, [auth, dispatch, router]);

    const fetchReturnOrders = async () => {
        try {
            setLoading(true);

            const response = await getAllReturnOrders('all');
            if (response.status) {
                setOrders(response.data);
            } else {
                setOrders([]);
                setError(response.message);
            }
        } catch (err) {
            setOrders([]);
            setError("Failed to fetch orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (returnOrderId) => {
        router.push(`/return-orders/${returnOrderId}`);
    };

    const handlePaymentClick = async (e, order) => {
        e.stopPropagation();
        setSelectedOrder(order);
        setIsPaymentModalOpen(true);

        // Fetch customer's active banks
        if (order?.customerId?._id) {
            setBanksLoading(true);
            try {
                const response = await getUserActiveBanks(order.customerId._id);
                if (response.status) {
                    setCustomerBanks(response.data || []);
                } else {
                    setCustomerBanks([]);
                }
            } catch (error) {
                console.error("Error fetching banks:", error);
                setCustomerBanks([]);
            } finally {
                setBanksLoading(false);
            }
        }
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedOrder(null);
        setCustomerBanks([]);
    };

    const handleWithdrawalPaid = async () => {
        if (!selectedOrder?._id) return;

        const finalWithdrawal = selectedOrder?.orderId?.total;

        setWithdrawalProcessing(true);
        try {
            const response = await updateReturnOrderWithdrawalStatus(selectedOrder._id, finalWithdrawal);
            if (response.status) {
                alert("Withdrawal status updated successfully!");
                closePaymentModal();
                // Refresh the orders list
                fetchReturnOrders();
            } else {
                alert(response.message || "Failed to update withdrawal status");
            }
        } catch (error) {
            console.error("Error updating withdrawal status:", error);
            alert("An error occurred while updating withdrawal status");
        } finally {
            setWithdrawalProcessing(false);
        }
    };

    console.log(orders);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-1 flex">
                <Sidebar />
                <div className="flex-1 mt-[30px] px-[22px]">
                    {/* <SearchOnTop /> */}
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-semibold text-gray-800">Return Orders</p>
                    </div>

                    {/* Orders Section */}
                    <div className="my-[20px] p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-[94vw] md:w-[67vw] lg:w-[75vw] xl:w-auto">
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
                        ) : orders?.length === 0 ? (
                            <div className="flex justify-center items-center h-40">
                                <p className="text-[var(--text-color-body)]">No return orders found</p>
                            </div>
                        ) : (
                            <div className="p-[3px] bg-white rounded-[8px] w-full">
                                <table className="min-w-full border">
                                    <thead>
                                        <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                                            <th className="p-4 font-[500] text-nowrap">S.No</th>
                                            <th className="p-4 font-[500] text-nowrap">Customer</th>
                                            <th className="p-4 font-[500] text-nowrap">Product</th>
                                            <th className="p-4 font-[500]">Order Amount</th>
                                            <th className="p-4 font-[500]">Return Status</th>
                                            <th className="p-4 font-[500]">Payment Status</th>
                                            <th className="p-4 font-[500]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders?.map((order, index) => (
                                            <tr
                                                key={order._id}
                                                className="text-gray-800 text-sm border-b cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => handleRowClick(order._id)}
                                            >
                                                <td className="p-4 text-[13px]">{index + 1}</td>
                                                <td className="p-4 text-[13px]">
                                                    <div className="flex items-center gap-[10px] flex-nowrap">
                                                        <Image alt="customer-image" src={`${BACKEND_URL}/${order?.customerId?.image}`} width={32} height={32} className="w-8 h-8 object-cover rounded-full" />
                                                        <p className="text-nowrap">{order?.customerId?.fullName || "N/A"}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-[13px] flex items-center gap-3">
                                                    {order.orderId && order?.orderId?.productId?.length > 0 ? (
                                                        <>
                                                            <Image
                                                                src={`${BACKEND_URL}/${order?.orderId?.productId[0].image}`}
                                                                alt={order?.orderId?.productId[0].name || "Product"}
                                                                width={32}
                                                                height={32}
                                                                className="w-8 h-8 object-cover rounded-full"
                                                            />
                                                            <span>{order?.orderId?.productId[0].name || "N/A"}</span>
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
                                                            width={14}
                                                            height={14}
                                                            className="inline-block mr-1.5 mb-[1px]"
                                                        />
                                                        {order?.orderId?.subTotal || "0.00"}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className={`w-[max-content] rounded-full px-2 py-1 text-xs font-semibold capitalize ${order?.status?.toLowerCase() === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : order?.status?.toLowerCase() === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}>{order?.status || "Unknown"}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.paidByAdmin === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {order?.paidByAdmin || "unpaid"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                                                            title="View Details"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRowClick(order._id);
                                                            }}
                                                        >
                                                            <FiEye />
                                                        </button>
                                                        {order?.status?.toLowerCase() === "delivered" && (
                                                            <button
                                                                className="bg-green-100 text-green-600 rounded-full px-2 py-2"
                                                                title="Payment Details"
                                                                onClick={(e) => handlePaymentClick(e, order)}
                                                            >
                                                                <FiDollarSign />
                                                            </button>
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
                                        total={orders.length}
                                        pageSize={itemsPerPage}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Payment Details
                            </h2>
                            <button
                                onClick={closePaymentModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <AiOutlineClose size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="space-y-4">

                                {/* Withdrawal Calculation */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                                        Withdrawal Calculation
                                    </h3>
                                    {(() => {
                                        const subTotal = parseFloat(selectedOrder?.orderId?.subTotal || 0);
                                        const deduction1 = selectedOrder?.orderId?.total * 0.12; // 12% of subtotal
                                        const deduction2 = 17.36; // Fixed amount
                                        const totalDeduction = deduction1 + deduction2;
                                        const finalWithdrawal = selectedOrder?.orderId?.total;

                                        return (
                                            <div className="space-y-3">
                                                {/* Subtotal */}
                                                <div className="flex justify-between items-center bg-white p-3 rounded">
                                                    <span className="text-gray-700 font-medium">Order Subtotal</span>
                                                    <span className="inline-flex items-center text-gray-900 font-semibold">
                                                        <Image
                                                            alt="dirham"
                                                            src="/dirham-sign.svg"
                                                            width={14}
                                                            height={14}
                                                            className="mr-1.5"
                                                        />
                                                        {subTotal.toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Deductions Section */}
                                                <div className="bg-red-50 p-3 rounded space-y-2">
                                                    <p className="text-sm font-semibold text-red-800 mb-2">Deductions:</p>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-700">Platform Fee (12%)</span>
                                                        <span className="inline-flex items-center text-red-600 font-medium">
                                                            -<Image
                                                                alt="dirham"
                                                                src="/dirham-sign.svg"
                                                                width={12}
                                                                height={12}
                                                                className="mx-1"
                                                            />
                                                            {deduction1.toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-700">Shipping Charge + VAT</span>
                                                        <span className="inline-flex items-center text-red-600 font-medium">
                                                            -<Image
                                                                alt="dirham"
                                                                src="/dirham-sign.svg"
                                                                width={12}
                                                                height={12}
                                                                className="mx-1"
                                                            />
                                                            {deduction2.toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="border-t border-red-200 pt-2 mt-2">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-700 font-semibold">Total Deductions</span>
                                                            <span className="inline-flex items-center text-red-700 font-semibold">
                                                                -<Image
                                                                    alt="dirham"
                                                                    src="/dirham-sign.svg"
                                                                    width={12}
                                                                    height={12}
                                                                    className="mx-1"
                                                                />
                                                                {totalDeduction.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Final Withdrawal Amount */}
                                                <div className="bg-green-100 p-4 rounded border-2 border-green-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-bold text-green-800">Final Withdrawal Amount</span>
                                                        <span className="inline-flex items-center text-xl text-green-900 font-bold">
                                                            <Image
                                                                alt="dirham"
                                                                src="/dirham-sign.svg"
                                                                width={18}
                                                                height={18}
                                                                className="mr-2"
                                                            />
                                                            {finalWithdrawal.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* KYC Status Section */}
                                <div className={`p-4 rounded-lg ${selectedOrder?.customerId?.kycApproved ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                                        KYC Verification Status
                                    </h3>
                                    <div className="bg-white p-4 rounded border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500">Verification Status</p>
                                                <p className={`text-lg font-semibold ${selectedOrder?.customerId?.kycApproved ? 'text-green-700' : 'text-red-700'}`}>
                                                    {selectedOrder?.customerId?.kycApproved ? 'KYC Approved' : 'KYC Not Completed'}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedOrder?.customerId?.kycApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {selectedOrder?.customerId?.kycApproved ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                        {!selectedOrder?.customerId?.kycApproved && (
                                            <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                                                <p className="text-sm text-red-800">
                                                    ⚠️ User did not complete KYC verification. Payment cannot be processed until KYC is approved.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Customer Banks Section */}
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                                        Customer Bank Accounts
                                    </h3>
                                    {banksLoading ? (
                                        <div className="flex justify-center items-center py-4">
                                            <p className="text-gray-600">Loading bank accounts...</p>
                                        </div>
                                    ) : customerBanks.length > 0 ? (
                                        <div className="space-y-3">
                                            {customerBanks.map((bank, index) => (
                                                <div key={bank._id || index} className="bg-white p-4 rounded border border-purple-200">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Bank Name</p>
                                                                <p className="text-gray-900 font-semibold">
                                                                    {bank.bankName || "N/A"}
                                                                </p>
                                                            </div>
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                                {bank?.bankStatus}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Account Number</p>
                                                                <p className="text-sm text-gray-900 font-medium">
                                                                    {bank.accountNo || "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Account Holder</p>
                                                                <p className="text-sm text-gray-900 font-medium">
                                                                    {bank.accountHolderName || "N/A"}
                                                                </p>
                                                            </div>
                                                            {bank.iban && (
                                                                <div className="col-span-2">
                                                                    <p className="text-xs text-gray-500">IBAN</p>
                                                                    <p className="text-sm text-gray-900 font-medium">
                                                                        {bank.iban}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {bank.swiftCode && (
                                                                <div>
                                                                    <p className="text-xs text-gray-500">SWIFT Code</p>
                                                                    <p className="text-sm text-gray-900 font-medium">
                                                                        {bank.swiftCode}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-4 rounded border border-purple-200 text-center">
                                            <p className="text-gray-500 text-sm">
                                                No active bank accounts found for this customer
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-between items-center gap-3 p-6 border-t">
                            <button
                                onClick={closePaymentModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleWithdrawalPaid}
                                disabled={withdrawalProcessing || selectedOrder?.paidByAdmin === "paid" || customerBanks.length === 0 || !selectedOrder?.customerId?.kycApproved}
                                className={`px-4 py-2 rounded-md transition-colors ${withdrawalProcessing || selectedOrder?.paidByAdmin === "paid" || customerBanks.length === 0 || !selectedOrder?.customerId?.kycApproved
                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                            >
                                {withdrawalProcessing
                                    ? "Processing..."
                                    : selectedOrder?.paidByAdmin === "paid"
                                        ? "Already Paid"
                                        : !selectedOrder?.customerId?.kycApproved
                                            ? "KYC Not Approved"
                                            : customerBanks.length === 0
                                                ? "No Bank Details"
                                                : "Withdraw Amount Paid"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnOrders;
