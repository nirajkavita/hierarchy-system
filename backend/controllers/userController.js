const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const ALLOWED_CHILDREN = {
  ADMIN: ["COMPANY", "BRANCH", "SUPERVISOR", "EMPLOYEE"],
  COMPANY: ["BRANCH", "SUPERVISOR", "EMPLOYEE"],
  BRANCH: ["SUPERVISOR", "EMPLOYEE"],
  SUPERVISOR: ["EMPLOYEE"],
};

// CREATE — each role can create roles below it in the hierarchy
exports.createUser = async (req, res) => {
  try {
    const data = { ...req.body };
    const allowedRoles = ALLOWED_CHILDREN[req.user.role];
    if (!allowedRoles) return res.status(403).json({ message: "You cannot create users" });
    if (!allowedRoles.includes(data.role)) {
      return res.status(403).json({ message: `${req.user.role} cannot create ${data.role}` });
    }
    if (!data.password) return res.status(400).json({ message: "Password is required" });

    ["company", "branch", "supervisor"].forEach((k) => {
      if (data[k] === "" || data[k] === null) delete data[k];
    });

    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.create(data);
    const populated = await User.findById(user._id)
      .populate("company", "name email role")
      .populate("branch", "name email role")
      .populate("supervisor", "name email role");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .populate("company", "name email role")
      .populate("branch", "name email role")
      .populate("supervisor", "name email role")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("company", "name email role")
      .populate("branch", "name email role")
      .populate("supervisor", "name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    ["company", "branch", "supervisor"].forEach((k) => {
      if (data[k] === "" || data[k] === null) data[k] = null;
    });
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    else delete data.password;

    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      .populate("company", "name email role")
      .populate("branch", "name email role")
      .populate("supervisor", "name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
