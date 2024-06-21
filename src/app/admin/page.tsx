import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Logout from "./Logout";
import Send from "./Send";

const Home = async () => {
    const session = await getServerSession(authOptions);
    if (!session || ! session.admin || ! session.admin.isAdmin ) redirect("/admin/auth")
    
    return (

    <section className="bg-gradient-to-r from-white/95 to-red-100/5 py-8 sm:py-16" aria-labelledby="hero-heading">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 items-center">
            <Send/>
            <Logout/>
        </div>
      </div>
    </section>
    )
}
export default Home;