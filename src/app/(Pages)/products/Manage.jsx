import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "@/api/api";
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
      const response = await getCategories();
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[300px]"
          >
            <div className="relative">
              <Image
                alt={category.name}
                src={`http://localhost:8000/${category.image?.replace(/\\/g, "/")}`}
                className="w-full h-[300px] object-cover rounded-lg"
                width={300}
                height={300}
              />
            </div>

            <div className="mt-3 px-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleModalOpen(category)}
                  className="text-lg font-semibold text-gray-800 hover:underline"
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
                    size={22}
                    fill={wishlist[category._id] ? "red" : "none"}
                  />
                </button>
              </div>

              <div className="flex items-center gap-1 mt-1">
                {getStarRating(4.5)} {/* Example rating */}
              </div>

              <p className="text-md text-gray-500">
                Category: {category.category || "N/A"}
              </p>
              <p className="text-md text-gray-500">
                Size: {category.size || "None"}
              </p>
              <p className="text-lg font-semibold text-teal-600">
                {category.price || "N/A"}
              </p>
              <p className="text-lg font-semibold text-teal-600">
                {category.inclPrice || "N/A"}{" "}
                <span className="text-xs text-gray-400">incl.</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        centered
        footer={null}
        width={600}
        title={<p className="text-[20px] font-[700]">Product Details</p>}
        open={isModalOpen}
        onCancel={handleModalClose}
      >
        {selectedCategory && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[14px] font-[600] w-[150px]">Product Name:</p>
              <p className="text-[14px]">{selectedCategory.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[14px] font-[600] w-[150px]">Status:</p>
              <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                {selectedCategory.status || "Active"}
              </span>
            </div>
            {selectedCategory.image && (
              <div className="flex items-center gap-4">
                <p className="text-[14px] font-[600] w-[150px]">Image:</p>
                <img
                  src={`http://localhost:8000/${selectedCategory.image.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={selectedCategory.name}
                  className="w-32 h-32 object-cover rounded"
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
