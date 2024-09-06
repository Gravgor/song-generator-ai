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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { PlayArrow, Pause, Memory } from "@mui/icons-material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllAccessSongs } from "@/lib/songs/allAccess";


const colors = {
  primary: '#3f51b5',
  secondary: '#303f9f',
  text: '#ffffff',
  buttonText: '#ffffff',
  background: '#0a192f',
};

const AIBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(45deg, ${colors.background} 0%, #1a2a4a 100%)`,
});

const FloatingParticle = styled(Box)({
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '50%',
  animation: 'float 15s infinite linear',
  '@keyframes float': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(100vw, 100vh)' },
  },
});


const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  '& .slick-slide': {
    padding: '0 10px',
  },
  '& .slick-prev, & .slick-next': {
    zIndex: 1,
    '&:before': {
      color: colors.primary,
    },
  },
});

const FullWidthCarouselContainer = styled(Box)({
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  marginRight: 'calc(-50vw + 50%)',
  '& .slick-slide': {
    padding: '0 10px',
  },
  '& .slick-prev, & .slick-next': {
    zIndex: 1,
    '&:before': {
      color: colors.primary,
    },
  },
});

const SongCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  width: '100%',
  height: '200px',
  cursor: 'pointer',
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
}));

const CardContentContainer = styled(CardContent)({
  display: 'flex',
  flexDirection: 'row',
  padding: '1rem',
  flex: 1,
  overflow: 'hidden',
  color: colors.text,
});

const SongCardContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  marginLeft: '1rem',
});

const SongTitle = styled(Typography)({
  color: '#FFFFFF',  // Changed to white for better visibility
  fontWeight: 'bold',
  fontSize: '1.2rem',  // Increased font size
  marginBottom: '0.25rem',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',  // Added text shadow for better contrast
});

const SongStyle = styled(Typography)({
  color: colors.secondary,
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
});
const ExpandableLyrics = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

const PlayButton = styled(IconButton)({
  position: 'absolute',
  bottom: '1rem',
  right: '1rem',
  backgroundColor: colors.primary,
  color: colors.buttonText,
  '&:hover': {
    backgroundColor: colors.secondary,
  },
});

const ExpandedSongCard = styled(SongCard)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) scale(1.1)',
  width: '80%',
  height: 'auto',
  maxHeight: '80vh',
  zIndex: 1300,
  overflow: 'auto',
}));


const BackdropOverlay = styled(Backdrop)({
  zIndex: 1200,
  color: '#fff',
  transition: 'all 0.5s ease',
});

const AIIcon = styled(Memory)({
  color: colors.primary,
  marginRight: '0.5rem',
});

const StyledSlider = styled(Slider)({
  color: colors.primary,
  '& .MuiSlider-thumb': {
    backgroundColor: colors.primary,
  },
  '& .MuiSlider-track': {
    backgroundColor: colors.primary,
  },
});


interface Song {
  id: string;
  clipCoverUrl: string;
  clipTitle: string;
  clipTags: string;
  clipAudioUrl: string;
}

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [expandedSong, setExpandedSong] = useState<Song | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [style, setStyle] = useState<any>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<Slider | null>(null);

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
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
      width: "18%",
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

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const fetchedSongs = await getAllAccessSongs();
        setSongs(fetchedSongs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch songs. Please try again later.");
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: colors.text }}>
        <AIIcon />
        Latest AI-Generated Songs by Our Users
      </Typography>
      <FullWidthCarouselContainer>
        <Slider {...settings}>
          {songs.map((song) => (
            <Box key={song.id} sx={{ padding: '10px' }}>
              <SongCard onClick={() => handleCardClick(song)}>
                <CardContentContainer>
                  <CardMedia
                    component="img"
                    sx={{ width: 150, height: 150, borderRadius: '8px' }}
                    image={song.clipCoverUrl}
                    alt={song.clipTitle}
                  />
                  <SongCardContent>
                    <SongTitle variant="h6">{song.clipTitle}</SongTitle>
                    <SongStyle variant="subtitle2">{song.clipTags}</SongStyle>
                    <ExpandableLyrics variant="body2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien.
                    </ExpandableLyrics>
                  </SongCardContent>
                  <PlayButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause(song);
                    }}
                  >
                    {playingSong && playingSong.id === song.id ? (
                      audioRef.current?.paused ? <PlayArrow /> : <Pause />
                    ) : (
                      <PlayArrow />
                    )}
                  </PlayButton>
                </CardContentContainer>
              </SongCard>
            </Box>
          ))}
        </Slider>
      </FullWidthCarouselContainer>

      {expandedSong && (
        <BackdropOverlay open={Boolean(expandedSong)} onClick={handleClose}>
          <ExpandedSongCard>
            {/* ... keep your expanded song card content ... */}
          </ExpandedSongCard>
        </BackdropOverlay>
      )}
    </>
  );
}
