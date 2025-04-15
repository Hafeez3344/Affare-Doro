"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, notification, Modal, Pagination } from 'antd';
import { createPackage, getPackages, updatePackage, deletePackage } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from 'moment-timezone';

const Packages = () => {
  const dispatch = useDispatch();
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedPackages = packages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    dispatch(updatePageNavigation("packages"));
    fetchPackages();
  }, [dispatch]);

  const fetchPackages = async () => {
    try {
      const response = await getPackages();
      if (response.status) {
        setPackages(response.data);
      } else {
        notification.error({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to fetch packages',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setIsEditMode(true);
    setShowModal(true);
    form.setFieldsValue({
      name: pkg.name,
      subTitle: pkg.subTitle,
      shippingCharges: pkg.shippingCharges
    });
  };

  const handleDelete = async (id) => {
    try {
      Modal.confirm({
        title: 'Delete Package',
        content: 'Are you sure you want to delete this package? This action cannot be undone.',
        okText: 'Yes, Delete',
        cancelText: 'No, Cancel',
        okButtonProps: {
          style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }
        },
        onOk: async () => {
          const response = await deletePackage(id);
          if (response.status) {
            notification.success({
              message: "Success",
              description: response.message,
              placement: 'topRight',
              style: { marginTop: '50px' }
            });
            fetchPackages();
          } else {
            notification.error({
              message: "Error",
              description: response.message,
              placement: 'topRight',
              style: { marginTop: '50px' }
            });
          }
        }
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || 'Failed to delete package',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;

      const submitData = {
        name: values.name,
        subTitle: values.subTitle,
        shippingCharges: values.shippingCharges
      };

      if (isEditMode && selectedPackage?._id) {
        response = await updatePackage(selectedPackage._id, submitData);
      } else {
        response = await createPackage(submitData);
      }

      if (response.status) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        await fetchPackages();
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedPackage(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} package`,
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Packages</h1>
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
              Add Package
            </button>
          </div>

          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">Package Size</th>
                  <th className="p-4 font-[500] text-nowrap">Package Description</th>
                  <th className="p-4 font-[500] text-nowrap">Shipping Charges</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPackages.length > 0 ? (
                  paginatedPackages.map((item) => (
                    <tr key={item._id} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[13px]">{item.name}</td>
                      <td className="p-4 text-[13px]">{item.subTitle}</td>
                      <td className="p-4 text-[13px]">{item.shippingCharges}</td>
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
                    <td colSpan={5} className="text-center p-4">No packages found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={packages.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* Modal */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">{isEditMode ? "Edit Package" : "Add New Package"}</p>}
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
                label="Package Size"
                rules={[{ required: true, message: 'Please enter package size' }]}
              >
                <Input
                  placeholder="Enter package size"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                />
              </Form.Item>

              <Form.Item
                name="subTitle"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input.TextArea
                  placeholder="Enter description"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                />
              </Form.Item>

              <Form.Item
                name="shippingCharges"
                label="Shipping Charges"
                rules={[{ required: true, message: 'Please enter shipping charges' }]}
              >
                <Input
                  placeholder="Enter shipping charges"
                  type="number"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                />
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
                  {isEditMode ? "Update Package" : "Create Package"}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Packages;
