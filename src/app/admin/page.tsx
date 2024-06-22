"use client"
import { redirect } from "next/navigation";
import WorkingHoursTable from "./WorkingHoursTable";
import { useSession } from "next-auth/react";

const Home =  () => {
  const { data,status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/admin/auth")
    },
  })
  console.log({data})
  if (status === "loading") {
    return "Loading"
  }

    return (

    <section className="bg-gradient-to-r from-white/95 to-red-100/5 py-8 sm:py-16" aria-labelledby="hero-heading">
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 items-center">
      <WorkingHoursTable/>
      
        </div>
      </div>
    </section>
    )
}
export default Home;