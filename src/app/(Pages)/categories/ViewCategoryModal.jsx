import React from 'react';
import moment from 'moment-timezone';
import { Modal } from 'antd';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import BACKEND_URL from '@/api/api';

const ViewCategoryModal = ({ 
  isOpen, 
  onClose, 
  selectedCategory,
  isViewDropdownOpen,
  setIsViewDropdownOpen,
  viewSubCategories,
  viewCategoryPath,
  handleViewGoBack,
  handleViewCategorySelect 
}) => {
  return (
    <Modal
      centered
      footer={null}
      width={selectedCategory?.image ? 800 : 500}
      title={<p className="text-[20px] font-[700]">Category Details</p>}
      open={isOpen}
      onCancel={onClose}
    >
      {selectedCategory && (
        <div className="flex flex-col gap-6">
          <div className={`flex ${selectedCategory.image ? 'gap-6' : ''}`}>
            {/* Left side - Category Details */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <p className="text-[15px] font-[600] w-[120px]">Category Name:</p>
                <p className="text-[14px]">{selectedCategory.name}</p>
              </div>
              {/* <div className="flex items-center gap-3">
                <p className="text-[15px] font-[600] w-[120px]">Status:</p>
                <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                  {selectedCategory.status || 'Active'}
                </span>
              </div> */}
              <div className="flex items-center gap-3">
                <p className="text-[15px] font-[600] w-[120px]">Created Date:</p>
                <p className="text-[14px]">
                  {moment.utc(selectedCategory?.createdAt).format('DD MMM YYYY, hh:mm A')}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[15px] font-[600]">Features:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px]">Has Brand:</p>
                    <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasBrand ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                      {selectedCategory.hasBrand ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px]">Has Size:</p>
                    <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasSize ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                      {selectedCategory.hasSize ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px]">Has Condition:</p>
                    <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasCondition ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                      {selectedCategory.hasCondition ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px]">Has Color:</p>
                    <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasColor ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                      {selectedCategory.hasColor ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px]">Has Material:</p>
                    <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasMaterial ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                      {selectedCategory.hasMaterial ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px]">Has Custom Shipping:</p>
                    <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasCustomShopping ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                      {selectedCategory.hasCustomShopping ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <p className="text-[15px] font-[600]">Sub Categories:</p>
                <div
                  className="relative border p-2 rounded cursor-pointer flex items-center justify-between border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                  onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                >
                  <span>
                    {viewCategoryPath.map((c) => c.name).join(" / ")}
                  </span>
                  {isViewDropdownOpen ? (
                    <ChevronUp className="absolute right-2" />
                  ) : (
                    <ChevronDown className="absolute right-2" />
                  )}
                </div>
                <AnimatePresence>
                  {isViewDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border p-2 rounded mt-2 bg-white category-dropdown max-h-[200px] overflow-y-auto"
                    >
                      {viewCategoryPath.length > 1 && (
                        <div
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onClick={handleViewGoBack}
                        >
                          <ArrowLeft /> Back
                        </div>
                      )}
                      {viewSubCategories.length > 0 ? (
                        viewSubCategories.map((subCategory) => (
                          <div
                            key={subCategory._id}
                            className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
                            onClick={() => handleViewCategorySelect(subCategory)}
                          >
                            <span>{subCategory.name}</span>
                            {subCategory.subCategoryCount > 0 && <ArrowRight />}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No subcategories found</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side - Category Image */}
            {selectedCategory.image && (
              <div className="w-[400px] flex-shrink-0">
                <div className="w-full h-[300px]">
                  <Image
                    src={`${BACKEND_URL}/${selectedCategory.image}`}
                    alt={selectedCategory.name}
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
  );
};

export default ViewCategoryModal; 