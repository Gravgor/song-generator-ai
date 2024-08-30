"use client";
import { colors } from "@/style/style";
import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const StyledButton = styled(Button)({
    backgroundColor: colors.primary,
    color: colors.buttonText,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: colors.secondary,
    },
    fontFamily: 'Poppins, Nunito, sans-serif',
  });
