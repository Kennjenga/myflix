import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET: Fetch content by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const numericId = Number(id); // Convert the id to a number

  if (isNaN(numericId)) {
    return NextResponse.json(
      { message: 'Invalid content ID' },
      { status: 400 }
    );
  }

  try {
    // Fetch the content from the database using Prisma
    const content = await prisma.content.findUnique({
      where: { content_id: numericId },
    });

    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while fetching content',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE: Remove content by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const numericId = Number(id); // Convert the id to a number

  if (isNaN(numericId)) {
    return NextResponse.json(
      { message: 'Invalid content ID' },
      { status: 400 }
    );
  }

  try {
    // Delete the content from the database
    const deletedContent = await prisma.content.delete({
      where: { content_id: numericId },
    });

    return NextResponse.json({ message: 'Content deleted', deletedContent });
  } catch (error) {
    console.error('Error in DELETE function:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while deleting content',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT: Update content by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const numericId = Number(id); // Convert the id to a number

  if (isNaN(numericId)) {
    return NextResponse.json(
      { message: 'Invalid content ID' },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    // Update the content in the database
    const updatedContent = await prisma.content.update({
      where: { content_id: numericId },
      data: body,
    });

    return NextResponse.json({ message: 'Content updated', updatedContent });
  } catch (error) {
    console.error('Error in PUT function:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while updating content',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
