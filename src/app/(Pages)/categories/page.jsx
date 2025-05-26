"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { Form, notification, Select } from 'antd';
import { MdEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteCategoryModal from "./DeleteCategoryModal";
import AddEditCategoryModal from "./AddEditCategoryModal";
import { updatePageNavigation } from "@/features/features";
import { IoIosArrowDown, IoIosArrowUp, IoMdAdd } from "react-icons/io";
import BACKEND_URL, { createCategory, getCategories, updateCategory, deleteCategory, fn_getFormattedCategories, fn_updateCategoryOrderingApi } from "@/api/api";

const Categories = () => {

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryPath, setCategoryPath] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("categories"));
    fetchCategories();
    fn_getFormattedCategory();
  }, [auth, dispatch, router]);

  const [loader, setLoader] = useState(true);
  const [formattedCategory, setFormattedCategory] = useState([]);

  const fn_getFormattedCategory = async () => {
    const response = await fn_getFormattedCategories();
    setLoader(false);
    if (response?.status) {
      setFormattedCategory(response?.data);
    };
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('API Response:', response);

      if (response?.status && Array.isArray(response?.data)) {
        setCategories(response.data);
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

      // Set the parent category ID based on the category path
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

        // Reset form and close modal
        form.resetFields();
        setShowModal(false);
        setLoader(true);

        // Refresh both formatted categories and regular categories
        await Promise.all([
          fn_getFormattedCategory(),
          fetchCategories()
        ]);

        // Reset all states
        setCategoryPath([]);
        setCurrentParentId(null);
        setSubCategories([]);
        setIsCategoryDropdownOpen(false);
        setIsEditMode(false);
        setSelectedItem(null);
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

  const handleEditCategory = (category) => {
    setIsEditMode(true);
    setShowModal(true);
    setSelectedItem(category);
    form.setFieldsValue({
      name: category.name,
      image: category.image ? [{ url: `${BACKEND_URL}/${category.image}` }] : [],
      hasBrand: category.hasBrand,
      hasSize: category.hasSize,
      hasCondition: category.hasCondition,
      hasColor: category.hasColor,
      hasMaterial: category.hasMaterial,
      hasCustomShipping: category.hasCustomShipping,
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setCategoryPath([]);
    setCurrentParentId(null);
    setSubCategories([]);
    setIsCategoryDropdownOpen(false);
    form.resetFields();
    setSelectedItem(null);
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
            <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
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

          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto w-full mt-[20px] flex flex-col gap-[10px]">
            {!loader ? formattedCategory?.length > 0 ? (
              <CategoryTree categories={formattedCategory} fn_getFormattedCategory={fn_getFormattedCategory} handleEditCategory={handleEditCategory} />
            ) : (
              <p className="text-center text-gray-600 text-[14px]">No Data Found</p>
            ) : (
              <p className="text-center text-gray-600 text-[14px]">Loading...</p>
            )}
          </div>

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
            selectedItem={selectedItem}
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;

const CategoryTree = ({ categories, fn_getFormattedCategory, handleEditCategory, level = 0 }) => {

  const [expanded, setExpanded] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteClick = (e, category) => {
    e.stopPropagation();
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await deleteCategory(categoryToDelete._id);
      if (res?.status) {
        fn_getFormattedCategory();
        notification.success({
          message: 'Category Deleted',
          placement: 'topRight',
          style: { marginTop: '50px' }
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to delete category',
        description: error.message,
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const fn_sortPayment = async (id, order) => {
    const response = await fn_updateCategoryOrderingApi({ categoryId: id, newOrdering: order });
    if (response?.status) {
      notification.success({
        message: 'Category Ordering Updated',
        placement: 'topRight',
        style: { marginTop: '50px' }
      });
      fn_getFormattedCategory();
    }
  };

  return (
    <>
      {categories.map((cat, idx) => (
        <div key={cat._id} onClick={(e) => cat?.subCategory?.length > 0 ? toggleExpand(e, cat._id) : e.stopPropagation()}>
          <div
            className="flex items-center justify-between h-[55px] px-[20px] rounded-[10px] cursor-pointer mb-2 text-[14px]"
            style={{
              backgroundColor: "rgba(232, 187, 76, 0.07)",
              marginLeft: `${level * 50}px`,
            }}
          >
            <div className="flex items-center gap-[15px]">
              <p>{cat?.ordering || idx + 1}</p>
              <Image
                width={32}
                height={32}
                alt={cat?.name}
                className="w-8 h-8 object-cover rounded-full border border-yellow-300"
                src={cat?.image !== "" ? `${BACKEND_URL}/${cat?.image}` : "/dummy_image.png"}
              />
              <p>{cat?.name}</p>
            </div>
            <div className="flex items-center gap-[15px]">
              <p className="text-[12px] font-[500] me-[-8px]">Move to:</p>
              <Select
                size="small"
                style={{ width: 55 }}
                value={cat?.ordering || idx + 1}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => fn_sortPayment(cat._id, e)}
                options={categories?.map((item, index) => ({ label: item?.ordering || index + 1, value: item?.ordering || index + 1, disabled: item._id === cat._id }))}
              />
              <MdEdit className="text-[20px] text-blue-600" onClick={(e) => { e.stopPropagation(); handleEditCategory(cat) }} />
              <MdDelete className="text-[20px] text-red-600" onClick={(e) => handleDeleteClick(e, cat)} />
              {cat?.subCategory?.length > 0 ? (
                <div>
                  {expanded[cat._id] ? (
                    <IoIosArrowUp className="text-xl" />
                  ) : (
                    <IoIosArrowDown className="text-xl" />
                  )}
                </div>
              ) : (
                <div className="w-[28px] mr-[-9px]">
                  -
                </div>
              )}
            </div>
          </div>

          {/* Recursive Rendering of Subcategories */}
          {expanded[cat._id] && cat.subCategory?.length > 0 && (
            <CategoryTree categories={cat.subCategory} fn_getFormattedCategory={fn_getFormattedCategory} handleEditCategory={handleEditCategory} level={level + 1} />
          )}
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
};