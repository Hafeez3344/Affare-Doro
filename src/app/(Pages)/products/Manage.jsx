import React, { useEffect, useState } from "react";
import Image from "next/image";
import BACKEND_URL, { getCategories, getProducts } from "@/api/api";
import { notification, Modal } from "antd";
import { Heart } from "lucide-react";

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

const Manage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await getProducts();
      if (response?.status && Array.isArray(response?.data)) {
        setCategories(response.data);
      } else {
        throw new Error(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "An unexpected error occurred",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleModalOpen = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  console.log("Categories:", categories);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[250px] h-[360px]" 
          >
            
            <div className="relative h-[200px] w-full group">
              <Image
                alt={category.name}
                src={`${BACKEND_URL}/${category.image?.[0]}`}
                className="w-full h-full object-cover rounded-lg" 
                width={250}
                height={200} 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleModalOpen(category)}
                  className="bg-white text-gray-800 px-3 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  View Detail
                </button>
              </div>
            </div>

            <div className="mt-2 px-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleModalOpen(category)}
                  className="text-sm font-semibold text-gray-800 hover:underline" 
                >
                  {category.name}
                </button>

                <button
                  className={`cursor-pointer transition-colors ${
                    wishlist[category._id]
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-300"
                  }`}
                  onClick={() => toggleWishlist(category._id)}
                >
                  <Heart
                    size={18} 
                    fill={wishlist[category._id] ? "red" : "none"}
                  />
                </button>
              </div>

              <div className="flex items-center gap-1 mt-1">
                {getStarRating(4.5)}
              </div>

              <div className="mt-1">
                <p className="text-[12px] text-gray-500">
                  Category: {category.category || "N/A"}
                </p>
                <p className="text-[12px] text-gray-500">
                  Size: {category.size || "None"}
                </p>
                <p className="text-[12px] font-semibold text-teal-600">
                  {category.price || "N/A"}
                </p>
                <p className="text-[12px] font-semibold text-teal-600">
                  {category.inclPrice || "N/A"}{" "}
                  <span className="text-xs text-gray-400">incl.</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

           {/* Product View Model  */}
      <Modal
        centered
        footer={null}
        width={580}
        title={<p className="text-[20px] font-[700]">Product Details</p>}
        open={isModalOpen}
        onCancel={handleModalClose}
      >
        {selectedCategory && (
          <div className="flex gap-4">
            {/* Left side - Product Details */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-[600] w-[120px]">Product Name:</p>
                <p className="text-[14px]">{selectedCategory.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-[600] w-[120px]">Status:</p>
                <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                  {selectedCategory.status || "Active"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-[600] w-[120px]">Category:</p>
                <p className="text-[14px]">{selectedCategory.category || "N/A"}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-[600] w-[120px]">Size:</p>
                <p className="text-[14px]">{selectedCategory.size || "None"}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-[600] w-[120px]">Price:</p>
                <p className="text-[14px] text-teal-600 font-semibold">{selectedCategory.price || "N/A"}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[14px] font-[600] w-[120px]">Incl. Price:</p>
                <p className="text-[14px] text-teal-600 font-semibold">
                  {selectedCategory.inclPrice || "N/A"}{" "}
                  <span className="text-xs text-gray-400">incl.</span>
                </p>
              </div>
            </div>

            {/* Right side - Product Image */}
            {selectedCategory.image && (
              <div className="w-[220px] h-[220px] flex-shrink-0">
                <img
                  src={`${BACKEND_URL}/${selectedCategory.image?.[0]}`}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Manage;
