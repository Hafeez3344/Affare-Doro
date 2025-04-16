"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, notification, ColorPicker, Modal, Pagination } from 'antd';
import { createColor, getColors, updateColor, deleteColor } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import tableAction from "@/assets/svgs/table-action.svg";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from 'moment-timezone';
import { useRouter } from "next/navigation";

const Colors = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedColors = colors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("colors"));
    fetchColors();
  }, [auth, dispatch, router]);

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
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">Color Name</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedColors.length > 0 ? (
                  paginatedColors.map((item) => (
                    <tr key={item._id} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[13px]">{item.name}</td>
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
                    <td colSpan={4} className="text-center p-4">No colors found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={colors.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* Modal */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">{isEditMode ? 'Edit Color' : 'Add New Color'}</p>}
            open={showModal}
            onCancel={() => {
              setShowModal(false);
              setIsEditMode(false);
              form.resetFields();
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
                  {isEditMode ? 'Update Color' : 'Create Color'}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Colors;
