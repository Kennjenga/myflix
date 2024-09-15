import { NextResponse } from 'next/server'
import prisma  from '../../../lib/prisma' 

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params
  const numericId = Number(id) // Convert the id to a number

  if (isNaN(numericId)) {
    return NextResponse.json(
      { message: 'Invalid content ID' },
      { status: 400 }
    )
  }

  try {
    console.log(`Fetching content with ID: ${numericId}`)

    // Fetch the content from the database using Prisma
    const content = await prisma.content.findUnique({
      where: { content_id: numericId },
    })

    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error in GET function:', error)
    return NextResponse.json(
      {
        message: 'An error occurred while fetching content',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
