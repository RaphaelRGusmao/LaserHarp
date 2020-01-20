/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                                 Page: Home                                 */
/******************************************************************************/

import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import {
  Typography,
  TextField,
  Tooltip,
  Button, IconButton,
  CircularProgress,
  Slider,
  FormControl, InputLabel, Select, OutlinedInput, MenuItem,
} from "@material-ui/core"
import RefreshIcon from "@material-ui/icons/Refresh"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import ClearIcon from "@material-ui/icons/Clear"
import SerialPort from "serialport"
import Readline from "@serialport/parser-readline"
import { Hardware } from "../components/Hardware"
import { Midi } from "../components/Midi"
import Harp from "../components/Harp"
import Camera from "../components/Camera"

/******************************************************************************/
/* Styles                                                                     */
/******************************************************************************/
const styles = theme => ({
  root: {
    background: theme.palette.background.default,
    padding: 16,
  },

  // Views /////////////////////////////////////////////////////////////////////
  views: {
    margin: "0 0 -6px 0",
  },
  view: {
    background: "#000000",
    width: "calc(50% - 32px)",
    paddingTop: "calc(37.5% - 24px)",
    margin: 16,
    display: "inline-block",
    border: `1px solid #424242`,
    borderRadius: 32,
    position: "relative",
    overflow: "hidden",
    [theme.breakpoints.down(704)]: {
      display: "block",
      width: "calc(100% - 32px)",
      paddingTop: "calc(75% - 24px)",
      marginBottom: 32,
      "&:last-child": {
        marginBottom: 22,
      },
    },
  },
  loading: {
    color: "#ffffff",
    left: "calc(50% - 20px)",
    bottom: "calc(50% - 20px)",
    position: "absolute",
  },
  refresh: {
    left: "calc(50% - 32px)",
    bottom: "calc(50% - 32px)",
    position: "absolute",
    transition: "opacity 0.25s ease-in",
    transitionDelay: "0.25s",
    "& button": {
      width: 64,
      height: 64,
    },
    "& svg": {
      color: "#ffffff",
      transform: "scale(1.33)",
    },
  },
  playPauseButton: {
    color: "#ffffff",
    padding: 0,
    position: "absolute",
    transition: "opacity 0.25s ease-in",
  },
  playPauseIcon: {
    position: "absolute",
    transformOrigin: "top left",
    pointerEvents: "none",
  },
  disconnect: {
    top: 0,
    right: 0,
    position: "absolute",
    "& svg": {
      color: "#828282",
      transform: "scale(1.33)",
    },
  },
  tooltip: {
    margin: 0,
  },

  // Controllers ///////////////////////////////////////////////////////////////
  controllers: {
    width: "100%",
    maxWidth: 1088,
    margin: "auto",
    display: "flex",
    [theme.breakpoints.down(704)]: {
      display: "inherit",
    },
  },
  column: {
    width: "50%",
    padding: "16px 16px 0 16px",
    display: "inline-block",
    [theme.breakpoints.down(704)]: {
      width: "100%",
      display: "block",
    },
  },

  // Inputs ////////////////////////////////////////////////////////////////////
  field: {
    background: "#212121",
    height: 48,
    width: "100%",
    maxWidth: 512,
    margin: "0 0 32px 0",
    borderRadius: 32,
    "&:hover svg": {
      color: theme.palette.primary.main,
    },
  },
  fieldOutline: {
    borderRadius: 32,
    borderColor: "#424242 !important",
    "&:not(.Mui-disabled):hover fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  fieldLabel: {
    backgroundColor: "#212121",
    color: "#ffffff !important",
    whiteSpace: "nowrap",
    transform: "translate(14px, 16px) scale(1)",
  },
  fieldText: {
    color: theme.palette.primary.main,
    "&:disabled": {
      color: "#848484",
    },
  },
  fieldContainer: {
    width: "100%",
    height: 48,
    margin: "0 0 26px 0",
    display: "inline-block",
    position: "relative",
    "& > $field": {
      width: 80,
      margin: 0,
      top: 0,
      right: 0,
      position: "absolute",
    },
    "& > $fieldLabel": {
      width: 64,
      top: -12,
      left: 6,
      position: "absolute",
      transform: "scale(0.75)",
    },
  },
  slider: {
    width: "calc(100% - 112px)",
    margin: 0,
    bottom: 12,
    left: 0,
    position: "absolute",
    "&.Mui-disabled": {
      color: "#848484",
    },
    "&:not(.Mui-disabled):hover $sliderRail": {
      background: theme.palette.primary.main,
    },
    "&:not(.Mui-disabled):hover $sliderMark": {
      background: theme.palette.primary.main,
    },
  },
  sliderRail: {
    background: "#424242",
    height: 1,
    opacity: 1,
    transition: "0.1s",
  },
  sliderThumb: {
    height: "12px !important",
    width: "12px !important",
    margin: "-5px 0 0 -6px !important",
  },
  sliderMark: {
    background: "#424242",
    height: 8,
    width: 1,
    marginTop: -3,
    transition: "0.1s",
  },
  sliderMarkActive: {
    background: theme.palette.primary.main,
  },
  sliderMarkActiveDisabled: {
    background: "#848484",
  },
  degree: {
    top: 13,
    position: "absolute",
  },
  select: {
    "&.Mui-disabled": {
      color: "#848484",
    },
    "&:focus": {
      background: "#212121",
    },
  },
  selectIcon: {
    color: "#424242",
    transition: "0.1s",
  },
  selectIconDisabled: {
    color: "#424242 !important",
    transition: "0.1s",
  },
  selectMenu: {
    background: "#424242",
    color: "#ffffff",
  },
  selectsContainer: {
    width: "100%",
    height: 48,
    margin: "0 0 32px 0",
    display: "inline-block",
    position: "relative",
    "& > $field": {
      width: 80,
      margin: "0 32px 0 0",
      "&:last-child": {
        width: "calc(100% - 224px)",
        bottom: 0,
        right: 0,
        margin: 0,
        position: "absolute",
      },
    },
  },
})

