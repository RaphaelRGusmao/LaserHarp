/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                                    App                                     */
/******************************************************************************/

import React, { Component } from "react"
import { MuiThemeProvider } from "@material-ui/core/styles"
import {
  CssBaseline,
} from "@material-ui/core"
import Home from "./pages/Home"
import Theme from "./styles/theme"

/******************************************************************************/
/* App                                                                        */
/******************************************************************************/
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        <CssBaseline/>
        <Home/>
      </MuiThemeProvider>
    )
  }
}

/******************************************************************************/
export default App
/******************************************************************************/
