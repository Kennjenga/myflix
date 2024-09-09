import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma' // Adjust the import path as necessary

export async function GET() {
  try {
    console.log("Attempting to connect to the database...");
    
    // Fetch all records from the `content` table
    const results = await prisma.content.findMany()

    return NextResponse.json(results)

  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      {
        message: "An error occurred while fetching content",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
