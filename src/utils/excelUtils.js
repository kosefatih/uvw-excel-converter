const processExcelData = (data, rules) => {
    return data.map(row => {
        let newRow = { ...row };
        rules.forEach(rule => {
            const regex = new RegExp(rule.regexPattern);
            if (regex.test(row["Model"])) {
                newRow["Model"] = row["Model"].replace(regex, rule.outputFormat);
            }
        });
        return newRow;
    });
};

export { processExcelData };  // export kullanıldı
