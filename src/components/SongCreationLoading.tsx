"use client";
import { Skeleton } from "@mui/material";
import { AIResponseCard } from "./Cards";

export const SongCreationLoading = () => (
    <AIResponseCard>
      <Skeleton variant="text" width="100%" height={40} sx={{ marginBottom: '1rem' }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ marginBottom: '1rem' }} />
      <Skeleton variant="text" width="100%" height={40} sx={{ marginBottom: '1rem' }} />
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ marginBottom: '1rem' }} />
    </AIResponseCard>
  );