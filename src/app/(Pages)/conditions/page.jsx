"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";
import { Form, Input, Button, notification, Modal, Pagination } from "antd";
import { createCondition, getConditions, updateCondition, deleteCondition } from "@/api/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from 'moment-timezone';

const Conditions = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [conditions, setConditions] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedConditions = conditions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("conditions"));
    fetchConditions();
  }, [auth, dispatch, router]);

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
    form.setFieldsValue({ 
      name: condition.name,
      subTitle: condition.subTitle 
    });
  };

  const handleDelete = async (id) => {
    try {
      Modal.confirm({
        title: 'Delete Condition',
        content: 'Are you sure you want to delete this condition? This action cannot be undone.',
        okText: 'Yes, Delete',
        cancelText: 'No, Cancel',
        okButtonProps: {
          style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }
        },
        onOk: async () => {
          const response = await deleteCondition(id);
          if (response.status) {
            notification.success({
              message: "Success",
              description: response.message,
              placement: "topRight",
              style: { marginTop: "50px" },
            });
            fetchConditions(); // Refresh the list
          } else {
            notification.error({
              message: "Error",
              description: response.message,
              placement: "topRight",
              style: { marginTop: "50px" },
            });
          }
        }
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || 'Failed to delete condition',
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;

      if (isEditMode && selectedCondition) {
        response = await updateCondition(selectedCondition._id, values);
      } else {
        response = await createCondition(values);
      }

      if (response.status) {
        notification.success({
          message: `Success`,
          description: response.message,
          placement: "topRight",
          style: { marginTop: "50px" },
        });
        fetchConditions();
        setShowModal(false);
        form.resetFields();
        setIsEditMode(false);
        setSelectedCondition(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || `Failed to ${isEditMode ? "update" : "create"} condition`,
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
        <Sidebar showModal={showModal} />
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
            <table className="min-w-full border">
              <thead>
                <tr style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)' }} className="text-left text-[14px] text-gray-700">
                  <th className="p-4 font-[500] text-nowrap">Condition Name</th>
                  <th className="p-4 font-[500] text-nowrap">Condition Type</th>
                  <th className="p-4 font-[500]">Status</th>
                  <th className="p-4 font-[500]">Created Date</th>
                  <th className="p-4 font-[500]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedConditions.length > 0 ? (
                  paginatedConditions.map((condition) => (
                    <tr key={condition._id} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[13px]">{condition.name}</td>
                      <td className="p-4 text-[13px] text-nowrap">{condition.subTitle}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                          {condition.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-[13px] text-[#000000B2] whitespace-nowrap">
                        {moment.utc(condition?.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                          title="Edit"
                          onClick={() => handleEdit(condition)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2"
                          title="Delete"
                          onClick={() => handleDelete(condition._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4">No conditions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={conditions.length}
                pageSize={itemsPerPage}
              />
            </div>
          </div>

          {/* Modal */}
          <Modal
            centered
            footer={null}
            width={600}
            title={<p className="text-[20px] font-[700]">{isEditMode ? "Edit Condition" : "Add New Condition"}</p>}
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
                label="Condition Name"
                rules={[{ required: true, message: "Please enter condition name" }]}
              >
                <Input
                  placeholder="Enter condition name"
                  className="border-[--text-color] focus:border-[--text-color] hover:border-[--text-color] focus:shadow-[0_0_0_2px_rgba(232,187,76,0.2)]"
                />
              </Form.Item>

              <Form.Item
                name="subTitle"
                label="Condition Type"
                rules={[{ required: true, message: "Please enter condition type" }]}
              >
                <Input
                  placeholder="Enter condition type"
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
                  {isEditMode ? "Update Condition" : "Create Condition"}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
