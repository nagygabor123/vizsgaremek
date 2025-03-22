import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const page = () => {    
    return (
        <div>
            <h1>API Documentation</h1>
            <SwaggerUI url="swagger.json" />  
        </div>
    );  
};
export default page;
