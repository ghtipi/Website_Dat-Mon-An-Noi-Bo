import React from "react";
import { BrowserRouter } from "react-router-dom";  // import thêm
import AppRoutes from "./Routes/AppRoutes";
import 'bootstrap-icons/font/bootstrap-icons.css';

const App: React.FC = () => {
  return (
    <BrowserRouter> {/* Bọc ở đây */}
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-grow p-6 overflow-auto">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
