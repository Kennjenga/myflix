import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import prisma from './prisma'
 
export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
   
    try {
        const data = await prisma.users.findMany({
            where: {
              user_id: session.userId,
            },
            select: {
              user_id: true,
              username: true,
              email: true,
            },
          });
   
      const user = data[0]
   
      return user
    } catch (error) {
      return null
    }
  })