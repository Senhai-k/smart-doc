import { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Space, Input, Tag, Popconfirm, message, Select, Modal, Row, Col
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ClearOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { logApi, type OperationLog } from '@/api/log';

const OperationLogPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OperationLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [todayStats, setTodayStats] = useState({ total: 0, success: 0, failed: 0 });

  const moduleMap: Record<string, { label: string; icon: string }> = {
    auth: { label: '签核', icon: '🔐' },
    ocr: { label: '誊录', icon: '📷' },
    llm: { label: '智识', icon: '🤖' },
    user: { label: '馆务', icon: '👥' },
    system: { label: '系统', icon: '⚙️' }
  };

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await logApi.getList({
        page,
        pageSize,
        module: moduleFilter || undefined,
        status: statusFilter || undefined,
        keyword: keyword || undefined
      });
      setDataSource(res.items);
      setTotal(res.total);
      
      // 同时加载今日统计
      const statsRes = await logApi.getTodayStats();
      setTodayStats(statsRes);
    } catch (_error) {
      console.error('加载失败', _error);
      // 如果后端API不可用，使用模拟数据作为后备
      setDataSource([]);
      setTotal(0);
      setTodayStats({ total: 0, success: 0, failed: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, moduleFilter, statusFilter, keyword]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleBatchDelete = async () => {
    try {
      await logApi.deleteBatch(selectedRowKeys as number[]);
      message.success(`已将 ${selectedRowKeys.length} 件移出日志`);
      setSelectedRowKeys([]);
      loadLogs();
    } catch (_error) {
      message.error('移出失败');
    }
  };

  const handleClearAll = async () => {
    Modal.confirm({
      title: '清空日志',
      content: '确定清空所有值班日志？此操作不可恢复。',
      onOk: async () => {
        try {
          await logApi.clearAll();
          message.success('已清空日志');
          loadLogs();
        } catch (_error) {
          message.error('清空失败');
        }
      }
    });
  };

  const handleExport = async () => {
    try {
      // TODO: 实现导出功能
      message.info('导出功能开发中');
    } catch (_error) {
      message.error('导出失败');
    }
  };

  const columns: ColumnsType<OperationLog> = [
    { title: '编号', dataIndex: 'id', width: 60 },
    { title: '馆员', dataIndex: 'username', width: 90 },
    {
      title: '事务',
      dataIndex: 'action',
      width: 120,
      render: (text: string) => <span style={{ fontFamily: 'Georgia' }}>{text}</span>
    },
    {
      title: '司职',
      dataIndex: 'module',
      width: 80,
      render: (module: string) => {
        const m = moduleMap[module];
        return <Tag style={{ borderRadius: 0, background: 'var(--paper-dark)', border: 'none' }}>{m?.icon} {m?.label || module}</Tag>;
      }
    },
    { title: 'IP', dataIndex: 'ip', width: 120, render: (ip: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{ip || '-'}</span> },
    {
      title: '耗时',
      dataIndex: 'duration',
      width: 70,
      render: (ms: number) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: ms > 300 ? 'var(--seal-red)' : 'var(--seal-green)' }}>
          {ms}ms
        </span>
      )
    },
    {
      title: '结果',
      dataIndex: 'status',
      width: 70,
      render: (status: string) => (
        status === 'success' 
          ? <CheckCircleOutlined style={{ color: 'var(--seal-green)', fontSize: 16 }} />
          : <CloseCircleOutlined style={{ color: 'var(--seal-red)', fontSize: 16 }} />
      )
    },
    {
      title: '时辰',
      dataIndex: 'createdAt',
      width: 150,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm:ss')
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2>值班日志</h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#6B6258', marginTop: 12, marginBottom: 0 }}>
          查阅馆内事务记录
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={20} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 8 }}>今日总务</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, color: 'var(--wood)' }}>{todayStats.total}</div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 8 }}>成务</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, color: 'var(--seal-green)' }}>{todayStats.success}</div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 8 }}>失务</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, color: 'var(--seal-red)' }}>{todayStats.failed}</div>
          </div>
        </Col>
      </Row>

      <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--paper-stroke)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Space wrap>
            <Input
              placeholder="检索馆员或事务"
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 180, borderRadius: 0 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              placeholder="司职"
              allowClear
              style={{ width: 100, borderRadius: 0 }}
              onChange={setModuleFilter}
              options={[
                { value: 'auth', label: '签核' },
                { value: 'ocr', label: '誊录' },
                { value: 'llm', label: '智识' },
                { value: 'user', label: '馆务' },
              ]}
            />
            <Select
              placeholder="结果"
              allowClear
              style={{ width: 80, borderRadius: 0 }}
              onChange={setStatusFilter}
              options={[
                { value: 'success', label: '成' },
                { value: 'failed', label: '失' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={loadLogs} style={{ borderRadius: 0 }}>刷新</Button>
          </Space>
          
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm title="确认移出" description={`将选中的 ${selectedRowKeys.length} 件移出日志？`} onConfirm={handleBatchDelete}>
                <Button danger icon={<DeleteOutlined />} style={{ borderRadius: 0 }}>移出 ({selectedRowKeys.length})</Button>
              </Popconfirm>
            )}
            <Button icon={<ExportOutlined />} onClick={handleExport} style={{ borderRadius: 0 }}>誊录</Button>
            <Button danger icon={<ClearOutlined />} onClick={handleClearAll} style={{ borderRadius: 0 }}>清空</Button>
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
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
            showTotal: (total) => `共 ${total} 件`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            }
          }}
          style={{ padding: '0 20px 20px' }}
        />
      </div>
    </div>
  );
};

export default OperationLogPage;