import { cookies } from "next/headers";
import NotificationSetting from "@/components/settings";

export default async function Settings() {
  const cookieStore = cookies();
  let token = cookieStore.get("token");
  token = token.value;
  const data = await getUserDetails(token);

  async function updateSettings(updatedData, token) {
    "use server";
    const resPost = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/details/update",
      {
        method: "POST",
        body: JSON.stringify(
          updatedData,
        ),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (resPost.ok) {
      const json = await resPost.json();
      console.log(updatedData);
    }
  }
  return (
    <>
      <NotificationSetting token={token} data={data} update={updateSettings} />
    </>
  );
}

async function getUserDetails(token) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/test",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  if (res.ok) {
    const resGet = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/details",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (resGet.ok) {
      const json = await resGet.json();
      console.log(json);
      return json;
    } else {
      console.log("Data not fetched");
    }
  }
}
