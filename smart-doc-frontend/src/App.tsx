import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LoginPage from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import OCRPage from './pages/OCR';
import TextAIPage from './pages/TextAI';
import HistoryPage from './pages/History';
import UserManagePage from './pages/UserManage';
import OperationLogPage from './pages/OperationLog';
import BatchMeetingPage from './pages/BatchMeeting';

const queryClient = new QueryClient();

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ocr" element={<OCRPage />} />
                  <Route path="/text-ai" element={<TextAIPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/user-manage" element={<UserManagePage />} />
                  <Route path="/operation-log" element={<OperationLogPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/batch-meeting" element={<BatchMeetingPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;