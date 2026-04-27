const Query = require('../models/Query');

exports.submitQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const newQuery = await Query.create({ name, email, subject, message });
    res.status(201).json({ message: 'Query submitted successfully', query: newQuery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQueryStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;

    const query = await Query.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(query);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json({ message: 'Query deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
