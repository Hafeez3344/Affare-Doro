"use client"

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, notification, Spin } from "antd";

import { FiArrowLeft, FiCheck, FiX, FiZoomIn, FiXCircle, FiAlertTriangle } from "react-icons/fi";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import BACKEND_URL, { getReturnOrderById, updateReturnOrderStatus } from "@/api/api";
import { updatePageNavigation } from "@/features/features";

const ReturnOrderDetails = () => {

    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [returnOrder, setReturnOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!auth) {
            router.push("/login");
            return;
        }
        dispatch(updatePageNavigation("return-orders"));

        if (params.id) {
            fetchReturnOrderDetails();
        }
    }, [auth, dispatch, router, params.id]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && showImageModal) {
                closeImageModal();
            }
        };

        if (showImageModal) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [showImageModal]);

    const fetchReturnOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await getReturnOrderById(params.id);

            if (response.status) {
                setReturnOrder(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to fetch return order details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleReturnOrderAction = (action) => {
        if (!returnOrder?._id || actionLoading || returnOrder.status !== 'pending') return;

        setPendingAction(action);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        if (!pendingAction || !returnOrder?._id) return;

        try {
            setActionLoading(true);
            setShowConfirmModal(false);

            const response = await updateReturnOrderStatus(returnOrder._id, pendingAction);

            if (response.status) {
                notification.success({
                    message: "Success",
                    description: response.message || 'Return order updated successfully',
                    placement: "topRight",
                    style: { marginTop: "50px" },
                });

                setTimeout(() => {
                    router.push('/return-orders');
                }, 2000);
            } else {
                notification.error({
                    message: "Error",
                    description: response?.message || 'Failed to update return order',
                    placement: "topRight",
                    style: { marginTop: "50px" },
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: 'An unexpected error occurred. Please try again.',
                placement: "topRight",
                style: { marginTop: "50px" },
            });
        } finally {
            setActionLoading(false);
            setPendingAction(null);
        }
    };

    const cancelAction = () => {
        setShowConfirmModal(false);
        setPendingAction(null);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-1 flex">
                <Sidebar />
                <div className="flex-1 mt-[30px] px-[22px]">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FiArrowLeft className="text-lg" />
                            <span>Back</span>
                        </button>
                        <p className="text-2xl font-semibold text-gray-800">Return Order Details</p>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-[var(--text-color-body)]">Loading return order details...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : returnOrder ? (
                        <div className="space-y-6">
                            {/* Order Information */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-medium">{returnOrder.orderId?._id || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Return Status</p>
                                        <p className="font-medium capitalize">{returnOrder.status || "Unknown"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <div className="flex items-center">
                                            <Image
                                                alt=""
                                                src="/dirham-sign.svg"
                                                width={14}
                                                height={14}
                                                className="inline-block mr-1.5 mb-[1px]"
                                            />
                                            <span className="font-medium">{returnOrder.orderId?.subTotal || "0.00"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Return Reason & Supporting Images */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Return Request Details</h3>

                                {/* Return Reason - Highlighted */}
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-red-600 text-sm font-bold">!</span>
                                            </div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <h4 className="text-sm font-medium text-red-800 mb-1">Return Reason</h4>
                                            <p className="text-red-700 font-medium text-lg leading-relaxed">
                                                {returnOrder.returnReason || "No reason provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Supporting Images */}
                                {returnOrder.images && returnOrder.images.length > 0 ? (
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-700 mb-3">Supporting Evidence Images</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {returnOrder.images.map((image, index) => (
                                                <div key={index} className="relative group cursor-pointer" onClick={() => handleImageClick(image)}>
                                                    <Image
                                                        src={`${BACKEND_URL}/uploads/${image}`}
                                                        alt={`Supporting image ${index + 1}`}
                                                        width={200}
                                                        height={200}
                                                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-red-300 transition-colors"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                        <FiZoomIn className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                                                        <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Click on any image to view in full size</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No supporting images provided</p>
                                    </div>
                                )}
                            </div>

                            {/* Customer Information Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                                <div className="flex items-start gap-4">
                                    <Image
                                        alt="customer-image"
                                        src={`${BACKEND_URL}/${returnOrder.customerId?.image}`}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                                <p className="font-medium text-lg">{returnOrder.customerId?.fullName || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                                <p className="font-medium">{returnOrder.customerId?.email || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                                <p className="font-medium">{returnOrder.customerId?.phone || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Customer ID</p>
                                                <p className="font-medium text-sm text-gray-500">{returnOrder.customerId?._id || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Information Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
                                <div className="flex items-start gap-4">
                                    <Image
                                        alt="seller-image"
                                        src={`${BACKEND_URL}/${returnOrder.sellerId?.image || returnOrder.sellerId?.profileImage}`}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Store Name</p>
                                                <p className="font-medium text-lg">{returnOrder.sellerId?.storeName || returnOrder.sellerId?.fullName || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                                <p className="font-medium">{returnOrder.sellerId?.email || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                                <p className="font-medium">{returnOrder.sellerId?.phone || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Seller ID</p>
                                                <p className="font-medium text-sm text-gray-500">{returnOrder.sellerId?._id || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Information Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h3>
                                {returnOrder.orderId?.productId?.length > 0 ? (
                                    <div className="flex items-start gap-4">
                                        <Image
                                            src={`${BACKEND_URL}/${returnOrder.orderId.productId[0].image}`}
                                            alt={returnOrder.orderId.productId[0].name || "Product"}
                                            width={120}
                                            height={120}
                                            className="w-30 h-30 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Product Name</p>
                                                    <p className="font-medium text-lg">{returnOrder.orderId.productId[0].name || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Brand</p>
                                                    <p className="font-medium">{returnOrder.orderId.productId[0].brand || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Category</p>
                                                    <p className="font-medium">{returnOrder.orderId.productId[0].category || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Price</p>
                                                    <div className="flex items-center">
                                                        <Image
                                                            alt=""
                                                            src="/dirham-sign.svg"
                                                            width={14}
                                                            height={14}
                                                            className="inline-block mr-1.5 mb-[1px]"
                                                        />
                                                        <span className="font-medium">{returnOrder.orderId.productId[0].price || "0.00"}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                                                    <p className="font-medium">{returnOrder.orderId.productId[0].quantity || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Product ID</p>
                                                    <p className="font-medium text-sm text-gray-500">{returnOrder.orderId.productId[0]._id || "N/A"}</p>
                                                </div>
                                            </div>
                                            {returnOrder.orderId.productId[0].description && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-600 mb-1">Description</p>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{returnOrder.orderId.productId[0].description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg">No product information available</p>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Information */}
                            {returnOrder.orderId?.shippingInfo && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium">{returnOrder.orderId.shippingInfo.address || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">City</p>
                                            <p className="font-medium">{returnOrder.orderId.shippingInfo.city || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">State</p>
                                            <p className="font-medium">{returnOrder.orderId.shippingInfo.state || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Postal Code</p>
                                            <p className="font-medium">{returnOrder.orderId.shippingInfo.postalCode || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Action Buttons - Only show when status is pending */}
                            {returnOrder.status === 'pending' && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-end gap-4">
                                        {/* Reject Button */}
                                        <button
                                            onClick={() => handleReturnOrderAction('reject')}
                                            disabled={actionLoading}
                                            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${actionLoading
                                                ? 'bg-red-500 text-white cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700 text-white'
                                                }`}
                                        >
                                            {actionLoading ? <Spin size="small" /> : <FiXCircle className="text-lg" />}
                                            {actionLoading ? 'Processing...' : 'Reject Request'}
                                        </button>

                                        {/* Approve Button */}
                                        <button
                                            onClick={() => handleReturnOrderAction('approve')}
                                            disabled={actionLoading}
                                            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${actionLoading
                                                ? 'bg-green-500 text-white cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            {actionLoading ? <Spin size="small" /> : <FiCheck className="text-lg" />}
                                            {actionLoading ? 'Processing...' : 'Approve Request'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Status Display - Show when status is not pending */}
                            {returnOrder.status !== 'pending' && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-center">
                                        <div className={`px-6 py-3 rounded-lg flex items-center gap-2 ${returnOrder.status === 'approved'
                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                            : returnOrder.status === 'rejected'
                                                ? 'bg-red-100 text-red-800 border border-red-200'
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                            {returnOrder.status === 'approved' ? (
                                                <FiCheck className="text-lg" />
                                            ) : returnOrder.status === 'rejected' ? (
                                                <FiXCircle className="text-lg" />
                                            ) : null}
                                            <span className="font-medium capitalize">
                                                {returnOrder.status === 'approved'
                                                    ? 'Return Order Approved'
                                                    : returnOrder.status === 'rejected'
                                                        ? 'Return Order Rejected'
                                                        : `Status: ${returnOrder.status}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-[var(--text-color-body)]">No return order found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={closeImageModal}
                >
                    <div
                        className="relative max-w-4xl max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
                        >
                            <FiX className="text-gray-800 text-xl" />
                        </button>
                        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src={`${BACKEND_URL}/uploads/${selectedImage}`}
                                alt="Supporting evidence image"
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-white text-sm">Click outside or press ESC to close</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <FiAlertTriangle className="text-orange-600 text-lg" />
                        </div>
                        <span className="text-lg font-semibold">
                            {pendingAction === 'approve' ? 'Approve Return Order' : 'Reject Return Order'}
                        </span>
                    </div>
                }
                style={{ fontFamily: '"Poppins", sans-serif' }}
                open={showConfirmModal}
                onOk={confirmAction}
                onCancel={cancelAction}
                okText={pendingAction === 'approve' ? 'Approve' : 'Reject'}
                cancelText="Cancel"
                okButtonProps={{
                    style: { color: 'white', backgroundColor: pendingAction === 'approve' ? 'green' : 'red', width: '130px', height: '40px', fontFamily: '"Poppins", sans-serif' },
                    loading: actionLoading,
                }}
                cancelButtonProps={{
                    disabled: actionLoading,
                    style: { color: 'gray', backgroundColor: 'white', width: '130px', height: '40px', fontFamily: '"Poppins", sans-serif' },
                }}
                closable={!actionLoading}
                maskClosable={!actionLoading}
            >
                <div className="py-4">
                    <p className="text-gray-700 text-base leading-relaxed">
                        Are you sure you want to{' '}
                        <span className={`font-semibold ${pendingAction === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                            {pendingAction === 'approve' ? 'approve' : 'reject'}
                        </span>{' '}
                        this return order request?
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Return Reason:</strong> {returnOrder?.returnReason || 'No reason provided'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            <strong>Customer:</strong> {returnOrder?.customerId?.fullName || 'N/A'}
                        </p>
                    </div>
                    {actionLoading && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                            <Spin size="small" />
                            <span className="text-sm">Processing your request...</span>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ReturnOrderDetails;
