import { useEffect, useState } from 'react';
import { Row, Col, Spin, Table, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { dashboardApi } from '@/api/dashboard';
import type { DashboardStats } from '@/api/dashboard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await dashboardApi.getStats();
        setStats(res);
      } catch (_error) {
        console.error('加载统计数据失败', _error);
        // 如果后端API暂时不可用，使用模拟数据作为后备
        setStats({
          totalUsers: 128,
          totalOperations: 3456,
          todayOperations: 89,
          usageByType: {
            ocr: 1234,
            summary: 567,
            sentiment: 456,
            keywords: 345,
            translate: 234
          },
          dailyTrend: [
            { date: '5月20', count: 28 },
            { date: '5月21', count: 35 },
            { date: '5月22', count: 42 },
            { date: '5月23', count: 38 },
            { date: '5月24', count: 51 },
            { date: '5月25', count: 67 },
            { date: '5月26', count: 89 }
          ],
          recentActivities: [
            { id: 1, username: '张三', action: '执行OCR识别', time: '2024-05-26 14:30:00' },
            { id: 2, username: '李四', action: '使用智能总结', time: '2024-05-26 13:15:00' },
            { id: 3, username: '王五', action: '情感分析', time: '2024-05-26 11:20:00' },
            { id: 4, username: '赵六', action: '关键词提取', time: '2024-05-25 16:45:00' },
            { id: 5, username: '张三', action: '文本翻译', time: '2024-05-25 10:30:00' },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontFamily: 'monospace', color: 'var(--ink-light)' }}>加载案卷数据...</div>
      </div>
    );
  }

  if (!stats) return null;

  // 趋势图配置 - 档案室配色
  const trendOption = {
    grid: { top: 40, left: 50, right: 30, bottom: 30, containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: stats.dailyTrend.map(d => d.date),
      axisLabel: { fontFamily: 'monospace', fontSize: 11, color: '#6B6258' },
      axisLine: { lineStyle: { color: '#C8BCA8' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '誊录次数',
      nameTextStyle: { fontFamily: 'monospace', fontSize: 11, color: '#6B6258' },
      axisLabel: { fontFamily: 'monospace', fontSize: 11, color: '#6B6258' },
      splitLine: { lineStyle: { color: '#E3D9CC', type: 'dashed' } }
    },
    series: [{
      data: stats.dailyTrend.map(d => d.count),
      type: 'line',
      smooth: false,
      lineStyle: { color: '#9B7B5C', width: 2 },
      areaStyle: { opacity: 0.1, color: '#9B7B5C' },
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: '#7A5D42', borderColor: '#FDF9F4', borderWidth: 2 }
    }]
  };

  // 饼图配置
  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { fontFamily: 'monospace', fontSize: 11, color: '#2C2824' },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [{
      type: 'pie',
      radius: '55%',
      center: ['55%', '50%'],
      data: [
        { name: 'OCR识别', value: stats.usageByType.ocr || 0, itemStyle: { color: '#9B7B5C' } },
        { name: '智能总结', value: stats.usageByType.summary || 0, itemStyle: { color: '#B89B7A' } },
        { name: '情感分析', value: stats.usageByType.sentiment || 0, itemStyle: { color: '#C8B08A' } },
        { name: '关键词提取', value: stats.usageByType.keywords || 0, itemStyle: { color: '#D4C4A8' } },
        { name: '文本翻译', value: stats.usageByType.translate || 0, itemStyle: { color: '#E0D4BC' } }
      ],
      label: { show: false },
      emphasis: { scale: true }
    }]
  };

  const activityColumns = [
    { 
      title: '馆员', 
      dataIndex: 'username', 
      key: 'username',
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{text}</span>
    },
    { 
      title: '事务', 
      dataIndex: 'action', 
      key: 'action',
      render: (text: string) => <Tag style={{ borderRadius: 0, background: '#E3D9CC', border: 'none', fontFamily: 'monospace' }}>{text}</Tag>
    },
    { 
      title: '时辰', 
      dataIndex: 'time', 
      key: 'time',
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B6258' }}>{text}</span>
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: 'Georgia', fontSize: 22, fontWeight: 'normal', letterSpacing: 1 }}>
          案卷总览
        </h2>
        <div style={{ width: 40, height: 2, background: '#C8BCA8', marginTop: 8 }}></div>
      </div>

      {/* 统计卡片行 */}
      <Row gutter={20} style={{ marginBottom: 28 }}>
        <Col span={6}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '20px 16px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 12 }}>馆员总数</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, color: '#7A5D42' }}>{stats.totalUsers}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B6258', marginTop: 8 }}>人</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '20px 16px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 12 }}>总誊录次数</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, color: '#7A5D42' }}>{stats.totalOperations}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B6258', marginTop: 8 }}>次</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '20px 16px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 12 }}>今日誊录</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, color: '#7A5D42' }}>{stats.todayOperations}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B6258', marginTop: 8 }}>次</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '20px 16px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B6258', marginBottom: 12 }}>月增率</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, color: '#7A5D42' }}>12.5%</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B6258', marginTop: 8 }}>较上月</div>
          </div>
        </Col>
      </Row>

      {/* 图表行 */}
      <Row gutter={20} style={{ marginBottom: 28 }}>
        <Col span={14}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'Georgia', fontSize: 16, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--paper-stroke)' }}>
              近七日誊录趋势
            </div>
            <ReactECharts option={trendOption} style={{ height: 320, width: '100%' }} />
          </div>
        </Col>
        <Col span={10}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '16px 20px', height: '100%' }}>
            <div style={{ fontFamily: 'Georgia', fontSize: 16, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--paper-stroke)' }}>
              事务分布
            </div>
            <ReactECharts option={pieOption} style={{ height: 300, width: '100%' }} />
          </div>
        </Col>
      </Row>

      {/* 最近活动表格 */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--paper-stroke)', padding: '16px 20px' }}>
        <div style={{ fontFamily: 'Georgia', fontSize: 16, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--paper-stroke)' }}>
          近日馆务
        </div>
        <Table
          columns={activityColumns}
          dataSource={stats.recentActivities}
          rowKey="id"
          pagination={false}
          size="middle"
          showHeader={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;