
import { getServerSession } from "next-auth";
import Form from "./form";
import { redirect } from "next/navigation";
import localFont from "next/font/local";

const ZenDots = localFont({
  src: "../fonts/ZenDots-Regular.ttf",
  variable: "--font-zen-dots",
  weight: "100 900",
});

export default async function LoginPage() {

  const session = await getServerSession();
  if (session) {
    redirect("/dashboard")
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <span className={`${ZenDots.className} text-xl`}>
            telock
          </span>
        </a>
        <Form />
      </div>
    </div>
  )
}