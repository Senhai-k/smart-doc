import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      type: 'group' as const,
      label: '档案工作',
      children: [
        { key: '/dashboard', label: '案卷总览' },
        { key: '/ocr', label: '影像誊录' },
        { key: '/batch-meeting', label: '批量案卷' },
      ]
    },
    {
      type: 'group' as const,
      label: '智识工坊',
      children: [
        { key: '/text-ai', label: '智识工坊' },
      ]
    },
    {
      type: 'group' as const,
      label: '馆务管理',
      children: [
        { key: '/history', label: '归档索引' },
        { key: '/user-manage', label: '馆员名录' },
        { key: '/operation-log', label: '值班日志' },
      ]
    }
  ];

  return (
    <div className="archive-sidebar">
      <div className="archive-sidebar-header">
        <div className="archive-sidebar-title">智档馆</div>
        <div className="archive-sidebar-subtitle">丙午年制</div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="archive-sidebar-menu"
      />
      <div className="archive-sidebar-footer">
        <span>卷号 · 2317</span>
      </div>
    </div>
  );
};

export default Sidebar;