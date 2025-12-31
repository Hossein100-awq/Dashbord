import React from "react";
import QueueIcon from '@mui/icons-material/Queue';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import Table from "./../MUI/Modal/Table"
const CostTable = () => {
  return (
    <div className="flex w-full justify-between items-center h-12 sm:h-14 md:h-16 rounded-md bg-white my-6 sm:my-8 md:my-12 px-3 sm:px-4">
      <div className="flex gap-2 justify-between items-center">
          <span><FormatListNumberedRtlIcon></FormatListNumberedRtlIcon></span>
        <span>لیست انواع هزینه ها</span>
      
      </div>
      <div><Table/></div>
      <div> <Stack spacing={2}>
     
      <Pagination count={10} color="primary" />
     
    </Stack></div>
    </div>
  );
};

export default CostTable;
