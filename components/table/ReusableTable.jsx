// components/ReusableTable.js

import React from "react";
import { MaterialReactTable } from "material-react-table"; // This is correct

import { Box, Typography } from "@mui/material";

const ReusableTable = ({ columns, data, tableTitle }) => {
  return (
    <Box sx={{ padding: "20px" }}>
      {tableTitle && (
        <Typography variant="h6" component="div" gutterBottom>
          {tableTitle}
        </Typography>
      )}
      <MaterialReactTable columns={columns} data={data} />
    </Box>
  );
};

export default ReusableTable;
