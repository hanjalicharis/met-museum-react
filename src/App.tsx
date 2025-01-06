import React, { useState } from "react";

import Masonry from "react-masonry-css";

import { useFetchData } from "../hooks/useFetchData";
import "./styles.css";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import {
  AppBar,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  CssBaseline,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("none");

  const { data, loading, error } = useFetchData(searchTerm);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchTerm(searchTerm);
  };

  const resetSearch = () => {
    setSearchTerm("");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filteredData =
    filter === "favorites"
      ? data.filter((item: any) => favorites.has(item.objectID))
      : data;

  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "artist") {
      return a.artistDisplayName.localeCompare(b.artistDisplayName || "");
    }
    if (sort === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <AppBar position="static" className="app-bar">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="home" onClick={resetSearch}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" className="title">
              Art Explorer
            </Typography>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color={darkMode ? "secondary" : "inherit"}
            >
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box className="content-container">
          <form onSubmit={handleSearch} className="search-form">
            <TextField
              name="search"
              label="Search Artworks"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <Box className="filter-sort-container">
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, newFilter) => setFilter(newFilter || "all")}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="favorites">Favorites</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={sort}
              exclusive
              onChange={(e, newSort) => setSort(newSort || "none")}
            >
              <ToggleButton value="none">None</ToggleButton>
              <ToggleButton value="artist">By Artist</ToggleButton>
              <ToggleButton value="title">By Title</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {loading ? (
            <Box className="loader-container">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography className="error-message">{error}</Typography>
          ) : sortedData.length ? (
            <Masonry
              breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
              className="masonry-grid"
              columnClassName="masonry-grid-column"
            >
              {sortedData.map((item) => (
                <Card key={item.objectID} className="art-card">
                  <CardMedia
                    component="img"
                    alt={item.title}
                    height="300"
                    image={item.primaryImage || "https://via.placeholder.com/300"}
                  />
                  <Box className="card-content">
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.artistDisplayName}
                    </Typography>
                    <IconButton
                      onClick={() => toggleFavorite(item.objectID)}
                      color={favorites.has(item.objectID) ? "primary" : "default"}
                    >
                      {favorites.has(item.objectID) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Masonry>
          ) : (
            <Typography className="no-results-message">No artworks found.</Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
