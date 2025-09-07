"use client";

import axios from "axios";
import Image from "next/image";
import moment from "moment-timezone";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination, Input, Button, notification } from "antd";

import BACKEND_URL from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { updatePageNavigation } from "@/features/features";

import { FiEye, FiCheck, FiX } from "react-icons/fi";

const KYC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [kycs, setKYCs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalKycs, setTotalKycs] = useState(0);
    const [itemsPerPage] = useState(10);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedKYC, setSelectedKYC] = useState(null);
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [declineReason, setDeclineReason] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const fn_fetchKYCs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/kyc/getAll?page=${currentPage}&limit=${itemsPerPage}`);
            if (response?.status === 200) {
                setKYCs(response?.data?.data || []);
                setTotalPages(response?.data?.pagination?.totalPages || 1);
                setTotalKycs(response?.data?.pagination?.totalKycs || 0);
            }
        } catch (error) {
            console.log(error);
            setKYCs([]);
            notification.error({
                message: "Error",
                description: "Failed to fetch KYCs",
                placement: "topRight",
                style: { marginTop: "50px" },
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        if (!auth) {
            router.push("/login");
            return;
        }
        dispatch(updatePageNavigation("kyc"));
        fn_fetchKYCs();
    }, [auth, dispatch, router, currentPage, fn_fetchKYCs]);

    const handleViewKYC = (kyc) => {
        setSelectedKYC(kyc);
        setViewModalOpen(true);
    };

    const handleApprove = (kyc) => {
        setSelectedKYC(kyc);
        setActionType("approve");
        setActionModalOpen(true);
    };

    const handleDecline = (kyc) => {
        setSelectedKYC(kyc);
        setActionType("decline");
        setDeclineReason("");
        setActionModalOpen(true);
    };

    const handleActionSubmit = async () => {
        try {
            setLoading(true);
            const payload = {
                status: actionType === "approve" ? "approved" : "declined",
                ...(actionType === "decline" && { declineReason: declineReason })
            };

            const response = await axios.put(
                `${BACKEND_URL}/kyc/updateStatus/${selectedKYC._id}`,
                payload
            );

            if (response?.status === 200) {
                notification.success({
                    message: "Success",
                    description: `KYC ${actionType === "approve" ? "approved" : "declined"} successfully`,
                    placement: "topRight",
                    style: { marginTop: "50px" },
                });
                fn_fetchKYCs();
                setActionModalOpen(false);
                setSelectedKYC(null);
                setDeclineReason("");
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Error",
                description: `Failed to ${actionType} KYC`,
                placement: "topRight",
                style: { marginTop: "50px" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-[#10CB0026] text-[#0DA000]";
            case "declined":
                return "bg-[#FF000026] text-[#FF0000]";
            case "pending":
                return "bg-[#FFA50026] text-[#FF8C00]";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getIDTypeLabel = (idType) => {
        switch (idType) {
            case "passport":
                return "Passport";
            case "national-id":
                return "National ID";
            case "driving-license":
                return "Driving License";
            default:
                return idType;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-1 flex">
                <Sidebar />
                <div className="flex-1 mt-[30px] px-[22px]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">KYCs</h1>
                    </div>

                    <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-full">
                        <table className="min-w-full border">
                            <thead>
                                <tr
                                    style={{ backgroundColor: "rgba(232, 187, 76, 0.08)" }}
                                    className="text-left text-[14px] text-gray-700"
                                >
                                    <th className="p-4 font-[500] text-nowrap">User</th>
                                    <th className="p-4 font-[500]">Full Name</th>
                                    <th className="p-4 font-[500]">Date of Birth</th>
                                    <th className="p-4 font-[500]">Nationality</th>
                                    <th className="p-4 font-[500]">Gender</th>
                                    <th className="p-4 font-[500]">ID Type</th>
                                    <th className="p-4 font-[500]">Status</th>
                                    <th className="p-4 font-[500]">Submitted Date</th>
                                    <th className="p-4 font-[500]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center p-8 text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : kycs.length > 0 ? (
                                    kycs.map((kyc) => (
                                        <tr
                                            key={kyc._id}
                                            className="text-gray-800 text-sm border-b hover:bg-gray-50"
                                        >
                                            <td className="p-4 text-[13px] flex items-center gap-2">
                                                {kyc.userId?.image && (
                                                    <Image
                                                        src={`${BACKEND_URL}/${kyc.userId.image}`}
                                                        alt={kyc.userId.username}
                                                        className="w-8 h-8 object-cover rounded-full"
                                                        width={32}
                                                        height={32}
                                                    />
                                                )}
                                                <span className="text-[12px] text-gray-600">
                                                    {kyc.userId?.username || "N/A"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[13px]">{kyc.fullName}</td>
                                            <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                                                {moment(kyc.dateOfBirth).format("DD MMM YYYY")}
                                            </td>
                                            <td className="p-4 text-[13px]">{kyc.nationality}</td>
                                            <td className="p-4 text-[13px]">{kyc.gender || "N/A"}</td>
                                            <td className="p-4 text-[13px]">{getIDTypeLabel(kyc.idType)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-[20px] capitalize text-[11px] flex items-center justify-center w-[80px] ${getStatusColor(kyc.status)}`}>
                                                    {kyc.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                                                {moment(kyc.createdAt).format("DD MMM YYYY, hh:mm A")}
                                            </td>
                                            <td className="p-4 flex space-x-2">
                                                <button
                                                    className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                                                    title="View Documents"
                                                    onClick={() => handleViewKYC(kyc)}
                                                >
                                                    <FiEye />
                                                </button>
                                                {kyc.status === "pending" && (
                                                    <>
                                                        <button
                                                            className="bg-green-100 text-green-600 rounded-full px-2 py-2"
                                                            title="Approve"
                                                            onClick={() => handleApprove(kyc)}
                                                        >
                                                            <FiCheck />
                                                        </button>
                                                        <button
                                                            className="bg-red-100 text-red-600 rounded-full px-2 py-2"
                                                            title="Decline"
                                                            onClick={() => handleDecline(kyc)}
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center p-4 text-gray-500">
                                            No KYCs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <Pagination
                                current={currentPage}
                                onChange={(page) => setCurrentPage(page)}
                                total={totalKycs}
                                pageSize={itemsPerPage}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* View KYC Documents Modal */}
            <Modal
                centered
                footer={null}
                width={900}
                title={<p className="text-[20px] font-[700]">KYC Documents</p>}
                open={viewModalOpen}
                onCancel={() => {
                    setViewModalOpen(false);
                    setSelectedKYC(null);
                }}
            >
                {selectedKYC && (
                    <div className="space-y-6">
                        {/* KYC Details */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-[15px] font-[600]">Full Name:</p>
                                <p className="text-[14px]">{selectedKYC.fullName}</p>
                            </div>
                            <div>
                                <p className="text-[15px] font-[600]">Date of Birth:</p>
                                <p className="text-[14px]">{moment(selectedKYC.dateOfBirth).format("DD MMM YYYY")}</p>
                            </div>
                            <div>
                                <p className="text-[15px] font-[600]">Nationality:</p>
                                <p className="text-[14px]">{selectedKYC.nationality}</p>
                            </div>
                            <div>
                                <p className="text-[15px] font-[600]">Gender:</p>
                                <p className="text-[14px]">{selectedKYC.gender || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[15px] font-[600]">ID Type:</p>
                                <p className="text-[14px]">{getIDTypeLabel(selectedKYC.idType)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] font-[600]">Status:</p>
                                <span className={`px-2 py-1 rounded-[20px] text-[11px] ${getStatusColor(selectedKYC.status)}`}>
                                    {selectedKYC.status}
                                </span>
                            </div>
                        </div>

                        {/* Decline Reason (only show if status is declined) */}
                        {selectedKYC.status === "declined" && selectedKYC.declineReason && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-[15px] font-[600] text-red-800 mb-2">Decline Reason:</p>
                                <p className="text-[14px] text-red-700">{selectedKYC.declineReason}</p>
                            </div>
                        )}

                        {/* Documents */}
                        <div className="space-y-4">
                            <h3 className="text-[16px] font-[600]">Documents</h3>

                            {/* ID Front */}
                            <div>
                                <p className="text-[14px] font-[500] mb-2">ID Front:</p>
                                {selectedKYC.idFront && (
                                    <div className="relative w-full h-64 border rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => handleImageClick(`${BACKEND_URL}/uploads/${selectedKYC.idFront}`)}>
                                        <Image
                                            src={`${BACKEND_URL}/uploads/${selectedKYC.idFront}`}
                                            alt="ID Front"
                                            fill
                                            className="object-contain hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ID Back (if exists) */}
                            {selectedKYC.idBack && (
                                <div>
                                    <p className="text-[14px] font-[500] mb-2">ID Back:</p>
                                    <div className="relative w-full h-64 border rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => handleImageClick(`${BACKEND_URL}/uploads/${selectedKYC.idBack}`)}>
                                        <Image
                                            src={`${BACKEND_URL}/uploads/${selectedKYC.idBack}`}
                                            alt="ID Back"
                                            fill
                                            className="object-contain hover:scale-105 transition-transform"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Selfie with ID */}
                            <div>
                                <p className="text-[14px] font-[500] mb-2">Selfie with ID:</p>
                                {selectedKYC.selfieWithId && (
                                    <div className="relative w-full h-64 border rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => handleImageClick(`${BACKEND_URL}/uploads/${selectedKYC.selfieWithId}`)}>
                                        <Image
                                            src={`${BACKEND_URL}/uploads/${selectedKYC.selfieWithId}`}
                                            alt="Selfie with ID"
                                            fill
                                            className="object-contain hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Action Modal (Approve/Decline) */}
            <Modal
                centered
                footer={null}
                width={500}
                title={
                    <p className="text-[20px] font-[700]">
                        {actionType === "approve" ? "Approve KYC" : "Decline KYC"}
                    </p>
                }
                open={actionModalOpen}
                onCancel={() => {
                    setActionModalOpen(false);
                    setSelectedKYC(null);
                    setDeclineReason("");
                }}
            >
                {selectedKYC && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-[14px]">
                                <span className="font-[600]">User:</span> {selectedKYC.userId?.username || "N/A"}
                            </p>
                            <p className="text-[14px]">
                                <span className="font-[600]">Full Name:</span> {selectedKYC.fullName}
                            </p>
                        </div>

                        {actionType === "decline" && (
                            <div>
                                <label className="text-[14px] font-[500] mb-2 block">
                                    Reason for Decline:
                                </label>
                                <Input.TextArea
                                    rows={4}
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    placeholder="Enter reason for declining this KYC..."
                                    className="w-full"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <Button
                                onClick={() => setActionModalOpen(false)}
                                style={{
                                    backgroundColor: "white",
                                    color: "gray",
                                    borderColor: "gray",
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                loading={loading}
                                disabled={actionType === "decline" && !declineReason.trim()}
                                onClick={handleActionSubmit}
                                style={{
                                    backgroundColor: actionType === "approve" ? "#10CB00" : "#FF0000",
                                    color: actionType === "approve" ? "black" : "white",
                                }}
                            >
                                {actionType === "approve" ? "Approve" : "Decline"}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Image Viewer Modal */}
            <Modal
                centered
                footer={null}
                width={800}
                title={<p className="text-[20px] font-[700]">Document Viewer</p>}
                open={imageModalOpen}
                onCancel={() => {
                    setImageModalOpen(false);
                    setSelectedImage(null);
                }}
            >
                {selectedImage && (
                    <div className="flex justify-center">
                        <div className="relative w-full h-96">
                            <Image
                                src={selectedImage}
                                alt="Document"
                                fill
                                className="object-contain"
                                onClick={() => window.open(selectedImage, '_blank')}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default KYC;
