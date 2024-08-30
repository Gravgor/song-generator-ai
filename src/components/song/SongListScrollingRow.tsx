"use client";

import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Slider,
  Backdrop,
} from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";
import { colors } from "@/style/style";

// Keyframe animation for scrolling
const scrollAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const ScrollingContainer = styled('div')({
  display: 'flex',
  width: '200%', // Width should be double to create the infinite effect
  animation: `${scrollAnimation} 20s linear infinite`,
});

const SongCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  width: "400px",
  height: "180px",
  cursor: "pointer",
  position: "relative",
  zIndex: 1,
  transition: "transform 0.5s ease, width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ExpandedSongCard = styled(SongCard)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(1.1)",
  width: "80%",
  height: "auto",
  maxHeight: "80vh",
  zIndex: 1300,
  overflow: "auto",
}));

const CardContentContainer = styled(CardContent)({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  padding: "1rem",
  flex: 1,
  overflow: "hidden",
});

const SongCardContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

const ExpandableLyrics = styled(Box)({
  marginTop: "1rem",
  overflow: "hidden",
  position: "relative",
});

const BackdropOverlay = styled(Backdrop)({
  zIndex: 1200,
  color: "#fff",
  transition: "all 0.5s ease",
});

const mockSongs = [
  {
    id: 1,
    title: "Dreams of Tomorrow",
    style: "Pop, Upbeat",
    lyrics: "Life is just a journey, Take it step by step...",
    image: "https://via.placeholder.com/150",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Echoes in the Rain",
    style: "Rock, Melancholic",
    lyrics: "I hear the echoes, in the pouring rain...",
    image: "https://via.placeholder.com/150",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Whispers of the Night",
    style: "Jazz, Smooth",
    lyrics: "Whispers in the dark, where the light...",
    image: "https://via.placeholder.com/150",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "Chasing the Sun",
    style: "Electronic, Upbeat",
    lyrics: "Chasing the sun, on a path of gold...",
    image: "https://via.placeholder.com/150",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
];

export default function SongList() {
  const [playingSong, setPlayingSong] = useState<any>(null);
  const [expandedSong, setExpandedSong] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [style, setStyle] = useState<any>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePlayPause = (song: any) => {
    if (playingSong && playingSong.id === song.id) {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play();
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setPlayingSong(song);
      if (audioRef.current) {
        audioRef.current.src = song.audio;
        audioRef.current.play();
      }
    }
  };

  const handleCardClick = (song: any) => {
    if (isAnimating) return;

    const rect = cardRef.current?.getBoundingClientRect();
    const top = rect?.top ?? 0;
    const left = rect?.left ?? 0;
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;

    setStyle({
      top: `${centerY - height / 2}px`,
      left: `${centerX - width / 8}px`,
      width: "80%",
      height: "auto",
      cursor: "auto",
      position: "fixed",
      zIndex: 1300,
      transform: "translate(-50%, -50%) scale(1.1)",
    });

    setIsAnimating(true);
    setExpandedSong(song);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    setStyle({});
    setExpandedSong(null);
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Latest Generated Song by Our Users
      </Typography>
      <Box sx={{ overflow: 'hidden', width: '100%' }}>
        <ScrollingContainer>
          {mockSongs.concat(mockSongs).map((song, index) => (
            <Box key={index} sx={{ flex: '0 0 auto', padding: '0 8px' }}>
              <SongCard
                ref={cardRef}
                onClick={() => handleCardClick(song)}
                style={expandedSong?.id === song.id ? style : {}}
              >
                <CardContentContainer>
                  <CardMedia
                    component="img"
                    sx={{ width: 150, height: 150, marginRight: "1rem" }}
                    image={song.image}
                    alt={song.title}
                  />
                  <SongCardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {song.title}
                    </Typography>

                    <ExpandableLyrics>
                      <Typography variant="body2">
                        {expandedSong && expandedSong.id === song.id
                          ? song.lyrics
                          : `${song.lyrics.substring(0, 100)}...`}
                      </Typography>
                    </ExpandableLyrics>

                    <Box sx={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(song);
                        }}
                        sx={{ color: colors.primary }}
                        disabled={isAnimating}
                      >
                        {playingSong && playingSong.id === song.id ? (
                          audioRef.current?.paused ? <PlayArrow /> : <Pause />
                        ) : (
                          <PlayArrow />
                        )}
                      </IconButton>
                      <Slider
                        value={audioRef.current?.currentTime || 0}
                        min={0}
                        max={audioRef.current?.duration || 100}
                        onChange={(e, newValue) => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = newValue as number;
                          }
                        }}
                        sx={{ ml: 2, flex: 1 }}
                        disabled={isAnimating}
                      />
                    </Box>
                  </SongCardContent>
                </CardContentContainer>
              </SongCard>
            </Box>
          ))}
        </ScrollingContainer>
      </Box>

      {expandedSong && (
        <BackdropOverlay open={Boolean(expandedSong)} onClick={handleClose} />
      )}

</>
  )
}