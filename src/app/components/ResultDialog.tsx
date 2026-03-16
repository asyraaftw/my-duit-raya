"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import type { WheelSlot } from "./RouletteWheel";

interface ResultDialogProps {
  open: boolean;
  result: WheelSlot | null;
  onClose: () => void;
  onShare: () => void;
  playerName: string;
}

export default function ResultDialog({
  open,
  result,
  onClose,
  onShare,
  playerName,
}: ResultDialogProps) {
  if (!result) return null;

  const isJackpot = result.value !== null && result.value >= 50;
  const isSpecial = result.value === null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: isJackpot ? "secondary.main" : "primary.light",
            borderRadius: 3,
            overflow: "visible",
          },
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 4, pb: 2 }}>
        <Typography variant="h1" sx={{ fontSize: "3rem", mb: 1 }}>
          {isJackpot ? "🎉🧧🎉" : isSpecial ? "🎁" : "🧧"}
        </Typography>

        {playerName && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {playerName}
          </Typography>
        )}

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: isJackpot ? "secondary.main" : "primary.light",
            mb: 1,
          }}
        >
          {result.label}
        </Typography>

        {isJackpot && (
          <Typography
            variant="h6"
            sx={{ color: "secondary.light", fontWeight: 600 }}
          >
            🎰 JACKPOT! 🎰
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mt: 2, fontStyle: "italic" }}
        >
          Selamat Hari Raya! 🌙
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1 }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" color="secondary" onClick={onShare}>
          Share 📱
        </Button>
      </DialogActions>
    </Dialog>
  );
}
