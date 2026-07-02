import { useState, useEffect } from 'react';
import {
  Table, Button, Space, Input, Tag, Popconfirm, message, Modal, Form, Select, Avatar, Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  KeyOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CrownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { type User } from '@/api/user';

const { Option } = Select;

// 模拟数据（后端完成后替换）
const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01 10:00:00', lastLoginAt: '2024-05-26 09:00:00' },
  { id: 2, username: '张馆员', email: 'zhang@example.com', role: 'user', status: 'active', createdAt: '2024-02-15 14:30:00', lastLoginAt: '2024-05-25 16:20:00' },
  { id: 3, username: '李馆员', email: 'li@example.com', role: 'user', status: 'active', createdAt: '2024-03-10 09:15:00', lastLoginAt: '2024-05-24 11:45:00' },
  { id: 4, username: '王馆员', email: 'wang@example.com', role: 'user', status: 'disabled', createdAt: '2024-04-05 16:00:00', lastLoginAt: '2024-05-20 14:00:00' },
];

const UserManagePage = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<User[]>(mockUsers);
  const [total, setTotal] = useState(mockUsers.length);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增馆员');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const loadUsers = async () => {
    setDataSource(mockUsers);
    setTotal(mockUsers.length);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      if (editingUser) {
        message.success('更新成功');
      } else {
        message.success('登记成功');
      }
      setModalOpen(false);
      form.resetFields();
      loadUsers();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async () => {
    try {
      message.success('已移出馆员名录');
      loadUsers();
    } catch {
      message.error('移出失败');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      message.warning('密钥至少6位');
      return;
    }
    try {
      message.success(`已重置 "${resetUser?.username}" 的密钥`);
      setResetPwdOpen(false);
      setNewPassword('');
    } catch {
      message.error('重置失败');
    }
  };

  const columns: ColumnsType<User> = [
    { title: '编号', dataIndex: 'id', width: 60 },
    {
      title: '馆员',
      dataIndex: 'username',
      width: 120,
      render: (text: string, record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: 'var(--wood)' }} />
          <span style={{ fontFamily: 'Georgia' }}>{text}</span>
          {record.role === 'admin' && <CrownOutlined style={{ color: 'var(--wood)' }} />}
        </Space>
      )
    },
    {
      title: '馆邮',
      dataIndex: 'email',
      width: 200,
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{text}</span>
    },
    {
      title: '职级',
      dataIndex: 'role',
      width: 90,
      render: (role: string) => (
        <Tag style={{ borderRadius: 0, background: 'var(--paper-dark)', border: 'none' }}>
          {role === 'admin' ? '馆长' : '馆员'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => (
        <Tag style={{ borderRadius: 0, background: status === 'active' ? 'rgba(74, 107, 74, 0.15)' : 'rgba(184, 76, 60, 0.15)', border: 'none' }}>
          {status === 'active' ? '在职' : '休馆'}
        </Tag>
      )
    },
    {
      title: '入馆时辰',
      dataIndex: 'createdAt',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD')
    },
    {
      title: '最后到馆',
      dataIndex: 'lastLoginAt',
      width: 160,
      render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="修撰">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setModalTitle('修撰馆员');
              setModalOpen(true);
            }} style={{ color: 'var(--wood)' }} />
          </Tooltip>
          <Tooltip title="重置密钥">
            <Button type="link" size="small" icon={<KeyOutlined />} onClick={() => {
              setResetUser(record);
              setResetPwdOpen(true);
            }} style={{ color: 'var(--wood)' }} />
          </Tooltip>
          <Tooltip title="移出">
            <Popconfirm title="确认移出" description={`将 "${record.username}" 移出馆员名录？`} onConfirm={() => handleDelete(record.id)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontFamily: 'Georgia', fontSize: 24, fontWeight: 'normal', letterSpacing: 1 }}>
          馆员名录
        </h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#6B6258', marginTop: 12, marginBottom: 0 }}>
          登记、修撰或移出馆员信息
        </p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--paper-stroke)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Input
              placeholder="检索馆员"
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 180, borderRadius: 0 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              placeholder="按职级"
              allowClear
              style={{ width: 110, borderRadius: 0 }}
              onChange={setRoleFilter}
              options={[
                { value: 'admin', label: '馆长' },
                { value: 'user', label: '馆员' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={loadUsers} style={{ borderRadius: 0 }}>刷新</Button>
          </Space>
          
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setModalTitle('新馆登记');
            setModalOpen(true);
          }} style={{ borderRadius: 0 }}>
            新馆登记
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 位馆员`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            }
          }}
          style={{ padding: '0 20px 20px' }}
        />
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={<span style={{ fontFamily: 'Georgia' }}>{modalTitle}</span>}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        width={480}
        footer={[
          <Button key="cancel" onClick={() => { setModalOpen(false); form.resetFields(); }} style={{ borderRadius: 0 }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} style={{ borderRadius: 0 }}>确认</Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="馆员编号" rules={[{ required: true, message: '请输入' }]}>
            <Input prefix={<UserOutlined />} placeholder="馆员编号" style={{ borderRadius: 0 }} />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="密钥" rules={[{ required: true, message: '请输入', min: 6 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="至少6位" style={{ borderRadius: 0 }} />
            </Form.Item>
          )}
          <Form.Item name="email" label="馆邮" rules={[{ required: true, message: '请输入' }, { type: 'email', message: '无效格式' }]}>
            <Input prefix={<MailOutlined />} placeholder="email@example.com" style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item name="role" label="职级" initialValue="user">
            <Select style={{ borderRadius: 0 }}>
              <Option value="admin">馆长</Option>
              <Option value="user">馆员</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select style={{ borderRadius: 0 }}>
              <Option value="active">在职</Option>
              <Option value="disabled">休馆</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title={<span style={{ fontFamily: 'Georgia' }}>重置密钥 · {resetUser?.username}</span>}
        open={resetPwdOpen}
        onOk={handleResetPassword}
        onCancel={() => { setResetPwdOpen(false); setNewPassword(''); }}
        footer={[
          <Button key="cancel" onClick={() => { setResetPwdOpen(false); setNewPassword(''); }} style={{ borderRadius: 0 }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleResetPassword} style={{ borderRadius: 0 }}>重置</Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="新密钥" required>
            <Input.Password 
              placeholder="至少6位"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ borderRadius: 0 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagePage;