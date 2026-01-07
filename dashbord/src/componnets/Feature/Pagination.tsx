import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PA = () => {
  return (
    <Stack spacing={2} className="rtl"> 
      <Pagination
        count={10}
        showFirstButton
        showLastButton
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
