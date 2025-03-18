import { MongoClient } from "mongodb";
import 'dotenv/config';

const connectDB = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        console.log("MongoDB'ye başarıyla bağlanıldı.");
        return client.db();  // Veritabanını döndür
    } catch (err) {
        console.error("MongoDB bağlantısı hatası:", err);
        throw err;
    }
};




export { connectDB };
