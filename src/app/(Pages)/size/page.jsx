"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, Select, notification } from 'antd';
import { createSize, getSizes, updateSize, deleteSize, getCategories } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import tableAction from "@/assets/svgs/table-action.svg";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Sizes = () => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(updatePageNavigation("size")); // Ensure this matches the exact sidebar label "Size"
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSizes(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response.status) {
      setCategories(response.data);
    }
  };

  const fetchSizes = async (categoryId) => {
    const response = await getSizes(categoryId);
    if (response.status) {
      setSizes(response.data);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setShowModal(true);
    form.setFieldsValue({
      name: item.name,
      categoryId: item.categoryId
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteSize(id);
      if (response.status) {
        notification.success({
          message: "Size deleted successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchSizes(selectedCategory);
      }
    } catch (error) {
      notification.error({
        message: 'Failed to delete size',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = isEditMode
        ? await updateSize(selectedItem._id, values)
        : await createSize(values);

      if (response.status) {
        notification.success({
          message: `Size ${isEditMode ? 'updated' : 'created'} successfully`,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchSizes(selectedCategory);
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedItem(null);
      }
    } catch (error) {
      notification.error({
        message: error.message || `Size ${isEditMode ? 'update' : 'creation'} failed`,
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar showModal={showModal} />
        <div className="flex-1 mt-[30px] px-[22px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">Sizes</h1>
              <Select
                placeholder="Select Category"
                style={{ width: 200 }}
                onChange={setSelectedCategory}
                options={categories.map(cat => ({ label: cat.name, value: cat._id }))}
              />
            </div>
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
              Add Size
            </button>
          </div>

          {/* Table */}
          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px]">
                  <td>Size Name</td>
                  <td>Category</td>
                  <td>Status</td>
                  <td>Created Date</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                {sizes.map((item) => (
                  <tr key={item._id} className="h-[50px] text-[14px]">
                    <td>{item.name}</td>
                    <td>{categories.find(cat => cat._id === item.categoryId)?.name}</td>
                    <td>
                      <p className="h-[23px] w-[60px] rounded-[5px] bg-[var(--bg-color-delivered)] text-[10px] text-[var(--text-color-delivered)] font-[500] flex items-center justify-center">
                        {item.status || 'Active'}
                      </p>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-[17px] relative">
                      <div className="flex gap-2">
                        <MdEdit
                          className="cursor-pointer text-blue-600"
                          onClick={() => handleEdit(item)}
                        />
                        <MdDelete
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {isEditMode ? 'Edit Size' : 'Add New Size'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
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
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select
                      options={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                      placeholder="Select category"
                    />
                  </Form.Item>


                  <Form.Item
                    name="name"
                    label="Size Name"
                    rules={[{ required: true, message: 'Please enter size name' }]}
                  >
                    <Input
                      placeholder="Enter size name"
                      className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                    />
                  </Form.Item>


                  <div className="flex justify-end gap-3">
                    <Button onClick={() => setShowModal(false)}
                      style={{ backgroundColor: 'white', borderColor: 'rgb(232, 187, 76)' }}>Cancel</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ backgroundColor: 'white', borderColor: 'rgb(232, 187, 76)' }}
                    >
                      {isEditMode ? 'Update Size' : 'Create Size'}
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

export default Sizes;
