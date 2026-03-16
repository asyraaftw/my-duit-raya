"use client";

import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import RouletteWheel from "./components/RouletteWheel";
import type { WheelSlot } from "./components/RouletteWheel";
import ResultDialog from "./components/ResultDialog";
import Leaderboard from "./components/Leaderboard";
import type { LeaderEntry } from "./components/Leaderboard";

const SLOTS: WheelSlot[] = [
  { label: "RM1", color: "#2E7D32", value: 1 },
  { label: "RM2", color: "#388E3C", value: 2 },
  { label: "RM5", color: "#43A047", value: 5 },
  { label: "Spin Again!", color: "#6D4C41", value: null },
  { label: "RM10", color: "#1B5E20", value: 10 },
  { label: "RM20", color: "#4CAF50", value: 20 },
  { label: "Sing Raya Song 🎤", color: "#BF360C", value: null },
  { label: "RM50 JACKPOT", color: "#F9A825", value: 50 },
  { label: "RM2", color: "#388E3C", value: 2 },
  // { label: "Share w/ Sibling", color: "#4E342E", value: null },
  { label: "RM1", color: "#2E7D32", value: 1 },
  { label: "RM5", color: "#43A047", value: 5 },
];

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [result, setResult] = useState<WheelSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  const handleSpin = () => {
    if (spinning) return;
    const randomIndex = Math.floor(Math.random() * SLOTS.length);
    setTargetIndex(randomIndex);
    setSpinning(true);
  };

  const handleSpinEnd = useCallback(() => {
    setSpinning(false);
    const won = SLOTS[targetIndex];
    setResult(won);
    setDialogOpen(true);

    // Update leaderboard only for RM values
    if (won.value !== null && playerName.trim()) {
      setLeaderboard((prev) => {
        const existing = prev.find((e) => e.name === playerName.trim());
        if (existing) {
          return prev.map((e) =>
            e.name === playerName.trim()
              ? { ...e, total: e.total + won.value!, spins: e.spins + 1 }
              : e,
          );
        }
        return [
          ...prev,
          { name: playerName.trim(), total: won.value!, spins: 1 },
        ];
      });
    }
  }, [targetIndex, playerName]);

  const handleShare = () => {
    if (!result) return;
    const text =
      result.value !== null
        ? `I just won ${result.label} from Duit Raya Roulette! 🧧🎰 Try your luck! Selamat Hari Raya! 🌙`
        : `I got "${result.label}" on Duit Raya Roulette! 😂🧧 Try your luck!`;

    if (navigator.share) {
      navigator.share({ title: "Duit Raya Roulette", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: { xs: 3, sm: 5 },
        pb: { xs: 8, sm: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: "primary.dark",
          opacity: 0.15,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "secondary.dark",
          opacity: 0.1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={3} alignItems="center">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                background: "linear-gradient(135deg, #4CAF50 0%, #FFD54F 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
              }}
            >
              🎰 Duit Raya Roulette
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              Spin & win your duit raya! Selamat Hari Raya Aidilfitri 🌙
            </Typography>
          </Box>

          <TextField
            label="Your Name"
            placeholder="e.g. Ali"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            size="small"
            fullWidth
            sx={{
              maxWidth: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <RouletteWheel
            slots={SLOTS}
            spinning={spinning}
            targetIndex={targetIndex}
            onSpinEnd={handleSpinEnd}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSpin}
            disabled={spinning}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: { xs: "1rem", sm: "1.15rem" },
              fontWeight: 700,
              bgcolor: "secondary.main",
              color: "#000",
              "&:hover": { bgcolor: "secondary.dark" },
              "&:disabled": { bgcolor: "grey.800", color: "grey.500" },
              boxShadow: spinning ? "none" : "0 0 20px rgba(255,213,79,0.4)",
            }}
          >
            {spinning ? "Spinning... 🌀" : "SPIN! 🧧"}
          </Button>

          <Leaderboard entries={leaderboard} />
        </Stack>
      </Container>

      <ResultDialog
        open={dialogOpen}
        result={result}
        onClose={() => setDialogOpen(false)}
        onShare={handleShare}
        playerName={playerName}
      />

      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          py: 1.5,
          bgcolor: "background.default",
          borderTop: "1px solid",
          borderColor: "primary.dark",
          zIndex: 10,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
          }}
        >
          Built by{" "}
          <Box
            component="span"
            sx={{ color: "secondary.main", fontWeight: 700 }}
          >
            acap hensem
          </Box>{" "}
          ✨ on NextJS
        </Typography>
      </Box>
    </Box>
  );
}
