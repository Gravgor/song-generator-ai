import MainContainer from "@/components/Containter";
import { Container } from "@mui/material";
import dynamic from "next/dynamic";
import { SongCreationLoading } from "../../components/SongContainerForm";

const SongCreationForm = dynamic(() => import("../../components/SongContainerForm"), {
  ssr: false,
  loading: () => <SongCreationLoading />,
});

export default function SongCreationPage() {
  return (
    <MainContainer>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <SongCreationForm />
      </Container>
    </MainContainer>
  );
}
