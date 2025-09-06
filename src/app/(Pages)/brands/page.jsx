"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Upload,
  Button,
  notification,
  Modal,
  Pagination,
} from "antd";
import moment from "moment-timezone";
import BACKEND_URL from "@/api/api";
import { FiEye } from "react-icons/fi";
import Navbar from "@/components/navbar";
import { IoMdAdd } from "react-icons/io";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { MdDelete, MdEdit } from "react-icons/md";
import { UploadOutlined } from "@ant-design/icons";
import tableAction from "@/assets/svgs/table-action.svg";
import { updatePageNavigation } from "@/features/features";
import { createBrand, getBrands, updateBrand, deleteBrand } from "@/api/api";

const Brands = () => {
  const itemsPerPage = 10;
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchBrands = async () => {
    try {
      const response = await getBrands(); // Remove the page parameter if the API doesn't support pagination
      console.log("API Response:", response); // Debugging line

      if (response?.status && Array.isArray(response?.data)) {
        setBrands(response.data); // Assuming response.data is the array of brands
      } else {
        throw new Error(response?.message || "Unexpected API response");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      notification.error({
        message: "Failed to fetch brands",
        description: error.message || "An unexpected error occurred",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    }
  };

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("brands"));
    fetchBrands();
  }, [auth, dispatch, router]);

  const fn_viewDetails = (id) => {
    if (id === selectedBrand) {
      return setSelectedBrand(0);
    }
    setSelectedBrand(id);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setShowModal(true);
    form.setFieldsValue({
      name: item.name,
    });
  };

  const handleDelete = async (id) => {
    console.log("handleDelete called with ID:", id);
    try {
      // Check if user is authenticated
      if (!auth) {
        console.log("User not authenticated");
        notification.error({
          message: "Authentication Error",
          description: "Please login to perform this action",
          placement: "topRight",
          style: { marginTop: "50px" },
        });
        return;
      }
      if (!id) {
        // error
      };
      const response = await deleteBrand(id);
      if (response.status) {
        // Update local state by filtering out the deleted brand
        setBrands(prevBrands => prevBrands.filter(brand => brand._id !== id));
        notification.success({
          message: "Success",
          description: response.message,
        });
      };
    } catch (error) {
      console.error("Error in handleDelete:", error);
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete brand",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e?.fileList && e.fileList.length > 0) {
      const file = e.fileList[0]?.originFileObj;
      if (file) {
        setImageFile(file);
        return e.fileList;
      }
    }
    return e;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add name to FormData
      formData.append("name", values.name);

      // Handle image file
      if (imageFile) {
        console.log("Image file being added to FormData:", imageFile);
        formData.append("image", imageFile);
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      let response;
      if (isEditMode) {
        response = await updateBrand(selectedItem._id, formData);
      } else {
        response = await createBrand(formData);
      }

      if (response.status) {
        notification.success({
          message: isEditMode
            ? "Brand updated successfully"
            : "Brand created successfully",
          placement: "topRight",
          style: { marginTop: "50px" },
        });
        fetchBrands();
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedItem(null);
        setImageFile(null);
      } else {
        throw new Error(response.message || "Brand operation failed");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      notification.error({
        message: error.message || "Brand operation failed",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewBrand = (brand) => {
    setSelectedItem(brand);
    setViewModalOpen(true);
  };

  const modalTitle = isEditMode ? "Edit Brand" : "Add New Brand";
  const submitButtonText = isEditMode ? "Update Brand" : "Create Brand";

  const paginatedBrands = brands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar showModal={showModal} />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Brands</h1>
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "rgba(232, 187, 76, 0.08)",
                color: "rgb(232, 187, 76)",
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors focus:outline-none"
            >
              <IoMdAdd className="text-xl" />
              Add Brand
            </button>
          </div>

          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-full">
            <table className="min-w-full border">
              <thead>
                <tr
                  style={{ backgroundColor: "rgba(232, 187, 76, 0.08)" }}
                  className="text-left text-[14px] text-gray-700"
                >
                  <th className="p-4 font-[500] text-nowrap">Brand Name</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBrands.length > 0 ? (
                  paginatedBrands.map((item) => (
                    <tr
                      key={item._id}
                      className="text-gray-800 text-sm border-b hover:bg-gray-50"
                    >
                      <td className="p-4 text-[13px] flex items-center gap-2">
                        {item.image && (
                          <Image
                            src={`${BACKEND_URL}/${item.image}`}
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded-full"
                            width={32}
                            height={32}
                          />
                        )}
                        {item.name}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000] w-[80px]">
                          {item.status || "Active"}
                        </span>
                      </td>
                      <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                        {moment
                          .utc(item?.createdAt)
                          .format("DD MMM YYYY, hh:mm A")}
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                          title="View"
                          onClick={() => handleViewBrand(item)}
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
                          className="bg-blue-100 text-red-600 rounded-full px-2 py-2"
                          title="Delete"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(
                              "Delete button clicked for brand:",
                              item
                            );
                            handleDelete(item._id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No brands found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={brands.length}
                pageSize={itemsPerPage}
                showSizeChanger={false}
              />
            </div>
          </div>

          {/* Add Brand Modal */}
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
            }}
            closeIcon={<span className="ant-modal-close-x ">×</span>}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="name"
                label="Brand Name"
                rules={[{ required: true, message: "Please enter brand name" }]}
              >
                <Input
                  placeholder="Enter brand name"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                />
              </Form.Item>

              <Form.Item
                name="image"
                label="Brand Logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
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
                    Upload Logo
                  </Button>
                </Upload>
              </Form.Item>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <Button
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "rgba(232, 187, 76, 0.08)",
                    color: "rgb(232, 187, 76)",
                    borderColor: "rgb(232, 187, 76)",
                  }}
                  className="transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    backgroundColor: "rgba(232, 187, 76, 0.08)",
                    color: "rgb(232, 187, 76)",
                    borderColor: "rgb(232, 187, 76)",
                  }}
                  className="transition-colors"
                >
                  {submitButtonText}
                </Button>
              </div>
            </Form>
          </Modal>

          {/* View Brand Modal */}
          <Modal
            centered
            footer={null}
            width={700}
            title={<p className="text-[20px] font-[700]">Brand Details</p>}
            open={viewModalOpen}
            onCancel={() => {
              setViewModalOpen(false);
              setSelectedItem(null);
            }}
          >
            {selectedItem && (
              <div className="flex flex-col md:flex-row">
                {/* Left side details */}
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-4">
                    <p className="text-[15px] font-[600] w-[150px]">
                      Brand Name:
                    </p>
                    <p className="text-[14px]">{selectedItem.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[15px] font-[600] w-[150px]">Status:</p>
                    <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                      {selectedItem.status || "Active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[15px] font-[600] w-[150px]">
                      Created Date:
                    </p>
                    <p className="text-[14px]">
                      {moment
                        .utc(selectedItem?.createdAt)
                        .format("DD MMM YYYY, hh:mm A")}
                    </p>
                  </div>
                </div>

                {/* Right side image */}
                {selectedItem.image && (
                  <div className="w-full md:w-1/2 md:border-l mt-10 md:mt-0 pl-0 md:pl-6 flex justify-center items-center">
                    <div className="relative w-full max-w-[400px]">
                      <Image
                        src={`${BACKEND_URL}/${selectedItem.image}`}
                        alt={selectedItem.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Brands;

const ViewDetails = ({ id }) => {
  return (
    <div className="absolute h-[50px] px-[20px] flex items-center gap-2 text-[var(--text-color-body)] bg-white rounded-[8px] shadow-md border border-gray-100 w-[max-content] left-[-145px] top-[13px] cursor-pointer">
      <FiEye className="w-[20px] h-[20px]" />
      <p className="text-[14px]">View Details</p>
    </div>
  );
};
