import { connectDB } from "../config/db.js";


const getRules = async () => {
    const db = await connectDB();
    const collection = db.collection('mycollection'); // 'rules' koleksiyonunu seçin

    try {
        const rules = await collection.find({}).toArray();  // Veritabanından tüm kuralları alıyoruz
        if (Array.isArray(rules) && rules.length > 0) {
            console.log("Kurallar başarılı bir şekilde alındı:", rules);  // Kurallar dizisini kontrol et
            return rules;  // Kurallar dizisini döndür
        } else {
            console.error("Kurallar bulunamadı veya boş");
            return [];  // Eğer kural yoksa boş dizi döndür
        }
    } catch (err) {
        console.error("Veri alınırken hata oluştu:", err);
        throw err;
    }
};

export { getRules };
