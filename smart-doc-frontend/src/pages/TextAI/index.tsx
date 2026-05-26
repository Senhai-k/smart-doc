import { useState } from 'react';
import { Input, Button, Select, Space, message, Row, Col, Tag } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { llmApi } from '@/api/llm';

const { TextArea } = Input;

const TextAIPage = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'sentiment' | 'keywords' | 'translate'>('summary');
  
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [keywords, setKeywords] = useState('');
  const [translation, setTranslation] = useState('');
  const [targetLang, setTargetLang] = useState('en');

  const exampleText = `人工智能是计算机科学的一个分支，旨在创建能够执行通常需要人类智能的任务的系统。这些任务包括视觉识别、语音识别、决策制定和语言翻译等。深度学习是机器学习的一个子集，它使用多层神经网络从大量数据中学习。近年来，深度学习在图像识别、自然语言处理等领域取得了突破性进展。`;

  const handleUseExample = () => {
    setInputText(exampleText);
    message.info('已载入示例文稿');
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setSentiment('');
    setKeywords('');
    setTranslation('');
    message.info('已清空');
  };

  const handleSummary = async () => {
    if (!inputText.trim()) { message.warning('请先录入文稿'); return; }
    setLoading(true);
    try {
      const res = await llmApi.summary(inputText);
      setSummary(res.result);
      message.success('摘要完成');
    } catch (error) {
      message.error('摘要失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSentiment = async () => {
    if (!inputText.trim()) { message.warning('请先录入文稿'); return; }
    setLoading(true);
    try {
      const res = await llmApi.sentiment(inputText);
      setSentiment(res.result);
      message.success('判词完成');
    } catch (error) {
      message.error('判词失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywords = async () => {
    if (!inputText.trim()) { message.warning('请先录入文稿'); return; }
    setLoading(true);
    try {
      const res = await llmApi.keywords(inputText);
      setKeywords(res.result);
      message.success('索引完成');
    } catch (error) {
      message.error('索引失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) { message.warning('请先录入文稿'); return; }
    setLoading(true);
    try {
      const res = await llmApi.translate(inputText, targetLang);
      setTranslation(res.result);
      message.success('译稿完成');
    } catch (error) {
      message.error('译稿失败');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentTag = (result: string) => {
    if (result.includes('正面') || result.includes('积极')) {
      return { color: 'success', text: result, icon: '😊' };
    } else if (result.includes('负面') || result.includes('消极')) {
      return { color: 'error', text: result, icon: '😞' };
    }
    return { color: 'warning', text: result, icon: '😐' };
  };

  const langMap: Record<string, string> = {
    en: '英语', ja: '日语', ko: '韩语', fr: '法语', de: '德语', ru: '俄语'
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontFamily: 'Georgia', fontSize: 24, fontWeight: 'normal', letterSpacing: 1 }}>
          智识工坊
        </h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#6B6258', marginTop: 12, marginBottom: 0 }}>
          从文稿中提炼摘要、判词、索引，或转译为他国文字
        </p>
      </div>

      <Row gutter={28}>
        <Col span={12}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--paper-stroke)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Georgia', fontSize: 16 }}>原稿</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="small" onClick={handleUseExample} style={{ borderRadius: 0 }}>示例</Button>
                <Button size="small" danger icon={<ClearOutlined />} onClick={handleClear} style={{ borderRadius: 0 }}>清稿</Button>
              </div>
            </div>
            <div style={{ padding: 20, flex: 1 }}>
              <TextArea
                rows={14}
                placeholder="请在此处录入或粘贴需要处理的文稿..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 15,
                  lineHeight: 1.8,
                  background: 'var(--card)',
                  border: '1px solid var(--paper-stroke)',
                  borderRadius: 0,
                  resize: 'vertical'
                }}
              />
              <div style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 12, color: '#6B6258', textAlign: 'right' }}>
                字数：{inputText.length}
              </div>
            </div>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--paper-stroke)', display: 'flex', gap: 20 }}>
              {[
                { key: 'summary', label: '摘要案卷', icon: '📄' },
                { key: 'sentiment', label: '判词倾向', icon: '😊' },
                { key: 'keywords', label: '索引标签', icon: '🏷️' },
                { key: 'translate', label: '译作副本', icon: '🌐' }
              ].map(tab => (
                <span
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    fontFamily: activeTab === tab.key ? 'Georgia' : 'monospace',
                    fontSize: 15,
                    cursor: 'pointer',
                    color: activeTab === tab.key ? '#7A5D42' : '#6B6258',
                    borderBottom: activeTab === tab.key ? '2px solid #7A5D42' : 'none',
                    paddingBottom: 8,
                    transition: 'all 0.1s'
                  }}
                >
                  {tab.icon} {tab.label}
                </span>
              ))}
            </div>

            <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
              {activeTab === 'summary' && (
                <div>
                  <Button
                    type="primary"
                    onClick={handleSummary}
                    loading={loading}
                    block
                    style={{ borderRadius: 0, height: 44, fontSize: 14, fontFamily: 'monospace' }}
                  >
                    生成摘要
                  </Button>
                  {summary && (
                    <div style={{ marginTop: 20, padding: 18, background: 'rgba(227, 217, 204, 0.3)', borderLeft: '3px solid #7A5D42' }}>
                      <div style={{ fontFamily: 'Georgia', fontSize: 15, lineHeight: 1.8, color: 'var(--ink)' }}>
                        {summary}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sentiment' && (
                <div>
                  <Button
                    type="primary"
                    onClick={handleSentiment}
                    loading={loading}
                    block
                    style={{ borderRadius: 0, height: 44, fontSize: 14, fontFamily: 'monospace' }}
                  >
                    判词分析
                  </Button>
                  {sentiment && (
                    <div style={{ marginTop: 20, textAlign: 'center', padding: 20, background: 'rgba(227, 217, 204, 0.3)' }}>
                      <Tag color={getSentimentTag(sentiment).color} style={{ borderRadius: 0, padding: '8px 24px', fontSize: 16 }}>
                        {getSentimentTag(sentiment).icon} {getSentimentTag(sentiment).text}
                      </Tag>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'keywords' && (
                <div>
                  <Button
                    type="primary"
                    onClick={handleKeywords}
                    loading={loading}
                    block
                    style={{ borderRadius: 0, height: 44, fontSize: 14, fontFamily: 'monospace' }}
                  >
                    提取索引
                  </Button>
                  {keywords && (
                    <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {keywords.split(/[，,、\s]+/).filter(k => k.trim()).map((kw, idx) => (
                        <Tag key={idx} style={{ borderRadius: 0, background: 'var(--paper-dark)', border: 'none', padding: '6px 14px', fontFamily: 'monospace', fontSize: 13 }}>
                          #{kw.trim()}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'translate' && (
                <div>
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      value={targetLang}
                      onChange={setTargetLang}
                      style={{ width: 100, borderRadius: 0 }}
                      options={Object.entries(langMap).map(([k, v]) => ({ value: k, label: v }))}
                    />
                    <Button
                      type="primary"
                      onClick={handleTranslate}
                      loading={loading}
                      style={{ flex: 1, borderRadius: 0, height: 44, fontSize: 14, fontFamily: 'monospace' }}
                    >
                      转译
                    </Button>
                  </Space.Compact>
                  {translation && (
                    <div style={{ marginTop: 20, padding: 18, background: 'rgba(227, 217, 204, 0.3)', borderLeft: '3px solid #7A5D42' }}>
                      <div style={{ fontFamily: 'Georgia', fontSize: 15, lineHeight: 1.8, color: 'var(--ink)' }}>
                        {translation}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TextAIPage;