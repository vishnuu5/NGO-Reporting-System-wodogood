import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReportForm from "./pages/ReportForm";
import BulkUpload from "./pages/BulkUpload";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl sm:text-2xl font-bold text-primary">
                  NGO Reporting
                </h1>
                <div className="hidden md:flex space-x-4">
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Submit Report
                  </Link>
                  <Link
                    to="/bulk-upload"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Bulk Upload
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:hidden flex space-x-2 pb-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-xs font-medium transition-colors"
              >
                Submit Report
              </Link>
              <Link
                to="/bulk-upload"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-xs font-medium transition-colors"
              >
                Bulk Upload
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-xs font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<ReportForm />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
