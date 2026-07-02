import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingOverlayProps {
  tip?: string;
  visible?: boolean;
}

const LoadingOverlay = ({ tip = '加载中...', visible = false }: LoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        tip={tip}
        size="large"
      >
        <div style={{ padding: 50 }} />
      </Spin>
    </div>
  );
};

export default LoadingOverlay;