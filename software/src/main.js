/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                                    Main                                    */
/******************************************************************************/

import { app, BrowserWindow } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
import { enableLiveReload } from "electron-compile"

let mainWindow

const isDevMode = process.execPath.match(/[\\/]electron/)
if (isDevMode) {
  enableLiveReload({ strategy: "react-hmr" })
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"
}

/******************************************************************************/
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1136,
    height: 760,
    backgroundColor: "#212121",
    minWidth: 397,
    // show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS)
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools()
    })
  }

  /****************************************************************************/
  // mainWindow.once("ready-to-show", () => {
  //   mainWindow.show()
  // })

  /****************************************************************************/
  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

/******************************************************************************/
app.on("ready", createWindow)

/******************************************************************************/
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

/******************************************************************************/
app.on("activate", () => {
  if (mainWindow === null) createWindow()
})

/******************************************************************************/
