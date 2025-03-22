import SwaggerUI from "swagger-ui-react";

const page = () => {    
    return (
        <div>
            <h1>API Documentation</h1>
            <SwaggerUI url="telock\app\api-docs\swagger.json" />  
        </div>
    );  
};
export default page;
