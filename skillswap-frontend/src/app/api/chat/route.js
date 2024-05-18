import { fetchRedis } from '@/util/fetchredis';
import {z} from 'zod';
import { useRedis } from '@/util/db'
export async function POST(req) {
    const db = useRedis();
    try {
        const body = await req.json()
    
        const { email: emailToAdd } = z.object({ email: z.string() }).parse(body)
        const { signedUserEmail: signedUpEmailToAdd } = z.object({ signedUserEmail: z.string() }).parse(body)

        // verify both users are not already friends
        const isAlreadyFriends = await fetchRedis(
            'sismember',
            `user:${signedUpEmailToAdd}:friends`,
            emailToAdd
        );

        if (isAlreadyFriends) {
            return new Response('Already friends', { status: 200 })
        }

        await db.sadd(`user:${signedUpEmailToAdd}:friends`, emailToAdd);
        await db.sadd(`user:${emailToAdd}:friends`, signedUpEmailToAdd);


        return new Response('OK', {status: 200});
    }catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
          }
      
          return new Response('Invalid request', { status: 200 })
    }
    
}