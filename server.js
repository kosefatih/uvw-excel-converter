import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { processExcel } from "./src/controllers/excelController.js";

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: "http://localhost:8888",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  };
  
  app.use(cors(corsOptions));

app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./uploads";

        // Klasör yoksa oluştur
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, "input.xlsx");
    }
});

const upload = multer({ storage: storage });

// 📌 Excel Dosyasını İşleme Endpoint'i
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        await processExcel();
        res.download("output.xlsx"); // İşlenen dosyayı gönder
    } catch (error) {
        res.status(500).json({ error: "Dosya işlenirken hata oluştu." });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`🚀 Server ${port} üzerinde çalışıyor.`);
});
