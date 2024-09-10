import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const contentType = url.searchParams.get("content_type") || "";
  const search = url.searchParams.get("query") || "";
  const sort = url.searchParams.get("sort") || "";

  const filter: any = {};
  if (contentType) filter.content_type = { equals: contentType }; // Enums should use equals
  if (search) filter.title = { contains: search, mode: "insensitive" };

  let orderBy: any = {};
  if (sort === "top_rated") {
    orderBy = { rating: "desc" };
  }

  try {
    const results = await prisma.content.findMany({
      where: filter,
      orderBy: orderBy,
      take: 10, // Limit results for dropdown
    });

    return NextResponse.json({
      content: results,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
