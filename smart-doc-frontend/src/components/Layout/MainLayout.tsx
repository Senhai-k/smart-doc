import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from './Sidebar';

const { Header, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 200 }}>
        <Header style={{ 
          background: 'var(--card)', 
          borderBottom: '1px solid var(--paper-stroke)',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 48
        }}>
          <span style={{ fontSize: 11, color: 'var(--ink-light)' }}>
            当前馆员：{user?.username || '访客'}
          </span>
          <span 
            onClick={handleLogout}
            style={{ 
              fontSize: 11, 
              cursor: 'pointer',
              color: 'var(--ink-light)'
            }}
          >
            <LogoutOutlined style={{ marginRight: 6 }} />
            退馆
          </span>
        </Header>
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default MainLayout;