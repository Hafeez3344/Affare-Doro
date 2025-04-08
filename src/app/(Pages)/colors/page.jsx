"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, notification, ColorPicker } from 'antd';
import { createColor, getColors, updateColor, deleteColor } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import tableAction from "@/assets/svgs/table-action.svg";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Colors = () => {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(updatePageNavigation("colors")); // Ensure this matches the sidebar label
    fetchColors(); // Call fetchColors to load the colors
  }, [dispatch]);

  // Add the missing fetchColors function
  const fetchColors = async () => {
    try {
      const response = await getColors();
      if (response.status) {
        setColors(response.data);
      } else {
        notification.error({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to fetch colors',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setShowModal(true);
    form.setFieldsValue({
      name: item.name,
      code: item.code
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteColor(id);
      if (response.status) {
        notification.success({
          message: "Color deleted successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchColors();
      }
    } catch (error) {
      notification.error({
        message: 'Failed to delete color',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = isEditMode
        ? await updateColor(selectedItem._id, values)
        : await createColor(values);

      if (response.status) {
        notification.success({
          message: `Color ${isEditMode ? 'updated' : 'created'} successfully`,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchColors();
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedItem(null);
      }
    } catch (error) {
      notification.error({
        message: error.message || `Color ${isEditMode ? 'update' : 'creation'} failed`,
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
            <h1 className="text-2xl font-semibold text-gray-800">Colors</h1>
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
              Add Color
            </button>
          </div>

          {/* Table */}
          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px]">
                  <td>Color Name</td>
                  <td>Color Code</td>
                  <td>Preview</td>
                  <td>Status</td>
                  <td>Created Date</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                {colors.map((item) => (
                  <tr key={item._id} className="h-[50px] text-[14px]">
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td>
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: item.code }}
                      />
                    </td>
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
                    {isEditMode ? 'Edit Color' : 'Add New Color'}
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
                    name="name"
                    label="Color Name"
                    rules={[{ required: true, message: 'Please enter color name' }]}
                  >
                    <Input
                      placeholder="Enter color name"
                      className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                    />
                  </Form.Item>


                  <Form.Item
                    name="code"
                    label="Color Code"
                    rules={[{ required: true, message: 'Please select a color' }]}
                  >
                    <ColorPicker />
                  </Form.Item>

                  <div className="flex justify-end gap-3">
                    <Button 
                      onClick={() => setShowModal(false)} 
                      style={{ backgroundColor: 'white', borderColor: 'lightgray', color: 'black' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {}}
                      style={{ backgroundColor: 'white', borderColor: 'lightgray', color: 'black' }}
                      htmlType="submit"
                      loading={loading}
                    >
                      {isEditMode ? 'Update Color' : 'Create Color'}
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

export default Colors;
