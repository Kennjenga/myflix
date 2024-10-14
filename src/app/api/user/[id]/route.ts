// src/app/api/users/[email]/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

//update by id
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const userId = Number(params.id);
    const body = await request.json();
  
    try {
      const user = await prisma.users.update({
        where: { user_id: userId },
        data: {
          username: body.username,
          email: body.email,
          phone_number: body.phone_number,
          firstname: body.firstname,
          lastname: body.lastname,
          updated_at: new Date(),
        },
      });
  
      return NextResponse.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  //delete by id 
  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const userId = Number(params.id);
  
    try {
      await prisma.users.delete({
        where: { user_id: userId },
      });
  
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
