import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const page = () => {    
    return (
        <div className="min-h-screen">
            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 py-6 px-4 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-white">telock</h1>
                    <p className="text-xl text-blue-100 mt-1">API dokumentáció</p>
                </div>
            </div>
            
            {/* Swagger UI */}
            <div className="container mx-auto px-4 py-8">
                <SwaggerUI url="swagger.json" />
            </div>
        </div>
    );  
};
export default page;