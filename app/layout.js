import "./globals.css";

export const metadata = {
  title: "Pokédex",
  description: "Browse Pokémon with the PokéAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
