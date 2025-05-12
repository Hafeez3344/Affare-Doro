import React from 'react';
import { Modal, Form, Input, Upload, Radio, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";

const AddEditCategoryModal = ({
  isOpen,
  onClose,
  form,
  loading,
  isEditMode,
  categoryPath,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  currentParentId,
  subCategories,
  categories,
  handleGoBack,
  handleNewCategory,
  handleCategorySelect,
  handleSubmit,
  selectedItem, // Receive selectedItem
}) => {
  const modalTitle = isEditMode ? "Edit Category" : "Add New Category";
  const submitButtonText = isEditMode ? "Update Category" : "Create Category";

  // Add the normFile function to handle file uploads
  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    if (e?.fileList) {
      return e.fileList;
    }
    return e;
  };

  return (
    <Modal
      centered
      footer={null}
      width={600}
      title={<p className="text-[20px] font-[700]">{modalTitle}</p>}
      open={isOpen}
      onCancel={onClose}
      closeIcon={<span className="ant-modal-close-x ">×</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input
            placeholder="Enter category name"
            className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
          />
        </Form.Item>

        {!isEditMode && ( // Exclude category selection input in edit mode
          <Form.Item
            name="category"
            label="Product Category"
            rules={[{ required: false, message: "Please select a category" }]}
          >
            <div
              className="relative border p-2 rounded cursor-pointer flex items-center justify-between border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span>
                {categoryPath.length
                  ? categoryPath.map((c) => c.name).join(" / ")
                  : "Select Category"}
              </span>
              {isCategoryDropdownOpen ? (
                <ChevronUp className="absolute right-2" />
              ) : (
                <ChevronDown className="absolute right-2" />
              )}
            </div>
            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border p-2 rounded mt-2 bg-white category-dropdown max-h-[200px] overflow-y-auto"
                >
                  {categoryPath.length > 0 && (
                    <div
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={handleGoBack}
                    >
                      <ArrowLeft /> Back
                    </div>
                  )}
                  <div
                    className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
                    onClick={() => handleNewCategory()}
                  >
                    <span>New Category</span>
                  </div>
                  {(currentParentId ? subCategories : categories).map((category) => (
                    <div
                      key={category._id}
                      className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span>{category.name}</span>
                      {category.subCategoryCount > 0 && <ArrowRight />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Form.Item>
        )}

        <Form.Item
          name="image"
          label="Category Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="image"
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
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Form.Item
            name="hasBrand"
            label="Has Brand"
            initialValue={selectedItem?.hasBrand ?? true}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="hasSize"
            label="Has Size"
            initialValue={selectedItem?.hasSize ?? true}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="hasCondition"
            label="Has Condition"
            initialValue={selectedItem?.hasCondition ?? true}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="hasColor"
            label="Has Color"
            initialValue={selectedItem?.hasColor ?? true}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="hasMaterial"
            label="Has Material"
            initialValue={selectedItem?.hasMaterial ?? true}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="hasCustomShipping"
            label="Has Custom Shipping"
            initialValue={selectedItem?.hasCustomShipping ?? true}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button
            onClick={onClose}
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
            {submitButtonText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditCategoryModal;