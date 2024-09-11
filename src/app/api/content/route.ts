import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const contentType = url.searchParams.get("content_type") || "";
  const search = url.searchParams.get("query") || "";
  const sort = url.searchParams.get("sort") || "";

  const filter: any = {};
  let orderBy: any = {};

  // Apply content type filter if provided
  if (contentType) {
    filter.content_type = { equals: contentType };
  }

  // Apply search filter (case-sensitive for now, or use lowercased approach)
  if (search) {
    filter.title = { contains: search }; // Removed 'mode' argument
  }

  // Apply sorting if "top_rated" is requested
  if (sort === "top_rated") {
    orderBy = { rating: "desc" }; // Sort by rating in descending order
  }

  try {
    // Fetch results with filter and sorting logic
    const results = await prisma.content.findMany({
      where: filter,  // Apply filters
      orderBy: orderBy || undefined,  // Apply sorting (only if provided)
      take: 10,  // Limit results to 10
    });

    return NextResponse.json({ content: results });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error fetching data", details: error},
      { status: 500 }
    );
  }
}


// const results = await prisma.$queryRaw`
//   SELECT * FROM content
//   WHERE LOWER(title) LIKE LOWER(${search})
//   LIMIT 10
// `;

