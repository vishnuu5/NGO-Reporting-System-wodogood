import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ReportForm() {
  const [formData, setFormData] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(`${API_URL}/api/report`, {
        ngoId: formData.ngoId,
        month: formData.month,
        peopleHelped: Number.parseInt(formData.peopleHelped),
        eventsConducted: Number.parseInt(formData.eventsConducted),
        fundsUtilized: Number.parseFloat(formData.fundsUtilized),
      });

      setMessage({ type: "success", text: "Report submitted successfully!" });
      setFormData({
        ngoId: "",
        month: "",
        peopleHelped: "",
        eventsConducted: "",
        fundsUtilized: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to submit report",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Submit Monthly Report
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="ngoId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              NGO ID *
            </label>
            <input
              type="text"
              id="ngoId"
              name="ngoId"
              value={formData.ngoId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g., NGO001"
            />
          </div>

          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Month *
            </label>
            <input
              type="month"
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="peopleHelped"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              People Helped *
            </label>
            <input
              type="number"
              id="peopleHelped"
              name="peopleHelped"
              value={formData.peopleHelped}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Number of people"
            />
          </div>

          <div>
            <label
              htmlFor="eventsConducted"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Events Conducted *
            </label>
            <input
              type="number"
              id="eventsConducted"
              name="eventsConducted"
              value={formData.eventsConducted}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Number of events"
            />
          </div>

          <div>
            <label
              htmlFor="fundsUtilized"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Funds Utilized (₹) *
            </label>
            <input
              type="number"
              id="fundsUtilized"
              name="fundsUtilized"
              value={formData.fundsUtilized}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Amount in rupees"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="spinner mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;
