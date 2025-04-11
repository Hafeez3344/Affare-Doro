"use client";

import Image from "next/image";
import moment from 'moment-timezone';
import { IoMdAdd } from "react-icons/io";
import Navbar from "@/components/navbar";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from "framer-motion";
import { updatePageNavigation } from "@/features/features";
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from "lucide-react";
import { Form, Input, Upload, Radio, Button, notification, Select, Modal, Pagination } from 'antd';
import BACKEND_URL, { createCategory, getCategories, updateCategory, deleteCategory } from "@/api/api";
import { FiEye } from "react-icons/fi";

const { Option } = Select;

const Categories = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryPath, setCategoryPath] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewSubCategories, setViewSubCategories] = useState([]);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [viewCategoryPath, setViewCategoryPath] = useState([]);
  const [currentViewParentId, setCurrentViewParentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    dispatch(updatePageNavigation("categories"));
    fetchCategories(); // Remove the currentPage dependency
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories(); 
      console.log('API Response:', response); 

      if (response?.status && Array.isArray(response?.data)) {
        setCategories(response.data); // Assuming response.data is the array of categories
      } else {
        throw new Error(response?.message || 'Unexpected API response');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      notification.error({
        message: 'Failed to fetch categories',
        description: error.message || 'An unexpected error occurred',
        placement: 'topRight',
        style: { marginTop: '50px' },
      });
    }
  };

  const fn_viewDetails = (id) => {
    if (id === selectedCategory) {
      return setSelectedCategory(0);
    }
    setSelectedCategory(id);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setShowModal(true);
    form.setFieldsValue({
      name: item.name,
      // Set other fields as needed
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);
      if (response.status) {
        notification.success({
          message: "Category deleted successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchCategories();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      notification.error({
        message: error.message || 'Failed to delete category',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Form values:', values);
      setLoading(true);
      let response;

      if (isEditMode) {
        response = await updateCategory(selectedItem._id, values);
      } else {
        const formData = new FormData();

        // Add each field to FormData
        Object.keys(values).forEach(key => {
          if (key !== 'image' && key !== 'category') {
            formData.append(key, values[key]);
            console.log(`Added ${key} to formData:`, values[key]);
          }
        });

        // Handle image file separately
        if (imageFile) {
          formData.append('image', imageFile);
          console.log('Added image file to formData');
        }

        // If we have a selected category, add it to the form data
        if (categoryPath.length > 0) {
          const parentId = categoryPath[categoryPath.length - 1]._id;
          formData.append('parentCategoryId', parentId);
          console.log('Added parentId to formData:', parentId);
        }

        console.log('Final formData:', Object.fromEntries(formData));

        response = await createCategory(formData);
        console.log('API Response:', response);
      }

      if (response.status) {
        notification.success({
          message: isEditMode ? "Category updated successfully" : "Category created successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchCategories();
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedItem(null);
        setImageFile(null);
        setCategoryPath([]);
      } else {
        throw new Error(response.message || 'Category creation failed');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      notification.error({
        message: error.message || 'Category creation failed',
        placement: 'topRight',
        style: {
          marginTop: '50px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e?.fileList) {
      const file = e.fileList[0]?.originFileObj;
      setImageFile(file);
      return e.fileList;
    }
    return e;
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`);
      const data = await response.json();
      
      if (data.status === "ok") {
        setSubCategories(data.data);
        setCurrentParentId(categoryId);
        setIsCategoryDropdownOpen(true);
        
        // Update the category path with the current category
        const currentCategory = categories.find(cat => cat._id === categoryId);
        if (currentCategory) {
          setCategoryPath([...categoryPath, currentCategory]);
        }
      } else {
        notification.error({
          message: "Failed to fetch subcategories",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      notification.error({
        message: 'Failed to fetch subcategories',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleCategorySelect = (category) => {
    if (category.subCategoryCount > 0) {
      fetchSubCategories(category._id);
    } else {
      setCategoryPath([...categoryPath, category]);
      setIsCategoryDropdownOpen(false);
    }
  };

  const handleGoBack = () => {
    if (categoryPath.length > 0) {
      const newPath = [...categoryPath];
      newPath.pop();
      setCategoryPath(newPath);
      
      if (newPath.length === 0) {
        setCurrentParentId(null);
        setSubCategories([]);
      } else {
        const parentId = newPath[newPath.length - 1]._id;
        fetchSubCategories(parentId);
      }
    }
  };

  const handleNewCategory = () => {
    setShowModal(true);
    setIsEditMode(false);
    form.resetFields();
  };

  const handleViewCategory = async (category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
    setIsViewDropdownOpen(false);
    setViewCategoryPath([category]);
    await fetchViewSubCategories(category._id);
  };

  const handleViewCategorySelect = async (category) => {
    if (category.subCategoryCount > 0) {
      setViewCategoryPath([...viewCategoryPath, category]);
      await fetchViewSubCategories(category._id);
    }
  };

  const handleViewGoBack = async () => {
    if (viewCategoryPath.length > 1) {
      const newPath = [...viewCategoryPath];
      newPath.pop();
      setViewCategoryPath(newPath);
      
      const parentId = newPath[newPath.length - 1]._id;
      await fetchViewSubCategories(parentId);
    }
  };

  const fetchViewSubCategories = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`);
      const data = await response.json();
      
      if (data.status === "ok") {
        setViewSubCategories(data.data);
        setCurrentViewParentId(categoryId);
      } else {
        setViewSubCategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setViewSubCategories([]);
    }
  };

  const modalTitle = isEditMode ? "Edit Category" : "Add New Category";
  const submitButtonText = isEditMode ? "Update Category" : "Create Category";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ fontFamily: '"Poppins", sans-serif' }}>
      <style jsx global>{`
        body {
          font-family: "Poppins", sans-serif !important;
        }
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(232, 187, 76, 0.3);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(232, 187, 76, 0.5);
        }
        .category-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .category-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .category-dropdown::-webkit-scrollbar-thumb {
          background-color: rgba(232, 187, 76, 0.3);
          border-radius: 6px;
        }
        .category-dropdown::-webkit-scrollbar-thumb:hover {
          background-color: rgba(232, 187, 76, 0.5);
        }
      `}</style>
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar showModal={showModal} />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[25px] font-[500] text-gray-800">Categories</h1>
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditMode(false);
                form.resetFields();
              }}
              style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)' }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors focus:outline-none text-[14px]"
            >
              <IoMdAdd className="text" />
              Add Category
            </button>
          </div>
          {/* ---------------------Category Table----------------------- */}
          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-full">
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">Category Name</th>
                  <th className="p-4 font-[500] text-nowrap">Sub Categories</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((item) => (
                    <tr key={item._id} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[13px]">{item.name}</td>
                      <td className="p-4 text-[13px]">{item.subCategoryCount}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                        {moment.utc(item?.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                          title="View"
                          onClick={() => handleViewCategory(item)}
                        >
                          <FiEye />
                        </button>
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2"
                          title="Delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={categories.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* View Category Modal */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">Category Details</p>}
            open={viewModalOpen}
            onCancel={() => {
              setViewModalOpen(false);
              setIsViewDropdownOpen(false);
              setViewSubCategories([]);
              setViewCategoryPath([]);
            }}
          >
            {selectedCategory && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-[14px] font-[600] w-[150px]">Category Name:</p>
                  <p className="text-[14px]">{selectedCategory.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[14px] font-[600] w-[150px]">Status:</p>
                  <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                    {selectedCategory.status || 'Active'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[14px] font-[600] w-[150px]">Created Date:</p>
                  <p className="text-[14px]">
                    {moment.utc(selectedCategory?.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </p>
                </div>
                {selectedCategory.image && (
                  <div className="flex items-center gap-4">
                    <p className="text-[14px] font-[600] w-[150px]">Image:</p>
                    <img 
                      src={`http://localhost:8000/${selectedCategory.image.replace(/\\/g, '/')}`}
                      alt={selectedCategory.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-[600]">Features:</p>
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
                      <p className="text-[14px]">Has Custom Shopping:</p>
                      <span className={`px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center ${selectedCategory.hasCustomShopping ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF7A8F33] text-[#FF002A]"}`}>
                        {selectedCategory.hasCustomShopping ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-[600]">Sub Categories:</p>
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
            )}
          </Modal>

          {/* Modal for Add/Edit Category */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">{modalTitle}</p>}
            open={showModal}
            onCancel={() => {
              setShowModal(false);
              setIsEditMode(false);
              form.resetFields();
              setImageFile(null);
              setCategoryPath([]);
            }}
            closeIcon={<span className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center">×</span>}
          >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      name="name"
                      label="Category Name"
                      rules={[{ required: true, message: 'Please enter category name' }]}
                    >
                      <Input
                        placeholder="Enter category name"
                        className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                      />
                    </Form.Item>

                    <Form.Item
                      name="category"
                      label="Product Category"
                      rules={[{ required: false, message: "Please select a category" }]}
                    >
                      <div
                        className="relative border p-2 rounded cursor-pointer flex items-center justify-between border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      >
                        <span>
                          {categoryPath.length
                            ? categoryPath.map((c) => c.name).join(" / ")
                            : "Select Category"}
                        </span>
                        {isCategoryDropdownOpen ? (
                          <ChevronUp className="absolute right-2" />
                        ) : (
                          <ChevronDown className="absolute right-2" />
                        )}
                      </div>
                      <AnimatePresence>
                        {isCategoryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="border p-2 rounded mt-2 bg-white category-dropdown max-h-[200px] overflow-y-auto"
                          >
                            {categoryPath.length > 0 && (
                              <div
                                className="cursor-pointer p-2 hover:bg-gray-100"
                                onClick={handleGoBack}
                              >
                                <ArrowLeft /> Back
                              </div>
                            )}
                            <div
                              className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
                              onClick={() => handleNewCategory()}
                            >
                              <span>New Category</span>
                            </div>
                            {(currentParentId ? subCategories : categories).map((category) => (
                              <div
                                key={category._id}
                                className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
                                onClick={() => handleCategorySelect(category)}
                              >
                                <span>{category.name}</span>
                                {category.subCategoryCount > 0 && <ArrowRight />}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Form.Item>

                    <Upload
                      maxCount={1}
                      beforeUpload={() => false}
                      listType="picture"
                      accept="image/*"
                      className="w-full"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        className="w-full border-[--text-color] text-[--text-color] bg-[rgba(232,187,76,0.08)] hover:border-[--text-color]"
                      >
                        Upload Image
                      </Button>
                    </Upload>
              <div className="grid grid-cols-3 gap-2 mt-4">
                      <Form.Item
                        name="hasBrand"
                        label="Has Brand"
                        initialValue={true}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="hasSize"
                        label="Has Size"
                        initialValue={true}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="hasCondition"
                        label="Has Condition"
                        initialValue={true}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="hasColor"
                        label="Has Color"
                        initialValue={true}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="hasMaterial"
                        label="Has Material"
                        initialValue={true}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="hasCustomShopping"
                        label="Has Custom Shopping"
                        initialValue={true}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                  <Button
                    onClick={() => setShowModal(false)}
                    style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)', borderColor: 'rgb(232, 187, 76)' }}
                    className="transition-colors"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)', borderColor: 'rgb(232, 187, 76)' }}
                    className="transition-colors"
                  >
                    {submitButtonText}
                  </Button>
                </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Categories;

const ViewDetails = ({ id, item }) => {
  return (
    <div className="absolute h-[auto] py-2 px-[20px] flex flex-col gap-2 text-[var(--text-color-body)] bg-white rounded-[8px] shadow-md border border-gray-100 w-[max-content] left-[-145px] top-[13px]">
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => handleEdit(item)}>
        <MdEdit className="w-[20px] h-[20px]" />
        <p className="text-[14px]">Edit</p>
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:text-red-600" onClick={() => handleDelete(id)}>
        <MdDelete className="w-[20px] h-[20px]" />
        <p className="text-[14px]">Delete</p>
      </div>
    </div>
  );
};
