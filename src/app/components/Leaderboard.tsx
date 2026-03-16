"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export interface LeaderEntry {
  name: string;
  total: number;
  spins: number;
}

interface LeaderboardProps {
  entries: LeaderEntry[];
}

const medalColors = ["#FFD54F", "#B0BEC5", "#A1887F"];

export default function Leaderboard({ entries }: LeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.total - a.total);

  if (sorted.length === 0) return null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        bgcolor: "background.paper",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "primary.dark",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.dark",
          py: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <EmojiEventsIcon sx={{ color: "secondary.main" }} />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "secondary.main" }}
        >
          Leaderboard
        </Typography>
      </Box>
      <List dense sx={{ py: 0 }}>
        {sorted.map((entry, i) => (
          <ListItem
            key={entry.name}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: i < 3 ? medalColors[i] : "primary.main",
                  color: i < 3 ? "#000" : "#fff",
                  width: 32,
                  height: 32,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={entry.name}
              secondary={`${entry.spins} spin${entry.spins !== 1 ? "s" : ""}`}
              slotProps={{
                primary: { sx: { fontWeight: 600 } },
                secondary: {
                  sx: { color: "text.secondary", fontSize: "0.75rem" },
                },
              }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, color: "secondary.main" }}
            >
              RM{entry.total}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
