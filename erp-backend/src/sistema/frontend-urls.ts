let FRONTEND_URL;
if(process.env.PROD_ENV === 'TRUE'){
    FRONTEND_URL = `https://${process.env.FRONTEND_PROXY}`;
}else{
    FRONTEND_URL =  `http://localhost:${process.env.FRONTEND_PORT}`;
}
export default FRONTEND_URL as string;