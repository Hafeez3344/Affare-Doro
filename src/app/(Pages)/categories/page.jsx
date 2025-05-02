"use client";

import Image from "next/image";
import moment from 'moment-timezone';
import { FiEye } from "react-icons/fi";
import Navbar from "@/components/navbar";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import ViewCategoryModal from "./ViewCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import AddEditCategoryModal from "./AddEditCategoryModal";
import { updatePageNavigation } from "@/features/features";
import { Form, notification, Select, Modal, Pagination } from 'antd';
import BACKEND_URL, { createCategory, getCategories, updateCategory, deleteCategory } from "@/api/api";

const { Option } = Select;

const Categories = () => {
  const itemsPerPage = 10;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryPath, setCategoryPath] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [viewCategoryPath, setViewCategoryPath] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewSubCategories, setViewSubCategories] = useState([]);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [currentViewParentId, setCurrentViewParentId] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("categories"));
    fetchCategories();
  }, [auth, dispatch, router]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('API Response:', response);

      if (response?.status && Array.isArray(response?.data)) {
        setCategories(response.data); // Assuming response.data is the array of categories
      } else {
        throw new Error(response?.message || 'Unexpected API response');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      notification.error({
        message: 'Failed to fetch categories',
        description: error.message || 'An unexpected error occurred',
        placement: 'topRight',
        style: { marginTop: '50px' },
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

  console.log("imageFile", imageFile);

  const handleSubmit = async (values) => {
    try {
      console.log('Form values:', values);
      setLoading(true);
      let response;

      // Get the image file from the form values
      const imageFile = values.image?.[0]?.originFileObj;
      console.log("Image file from form:", imageFile);

      const formData = new FormData();

      // Add each field to FormData except image and category
      Object.keys(values).forEach(key => {
        if (key !== 'image' && key !== 'category') {
          formData.append(key, values[key]);
        }
      });

      // Add image file to FormData if it exists
      if (imageFile) {
        formData.append('image', imageFile);
        console.log('Added image file to formData:', imageFile);
      }

      // If we have a selected category, add it to the form data
      if (categoryPath.length > 0) {
        const parentId = categoryPath[categoryPath.length - 1]._id;
        formData.append('parentCategoryId', parentId);
        console.log('Added parentId to formData:', parentId);
      }

      if (isEditMode) {
        response = await updateCategory(selectedItem._id, formData);
      } else {
        response = await createCategory(formData);
      }

      if (response.status) {
        notification.success({
          message: isEditMode ? "Category updated successfully" : "Category created successfully",
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
        
        // Reset all states and close modal
        form.resetFields();
        setCategoryPath([]);
        setCurrentParentId(null);
        setSubCategories([]);
        setIsCategoryDropdownOpen(false);
        setShowModal(false);
        setIsEditMode(false);
        setSelectedItem(null);
        setImageFile(null);
        
        // Fetch updated categories
        await fetchCategories();
      } else {
        throw new Error(response.message || 'Category operation failed');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      notification.error({
        message: error.message || 'Category operation failed',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setCategoryPath([]);
    setCurrentParentId(null);
    setSubCategories([]);
    setIsCategoryDropdownOpen(false);
    form.resetFields();
    setImageFile(null);
    setSelectedItem(null);
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    if (e?.fileList) {
      const file = e.fileList[0]?.originFileObj;
      console.log('Setting image file:', file);
      setImageFile(file);
      return e.fileList;
    }
    return e;
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`);
      const data = await response.json();

      if (data.status === "ok") {
        setSubCategories(data.data);
        setCurrentParentId(categoryId);
        setIsCategoryDropdownOpen(true);

        // Update the category path with the current category
        const currentCategory = categories.find(cat => cat._id === categoryId);
        if (currentCategory) {
          setCategoryPath([...categoryPath, currentCategory]);
        }
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

  const handleCategorySelect = (category) => {
    if (category.subCategoryCount > 0) {
      // If category has subcategories, fetch them and update the path
      fetchSubCategories(category._id);
      setCurrentParentId(category._id);
      setCategoryPath([...categoryPath, category]);
    } else {
      // If category has no subcategories, add it to path and close dropdown
      setCategoryPath([...categoryPath, category]);
      setIsCategoryDropdownOpen(false);
    }
  };

  const handleGoBack = () => {
    if (categoryPath.length > 0) {
      const newPath = [...categoryPath];
      newPath.pop();
      setCategoryPath(newPath);

      if (newPath.length === 0) {
        setCurrentParentId(null);
        setSubCategories([]);
      } else {
        const parentId = newPath[newPath.length - 1]._id;
        fetchSubCategories(parentId);
      }
    }
  };

  const handleNewCategory = () => {
    // Reset everything when creating a new category
    setCategoryPath([]);
    setCurrentParentId(null);
    setSubCategories([]);
    setIsCategoryDropdownOpen(false);
    setShowModal(true);
    setIsEditMode(false);
    form.resetFields();
  };

  const handleViewCategory = async (category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
    setIsViewDropdownOpen(false);
    setViewCategoryPath([category]);
    await fetchViewSubCategories(category._id);
  };

  const handleViewCategorySelect = async (category) => {
    if (category.subCategoryCount > 0) {
      setViewCategoryPath([...viewCategoryPath, category]);
      await fetchViewSubCategories(category._id);
    }
  };

  const handleViewGoBack = async () => {
    if (viewCategoryPath.length > 1) {
      const newPath = [...viewCategoryPath];
      newPath.pop();
      setViewCategoryPath(newPath);

      const parentId = newPath[newPath.length - 1]._id;
      await fetchViewSubCategories(parentId);
    }
  };

  const fetchViewSubCategories = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`);
      const data = await response.json();

      if (data.status === "ok") {
        setViewSubCategories(data.data);
        setCurrentViewParentId(categoryId);
      } else {
        setViewSubCategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setViewSubCategories([]);
    }
  };

  const modalTitle = isEditMode ? "Edit Category" : "Add New Category";
  const submitButtonText = isEditMode ? "Update Category" : "Create Category";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ fontFamily: '"Poppins", sans-serif' }}>
      <style jsx global>{`
        body {
          font-family: "Poppins", sans-serif !important;
        }
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(232, 187, 76, 0.3);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(232, 187, 76, 0.5);
        }
        .category-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .category-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .category-dropdown::-webkit-scrollbar-thumb {
          background-color: rgba(232, 187, 76, 0.3);
          border-radius: 6px;
        }
        .category-dropdown::-webkit-scrollbar-thumb:hover {
          background-color: rgba(232, 187, 76, 0.5);
        }
      `}</style>
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar showModal={showModal} />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[25px] font-[500] text-gray-800">Categories</h1>
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditMode(false);
                form.resetFields();
              }}
              style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)' }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors focus:outline-none text-[14px]"
            >
              <IoMdAdd className="text" />
              Add Category
            </button>
          </div>
          {/* ---------------------Category Table----------------------- */}
          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-full">
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">Category Name</th>
                  <th className="p-4 font-[500] text-nowrap">Sub Categories</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((item) => (
                    <tr key={item._id} className="text-gray-800 text-sm border-b">
                      {/* <td className="p-4 text-[13px]">{item.name}</td> */}
                      <td className="p-4 text-[13px] flex items-center gap-2">
                        {item.image && (
                          <img
                            src={`${BACKEND_URL}/${item.image}`}
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded-full"
                          />
                        )}
                        {item.name}
                      </td>
                      <td className="p-4 text-[13px]">{item.subCategoryCount}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 w-20 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                        {moment.utc(item?.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                          title="View"
                          onClick={() => handleViewCategory(item)}
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
                    <td colSpan="5" className="text-center p-4 text-gray-500">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={categories.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* View Category Modal */}
          <ViewCategoryModal
            isOpen={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false);
              setIsViewDropdownOpen(false);
              setViewSubCategories([]);
              setViewCategoryPath([]);
            }}
            selectedCategory={selectedCategory}
            isViewDropdownOpen={isViewDropdownOpen}
            setIsViewDropdownOpen={setIsViewDropdownOpen}
            viewSubCategories={viewSubCategories}
            viewCategoryPath={viewCategoryPath}
            handleViewGoBack={handleViewGoBack}
            handleViewCategorySelect={handleViewCategorySelect}
          />

          {/* Add/Edit Category Modal */}
          <AddEditCategoryModal
            isOpen={showModal}
            onClose={handleModalClose}
            form={form}
            loading={loading}
            isEditMode={isEditMode}
            categoryPath={categoryPath}
            isCategoryDropdownOpen={isCategoryDropdownOpen}
            setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
            currentParentId={currentParentId}
            subCategories={subCategories}
            categories={categories}
            handleGoBack={handleGoBack}
            handleNewCategory={handleNewCategory}
            handleCategorySelect={handleCategorySelect}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
