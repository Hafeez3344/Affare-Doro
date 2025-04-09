import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "@/api/api"; // Import the API function
import { notification, Modal } from "antd"; // Import Ant Design Modal
import fillStar from "@/assets/svgs/Star.svg"; // Import filled star icon
import grayStar from "@/assets/svgs/Gray-Star.svg"; // Import gray star icon

const Manage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px] pb-[30px]">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative rounded-[8px] bg-white shadow-sm overflow-hidden"
          >
            <Image
              alt={category.name}
              src={`http://localhost:8000/${category.image?.replace(/\\/g, "/")}`}
              className="w-full h-[165px] object-contain"
              width={300}
              height={165}
            />
            <div className="absolute left-0 top-0 w-full h-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
              <button
                onClick={() => handleModalOpen(category)}
                className="bg-black w-[100px] h-[30px] text-[14px] font-[500] text-white rounded-full border border-gray-600"
              >
                View Detail
              </button>
            </div>
            <div className="p-[10px]">
              <p className="font-[600] text-[15px]">{category.name}</p>
              <p className="text-[var(--price-color)] text-[13px] font-[600]">
                {category.status || "Active"}
              </p>
              <div className="flex gap-0.5 mt-1">
                {/* Star ratings */}
                <Image alt="star" src={fillStar} width={16} height={16} />
                <Image alt="star" src={fillStar} width={16} height={16} />
                <Image alt="star" src={fillStar} width={16} height={16} />
                <Image alt="star" src={fillStar} width={16} height={16} />
                <Image alt="star" src={grayStar} width={16} height={16} />
                <p className="text-[11px] text-[--text-color-body] font-[600]">
                  (131)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
