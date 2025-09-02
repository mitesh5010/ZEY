const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  aadhar: { type: String, required: true, unique: true },  // Unique
  name: { type: String, required: true },  // Name of the applicant as per aadhar
  income: {type: Number, required: true },  // Annual income
  status: { type: String, default: 'pending' }, 
  subsidy: { type: Number, default: 0 },  // Calculated based on income
  setupDate: { type: Date },  // For approved
  officerInfo: { type: String },
  rejectReason: { type: String }  // For rejected
});

module.exports = mongoose.model('Application', applicationSchema);