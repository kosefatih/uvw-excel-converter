import { connectDB } from '../config/db.js';

const insertData = async () => {
    try {
        // MongoDB'ye bağlan
        const database = await connectDB();
        console.log("MongoDB'ye başarıyla bağlanıldı.");

        // Veritabanı ve koleksiyonu seç
        const collection = database.collection('mycollection'); // Koleksiyon adı

        // Eklenecek veri
        const newData = {

            /*
            modelFormat: "VX####.###",  // Model formatı
            regexPattern: "VX(\\d+\\.\\d+)",  // RegEx desen
            outputFormat: "RIT.{model}",
            createdAt: new Date(),*/

            modelFormat: "SV####.###",  // Model formatı
            regexPattern: "SV(\\d+\\.\\d+)",  // RegEx desen
            outputFormat: ".{model}",
            createdAt: new Date(),

           /* modelFormat: "CP####.###",  // Model formatı
            regexPattern: "CP(\\d+\\.\\d+)",  // RegEx desen
            outputFormat: ".{model}",
            createdAt: new Date(),*/
        };


        // Veriyi koleksiyona ekle
        const result = await collection.insertOne(newData);
        console.log(`Veri başarıyla eklendi. Eklenen veri ID: ${result.insertedId}`);
    } catch (error) {
        console.error("Veri eklenirken hata oluştu:", error);
    }
};

export {insertData};
