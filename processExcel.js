import { processExcel } from "./src/controllers/excelController.js";
import { insertData } from "./src/controllers/data.js";
import 'dotenv/config';

//insertData();  // Veri ekleme fonksiyonu çalıştırılır

processExcel();  // Excel işleme fonksiyonu çalıştırılır

