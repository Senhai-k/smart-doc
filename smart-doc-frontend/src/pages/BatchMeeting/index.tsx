import { useState } from 'react';
import { Upload, Button, Table, message, Spin, Card } from 'antd';
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { llmApi } from '@/api/llm';

const { Dragger } = Upload;

interface ProcessResult {
  filename: string;
  structured?: {
    meeting_topic?: string;
    date?: string;
    attendees?: string[];
    conclusion?: string;
    action_items?: Array<{ task: string; assignee: string; deadline: string }>;
  };
  error?: string;
}

const BatchMeetingPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProcessResult[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadProps: UploadProps = {
    name: 'files',
    multiple: true,
    accept: '.pdf,.docx,.pptx,.txt',
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
  };

  const handleProcess = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }

    const formData = new FormData();
    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('files', file.originFileObj);
      }
    });

    setLoading(true);
    try {
      const res = await llmApi.batchProcessMeeting(formData);
      setResults(res.results);
      message.success(`处理完成，共 ${res.total} 个文件`);
    } catch (_error) {
      console.error(_error);
      message.error('处理失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    const headers = ['文件名', '会议主题', '会议日期', '参会人', '结论', '待办事项'];
    const rows = results.map(r => [
      r.filename,
      r.structured?.meeting_topic || '',
      r.structured?.date || '',
      (r.structured?.attendees || []).join(';'),
      r.structured?.conclusion || '',
      (r.structured?.action_items || [])
        .map(item => `${item.task}（${item.assignee}）`)
        .join(';')
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `meeting_summary_${new Date().toISOString().slice(0, 19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('导出成功');
  };

  const columns = [
    { title: '文件名', dataIndex: 'filename', key: 'filename', width: 200 },
    { 
      title: '会议主题', 
      key: 'topic', 
      width: 200,
      render: (_: unknown, record: ProcessResult) => record.structured?.meeting_topic || '-'
    },
    { 
      title: '结论', 
      key: 'conclusion', 
      width: 250,
      render: (_: unknown, record: ProcessResult) => record.structured?.conclusion || '-'
    },
    { 
      title: '待办事项', 
      key: 'tasks', 
      width: 200,
      render: (_: unknown, record: ProcessResult) => (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {(record.structured?.action_items || []).map((item, idx) => (
            <li key={idx}>{item.task}（{item.assignee}）</li>
          ))}
        </ul>
      )
    },
    { 
      title: '状态', 
      key: 'status', 
      width: 80,
      render: (_: unknown, record: ProcessResult) => (
        record.error ? <span style={{ color: 'red' }}>失败</span> : <span style={{ color: 'green' }}>成功</span>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2>批量案卷 · 会议纪要</h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
        <p style={{ fontSize: 13, color: '#6B6258', marginTop: 12 }}>
          上传会议记录文件（PDF/Word/PPT/TXT），自动提取会议主题、结论、待办事项，导出 CSV
        </p>
      </div>

      <Card>
        <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p>拖拽或点击上传会议记录文件</p>
          <p style={{ color: '#999' }}>支持 PDF、Word、PPT、TXT 格式，可多选</p>
        </Dragger>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <Button 
            type="primary" 
            onClick={handleProcess} 
            loading={loading}
            disabled={fileList.length === 0}
          >
            批量处理
          </Button>
          {results.length > 0 && (
            <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
              导出为 CSV
            </Button>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin tip="处理中，请稍候..." />
          </div>
        )}

        {results.length > 0 && (
          <Table
            columns={columns}
            dataSource={results}
            rowKey="filename"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        )}
      </Card>
    </div>
  );
};

export default BatchMeetingPage;