
import mongoose from 'mongoose';

export const cleanDB = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).send('This operation is not allowed in production');
  }
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    res.send('All collections deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
