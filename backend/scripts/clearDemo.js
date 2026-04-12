require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const CoordinatorProfile = require('../models/CoordinatorProfile');
const CoordinatorActivityLog = require('../models/CoordinatorActivityLog');
const CoordinatorTask = require('../models/CoordinatorTask');
const Interview = require('../models/Interview');
const PrepResource = require('../models/PrepResource');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/applywise_db';
const BATCH_NAME = 'youtube_demo_1';
const DEMO_TAG = { isDemoData: true, demoBatch: BATCH_NAME };

const clearDemo = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    console.log(`🧹 Scraping all records tagged with demoBatch: ${BATCH_NAME}...`);

    const collections = [
      { model: User, name: 'Users' },
      { model: Student, name: 'Students' },
      { model: Job, name: 'Jobs' },
      { model: Application, name: 'Applications' },
      { model: Notification, name: 'Notifications' },
      { model: CoordinatorProfile, name: 'Coordinator Profiles' },
      { model: CoordinatorActivityLog, name: 'Activity Logs' },
      { model: CoordinatorTask, name: 'Tasks' },
      { model: Interview, name: 'Interviews' },
      { model: PrepResource, name: 'Prep Resources' }
    ];

    for (const { model, name } of collections) {
      const result = await model.deleteMany(DEMO_TAG);
      if (result.deletedCount > 0) {
        console.log(`  🗑 Deleted ${result.deletedCount} demo record(s) from ${name}.`);
      }
    }

    console.log('\n✨ Demo cleanup complete! Your database is back to its organic state. ✨');
    process.exit(0);

  } catch (error) {
    console.error('❌ Demo cleanup failed:', error);
    process.exit(1);
  }
};

clearDemo();
