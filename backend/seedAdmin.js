require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Hapus user lama (Opsional, hapus baris ini jika tidak ingin me-reset user)
    await User.deleteMany({});
    console.log('Old users cleared.');

    const salt = await bcrypt.genSalt(10);
    const hashedPasswordSuperAdmin = await bcrypt.hash('superadmin123', salt);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', salt);

    const users = [
      {
        username: 'superadmin',
        password: hashedPasswordSuperAdmin,
        role: 'superadmin'
      },
      {
        username: 'admin',
        password: hashedPasswordAdmin,
        role: 'admin'
      }
    ];

    await User.insertMany(users);
    console.log('Seed users created successfully!');
    console.log('Superadmin: superadmin / superadmin123');
    console.log('Admin: admin / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
