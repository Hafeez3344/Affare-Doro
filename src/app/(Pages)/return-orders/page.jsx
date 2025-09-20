"use client"

import Image from "next/image";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FiEye } from "react-icons/fi";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import BACKEND_URL, { getAllReturnOrders } from "@/api/api";
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
                                                <td className="p-4 capitalize">
                                                    {order.status || "Unknown"}
                                                </td>
                                                <td className="p-4">
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
        </div>
    );
};

export default ReturnOrders;
