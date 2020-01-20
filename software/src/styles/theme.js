/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                                   Theme                                    */
/******************************************************************************/

import { createMuiTheme } from "@material-ui/core/styles"

/******************************************************************************/
/* Theme                                                                      */
/******************************************************************************/
const Theme = createMuiTheme({
  palette: {
    background: {
      default: "#212121",
    },
    primary: {
      lightest: "#e0f7fa",
      lightest2: "#b2ebf2",
      light: "#33c9dc",
      main: "#009696",
      dark: "#008394",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#33eaff",
      main: "#00e5ff",
      dark: "#00a0b2",
      contrastText: "#ffffff",
    },
    defaultGray: "#9e9e9e",
  },
  typography: {
    useNextVariants: true,
  },
})

/******************************************************************************/
export default Theme
/******************************************************************************/
