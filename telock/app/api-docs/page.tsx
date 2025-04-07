import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import localFont from "next/font/local";
import Link from "next/link";

const ZenDots = localFont({
  src: "./fonts/ZenDots-Regular.ttf",
  variable: "--font-zen-dots",
  weight: "100 900",
});

const page = () => {    
    return (
        <div className="min-h-screen">
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-4 shadow-md">
                <div className="container mx-auto">
                    <Link href="/" className={`${ZenDots.className} text-3xl font-bold text-white`}>telock</Link>
                    <p className="text-xl text-blue-100 mt-1">API dokumentáció</p>
                </div>
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <SwaggerUI url="swagger.json" />
            </div>
        </div>
    );  
};
export default page;