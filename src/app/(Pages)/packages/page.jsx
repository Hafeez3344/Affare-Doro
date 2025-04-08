"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, notification } from 'antd';
import { createPackage, getPackages } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import tableAction from "@/assets/svgs/table-action.svg";
import { IoEye } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

const Packages = () => {
  const dispatch = useDispatch();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

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

  const fn_viewDetails = (id) => {
    if (id === selectedPackage) {
      return setSelectedPackage(0);
    }
    setSelectedPackage(id);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await createPackage(values);

      if (response.status) {
        notification.success({
          message: "Package created successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchPackages();
        setShowModal(false);
        form.resetFields();
      } else {
        throw new Error(response.message || 'Package creation failed');
      }
    } catch (error) {
      notification.error({
        message: error.message || 'Package creation failed',
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
       <Sidebar showModal={showModal}/>
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Packages</h1>
            <button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none"
            >
              <IoMdAdd className="text-xl" />
              Add Package
            </button>
          </div>

          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px]">
                  <td>Package Size</td>
                  <td>Package Description</td>
                  <td>Status</td>
                  <td>Created Date</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                {packages && packages.length > 0 ? (
                  packages.map((item) => (
                    <tr className="h-[50px] text-[14px]" key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.subTitle}</td>
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
                        {selectedPackage === item._id && (
                          <ViewDetails id={item._id} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No packages found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[800px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Package</h2>
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
                    name="size"
                    label="Package Size"
                    rules={[{ required: true, message: 'Please enter package size' }]}
                  >
                    <Input placeholder="Enter package size" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                  >
                    <Input.TextArea placeholder="Enter description" />
                  </Form.Item>

                  <div className="flex justify-end gap-3">
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Create Package
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

export default Packages;

const ViewDetails = ({ id }) => {
  return (
    <div className="absolute h-[50px] px-[20px] flex items-center gap-2 text-[var(--text-color-body)] bg-white rounded-[8px] shadow-md border border-gray-100 w-[max-content] left-[-145px] top-[13px] cursor-pointer">
      <IoEye className="w-[20px] h-[20px]" />
      <p className="text-[14px]">View Details</p>
    </div>
  );
};
