import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Perform a simple database query to count as activity
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: "alive", 
      timestamp: new Date().toISOString(),
      message: "Database activity recorded"
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "error", 
      message: "Failed to ping database" 
    }, { status: 500 });
  }
}
