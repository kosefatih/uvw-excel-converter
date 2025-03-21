import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { processExcel } from "./src/controllers/excelController.js";

// __dirname benzeri yapı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Uploads klasörünü temizleyen fonksiyon
const clearUploadsFolder = () => {
  const uploadDir = path.join(__dirname, "uploads");

  // Klasör var mı kontrol et
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);

    // Her dosyayı sil
    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlinkSync(filePath); // Dosyayı sil
    });
    console.log("Uploads klasörü temizlendi.");
  }
};

// Benzersiz dosya adı için zaman damgası kullanımı
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');  // Dosyanın yükleneceği klasör
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });  // Klasör yoksa oluştur
        }
        console.log("Dosya yüklenecek klasör:", uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.log("Dosya adı:", file.originalname);  // Yüklenen dosyanın adı
        // Burada dosya adını değiştirmeyip orijinal adı kullanabilirsiniz
        cb(null, file.originalname);  // Orijinal dosya adını kullan
    }
});


const upload = multer({ storage: storage });

// 📌 Excel Dosyasını İşleme Endpoint'i
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("Dosya alındı:", req.file);
        if (!req.file) {
            return res.status(400).json({ error: "Dosya yüklenmedi." });
        }
        const inputFilePath = path.join(__dirname, "uploads", req.file.filename);
        console.log("İşlenecek dosya:", inputFilePath);

        if (!fs.existsSync(inputFilePath)) {
            return res.status(404).json({ error: "Dosya bulunamadı." });
        }

        // Excel işlemini başlat
        await processExcel(inputFilePath);

        const outputFilePath = path.join(__dirname, "uploads", "output.xlsx");
        console.log("Çıktı dosyası yolu:", outputFilePath);

        if (fs.existsSync(outputFilePath)) {
            // Çıktı dosyasını indir
            res.download(outputFilePath, (err) => {
                if (err) {
                    console.error("Dosya indirme hatası:", err);
                    return res.status(500).send("Dosya indirilirken hata oluştu.");
                }
                // Dosya indirildikten sonra uploads klasörünü temizle
                clearUploadsFolder();
            });
        } else {
            throw new Error("Çıktı dosyası bulunamadı.");
        }

    } catch (error) {
        console.error("Sunucu tarafında hata:", error);
        res.status(500).json({ error: `Dosya işlenirken hata oluştu: ${error.message}` });
    }
});


// Sunucu başlatıldığında uploads klasörünü temizle
clearUploadsFolder();

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`🚀 Server ${port} üzerinde çalışıyor.`);
});
