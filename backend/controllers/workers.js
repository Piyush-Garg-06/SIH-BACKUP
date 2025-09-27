import Worker from '../models/Worker.js';

export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select('-user'); // Exclude the user field
    res.json(workers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get worker profile for the logged-in user
export const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });
    if (!worker) {
      return res.status(404).json({ msg: 'Worker profile not found' });
    }
    res.json({ profile: worker });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
