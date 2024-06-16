import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInForm from "./Form";

const Home = async () => {
    const session = await getServerSession(authOptions);
    if (session && session.admin && session.admin.isAdmin )
        redirect("/admin")
    return (

    <SignInForm/>
    )
}
export default Home;