import MainContainer from "@/components/ui/Containter";
import { Container } from "@mui/material";
import dynamic from "next/dynamic";
import { getServerAuthSession } from "@/lib/auth";
import { SongCreationLoading } from "@/components/song/SongCreationLoading";

const SongCreationForm = dynamic(() => import("../../../components/song/SongContainerForm"), {
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
