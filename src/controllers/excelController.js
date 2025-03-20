import { getRules } from "../models/ruleModel.js";
import XLSX from "xlsx";

const processExcel = async () => {
    try {
        // 📌 1. Kuralları veritabanından çek
        const rules = await getRules();

        // 📌 2. Excel dosyasını oku
        const workbook = XLSX.readFile("input.xlsx");
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log("Excel Verisi:", data);
        console.log("Dönüştürme Kuralları:", rules);

        // 📌 3. Hersteller veya Bestell_Nr_ sütunları boş olan satırları kaldır
        const filteredData = data.filter(row => {
            // Hersteller veya Bestell_Nr_ boş ise false döner ve satır filtrelenir
            return row["Hersteller"] && row["Bestell_Nr_"];
        });

        // 📌 4. Excel verisini işle
        const newData = filteredData.map(row => {
            // 📌 Etiket oluştur (A + K + R + W sütunlarını birleştir)
            const etiket = `${row["Anlage"] || ""}${row["Funktion"] || ""}${row["Ort"] || ""}${row["BMK"] || ""}`.trim();

            // 📌 Markayı kontrol et ve kısaltmayı belirle
            const manufacturer = row["Hersteller"] || "";
            let abbreviation = "";

            if (manufacturer.toLowerCase().includes("rittal")) {
                abbreviation = "RIT";
            } else if (manufacturer.toLowerCase().includes("siemens")) {
                abbreviation = "SIE";
            } else if (manufacturer.toLowerCase().includes("wöhner")) {
                abbreviation = "WOE";
            } else if (manufacturer.toLowerCase().includes("lenze")) {
                abbreviation = "LEN";
            } else if (manufacturer.toLowerCase().includes("eta")) {
                abbreviation = "ETA";
            } else if (manufacturer.toLowerCase().includes("lütze")) {
                abbreviation = "LUE";
            } else if (manufacturer.toLowerCase().includes("harting")) {
                abbreviation = "HAR";
            } else if (manufacturer.toLowerCase().includes("festo")) {
                abbreviation = "FES";
            } else if (manufacturer.toLowerCase().includes("lapp")) {
                abbreviation = "LAPP";
            } else if (manufacturer.toLowerCase().includes("phoenix")) {
                abbreviation = "PXC";
            } else if (manufacturer.toLowerCase().includes("schmersal")) {
                abbreviation = "SCHM";
            } else if (manufacturer.toLowerCase().includes("helukabel")) {
                abbreviation = "HELU";
            } else if (manufacturer.toLowerCase().includes("weidmüller")) {
                abbreviation = "WEI";
            } else if (manufacturer.toLowerCase().includes("murrelektr")) {
                abbreviation = "MURR";
            } else if (manufacturer.toLowerCase().includes("jumo")) {
                abbreviation = "JUMO";
            } else if (manufacturer.toLowerCase().includes("pepperl&fu")) {
                abbreviation = "P+F";
            } else if (manufacturer.toLowerCase().includes("neutrik")) {
                abbreviation = "NEU";
            }

            // 📌 Bestell_Nr_ sütunundaki kodu al
            let kod = row["Bestell_Nr_"] || "";

            // 📌 Veritabanındaki kurallara göre dönüşüm yap
            for (const rule of rules) {
                const regex = new RegExp(rule.regexPattern);
                if (regex.test(kod)) {
                    // Kodun model kısmını çıkar
                    const match = kod.match(regex);
                    if (match) {
                        // Modeli al ve noktalı kısmı kaldır
                        const model = match[1].replace(".", "");
                        // Formatı uygula
                        kod = rule.outputFormat.replace("{model}", model);
                    }
                    break;
                }
            }

            // 📌 Adet sütunu (Teilemenge)
            const adet = row["Teilemenge"] ? parseInt(row["Teilemenge"]) : 1;

            // 📌 Çıktı verisini oluştur
            return { "Etiket": etiket, "Kod": abbreviation + "." + kod, "Adet": adet };
        });

        // 📌 5. Yeni Excel dosyasını oluştur
        const newWorkbook = XLSX.utils.book_new();
        const newWorksheet = XLSX.utils.json_to_sheet(newData, { header: ["Etiket", "Kod", "Adet"] });
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Düzenlenmiş");

        // 📌 6. Dosyayı kaydet
        XLSX.writeFile(newWorkbook, "output.xlsx");

        console.log("✅ Excel dosyası başarıyla düzenlendi!");
    } catch (err) {
        console.error("❌ Excel dosyası işlenirken hata:", err);
    }
};

export { processExcel };