/******************************************************************************/
/* Home                                                                       */
/******************************************************************************/
class Home extends Component {
  state = {
    notes: [
      { name: "C",  baseMidi: 12, isSharp: false },
      { name: "C♯", baseMidi: 13, isSharp: true },
      { name: "D",  baseMidi: 14, isSharp: false },
      { name: "D♯", baseMidi: 15, isSharp: true },
      { name: "E",  baseMidi: 16, isSharp: false },
      { name: "F",  baseMidi: 17, isSharp: false },
      { name: "F♯", baseMidi: 18, isSharp: true },
      { name: "G",  baseMidi: 19, isSharp: false },
      { name: "G♯", baseMidi: 20, isSharp: true },
      { name: "A",  baseMidi: 21, isSharp: false },
      { name: "A♯", baseMidi: 22, isSharp: true },
      { name: "B",  baseMidi: 23, isSharp: false },
    ],
    octaves: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    scales: [
      {
        name: "Cromática",
        pattern: [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
      },
      {
        name: "Maior",
        pattern: [1,  0,  1,  0,  1,  1,  0,  1,  0,  1,  0,  1],
      },
      {
        name: "Menor",
        pattern: [1,  0,  1,  1,  0,  1,  0,  1,  1,  0,  1,  0],
      },
      {
        name: "Pentatônica Maior",
        pattern: [1,  0,  1,  0,  1,  0,  0,  1,  0,  1,  0,  0],
      },
      {
        name: "Pentatônica Menor",
        pattern: [1,  0,  0,  1,  0,  1,  0,  1,  0,  0,  1,  0],
      },
    ],
    tonic: 0,
    octave: 4,
    scale_id: 0,
    n_strings: 12,
    angle_strings: 8,
    capture_devices: [""],
    device_id: 0,
    brightness: 0,
    contrast: 0,
    is_loading: false,
    harp_ratio: 1,
    n_strings_min: 1,
    n_strings_max: 25,
    angle_strings_min: 4,
    angle_strings_max: 8,
  }
  hardware = new Hardware()
  midi = new Midi()

  /****************************************************************************/
  /* Lifecycle                                                                */
  /****************************************************************************/
  componentDidMount() {
    this.searchLaserHarp()
    this.searchCaptureDevices()
    this.midi.connect()
  }

  /****************************************************************************/
  /* Searchs                                                                  */
  /****************************************************************************/
  searchLaserHarp = () => {
    this.startLoading()
    let serials = []
    SerialPort.list().then((ports) => {
      for (let port of ports) {
        if (this.state.serial == null) {
          let serial = new SerialPort(port.comName, { baudRate: 9600, autoOpen: false })
          serial.open((error) => {
            if (error == null) {
              let parser = serial.pipe(new Readline({ delimiter: "\r\n" }))
              serials.push({path: port.comName, serial: serial})
              parser.on("data", (data) => {
                console.log("%c" + data, "color: #009696")
                if (data == "LASERHARP") {
                  this.hardware.setSerial(serial)
                  this.refs.harp.setConnected(true)
                  this.forceUpdate()
                  serial.on("close", () => {
                    this.hardware.setSerial(null)
                    this.refs.harp.setActive(false)
                    this.refs.harp.setConnected(false)
                    this.forceUpdate()
                  })
                }
              })
            }
          })
        }
      }
    })
    setTimeout(() => {
      serials.forEach(({ path, serial }) => {
        if ((!this.hardware.isConnected() || path != this.hardware.serial.path) && serial.isOpen) {
          serial.close()
        }
      })
      this.stopLoading()
    }, 5000)
  }

  /****************************************************************************/
  searchCaptureDevices = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.setState({
        capture_devices: devices.filter(obj => obj.kind === "videoinput").map(obj => obj.label)
      })
    })
  }

  /****************************************************************************/
  /* Inputs                                                                   */
  /****************************************************************************/
  handleNumberChange = (field, min, max, isInteger) => (event) => {
    let {value} = event.target
    if (max < value)      value = max
    else if (value < min) value = min
    else if (isInteger) value = parseInt(value)
    this.setState({
      [field]: value
    })
    if (field == "n_strings") {
      this.setState({
        angle_strings_max: Math.floor(90/(this.state.n_strings-1)),
        angle_strings: Math.min(this.state.angle_strings, this.state.angle_strings_max),
      })
    }
  }

  /****************************************************************************/
  handleSliderChange = (field) => (e, value) => {
    this.setState({
      [field]: value
    })
    if (field == "n_strings") {
      this.setState({
        angle_strings_max: Math.floor(90/(this.state.n_strings-1)),
        angle_strings: Math.min(this.state.angle_strings, this.state.angle_strings_max),
      })
    }
  }

  /****************************************************************************/
  /* Buttons                                                                  */
  /****************************************************************************/
  startCamera = () => {
    this.refs.camera.openCV()
  }

  /****************************************************************************/
  disconnect = () => {
    this.hardware.disconnect()
    this.refs.harp.setActive(false)
    this.refs.harp.setConnected(false)
    // this.forceUpdate()
  }

  /****************************************************************************/
  start = () => {
    this.hardware.start(this.refs.harp.getParams())
    this.refs.harp.setActive(true)
    this.forceUpdate()
  }

  /****************************************************************************/
  pause = () => {
    this.hardware.pause()
    this.refs.harp.setActive(false)
    this.forceUpdate()
  }

  /****************************************************************************/
  /* Others                                                                   */
  /****************************************************************************/
  getDegreeMargin = () => {
    let context = document.createElement("canvas").getContext("2d")
    let width = Math.min(Math.floor(context.measureText(this.state.angle_strings).width), 30)
    if (width == 5)
      return 50
    return 50 - width
  }

  /****************************************************************************/
  startLoading = () => {
    this.setState({
      isLoading: true,
    })
  }

  /****************************************************************************/
  stopLoading = () => {
    this.setState({
      isLoading: false,
    })
  }

  /****************************************************************************/
  render() {
    const { classes } = this.props
    // console.clear()
    // console.log(JSON.stringify(this.state, null, 2))

    /**************************************************************************/
    return (
      <div className={classes.root}>
        {/* Views ************************************************************/}
        <div className={classes.views}>
          {/* Harp ***********************************************************/}
          <div className={classes.view}>
            <Harp ref="harp"
              midi={this.midi}
              notes={this.state.notes}
              scales={this.state.scales}
              tonic={this.state.tonic}
              octave={this.state.octave}
              scale_id={this.state.scale_id}
              n_strings={this.state.n_strings}
              angle_strings={this.state.angle_strings}
              home={this}
              base_radius={null}
            />
            {!this.hardware.isConnected() && this.state.isLoading?
              <CircularProgress className={classes.loading}/>
            :null}
            <Tooltip
              title="Procurar LaserHarp"
              enterDelay={500}
              classes={{ tooltip: classes.tooltip }}
              style={{ display: this.hardware.isConnected()? "none" : "inherit" }}
            >
              <div className={classes.refresh}>
                <IconButton
                  onClick={this.searchLaserHarp}
                  disabled={this.hardware.isConnected() || this.state.isLoading}
                  style={{ opacity: !this.hardware.isConnected() && !this.state.isLoading? 1 : 0 }}
                >
                  <RefreshIcon/>
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip
              title={this.hardware.isActive()? "Pausar" : "Iniciar"}
              enterDelay={500}
              classes={{ tooltip: classes.tooltip }}
            >
              <div>
                <IconButton
                  onClick={this.hardware.isActive()? this.pause : this.start}
                  disabled={!this.hardware.isConnected()}
                  className={classes.playPauseButton}
                  style={{
                    opacity: this.hardware.isConnected()? 1 : 0,
                    width: 64*this.state.harp_ratio,
                    height: 64*this.state.harp_ratio,
                    left: `calc(50% - ${32*this.state.harp_ratio}px)`,
                    bottom: -32*this.state.harp_ratio,
                  }}
                >
                  {this.hardware.isActive()?
                    <PauseIcon
                      className={classes.playPauseIcon}
                      style={{
                        transform: `scale(${1.33*this.state.harp_ratio})`,
                        top: 0,
                        left: 12*1.33*this.state.harp_ratio,
                      }}
                    />
                  :
                    <PlayArrowIcon
                      className={classes.playPauseIcon}
                      style={{
                        transform: `scale(${1.33*this.state.harp_ratio})`,
                        top: 0,
                        left: 12*1.33*this.state.harp_ratio,
                      }}
                    />
                  }
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip
              title="Desconectar"
              enterDelay={500}
              classes={{ tooltip: classes.tooltip }}
              style={{ display: !this.hardware.isConnected() || this.hardware.isActive()? "none" : "inherit" }}
            >
              <div className={classes.disconnect}>
                <IconButton
                  onClick={this.disconnect}
                  disabled={!this.hardware.isConnected() || this.hardware.isActive()}
                >
                  <ClearIcon/>
                </IconButton>
              </div>
            </Tooltip>
          </div>

          {/* Camera *********************************************************/}
          <div className={classes.view}>
            <Camera ref="camera"
              midi={this.midi}
              device_id={this.state.device_id}
              brightness={this.state.brightness}
              contrast={this.state.contrast}
            />
          </div>
        </div>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={this.startCamera}
        >
          OpenCV
        </Button> */}

        {/* Controllers ******************************************************/}
        <div className={classes.controllers}>
          {/* Left ***********************************************************/}
          <div className={classes.column}>
            <div className={classes.selectsContainer}>
              {/* Tonic ******************************************************/}
              <FormControl
                variant="outlined"
                className={classes.field}
              >
                <InputLabel htmlFor="tonic" className={classes.fieldLabel}>
                  Tônica
                </InputLabel>
                <Select
                  value={this.state.tonic}
                  onChange={this.handleNumberChange("tonic")}
                  disabled={this.hardware.isActive()}
                  inputProps={{ id: "tonic" }}
                  input={
                    <OutlinedInput
                      className={classes.fieldOutline}
                      classes={{ input: classes.fieldText, notchedOutline: classes.fieldOutline }}
                    />
                  }
                  classes={{ root: classes.select, icon: this.hardware.isActive()? classes.selectIconDisabled : classes.selectIcon }}
                  MenuProps={{ classes: { paper: classes.selectMenu } }}
                >
                  {this.state.notes.map((note, i) => (
                    <MenuItem key={i} value={i}>{note.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Octave *****************************************************/}
              <FormControl
                variant="outlined"
                className={classes.field}
              >
                <InputLabel htmlFor="octave" className={classes.fieldLabel}>
                  Oitava
                </InputLabel>
                <Select
                  value={this.state.octave}
                  onChange={this.handleNumberChange("octave")}
                  disabled={this.hardware.isActive()}
                  inputProps={{ id: "octave" }}
                  input={
                    <OutlinedInput
                      className={classes.fieldOutline}
                      classes={{ input: classes.fieldText, notchedOutline: classes.fieldOutline }}
                    />
                  }
                  classes={{ root: classes.select, icon: this.hardware.isActive()? classes.selectIconDisabled : classes.selectIcon }}
                  MenuProps={{ classes: { paper: classes.selectMenu } }}
                >
                  {this.state.octaves.map(octave => (
                    <MenuItem key={octave} value={octave}>{octave}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Musical Scale **********************************************/}
              <FormControl
                variant="outlined"
                className={classes.field}
              >
                <InputLabel htmlFor="scale_id" className={classes.fieldLabel}>
                  Escala
                </InputLabel>
                <Select
                  value={this.state.scale_id}
                  onChange={this.handleNumberChange("scale_id")}
                  disabled={this.hardware.isActive()}
                  inputProps={{ id: "scale_id" }}
                  input={
                    <OutlinedInput
                      className={classes.fieldOutline}
                      classes={{ input: classes.fieldText, notchedOutline: classes.fieldOutline }}
                    />
                  }
                  classes={{ root: classes.select, icon: this.hardware.isActive()? classes.selectIconDisabled : classes.selectIcon }}
                  MenuProps={{ classes: { paper: classes.selectMenu } }}
                >
                  {this.state.scales.map((scale, i) => (
                    <MenuItem key={i} value={i}>{scale.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* Number of Strings ********************************************/}
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Número de cordas</Typography>
              <Slider
                value={Number(this.state.n_strings)}
                onChange={this.handleSliderChange("n_strings")}
                disabled={this.hardware.isActive()}
                min={this.state.n_strings_min}
                max={this.state.n_strings_max}
                marks
                className={classes.slider}
                classes={{ rail: classes.sliderRail, thumb: classes.sliderThumb, mark: classes.sliderMark, markActive: this.hardware.isActive()? classes.sliderMarkActiveDisabled : classes.sliderMarkActive }}
              />
              <TextField
                type="number"
                inputProps={{
                  min: this.state.n_strings_min,
                  max: this.state.n_strings_max
                }}
                value={this.state.n_strings}
                onChange={this.handleNumberChange("n_strings", this.state.n_strings_min, this.state.n_strings_max, true)}
                disabled={this.hardware.isActive()}
                margin="normal"
                variant="outlined"
                className={classes.field}
                InputProps={{ classes: { input: classes.fieldText, root: classes.fieldOutline, notchedOutline: classes.fieldOutline } }}
                InputLabelProps={{ classes: { root: classes.fieldLabel } }}
              />
            </div>
            {/* Angle between Strings ****************************************/}
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Ângulo entre as cordas</Typography>
              <Slider
                value={Number(this.state.angle_strings)}
                onChange={this.handleSliderChange("angle_strings")}
                disabled={this.hardware.isActive()}
                min={this.state.angle_strings_min}
                max={this.state.angle_strings_max}
                step={0.5}
                className={classes.slider}
                classes={{ rail: classes.sliderRail, thumb: classes.sliderThumb }}
              />
              <TextField
                type="number"
                inputProps={{
                  min: this.state.angle_strings_min,
                  max: this.state.angle_strings_max,
                  step: "0.5",
                }}
                value={this.state.angle_strings}
                onChange={this.handleNumberChange("angle_strings", this.state.angle_strings_min, this.state.angle_strings_max)}
                disabled={this.hardware.isActive()}
                margin="normal"
                variant="outlined"
                className={classes.field}
                InputProps={{ id: "angle_strings", classes: { input: classes.fieldText, root: classes.fieldOutline, notchedOutline: classes.fieldOutline } }}
                InputLabelProps={{ classes: { root: classes.fieldLabel } }}
              />
              <Typography
                className={classes.degree}
                style={{
                  right: this.getDegreeMargin(),
                  color: this.hardware.isActive()? "#848484" : "#009696",
                }}
              >
                °
              </Typography>
            </div>
          </div>
          {/* Right **********************************************************/}
          <div className={classes.column}>
            {/* Capture Device ***********************************************/}
            <FormControl
              variant="outlined"
              className={classes.field}
            >
              <InputLabel htmlFor="device_id" className={classes.fieldLabel}>
                Dispositivo de captura
              </InputLabel>
              <Select
                value={this.state.device_id}
                onChange={this.handleNumberChange("device_id")}
                inputProps={{ id: "device_id" }}
                input={
                  <OutlinedInput
                    className={classes.fieldOutline}
                    classes={{ input: classes.fieldText, notchedOutline: classes.fieldOutline }}
                  />
                }
                classes={{ root: classes.select, icon: this.hardware.isActive()? classes.selectIconDisabled : classes.selectIcon }}
                MenuProps={{ classes: { paper: classes.selectMenu } }}
              >
                {this.state.capture_devices.map((device, i) => (
                  <MenuItem key={i} value={i}>{device}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Brightness ***************************************************/}
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Brilho</Typography>
              <Slider
                value={Number(this.state.brightness)}
                onChange={this.handleSliderChange("brightness")}
                min={-100}
                max={100}
                className={classes.slider}
                classes={{ rail: classes.sliderRail, thumb: classes.sliderThumb }}
              />
              <TextField
                type="number"
                inputProps={{
                  min: "-100",
                  max: "100"
                }}
                value={this.state.brightness}
                onChange={this.handleNumberChange("brightness", -100, 100)}
                margin="normal"
                variant="outlined"
                className={classes.field}
                InputProps={{ classes: { input: classes.fieldText, root: classes.fieldOutline, notchedOutline: classes.fieldOutline } }}
                InputLabelProps={{ classes: { root: classes.fieldLabel } }}
              />
            </div>
            {/* Contrast *****************************************************/}
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Contraste</Typography>
              <Slider
                value={Number(this.state.contrast)}
                onChange={this.handleSliderChange("contrast")}
                min={-100}
                max={100}
                className={classes.slider}
                classes={{ rail: classes.sliderRail, thumb: classes.sliderThumb }}
              />
              <TextField
                type="number"
                inputProps={{
                  min: "-100",
                  max: "100"
                }}
                value={this.state.contrast}
                onChange={this.handleNumberChange("contrast", -100, 100)}
                margin="normal"
                variant="outlined"
                className={classes.field}
                InputProps={{ classes: { input: classes.fieldText, root: classes.fieldOutline, notchedOutline: classes.fieldOutline } }}
                InputLabelProps={{ classes: { root: classes.fieldLabel } }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/******************************************************************************/
export default withStyles(styles)(Home)
/******************************************************************************/
