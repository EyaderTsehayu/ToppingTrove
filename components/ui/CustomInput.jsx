import { TextField } from "@mui/material";
import { forwardRef } from "react";

const CustomInput = forwardRef(
  ({ label, name, error, helperText, ...props }, ref) => {
    return (
      <TextField
        label={label}
        name={name}
        inputRef={ref}
        error={!!error}
        helperText={error ? helperText : ""}
        variant="outlined"
        size="small"
        fullWidth
        {...props}
      />
    );
  }
);

export default CustomInput;
