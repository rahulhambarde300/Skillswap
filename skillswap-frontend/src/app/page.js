//import LoginForm from "@/components/loginform";
import Header from "@/components/layout/header";
import LandingPage from "@/components/landingpage";
//import Sidebar from "@/components/layout/sidebar";
import Hero from "@/components/hero";

export default function Home() {
  const props = "This is props";
  

  return (
    <section className="">
      <>
        <Header />
        <Hero/>
        <LandingPage/>
       </>
    </section>

  );
}
