import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nextfile.local";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      email: admin.email,
    });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin user", details: error.message },
      { status: 500 }
    );
  }
}
