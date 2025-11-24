const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Location = require('./models/Location');
const HistoricalEvent = require('./models/HistoricalEvent');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Location.deleteMany();
    await HistoricalEvent.deleteMany();
    console.log('Existing data cleared');

    // Read JSON files
    const locationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/sample-locations.json'), 'utf-8')
    );
    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/sample-events.json'), 'utf-8')
    );

    // Import locations
    await Location.insertMany(locationsData);
    console.log(`${locationsData.length} locations imported`);

    // Import events
    await HistoricalEvent.insertMany(eventsData);
    console.log(`${eventsData.length} historical events imported`);

    console.log('Data import complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();
