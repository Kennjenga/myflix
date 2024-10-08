import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const contentType = url.searchParams.get("content_type") || "";
  const search = url.searchParams.get("query") || "";
  const sort = url.searchParams.get("sort") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("limit") || "12");

  const filter: any = {};
  let orderBy: any = {};

  if (contentType) {
    filter.content_type = { equals: contentType };
  }

  if (search) {
    filter.title = { contains: search };
  }

  if (sort === "top_rated") {
    orderBy = { rating: "desc" };
  }

  try {
    const totalItems = await prisma.content.count({
      where: filter,
    });

    const results = await prisma.content.findMany({
      where: filter,
      orderBy: orderBy || undefined,
      take: pageSize,
      skip: (page - 1) * pageSize, // Pagination logic
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json({
      content: results,
      totalPages: totalPages,
      currentPage: page,
      totalItems: totalItems
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error fetching data", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, release_date, genre, rating, content_type, duration, episodes ,image_url} = await request.json();

    // Data validation
    if (!title || !rating || !content_type) {
      return NextResponse.json({ error: "Title, Rating, and Type are required fields." }, { status: 400 });
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        release_date: new Date(release_date),
        genre,
        rating,
        content_type: content_type,
        duration: content_type === 'movie' ? duration : null,
        episodes: content_type === 'tv_show' ? episodes : null,
        image_url,
      }
    });


    return NextResponse.json({ content: newContent });
  } catch (error) {
    console.error("Erqaror creating content:", error);
    return NextResponse.json({ error: "Errpor creating content" }, { status: 500 });
  }
}

// //update content
// export async function PUT(request: Request) {
//   const { content_id, title, description, releaseDate, genre, rating, content_type, duration, episodes } = await request.json();

//   if (!content_id) return NextResponse.json({ error: "Content ID is required." }, { status: 400 });

//   try {
//     const updatedContent = await prisma.content.update({
//       where: { content_id },
//       data: {
//         title,
//         description,
//         release_date: new Date(releaseDate),
//         genre,
//         rating,
//         content_type: type,
//         duration: type === 'movie' ? duration : null,
//         episodes: type === 'tv_show' ? episodes : null,
//       },
//     });

//     return NextResponse.json({ content: updatedContent });
//   } catch (error) {
//     console.error("Error updating content:", error);
//     return NextResponse.json({ error: "Error updating content" }, { status: 500 });
//   }
// }

// //delete content
// export async function DELETE(request: Request) {
//   const content_id = Number(new URL(request.url).searchParams.get("id") || "");

//   if (!content_id) return NextResponse.json({ error: "Content ID is required." }, { status: 400 });

//   try {
//     await prisma.content.delete({
//       where: { content_id },
//     });
//     return NextResponse.json({ message: "Content deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting content:", error);
//     return NextResponse.json({ error: "Error deleting content" }, { status: 500 });
//   }
// }


// const results = await prisma.$queryRaw`
//   SELECT * FROM content
//   WHERE LOWER(title) LIKE LOWER(${search})
//   LIMIT 10
// `;

