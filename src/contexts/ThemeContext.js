import {createContext} from 'react'

const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => {},
    themes: {
        green: {
            bg: 'green'
        },
        black: {
            bg: 'black'
        }
    }
})

export default ThemeContext