let downloadCsv = {
    methods: {
        downloadCSV(filename, stockData) {
            let link;
            let csv = stockData;
            if (csv == null)
                return;

            let blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});

            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename)
            } else {
                link = document.createElement("a");
                if (link.download !== undefined) {
                    // feature detection, Browsers that support HTML5 download attribute
                    let url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }
    }
};

export default downloadCsv;