import pkg from "pg"
const {Pool} = pkg

export const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false,
    },
    family:4,
    
} as any)


export const connectDB = async() =>{
    try {
        const client = await pool.connect()
        console.log("✅ PostgresSql connected")

        await client.query("SELECT 1")
        client.release()
    } catch (error) {
        console.error("❌ PostgreSQL connection failed",error)
        process.exit(1)
    }
}


