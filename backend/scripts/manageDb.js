import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Grievance from "../models/Grievance.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // 1. Check if they already exist to avoid duplicates
    const studentEmail = "student.lenni@university.edu";
    const officerEmail = "officer.cooper@university.edu";

    // Delete them if they exist so we can reset their passwords/roles fresh
    await User.deleteMany({ email: { $in: [studentEmail, officerEmail] } });

    // 2. Create the Demo Users
    const users = [
      {
        name: "Lenni Student",
        email: studentEmail,
        password: "Pass@1234", // Model will hash this automatically
        role: "student",
      },
      {
        name: "Officer Cooper",
        email: officerEmail,
        password: "Pass@1234", // Model will hash this automatically
        role: "officer",
      },
    ];

    await User.create(users);

    console.log("✅ Demo Users Seeded Successfully!");
    console.log("   - student.lenni@university.edu");
    console.log("   - officer.cooper@university.edu");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const listData = async () => {
  const users = await User.find({});
  const grievances = await Grievance.find({});

  console.log("\n--- USERS ---");
  users.forEach((u) => console.log(`- ${u.name} (${u.role}) | ${u.email}`));

  console.log("\n--- GRIEVANCES ---");
  grievances.forEach((g) =>
    console.log(`- [${g.status}] ${g.title} (By: ${g.student})`)
  );

  console.log("\n-----------------");
  process.exit();
};

const destroyData = async () => {
  try {
    await Grievance.deleteMany();
    await User.deleteMany();
    console.log("Data Destroyed! 💥");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Handle command line args
connectDB().then(() => {
  if (process.argv[2] === "-d") {
    destroyData();
  } else if (process.argv[2] === "-s") {
    seedData();
  } else {
    listData();
  }
});
