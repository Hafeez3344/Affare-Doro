"use client";

import axios from "axios";
import { Input, Modal, Button, message } from "antd";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";

import BACKEND_URL from "@/api/api";
import { sendOTPForCredentialsUpdate, updateAdminCredentials } from "@/api/api";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { updatePageNavigation } from "@/features/features";

const Settings = () => {

  const dispatch = useDispatch();
  const [adminDetails, setAdminDetails] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [originalData, setOriginalData] = useState({
    email: "",
    password: ""
  });
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPLoading, setIsOTPLoading] = useState(false);

  useEffect(() => {
    dispatch(updatePageNavigation("settings"));
    fn_getAdminDetails();
  }, [dispatch]);

  useEffect(() => {
    // Check if form data has changed from original
    const hasChanged = formData.email !== originalData.email || formData.password !== originalData.password;
    setIsUpdateDisabled(!hasChanged);
  }, [formData, originalData]);

  const fn_getAdminDetails = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/admin/get`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        const adminData = response?.data?.data;
        setAdminDetails(adminData);
        setFormData({
          email: adminData?.email || "",
          password: adminData?.password || ""
        });
        setOriginalData({
          email: adminData?.email || "",
          password: adminData?.password || ""
        });
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
      setAdminDetails(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateCredentials = async () => {
    setIsLoading(true);
    try {
      // Send OTP to previous email address
      const otpResponse = await sendOTPForCredentialsUpdate(originalData.email);

      if (otpResponse.status) {
        setIsOTPModalVisible(true);
        message.success("OTP sent to your email address");
      } else {
        message.error(otpResponse.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      message.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 4) {
      message.error("Please enter a valid 4-digit OTP");
      return;
    }

    setIsOTPLoading(true);
    try {
      // Prepare update data with only changed fields
      const updateData = {};
      if (formData.email !== originalData.email) {
        updateData.email = formData.email;
      }
      if (formData.password !== originalData.password) {
        updateData.password = formData.password;
      }
      updateData.otp = otp;

      const updateResponse = await updateAdminCredentials(updateData);

      if (updateResponse.status) {
        message.success("Credentials updated successfully");
        setIsOTPModalVisible(false);
        setOtp("");
        // Refresh admin details
        await fn_getAdminDetails();
      } else {
        message.error(updateResponse.message);
      }
    } catch (error) {
      console.error("Error updating credentials:", error);
      message.error("Failed to update credentials");
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleOTPCancel = () => {
    setIsOTPModalVisible(false);
    setOtp("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 mt-[30px] px-[22px]">
          <div className="bg-white rounded-[8px] shadow-sm p-[20px]">
            <div className="border-[2px] border-gray-200 rounded-[8px] p-[20px]">
              <p className="text-[20px] font-[500]">Profile</p>
              <div className="flex flex-col gap-5 pb-2 mt-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Email Address</label>
                  <input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[#777777]">Password</label>
                  <Input.Password
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter Password"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-300 hover:border-blue-300"
                    visibilityToggle={true}
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    onClick={handleUpdateCredentials}
                    disabled={isUpdateDisabled || isLoading}
                    loading={isLoading}
                    className={`cursor-pointer w-[200px] text-[14px] font-[500] rounded-[7px] h-[40px] ${isUpdateDisabled ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-[#E8BB4C] cursor-pointer"}`}
                  >
                    {isLoading ? "Loading..." : "Update Credentials"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal
        title="Verify OTP"
        open={isOTPModalVisible}
        onCancel={handleOTPCancel}
        footer={[
          <button key="cancel" className="border w-[100px] text-[13px] font-[500] rounded-[5px] h-[35px]" onClick={handleOTPCancel}>
            Cancel
          </button>,
          <button
            key="verify"
            className={`cursor-pointer ms-[15px] w-[150px] text-[12px] font-[500] rounded-[7px] h-[35px] ${otp.length !== 4 ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-[#E8BB4C] cursor-pointer"}`}
            onClick={handleOTPSubmit}
            disabled={otp.length !== 4 || isOTPLoading}
            loading={isOTPLoading}
          >
            {isOTPLoading ? "Loading..." : "Verify & Update"}
          </button>,
        ]}
        centered
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-gray-600 text-center">
            Please enter the 4-digit OTP sent to your email address
          </p>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputStyle={'w-[45px] h-[45px] border min-w-[45px] rounded-[5px]'}
            renderInput={(props) => <input {...props} />}
            containerStyle="flex gap-2"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
