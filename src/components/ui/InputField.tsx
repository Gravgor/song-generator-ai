"use client"
import { TextField } from '@mui/material';

interface InputFieldProps {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, label, value, onChange }) => (
  <TextField
    type={type}
    label={label}
    value={value}
    onChange={onChange}
    variant="outlined"
    fullWidth
    margin="normal"
  />
);

export default InputField;