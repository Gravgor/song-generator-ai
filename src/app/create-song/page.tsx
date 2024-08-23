import MainContainer from "@/components/Containter";
import { Container } from "@mui/material";
import dynamic from "next/dynamic";
import { SongCreationLoading } from "../../components/SongContainerForm";
import { getServerAuthSession } from "@/next-auth/next-auth-options";

const SongCreationForm = dynamic(() => import("../../components/SongContainerForm"), {
  ssr: false,
  loading: () => <SongCreationLoading />,
});

export default async function SongCreationPage() {
  const session = await getServerAuthSession();
  return (
    <MainContainer>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <SongCreationForm session={session}/>
      </Container>
    </MainContainer>
  );
}
