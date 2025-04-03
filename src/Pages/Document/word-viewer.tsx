import { Box, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import { useEffect, useState } from 'react';

interface WordViewerProps {
  data: ArrayBuffer;
}

export function WordViewer({ data }: WordViewerProps) {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    mammoth
      .convertToHtml({ arrayBuffer: data })
      .then((result) => {
        const sanitizedContent = DOMPurify.sanitize(result.value);
        setContent(sanitizedContent);
      })
      .catch((err) => {
        console.error('Errore nella conversione del documento Word:', err);
        setError('Errore nel caricamento del documento');
      });
  }, [data]);

  if (error) {
    return (
      <Box
        sx={{
          height: '71vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          borderRadius: 1,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '71vh',
        bgcolor: 'common.white',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        ref={(node: HTMLDivElement | null) => {
          if (node) {
            node.innerHTML = content;
          }
        }}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 4,
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.6,
          maxWidth: '800px',
          mx: 'auto',
          wordWrap: 'break-word',
        }}
      />
    </Box>
  );
}
