"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Upload, Radio, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCategory, getCategories, updateCategory, deleteCategory } from "@/api/api";
import { MdEdit, MdDelete } from "react-icons/md";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import tableAction from "@/assets/svgs/table-action.svg";
import { IoEye } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

const Categories = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(updatePageNavigation("categories"));
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('Categories Response:', response); // Add this debug log
      if (response.status) {
        console.log('Categories Data:', response.data); // Add this debug log
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
          if (key !== 'image') {
            formData.append(key, values[key]);
          }
        });

        // Handle image file separately
        if (imageFile) {
          formData.append('image', imageFile);
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

  const modalTitle = isEditMode ? "Edit Category" : "Add New Category";
  const submitButtonText = isEditMode ? "Update Category" : "Create Category";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        {!showModal && <Sidebar />}
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditMode(false);
                form.resetFields();
              }}
              style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none"
            >
              <IoMdAdd className="text-xl" />
              Add Category
            </button>
          </div>

          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-[94vw] md:w-[67vw] lg:w-[75vw] xl:w-auto">
            <style jsx global>{`
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
            `}</style>
            <table className="w-[1000px] xl:w-[100%]">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px]">
                  <td>Category Name</td>
                  <td>Total Products</td>
                  <td>Status</td>
                  <td>Created Date</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                {console.log('Rendering categories:', categories)}
                {categories && categories.length > 0 ? (
                  categories.map((item) => (
                    <tr className="h-[50px] text-[14px]" key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.products?.length || 0}</td>
                      <td>
                        <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-delivered)] text-[10px] text-[var(--text-color-delivered)] font-[500] flex items-center justify-center">
                          {item.status || 'Active'}
                        </p>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-[17px] relative">
                        <Image
                          alt=""
                          src={tableAction}
                          className="cursor-pointer"
                          onClick={() => fn_viewDetails(item._id)}
                        />
                        {selectedCategory === item._id && (
                          <ViewDetails id={item._id} item={item} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Category Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[800px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{modalTitle}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

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
                    <Input placeholder="Enter category name" />
                  </Form.Item>

                  <Form.Item
                    name="image"
                    label="Category Image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload an image' }]}
                  >
                    <Upload
                      maxCount={1}
                      beforeUpload={() => false}
                      listType="picture"
                      accept="image/*"
                      className="w-full"
                    >
                      <Button icon={<UploadOutlined />} className="w-full">Upload Image</Button>
                    </Upload>
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="flex justify-end gap-3">
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
