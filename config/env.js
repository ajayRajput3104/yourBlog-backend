import dotenv from "dotenv";
dotenv.config();

const env={
    accessTokenSecret:String(process.env.ACCESS_TOKEN_SECRET),
    refreshTokenSecret:String(process.env.REFRESH_TOKEN_SECRET),
    saltRounds:Number(process.env.SALT_ROUNDS),
    port:Number(process.env.PORT),
    jwtExpiration:String(process.env.JWT_EXPIRATION),
    refreshTokenExpiration:String(process.env.REFRESH_TOKEN_EXPIRATION),
    mongoUri:String(process.env.MONGO_URI),
    mongoDbName:String(process.env.MONGO_DB_NAME),
    cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
    cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
    cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
    frontendOrigin:String(process.env.FRONTEND_ORIGIN)
}

export default env

