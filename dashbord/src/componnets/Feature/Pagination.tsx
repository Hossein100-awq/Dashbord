import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PAProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const PA: React.FC<PAProps> = ({ count, page, onChange }) => {
  return (
    <Stack spacing={2} className="rtl" direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        showFirstButton
        showLastButton
        color="primary"
        sx={{
          "& .MuiPaginationItem-previousNext": {
            transform: "scaleX(-1)",
          },
        }}
      />
    </Stack>
  );
};

export default PA;