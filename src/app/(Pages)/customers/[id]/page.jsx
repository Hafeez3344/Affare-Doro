"use client";

import Image from "next/image";
import { Modal, notification, Pagination } from "antd";
import Navbar from "@/components/navbar";
import { useDispatch } from "react-redux";
import data from "@/components/customers";
import Sidebar from "@/components/sidebar";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import BACKEND_URL, { getProducts } from "@/api/api";
import { updatePageNavigation } from "@/features/features";
import grommetIconsMoney from "@/assets/svgs/grommet-icons_money.svg";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import axios from "axios";

// Function to generate star ratings
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="text-yellow-500 text-lg">
      {"★".repeat(fullStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </span>
  );
};

const CustomersDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // New state for block functionality
  const [showBlockTextarea, setShowBlockTextarea] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
      placement: "topRight",
      duration: 3,
      style: {
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
    });
  };

  useEffect(() => {
    dispatch(updatePageNavigation("customers"));
    // Find customer data based on ID
    const customer = data.find(item => item.id === parseInt(params.id));
    setCustomerData(customer);

    // Fetch products for the specific seller
    fetchProducts();
  }, [dispatch, params.id, fetchProducts]);

  const fetchProducts = useCallback(async () => {
    const response = await getProducts();
    if (response.status && Array.isArray(response.data)) {
      // Filter products by seller ID from URL parameter
      const sellerProducts = response.data.filter(product => product.userId?._id === params.id);
      setProducts(sellerProducts);

      // Set seller from the first product's userId
      if (sellerProducts.length > 0 && sellerProducts[0].userId) {
        setSeller(sellerProducts[0].userId);
      }
    }
  }, [params.id]);

  // Calculate paginated products
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleModalOpen = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const fn_controlUser = async (state, id, blockReason = "") => {
    try {
      const requestBody = { state };
      if (blockReason) {
        requestBody.blockReason = blockReason;
      }

      const response = await axios.post(`${BACKEND_URL}/admin/userBlock/${id}`, requestBody);
      if (response?.status === 200 || response?.status === 201) {
        showNotification(
          "success",
          "Update Successfully",
          "User status updated successfully."
        );
        // Reset block form state
        setShowBlockTextarea(false);
        setBlockReason("");
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
      showNotification(
        "error",
        "Update Failed",
        error?.response?.data?.message || "Network Error"
      );
    }
  }

  const handleBlockClick = () => {
    setShowBlockTextarea(true);
  };

  const handleCancelBlock = () => {
    setShowBlockTextarea(false);
    setBlockReason("");
  };

  const handleConfirmBlock = () => {
    if (blockReason.trim()) {
      fn_controlUser(true, seller._id, blockReason);
    } else {
      showNotification(
        "error",
        "Block Reason Required",
        "Please provide a reason for blocking the user."
      );
    }
  };

  const handleUnblockClick = () => {
    fn_controlUser(false, seller._id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {contextHolder}
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px] flex flex-col xl:flex-row gap-5">
          <div className="flex-1 h-[max-content]">
            <p className="text-[20px] font-[600]">Customer View Detail</p>
            <div className="mt-[20px] grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
                <p className="text-[14px] text-[var(--text-color-body)]">
                  Total Cost Order
                </p>
                <div className="flex gap-2 items-start mt-4">
                  <Image alt="" src={grommetIconsMoney} className="mt-2" />
                  <div>
                    <p className="text-[25px] font-[600]">
                      ${customerData?.totalCost?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-[12px] text-[var(--text-color-body)]">
                      All time total cost
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
                <p className="text-[14px] text-[var(--text-color-body)]">
                  Total Cost Order
                </p>
                <div className="flex gap-2 items-start mt-4">
                  <Image alt="" src={grommetIconsMoney} className="mt-2" />
                  <div>
                    <p className="text-[25px] font-[600]">
                      $00.00
                    </p>
                    <p className="text-[12px] text-[var(--text-color-body)]">
                      All time total cost
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm">
                <p className="text-[14px] text-[var(--text-color-body)]">
                  Total Cost Order
                </p>
                <div className="flex gap-2 items-start mt-4">
                  <Image alt="" src={grommetIconsMoney} className="mt-2" />
                  <div>
                    <p className="text-[25px] font-[600]">
                      $00.00
                    </p>
                    <p className="text-[12px] text-[var(--text-color-body)]">
                      All time total cost
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="px-[20px] py-[30px] bg-white rounded-[8px] shadow-sm xl:col-span-3 flex flex-col lg:flex-row gap-20">
                <div className="lg:w-[40%] xl:w-[30%]">
                  <p className="text-[var(--text-color-body)] font-[500]">
                    General Data
                  </p>
                  <div className="flex items-center gap-5 text-[15px] mt-4">
                    <p className="w-[120px]">Age</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>{customerData?.age || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Birthday</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>{customerData?.birthday || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Gender</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>{customerData?.gender || "N/A"}</p>
                  </div>
                </div>
                <div className="border border-gray-200"></div>
                <div className="flex-1">
                  <p className="text-[var(--text-color-body)] font-[500]">
                    Contact Information
                  </p>
                  <div className="flex items-center gap-5 text-[15px] mt-4">
                    <p className="w-[120px]">Email</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>{customerData?.email || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Phone</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>{customerData?.phone || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-5 text-[15px] mt-2">
                    <p className="w-[120px]">Address</p>
                    <FaArrowRight className="text-[14px] text-[var(--text-color-body)]" />
                    <p>{customerData?.address || "N/A"}</p>
                  </div>
                </div>
              </div> */}

              {/* show here the products i am giving you the example of other page code only sow product dynamic */}
              <div className="xl:col-span-3">
                <p className="text-[20px] font-[600] mb-6">Products</p>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 justify-items-center">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[250px] h-[360px]"
                    >
                      <div className="relative h-[200px] w-full group">
                        <Image
                          alt={product.name}
                          src={`${BACKEND_URL}/${product.image?.[0]}`}
                          className="w-full h-full object-cover rounded-lg"
                          width={250}
                          height={200}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={() => handleModalOpen(product)}
                            className="bg-white text-gray-800 px-3 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                          >
                            View Detail
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 px-3">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleModalOpen(product)}
                            className="text-sm font-semibold text-gray-800 hover:underline text-nowrap"
                          >
                            {product.name}
                          </button>
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          {getStarRating(4.5)}
                        </div>

                        <div className="mt-1">
                          <p className="text-[12px] text-gray-500">
                            Category: {product.categoryId?.[product.categoryId.length - 1]?.name || "N/A"}
                          </p>
                          <p className="text-[12px] font-semibold text-teal-600">
                            $ {product.price || "N/A"}
                          </p>
                          <p className="text-[12px] font-semibold text-teal-600">
                            $ {product.inclPrice || "N/A"}{" "}
                            <span className="text-xs text-gray-400">incl.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length > itemsPerPage && (
                  <div className="flex justify-end mt-6">
                    <Pagination
                      current={currentPage}
                      onChange={(page) => setCurrentPage(page)}
                      total={products.length}
                      pageSize={itemsPerPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* seller account  */}
          <div className="xl:w-[320px] bg-white rounded-[8px] shadow-sm flex items-center flex-col px-[20px] py-[39px] h-[max-content]">
            <div className="w-[65px] h-[65px] rounded-full bg-[#E0D5C9] overflow-hidden">
              <Image
                alt={seller?.username || "Seller"}
                src={seller?.profileImage ? `${BACKEND_URL}/${seller.profileImage}` : "/default-profile.png"}
                width={65}
                height={65}
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
            <p className="text-gray-900 text-[14px] font-semibold mt-3">
              {seller?.username || "Seller Name"}
            </p>
            <p className="text-[14px] font-[500] mt-1">
              <span className="text-[var(--text-color-body)]">ID: </span>
              {seller?._id || "N/A"}
            </p>

            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[14px] text-[var(--text-color-body)]">Rating</p>
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-500">
                    {"★".repeat(Math.floor(seller?.rating || 0))}
                    {"☆".repeat(5 - Math.floor(seller?.rating || 0))}
                    <span className="text-gray-900 text-sm ml-2">
                      ({seller?.reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {seller?.block
                ? (
                  <div className="py-[15px]">
                    <button
                      className="w-full h-[40px] bg-yellow-500 text-black font-[500] text-[15px] rounded-[10px]"
                      onClick={handleUnblockClick}
                    >
                      <CgUnblock className="inline-block text-black mr-1 mt-[-2px]" size={19} /> UnBlock
                    </button>
                  </div>
                )
                : (
                  <div className="py-[15px]">
                    {!showBlockTextarea ? (
                      <button
                        className="w-full h-[40px] bg-yellow-500 text-black font-[500] text-[15px] rounded-[10px]"
                        onClick={handleBlockClick}
                      >
                        <MdBlock className="inline-block text-black mr-1 mt-[-2px]" size={18} /> Block
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button
                          className="w-full h-[40px] bg-gray-500 text-white font-[500] text-[15px] rounded-[10px] flex items-center justify-center"
                          onClick={handleCancelBlock}
                        >
                          <IoClose className="inline-block text-white mr-1 mt-[-2px]" size={18} /> Cancel
                        </button>
                        <textarea
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          placeholder="Enter block reason..."
                          className="w-full h-[80px] p-3 border border-gray-300 rounded-[10px] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                          className="w-full h-[40px] bg-red-500 text-white font-[500] text-[15px] rounded-[10px] flex items-center justify-center"
                          onClick={handleConfirmBlock}
                        >
                          <MdBlock className="inline-block text-white mr-1 mt-[-2px]" size={18} /> Block User
                        </button>
                      </div>
                    )}
                  </div>
                )
              }


              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Full Name</p>
                <p className="font-[500] text-[15px]">{seller?.fullName || "N/A"}</p>
              </div>

              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Email Address</p>
                <p className="font-[500] text-[15px]">{seller?.email || "N/A"}</p>
              </div>

              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Phone Number</p>
                <p className="font-[500] text-[15px]">{seller?.phone || "N/A"}</p>
              </div>

              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Country</p>
                <p className="font-[500] text-[15px]">{seller?.country || "N/A"}</p>
              </div>

              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">City</p>
                <p className="font-[500] text-[15px]">{seller?.city || "N/A"}</p>
              </div>

              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Gender</p>
                <p className="font-[500] text-[15px]">{seller?.gender || "N/A"}</p>
              </div>


              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Total Products</p>
                <p className="font-[500] text-[15px]">{products.length || 0}</p>
              </div>

              {/* <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Account Status</p>
                <span className={`px-2 py-1 rounded-[20px] text-[11px] w-fit flex items-center justify-center ${seller?.status === "active"
                  ? "bg-[#10CB0026] text-[#0DA000]"
                  : "bg-[#FF000026] text-[#FF0000]"
                  }`}>
                  {seller?.status || "Inactive"}
                </span>
              </div> */}

              <div className="w-[100%] flex flex-col gap-2 mt-4">
                <p className="text-[14px] text-[var(--text-color-body)]">Member Since</p>
                <p className="font-[500] text-[15px]">
                  {seller?.createdAt
                    ? new Date(seller.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product View Modal */}
      <Modal
        centered
        footer={null}
        width={800}
        title={<p className="text-[20px] font-[700]">Product Details</p>}
        open={isModalOpen}
        onCancel={handleModalClose}
      >
        {selectedProduct && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Left side - Product Details */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Product Name:</p>
                  <p className="text-[14px]">{selectedProduct.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Status:</p>
                  <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                    {selectedProduct.status || "Active"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Category:</p>
                  <p className="text-[14px]">{selectedProduct.categoryId?.[selectedProduct.categoryId?.length - 1]?.name || "N/A"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Price:</p>
                  <p className="text-[14px] text-teal-600 font-semibold">${selectedProduct.price || "N/A"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Incl. Price:</p>
                  <p className="text-[14px] text-teal-600 font-semibold">
                    ${selectedProduct.inclPrice || "N/A"}{" "}
                    <span className="text-xs text-gray-400">incl.</span>
                  </p>
                </div>
              </div>

              {/* Right side - Product Images */}
              {selectedProduct.image && selectedProduct.image.length > 0 && (
                <div className="w-[400px] flex-shrink-0">
                  <div className="w-full h-[300px]">
                    <Image
                      src={`${BACKEND_URL}/${selectedProduct.image[0]}`}
                      alt={selectedProduct.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomersDetails;

