import Header from "@/components/layout/header";
import LoginForm from "@/components/loginform";
import { cookies } from "next/headers";


export default function SignIn() {

  
  async function getToken(token)
  {
    "use server";
      cookies().set('token', token);
  }

  return (
    <>
    <Header/>
    <LoginForm  getToken={getToken}/>
    </>
  );
}
