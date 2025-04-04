'use client';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, notification } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { adminLogin } from '@/api/api';

const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      const response = await adminLogin(values);
      if (response.status) {
        notification.success({
          message: 'Success',
          description: response.message,
        });
        router.push('/dashboard');
      } else {
        notification.error({
          message: 'Error',
          description: response.message,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Something went wrong',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-96 h-[500px] bg-white shadow-lg rounded-xl overflow-hidden p-8 flex flex-col justify-center">
        <div className="text-center mb-6">
          <Title level={3}>Admin Login</Title>
          <Text>Welcome back! Please enter your details below to log in.</Text>
        </div>
        <Form name="admin_login" layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            name="email"
            rules={[{ type: 'email', required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
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
