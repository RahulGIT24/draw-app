import Redis from "ioredis"

const redis = new Redis({
    host:process.env.REDIS_HOST,
    password:process.env.REDIS_PASS,
    port:Number(process.env.REDIS_PORT) | 6379
})

redis.on('connect',()=>console.log("Connected to redis"))
redis.on('error',(err:any)=>console.log("Error while connecting to redis ",err))

export default redis