import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Select, Popconfirm, message, Modal, Tag } from 'antd';
import { DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { historyApi, type HistoryRecord } from '@/api/history';

const HistoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<HistoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<HistoryRecord | null>(null);

  const typeMap: Record<string, string> = {
    ocr: '影像誊录',
    summary: '摘要案卷',
    sentiment: '判词倾向',
    keywords: '索引标签',
    translate: '译作副本',
    meeting_extract: '会议纪要'
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await historyApi.getList({
        page,
        pageSize,
        type: typeFilter || undefined
      });
      setDataSource(res.items);
      setTotal(res.total);
    } catch (_error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    try {
      await historyApi.deleteRecord(id);
      message.success('已移出档案馆');
      loadData();
      setSelectedRowKeys(prev => prev.filter(key => key !== id));
    } catch (_error) {
      message.error('移出失败');
    }
  };

  const handleBatchDelete = async () => {
    try {
      await historyApi.deleteBatch(selectedRowKeys as number[]);
      message.success(`已将 ${selectedRowKeys.length} 件移出档案馆`);
      setSelectedRowKeys([]);
      loadData();
    } catch (_error) {
      message.error('移出失败');
    }
  };

  const handleClearAll = async () => {
    try {
      await historyApi.clearAll();
      message.success('已清空归档索引');
      loadData();
      setSelectedRowKeys([]);
    } catch (_error) {
      message.error('清空失败');
    }
  };

  const handleView = (record: HistoryRecord) => {
    setViewRecord(record);
    setViewModalOpen(true);
  };

  const columns: ColumnsType<HistoryRecord> = [
    { title: '编号', dataIndex: 'id', width: 70 },
    {
      title: '事务类别',
      dataIndex: 'type',
      width: 110,
      render: (type: string) => (
        <Tag style={{ borderRadius: 0, background: 'var(--paper-dark)', border: 'none' }}>
          {typeMap[type] || type}
        </Tag>
      )
    },
    {
      title: '原稿摘要',
      dataIndex: 'input',
      ellipsis: true,
      width: 250,
      render: (text: string) => (
        <span>{text.length > 50 ? text.slice(0, 50) + '…' : text}</span>
      )
    },
    {
      title: '誊录结果',
      dataIndex: 'output',
      ellipsis: true,
      width: 250,
      render: (text: string) => {
        try {
          // 如果是 JSON 格式，尝试解析并显示关键信息
          const parsed = JSON.parse(text);
          if (parsed.meeting_topic) {
            return <span>{parsed.meeting_topic}</span>;
          }
          return <span style={{ color: 'var(--ink-light)' }}>{text.length > 40 ? text.slice(0, 40) + '…' : text}</span>;
        } catch {
          return <span style={{ color: 'var(--ink-light)' }}>{text.length > 40 ? text.slice(0, 40) + '…' : text}</span>;
        }
      }
    },
    {
      title: '时辰',
      dataIndex: 'createdAt',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} style={{ color: 'var(--wood)' }} />
          <Popconfirm title="确认移出" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2>归档索引</h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
        <p style={{ fontSize: 13, color: 'var(--ink-light)', marginTop: 12, marginBottom: 0 }}>
          查阅历史誊录记录，可按类别筛选或移出
        </p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--paper-stroke)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Select
              placeholder="按事务筛选"
              allowClear
              style={{ width: 130 }}
              onChange={setTypeFilter}
              options={[
                { value: 'ocr', label: '影像誊录' },
                { value: 'summary', label: '摘要案卷' },
                { value: 'sentiment', label: '判词倾向' },
                { value: 'keywords', label: '索引标签' },
                { value: 'translate', label: '译作副本' },
                { value: 'meeting_extract', label: '会议纪要' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
          </Space>
          
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm title="批量移出" onConfirm={handleBatchDelete}>
                <Button danger>批量移出 ({selectedRowKeys.length})</Button>
              </Popconfirm>
            )}
            <Popconfirm title="清空索引" onConfirm={handleClearAll}>
              <Button danger>清空全部</Button>
            </Popconfirm>
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

      <Modal
        title="档案详情"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={650}
      >
        {viewRecord && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 6 }}>原稿</div>
              <div style={{ background: 'rgba(227, 217, 204, 0.3)', padding: 14, fontSize: 14, lineHeight: 1.7, maxHeight: 200, overflow: 'auto' }}>
                {viewRecord.input}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 6 }}>誊录结果</div>
              <div style={{ background: 'rgba(227, 217, 204, 0.3)', padding: 14, fontSize: 14, lineHeight: 1.7, maxHeight: 250, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                {(() => {
                  try {
                    const parsed = JSON.parse(viewRecord.output);
                    return (
                      <div>
                        {parsed.meeting_topic && <div><strong>会议主题：</strong>{parsed.meeting_topic}</div>}
                        {parsed.date && <div><strong>日期：</strong>{parsed.date}</div>}
                        {parsed.attendees && parsed.attendees.length > 0 && <div><strong>参会人：</strong>{parsed.attendees.join('、')}</div>}
                        {parsed.conclusion && <div><strong>结论：</strong>{parsed.conclusion}</div>}
                        {parsed.action_items && parsed.action_items.length > 0 && (
                          <div><strong>待办事项：</strong>
                            <ul>
                              {parsed.action_items.map((item: { task: string; assignee?: string; deadline?: string }, idx: number) => (
                                <li key={idx}>{item.task} {item.assignee && `（${item.assignee}）`} {item.deadline && `截止：${item.deadline}`}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  } catch {
                    return viewRecord.output;
                  }
                })()}
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 11, color: 'var(--ink-light)', textAlign: 'right' }}>
              时辰：{dayjs(viewRecord.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;