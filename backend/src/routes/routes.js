const express = require('express');
const fs = require('fs');
const Application = require('../models/applications');
const { protect } = require('../middleware/auth');
const router = express.Router();


// Load mock data (Aadhar DB)
let mockAadhar = [];
try {
  mockAadhar = JSON.parse(fs.readFileSync('./data/aadhar.json', 'utf8'));
} catch (err) {
  console.error('Error loading mock Aadhar:', err);
}


// Helper: Calculate subsidy percentage based on income
function calculateSubsidy(income) {
  if (income === 0) return 50;
  if (income <= 25000) return 40;
  if (income <= 50000) return 30;
  if (income <= 75000) return 20;
  if (income <= 100000) return 10;
  return 0;  // Ineligible
}

// POST: User applies with Aadhar (validates from mock, calculates subsidy)
router.post('/apply', async (req, res) => {
  const { aadhar, name, income } = req.body;
  if (!aadhar?.toString().trim() || !name?.toString().trim() || income === undefined || income === null || income === '') {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Find user in mock Aadhar DB
  const userData = mockAadhar.find(u => u.aadhar === aadhar);
  if (!userData) return res.status(400).json({ error: 'Invalid Aadhar number' });
  if (userData.name !== name) {
    return res.status(400).json({ error: 'Name does not match Aadhar records' });
  }
   if (userData.income !== Number(income)) {
    return res.status(400).json({ error: 'Income does not match Aadhar records' });
  }

  if (Number(income) > 100000) return res.status(400).json({ error: 'Income exceeds eligibility limit (1 LPA)' });

  const subsidy = calculateSubsidy(income);

  try {
    // Check for duplicate application
    const existing = await Application.findOne({ aadhar });
    if (existing) return res.status(400).json({ error: 'Application already submitted for this Aadhar' });

    // Create new application
    const application = new Application({ aadhar, name, income, subsidy });
    await application.save();
    res.json({ message: 'Application submitted successfully', applicationId: application._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during application submission' });
  }
});

// GET: User checks status by Aadhar
router.get('/status/:aadhar', async (req, res) => {
  try {
    const application = await Application.findOne({ aadhar: req.params.aadhar });
    if (!application) return res.status(404).json({ error: 'Application not found' });

    res.json(application);  // Returns full details: status, subsidy, setupDate, officerInfo, rejectReason, etc.
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching status' });
  }
});

// GET: Govt lists all applications
router.get('/applications', protect ,async (req, res) => {
  try {
    const applications = await Application.find({});
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error listing applications' });
  }
});

// PUT: Govt approves or rejects by application ID
router.put('/applications/:id',protect , async (req, res) => {
  const { status, rejectReason, officerInfo } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status (must be Approved or Rejected)' });
  }

  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    if (status === 'Approved') {
      application.status = 'Approved';
      application.setupDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days
      application.officerInfo = officerInfo || 'Unknown';
      application.subsidy = calculateSubsidy(application.income);
    } else if (status === 'Rejected') {
      if (!rejectReason) {
        return res.status(400).json({ error: 'rejectReason required for rejection' });
      }
      application.status = 'Rejected';
      application.rejectReason = rejectReason;
      application.officerInfo = officerInfo || 'Unknown';
    }

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating application' });
  }
});

module.exports = router;