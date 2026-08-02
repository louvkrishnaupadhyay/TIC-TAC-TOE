const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({
  username: { $exists: true, $ne: "" }
})
      .select("username wins losses draws")
      .sort({ wins: -1, losses: 1 })
      .limit(50);

    res.status(200).json(users);
  } catch (error) {
    console.error("Leaderboard error:", error);

    res.status(500).json({
      message: "Failed to load leaderboard",
    });
  }
};

module.exports = {
  getLeaderboard,
};