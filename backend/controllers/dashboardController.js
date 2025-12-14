import Report from "../models/Report.js";

export const getDashboardData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Month must be in YYYY-MM format" });
    }
    const reports = await Report.find({ month });
    const totalNGOs = reports.length;
    const totalPeopleHelped = reports.reduce(
      (sum, report) => sum + report.peopleHelped,
      0
    );
    const totalEvents = reports.reduce(
      (sum, report) => sum + report.eventsConducted,
      0
    );
    const totalFunds = reports.reduce(
      (sum, report) => sum + report.fundsUtilized,
      0
    );
    const ngoBreakdown = reports.map((report) => ({
      ngoId: report.ngoId,
      peopleHelped: report.peopleHelped,
      eventsConducted: report.eventsConducted,
      fundsUtilized: report.fundsUtilized,
    }));

    res.status(200).json({
      month,
      totalNGOs,
      totalPeopleHelped,
      totalEvents,
      totalFunds,
      ngoBreakdown,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
