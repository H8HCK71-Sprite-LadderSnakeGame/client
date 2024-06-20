import Maen from "./pages/maen";
import ThemeContext from './contexts/ThemeContext'
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState('green')
  return (
    <>
      <ThemeContext.Provider
        value={{
          theme: theme,
          setTheme: setTheme,
          themes: {
            green: {
              bg: "green",
              text: "black"
            },
            black: {
              bg: "black",
              text: "white"
            }
          },
        }}
      >
        <Maen/>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
