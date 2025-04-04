"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createBrand, getBrands } from "@/api/api";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import tableAction from "@/assets/svgs/table-action.svg";
import { IoEye } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

const Brands = () => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    dispatch(updatePageNavigation("brands"));
    fetchBrands();
  }, [dispatch]);

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      if (response.status) {
        setBrands(response.data);
      } else {
        notification.error({
          message: response.message,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to fetch brands',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    }
  };

  const fn_viewDetails = (id) => {
    if (id === selectedBrand) {
      return setSelectedBrand(0);
    }
    setSelectedBrand(id);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add each field to FormData
      Object.keys(values).forEach(key => {
        if (key !== 'image') {
          formData.append(key, values[key]);
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await createBrand(formData);

      if (response.status) {
        notification.success({
          message: "Brand created successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        fetchBrands();
        setShowModal(false);
        form.resetFields();
        setImageFile(null);
      } else {
        throw new Error(response.message || 'Brand creation failed');
      }
    } catch (error) {
      notification.error({
        message: error.message || 'Brand creation failed',
        placement: 'topRight',
        style: { marginTop: '50px' }
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        {!showModal && <Sidebar />}
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Brands</h1>
            <button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none"
            >
              <IoMdAdd className="text-xl" />
              Add Brand
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
                  <td>Brand Name</td>
                  <td>Total Products</td>
                  <td>Status</td>
                  <td>Created Date</td>
                  <td className="w-[80px]">Action</td>
                </tr>
              </thead>
              <tbody>
                {brands && brands.length > 0 ? (
                  brands.map((item) => (
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
                        {selectedBrand === item._id && (
                          <ViewDetails id={item._id} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No brands found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Brand Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[800px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Brand</h2>
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
                    label="Brand Name"
                    rules={[{ required: true, message: 'Please enter brand name' }]}
                  >
                    <Input placeholder="Enter brand name" />
                  </Form.Item>

                  <Form.Item
                    name="image"
                    label="Brand Logo"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload a logo' }]}
                  >
                    <Upload
                      maxCount={1}
                      beforeUpload={() => false}
                      listType="picture"
                      accept="image/*"
                      className="w-full"
                    >
                      <Button icon={<UploadOutlined />} className="w-full">Upload Logo</Button>
                    </Upload>
                  </Form.Item>

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
                      Create Brand
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

export default Brands;

const ViewDetails = ({ id }) => {
  return (
    <div className="absolute h-[50px] px-[20px] flex items-center gap-2 text-[var(--text-color-body)] bg-white rounded-[8px] shadow-md border border-gray-100 w-[max-content] left-[-145px] top-[13px] cursor-pointer">
      <IoEye className="w-[20px] h-[20px]" />
      <p className="text-[14px]">View Details</p>
    </div>
  );
};