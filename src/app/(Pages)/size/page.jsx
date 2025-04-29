"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, Select, notification, Modal, Pagination } from 'antd';
import { createSize, getSizes, updateSize, deleteSize, getCategories } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import tableAction from "@/assets/svgs/table-action.svg";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from 'moment-timezone';
import { useRouter } from "next/navigation";
import BACKEND_URL from "@/api/api";

const Sizes = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [selectedSize, setSelectedSize] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedSizes = sizes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("size"));
    fetchCategories();
    // Fetch all sizes initially
    fetchSizes();
  }, [auth, dispatch, router]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSizes(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response.status) {
      // Get only main categories (categories without parentId)
      const mainCategories = response.data.filter(cat => !cat.parentId);
      setCategories(mainCategories);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`);
      const data = await response.json();

      if (data.status === "ok") {
        setSubCategories(data.data);
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

  const fetchSizes = async (categoryId) => {
    console.log("Fetching sizes for category:", categoryId);
    // If no category is selected, fetch all sizes
    const response = await getSizes(categoryId);
    console.log("Sizes API response:", response);
    if (response.status) {
      setSizes(response.data);
    } else {
      notification.error({
        message: response.message || "Failed to fetch sizes",
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
      console.log("Submitting size with values:", values);
      const response = isEditMode
        ? await updateSize(selectedItem._id, values)
        : await createSize(values);

      console.log("Size creation/update response:", response);
      
      if (response.status) {
        notification.success({
          message: `Size ${isEditMode ? 'updated' : 'created'} successfully`,
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        
        // If a category is selected, fetch sizes for that category
        // Otherwise, fetch all sizes
        if (selectedCategory) {
          console.log("Fetching sizes for selected category:", selectedCategory);
          fetchSizes(selectedCategory);
        } else {
          console.log("No category selected, fetching all sizes");
          fetchSizes();
        }
        
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

  // Add this useEffect to fetch subcategories when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

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
              {/* <div className="flex gap-4">
                <Select
                  placeholder="Select Main Category"
                  style={{ width: 200 }}
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setSubCategories([]); // Clear subcategories when main category changes
                  }}
                  options={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                />
                <Select
                  placeholder="Select Sub Category"
                  style={{ width: 200 }}
                  disabled={!selectedCategory}
                  onChange={(value) => fetchSizes(value)}
                  options={subCategories.map(cat => ({ label: cat.name, value: cat._id }))}
                />
              </div> */}
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
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">Size Name</th>
                  <th className="p-4 font-[500] text-nowrap">Category</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSizes.length > 0 ? (
                  paginatedSizes.map((item) => (
                    <tr key={item._id} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[13px]">{item.name}</td>
                      <td className="p-4 text-[13px]">{categories.find(cat => cat._id === item.categoryId)?.name}</td>
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
                    <td colSpan={5} className="text-center p-4">No sizes found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={sizes.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* Modal */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">{isEditMode ? 'Edit Size' : 'Add New Size'}</p>}
            open={showModal}
            onCancel={() => {
              setShowModal(false);
              setIsEditMode(false);
              form.resetFields();
            }}
            closeIcon={<span className="ant-modal-close-x ">×</span>}

          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="categoryId"
                label="Sub Category"
                rules={[{ required: true, message: 'Please select sub category' }]}
              >
                <Select
                  options={subCategories.map(cat => ({ label: cat.name, value: cat._id }))}
                  placeholder="Select sub category"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
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
                  {isEditMode ? 'Update Size' : 'Create Size'}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Sizes;
