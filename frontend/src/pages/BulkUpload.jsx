import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    } else {
      setMessage({ type: "error", text: "Please select a valid CSV file" });
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_URL}/api/reports/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setJobId(response.data.jobId);
      setMessage({
        type: "success",
        text: `Upload started! Job ID: ${response.data.jobId}`,
      });
      setFile(null);
      document.getElementById("file-input").value = null;
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to upload file",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/job-status/${jobId}`);
        setJobStatus(response.data);

        if (
          response.data.status === "completed" ||
          response.data.status === "failed"
        ) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  const downloadSampleCSV = () => {
    const csvContent = `ngoId,month,peopleHelped,eventsConducted,fundsUtilized
NGO001,2024-01,150,5,50000
NGO002,2024-01,200,8,75000
NGO003,2024-01,100,3,30000`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Bulk Report Upload
        </h2>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-900 mb-2">CSV Format:</h3>
          <p className="text-sm text-blue-800 mb-3">
            Your CSV file should have the following columns: ngoId, month,
            peopleHelped, eventsConducted, fundsUtilized
          </p>
          <button
            onClick={downloadSampleCSV}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Download Sample CSV
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select CSV File *
            </label>
            <input
              type="file"
              id="file-input"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="spinner mr-2"></div>
                Uploading...
              </>
            ) : (
              "Upload CSV"
            )}
          </button>
        </form>

        {jobStatus && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Job Progress</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Job ID:
                </span>
                <span className="text-sm text-gray-900 font-mono">{jobId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    jobStatus.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : jobStatus.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : jobStatus.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {jobStatus.status.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Progress:
                </span>
                <span className="text-sm text-gray-900">
                  {jobStatus.processedRows} / {jobStatus.totalRows} rows
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${
                      (jobStatus.processedRows / jobStatus.totalRows) * 100
                    }%`,
                  }}
                ></div>
              </div>

              {jobStatus.successCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Successful:
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {jobStatus.successCount}
                  </span>
                </div>
              )}

              {jobStatus.failedCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Failed:
                  </span>
                  <span className="text-sm text-red-600 font-semibold">
                    {jobStatus.failedCount}
                  </span>
                </div>
              )}

              {jobStatus.errors && jobStatus.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-red-700 mb-2">
                    Errors:
                  </h4>
                  <div className="max-h-40 overflow-y-auto bg-red-50 rounded p-3 space-y-1">
                    {jobStatus.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-800">
                        Row {error.row}: {error.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkUpload;
