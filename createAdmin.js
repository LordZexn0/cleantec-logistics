require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/cleantec_promo', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create admin account
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new Admin({
            username: 'admin',
            password: hashedPassword,
            email: 'admin@cleantec.com',
            notificationPreferences: {
                emailNotifications: true
            }
        });

        await admin.save();
        console.log('Admin account created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin account:', error);
        process.exit(1);
    }
};

createAdmin(); 