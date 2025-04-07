export function getDocumentViewerTemplate({
  base64Data,
  extension,
}: {
  base64Data: string;
  extension: "docx" | "doc" | "xlsx" | "xls";
}) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Document Viewer</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
            }
            #viewer { 
              width: 100%; 
              height: calc(100vh - 40px);
              background: white;
              border-radius: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.12);
              overflow: auto;
              padding: 20px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
          </style>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mui/material@5.0.0/dist/css/material.min.css">
        </head>
        <body>
          <div id="viewer"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
          <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
          <script>
            const base64Data = "${base64Data}";
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const arrayBuffer = bytes.buffer;
  
            ${
              extension === "docx" || extension === "doc"
                ? `
              mammoth.convertToHtml({ arrayBuffer }, {
                styleMap: [
                  "p[style-name='Heading 1'] => h1:fresh",
                  "p[style-name='Heading 2'] => h2:fresh",
                  "p[style-name='Heading 3'] => h3:fresh",
                  "p[style-name='Heading 4'] => h4:fresh",
                  "p[style-name='Heading 5'] => h5:fresh",
                  "p[style-name='Heading 6'] => h6:fresh"
                ]
              })
              .then(result => {
                document.getElementById('viewer').innerHTML = result.value;
              })
              .catch(err => {
                console.error('Error:', err);
                document.getElementById('viewer').innerHTML = 'Error loading document';
              });
            `
                : `
              try {
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheets = workbook.SheetNames.map(name => {
                  const sheet = workbook.Sheets[name];
                  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                  
                  // Filtra le righe vuote
                  const nonEmptyRows = jsonData.filter(row => 
                    Array.isArray(row) && row.some(cell => 
                      cell !== null && cell !== undefined && cell !== ''
                    )
                  );
                  
                  // Converti le righe filtrate in HTML
                  const html = XLSX.utils.sheet_to_html(
                    XLSX.utils.json_to_sheet(nonEmptyRows),
                    { editable: false }
                  );

                  return {
                    name,
                    html
                  };
                });
  
                const viewer = document.getElementById('viewer');
                viewer.innerHTML = sheets.map(sheet => \`
                  <div style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 10px;">\${sheet.name}</h3>
                    <div style="overflow-x: auto;">\${sheet.html}</div>
                  </div>
                \`).join('');
              } catch (err) {
                console.error('Error:', err);
                document.getElementById('viewer').innerHTML = 'Error loading spreadsheet';
              }
            `
            }
          </script>
        </body>
      </html>
    `;
}
