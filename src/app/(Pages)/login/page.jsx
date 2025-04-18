"use client";
import { adminLogin } from "@/api/api";
import { useRouter } from "next/navigation";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Form, Input, Button, Typography, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateAuth } from "@/features/features";
import { useEffect } from "react";

const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth) {
      router.push("/dashboard");
    }
  }, [auth, router]);

  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
      placement: 'topRight',
      duration: 3,
      style: {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await adminLogin(values);
      if (response.status) {
        showNotification(
          'success',
          'Login Successful',
          'Welcome back! You have successfully logged in.'
        );
        dispatch(updateAuth(true));
        router.push("/dashboard");
      } else {
        showNotification(
          'error',
          'Login Failed',
          response.message || 'Invalid email or password'
        );
      }
    } catch (error) {
      showNotification(
        'error',
        'Error',
        'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {contextHolder}
      <div className="w-96 h-[500px] bg-white shadow-lg rounded-xl overflow-hidden p-8 flex flex-col justify-center">
        <div className="text-center mb-6">
          <Title level={3}>Admin Login</Title>
          <Text>Welcome back! Please enter your details below to log in.</Text>
        </div>
        <Form
          name="admin_login"
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" size="large">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
