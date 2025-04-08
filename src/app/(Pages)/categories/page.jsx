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
import { Form, Input, Upload, Radio, Button, notification, Select } from 'antd';
import { createCategory, getCategories, updateCategory, deleteCategory } from "@/api/api";

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
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(updatePageNavigation("categories"));
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('Categories Response:', response); 
      if (response.status) {
        console.log('Categories Data:', response.data); 
        setCategories(response.data);
      } else {
        notification.error({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to fetch categories',
        placement: 'topRight',
        style: { marginTop: '50px' }
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
          }
        });

        // Handle image file separately
        if (imageFile) {
          formData.append('image', imageFile);
        }

        // If we have a selected category, add it to the form data
        if (categoryPath.length > 0) {
          formData.append('parentId', categoryPath[categoryPath.length - 1]._id);
        }

        console.log('Submitting data:', Object.fromEntries(formData));

        response = await createCategory(formData);
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
      const response = await fetch(`http://localhost:8000/category/viewAll?parentCategoryId=${categoryId}`);
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
                  <th className="p-4 font-[500]">Category Name</th>
                  <th className="p-4 font-[500]">Sub Categories</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories && categories.length > 0 ? (
                  categories.map((item) => (
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
          </div>

          {/* Modal for Add/Edit Category */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-[600px] md:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{modalTitle}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
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
                  </Form>
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
              </div>
            </div>
          )}
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
