import { useState } from 'react';
import { Upload, Button, Spin, message, Image, Row, Col } from 'antd';
import { InboxOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { ocrApi } from '@/api/ocr';

const { Dragger } = Upload;

const OCRPage = () => {
  const [loading, setLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadProps: UploadProps = {
    name: 'image',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只接受影像文件');
        return false;
      }
      return true;
    },
    onChange: ({ file, fileList: newFileList }) => {
      setFileList(newFileList);
      if (file.status === 'removed') {
        setImageUrl('');
        setRecognizedText('');
        return;
      }
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
        reader.readAsDataURL(file.originFileObj);
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      setLoading(true);
      setRecognizedText('');
      const formData = new FormData();
      formData.append('image', file as File);
      
      try {
        const res = await ocrApi.recognize(formData);
        setRecognizedText(res.text);
        message.success('誊录完成');
        onSuccess?.(res);
      } catch (error) {
        message.error('誊录失败，请重试');
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recognizedText);
      message.success('已誊抄至剪贴板');
    } catch {
      message.error('誊抄失败');
    }
  };

  const handleClear = () => {
    setRecognizedText('');
    setImageUrl('');
    setFileList([]);
  };

  const handleDownload = () => {
    const blob = new Blob([recognizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `誊录_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('已提取卷宗');
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontFamily: 'Georgia', fontSize: 22, fontWeight: 'normal', letterSpacing: 1 }}>
          影像誊录
        </h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
        <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginTop: 12, marginBottom: 0 }}>
          将图像中的文字转录为可编辑的档案副本
        </p>
      </div>

      <Row gutter={28}>
        {/* 左侧：上传区 */}
        <Col span={10}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--paper-stroke)', fontFamily: 'Georgia', fontSize: 15 }}>
              待誊影像
            </div>
            <div style={{ padding: 24 }}>
              <Dragger {...uploadProps} disabled={loading} style={{ background: 'rgba(253, 249, 244, 0.5)', borderStyle: 'dashed' }}>
                <p style={{ fontSize: 40, marginBottom: 12, opacity: 0.6 }}>📄</p>
                <p style={{ fontFamily: 'monospace', fontSize: 13 }}>拖拽或点击提交案卷影像</p>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' }}>支持 JPG, PNG, GIF · 单件不超过10MB</p>
              </Dragger>
              
              {imageUrl && !loading && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <Image
                    src={imageUrl}
                    alt="预览"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', border: '1px solid var(--paper-stroke)' }}
                  />
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* 右侧：结果区 */}
        <Col span={14}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--paper-stroke)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Georgia', fontSize: 15 }}>档案副本</span>
              {recognizedText && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} style={{ borderRadius: 0 }}>誊抄</Button>
                  <Button size="small" icon={<DownloadOutlined />} onClick={handleDownload} style={{ borderRadius: 0 }}>提取</Button>
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={handleClear} style={{ borderRadius: 0 }}>废弃</Button>
                </div>
              )}
            </div>
            <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Spin size="large" />
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginTop: 16 }}>正在誊录，请稍候...</div>
                </div>
              ) : recognizedText ? (
                <pre style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  margin: 0,
                  color: 'var(--ink)'
                }}>
                  {recognizedText}
                </pre>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'monospace', fontSize: 13, color: '#9E9E9E' }}>
                  暂无副本，请先提交影像
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OCRPage;