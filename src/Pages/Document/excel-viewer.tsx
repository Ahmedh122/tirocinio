import { Box, Tab, Table, TableBody, TableCell, TableRow, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export interface ExcelViewerProps {
  data: ArrayBuffer;
}

interface SheetData {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any[];
  maxColumns: number;
}

export function ExcelViewer({ data }: ExcelViewerProps) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    try {
      const workbook = XLSX.read(data);
      const sheetsData = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Filtra le righe vuote alla fine
        const nonEmptyRows = jsonData.filter(
          (row) =>
            Array.isArray(row) &&
            row.some((cell) => cell !== null && cell !== undefined && cell !== ''),
        );

        const maxColumns = Math.max(
          ...nonEmptyRows.map((row) => (Array.isArray(row) ? row.length : 0)),
        );

        return {
          name: sheetName,
          data: nonEmptyRows,
          maxColumns,
        };
      });

      setSheets(sheetsData);
    } catch (error) {
      console.error('Errore nel parsing del file Excel:', error);
    }
  }, [data]);

  const handleChangeSheet = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSheet(newValue);
  };

  return (
    <Box>
      <Tabs
        value={activeSheet}
        onChange={handleChangeSheet}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {sheets.map((sheet, index) => (
          <Tab key={sheet.name} label={sheet.name} id={`sheet-tab-${index}`} />
        ))}
      </Tabs>

      <Box
        sx={{
          height: '71vh',
          overflow: 'auto',
        }}
      >
        {sheets[activeSheet] && (
          <Table sx={{ minWidth: '100%' }}>
            <TableBody>
              {sheets[activeSheet].data.map((row) => (
                <TableRow
                  key={JSON.stringify(row)}
                  sx={{
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  }}
                >
                  {Array.from({ length: sheets[activeSheet].maxColumns }).map((_, colIndex) => (
                    <TableCell
                      key={`cell-${row}-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        colIndex
                      }`}
                      sx={{
                        'minWidth': '200px',
                        'maxWidth': '200px',
                        'whiteSpace': 'nowrap',
                        'overflow': 'hidden',
                        'textOverflow': 'ellipsis',
                        'borderRight': '1px solid rgba(224, 224, 224, 1)',
                        'p': 1,
                        '&:hover': {
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      {Array.isArray(row) ? row[colIndex] ?? '' : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
