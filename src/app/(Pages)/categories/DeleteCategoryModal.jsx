import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteCategoryModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Modal
      centered
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
      title={
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationCircleOutlined />
          <span className="text-[18px] font-[600]">Delete Category</span>
        </div>
      }
    >
      <div className="py-4">
        <p className="text-[15px] mb-6">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            style={{ backgroundColor: 'rgba(232, 187, 76, 0.08)', color: 'rgb(232, 187, 76)', borderColor: 'rgb(232, 187, 76)' }}
            className="transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={onConfirm}
            loading={loading}
            className="transition-colors"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal; 