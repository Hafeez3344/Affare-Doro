"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { createCondition, getConditions } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Conditions = () => {
  const [conditions, setConditions] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    const response = await getConditions();
    if (response.status) {
      setConditions(response.data);
    }
  };

  const handleEdit = (condition) => {
    setSelectedCondition(condition);
    setIsEditMode(true);
    setShowModal(true);
    form.setFieldsValue({ name: condition.name });
  };

  const handleDelete = async (id) => {
    try {
      // Add deleteCondition API logic here if needed
      notification.success({
        message: "Condition deleted successfully",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
      fetchConditions();
    } catch (error) {
      notification.error({
        message: "Failed to delete condition",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = isEditMode
        ? await createCondition({ ...values, id: selectedCondition._id }) // Replace with updateCondition API if available
        : await createCondition(values);

      if (response.status) {
        notification.success({
          message: `Condition ${isEditMode ? "updated" : "created"} successfully`,
          placement: "topRight",
          style: { marginTop: "50px" },
        });
        fetchConditions();
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedCondition(null);
      }
    } catch (error) {
      notification.error({
        message: error.message || `Condition ${isEditMode ? "update" : "creation"} failed`,
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Conditions</h1>
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditMode(false);
                form.resetFields();
              }}
              style={{ backgroundColor: "rgba(232, 187, 76, 0.08)", color: "rgb(232, 187, 76)" }}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none"
            >
              <IoMdAdd className="text-xl" />
              Add Condition
            </button>
          </div>

          <div className="p-[30px] bg-white rounded-[8px] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="font-[500] text-[var(--text-color-body)] text-[15px]">
                  <td>Condition Name</td>
                  {/* <td>Description </td> */}
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {conditions.map((condition) => (
                  <tr key={condition._id} className="h-[50px] text-[14px]">
                    <td>{condition.name}</td>
                    <td className="px-[17px] relative">
                      <div className="flex gap-2">
                        <MdEdit
                          className="cursor-pointer text-blue-600"
                          onClick={() => handleEdit(condition)}
                        />
                        <MdDelete
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(condition._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {isEditMode ? "Edit Condition" : "Add New Condition"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item
                    name="name"
                    label="Condition Name"
                    rules={[{ required: true, message: "Please enter condition name" }]}
                  >
                    <Input placeholder="Enter condition name" />
                  </Form.Item>

                  <div className="flex justify-end gap-3">
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ backgroundColor: "rgb(232, 187, 76)", borderColor: "rgb(232, 187, 76)" }}
                    >
                      {isEditMode ? "Update Condition" : "Create Condition"}
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

export default Conditions;
