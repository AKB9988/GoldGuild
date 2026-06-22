import React from 'react';
import Register from './pages/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard.jsx";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Register />
      <Login />
      <Dashboard />

    </QueryClientProvider>
  );
}

export default App;