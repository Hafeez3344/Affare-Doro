"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, Modal, Pagination, notification } from 'antd';
import { getBumps, createBump, deleteBump } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from 'moment-timezone';
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";

const Bump = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bumpProducts, setBumpProducts] = useState([]);
  const itemsPerPage = 10;

  const paginatedBumps = bumpProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("bump"));
    fetchBumps();
  }, [auth, dispatch, router]);

  const fetchBumps = async () => {
    try {
      const response = await getBumps();
      if (response.status) {
        setBumpProducts(response.data);
      } else {
        notification.error({
          message: response.message || "Failed to fetch bump products",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to fetch bump products",
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedItem(null);
    form.resetFields();
  };

  const handleAddNew = () => {
    handleModalClose();
    setTimeout(() => {
      setShowModal(true);
      setIsEditMode(false);
    }, 0);
  };

  const handleEdit = (item) => {
    handleModalClose();
    setTimeout(() => {
      setSelectedItem(item);
      setIsEditMode(true);
      setShowModal(true);
      form.setFieldsValue({
        bumpDays: item.day,
        percentage: item.percentage
      });
    }, 0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteBump(id);
      if (response.status) {
        notification.success({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchBumps(); // Refresh the list after deletion
      } else {
        notification.error({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to delete bump",
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const bumpData = {
        day: values.bumpDays,
        percentage: values.percentage
      };

      const response = await createBump(bumpData);
      
      if (response.status) {
        notification.success({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        handleModalClose();
        fetchBumps(); // Refresh the list after creation
      } else {
        notification.error({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: error.message || "Failed to create bump",
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
              <h1 className="text-2xl font-semibold text-gray-800">Bump Prices</h1>
            </div>
            <button
              onClick={handleAddNew}
              style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none"
            >
              <IoMdAdd className="text-xl" />
              Add Bump Price
            </button>
          </div>

          {/* Table */}
          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">S.No</th>
                  <th className="p-4 font-[500] text-nowrap">Bump Days</th>
                  <th className="p-4 font-[500]">Percentage</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBumps.map((item, index) => (
                  <tr key={item._id} className="text-gray-800 text-sm border-b">
                    <td className="p-4 text-[13px]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4 text-[13px]">{item.day} days</td>
                    <td className="p-4 text-[13px]">{item.percentage}%</td>
                
                    <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                      {moment.utc(item.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </td>
                    <td className="p-4 flex space-x-2">
                      {/* <button
                        className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                        title="Edit"
                        onClick={() => handleEdit(item)}
                      >
                        <MdEdit />
                      </button> */}
                     
                      <button
                        className="bg-red-100 text-red-600 rounded-full px-2 py-2"
                        title="Delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={bumpProducts.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* Modal */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">{isEditMode ? 'Edit Bump' : 'Add New Bump'}</p>}
            open={showModal}
            onCancel={handleModalClose}
            closeIcon={<span className="ant-modal-close-x">×</span>}
            destroyOnClose={true}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              key={isEditMode ? 'edit' : 'add'}
            >
              <Form.Item
                name="bumpDays"
                label="Bump Days"
                rules={[{ required: true, message: 'Please enter bump days' }]}
              >
                <Input
                  type="number"
                  placeholder="Enter bump days"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                />
              </Form.Item>

              <Form.Item
                name="percentage"
                label="Percentage"
                rules={[{ required: true, message: 'Please enter percentage' }]}
              >
                <Input
                  type="number"
                  placeholder="Enter percentage"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                  addonAfter="%"
                />
              </Form.Item>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <Button
                  onClick={handleModalClose}
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
                  {isEditMode ? 'Update Bump' : 'Create Bump'}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Bump;
