import { fetchRedis } from "../fetchredis"

export const getFriendsByEmail = async (email) => {
    const friendEmails = await fetchRedis('smembers', `user:${email}:friends`);

    const friends = await Promise.all(
        friendEmails.map(async(friendemail) => {
            //const friend = await fetchRedis('get', `user:${email}`);
            const res = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/user/details?email=${friendemail}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
              );
            if(res.ok){
                const friend = res.json();
                return friend;
            }
        })
    );  


    return friends;
}