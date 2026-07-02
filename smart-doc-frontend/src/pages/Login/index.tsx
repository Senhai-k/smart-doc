import { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);
      login(res.user, res.token);
      message.success('签核成功');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error?.response?.data?.message || '馆员编号或密钥错误');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: { username: string; password: string; email: string }) => {
    setLoading(true);
    try {
      await authApi.register(values);
      message.success('登记成功，请签核');
    } catch (error: any) {
      message.error(error?.response?.data?.message || '登记失败');
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = () => {
    const [form] = Form.useForm();
    return (
      <Form form={form} onFinish={handleLogin}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入馆员编号' }]}>
          <Input prefix={<UserOutlined />} placeholder="馆员编号" size="large" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密钥' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密钥" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            签核登录
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const RegisterForm = () => {
    const [form] = Form.useForm();
    return (
      <Form form={form} onFinish={handleRegister}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入馆员编号' }]}>
          <Input prefix={<UserOutlined />} placeholder="馆员编号" size="large" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: '请输入馆邮', type: 'email' }]}>
          <Input prefix={<MailOutlined />} placeholder="馆邮地址" size="large" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请设定密钥', min: 6 }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密钥（至少6位）" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            登记入馆
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const items = [
    { key: 'login', label: '签核入馆', children: <LoginForm /> },
    { key: 'register', label: '新馆登记', children: <RegisterForm /> },
  ];

  return (
    <div className="archive-login">
      <div className="archive-login-container">
        <div className="archive-login-header">
          <div className="archive-stamp">智档馆 · 丙午年制</div>
          <h1>智能文档分析平台</h1>
          <p className="archive-subtitle">Intelligent Document Archive</p>
          <div className="archive-divider"></div>
        </div>
        <Card className="archive-login-card" bordered={false}>
          <Tabs items={items} />
        </Card>
        <div className="archive-login-footer">
          <span>卷宗编号 · 2317</span>
          <span>© 智档馆 2026</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;