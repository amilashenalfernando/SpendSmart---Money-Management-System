import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * KEEP-ALIVE CRON ROUTE
 * This API route is designed to be pinged by an external cron service (like Cron-job.org).
 * Its purpose is to perform a simple database query once a day to ensure the 
 * Supabase free tier database stays active and doesn't get paused due to inactivity.
 */

export async function GET(request: Request) {
  // 1. (Optional) Security Check
  // You can set a CRON_SECRET in your .env and check it here to prevent 
  // random people from hitting this route.
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Perform activity
    // We just need to trigger a SQL request. Counting users is perfect.
    const userCount = await prisma.user.count();
    
    console.log(`[Cron] Database pinged successfully. Current user count: ${userCount}`);

    return NextResponse.json({ 
      status: "success", 
      message: "Database pinged successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[Cron] Database ping failed:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Database ping failed" 
    }, { status: 500 });
  }
}
