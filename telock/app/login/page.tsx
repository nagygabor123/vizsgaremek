
import { getServerSession } from "next-auth";
import Form from "./form";
import { redirect } from "next/navigation";


export default async function LoginPage(){

    const session = await getServerSession();
    if(session){
      redirect("/dashboard/school/logs")
    }
    return(
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Form />
      </div>
    </div>
    )
}