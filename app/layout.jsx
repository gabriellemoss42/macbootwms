'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import InventoryIcon from '@mui/icons-material/Inventory2';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WidgetsIcon from '@mui/icons-material/Widgets';
import NextLink from "next/link";

const drawerWidth = 200;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: { main: "#003366" },
    background: { default: "#f4f6fa" }
  },
  typography: {
    fontFamily: `"Geist", "Geist Mono", "Roboto", "Arial", sans-serif`
  }
});

const menu = [
  { text: "Dashboard", icon: <HomeIcon />, href: "/" },
  { text: "Entrada em Massa", icon: <AssignmentIcon />, href: "/entrada_em_massa" },
  { text: "Total Estoque", icon: <InventoryIcon />, href: "/total" },
  { text: "Produtos", icon: <WidgetsIcon />, href: "/produtos" },
  { text: "Movimentações", icon: <ListAltIcon />, href: "/movimentacoes" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ zIndex: 1301 }}>
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 2 }}>
                Macboot WMS
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                bgcolor: "#e9eef6"
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {menu.map((item) => (
                  <ListItemButton
                    key={item.text}
                    component={NextLink}
                    href={item.href}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 4, ml: `${drawerWidth}px`, minHeight: "100vh" }}>
            <Toolbar />
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
