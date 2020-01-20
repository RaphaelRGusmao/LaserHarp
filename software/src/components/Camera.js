/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                             Component: Camera                              */
/******************************************************************************/

import React, { Component } from "react"
import cv from "opencv4nodejs"
import { withStyles } from "@material-ui/core/styles"

/******************************************************************************/
/* Styles                                                                     */
/******************************************************************************/
const styles = theme => ({
  canvas: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
})

/******************************************************************************/
/* Camera                                                                     */
/******************************************************************************/
class Camera extends Component {
  state = {
    device_id: 0,
    brightness: 0,
    contrast: 0,
  }

  /****************************************************************************/
  /* Lifecycle                                                                */
  /****************************************************************************/
  componentDidMount() {}

  /****************************************************************************/
  /* OpenCV                                                                   */
  /****************************************************************************/
  openCV = () => {
    let capture = new cv.VideoCapture(this.state.device_id)
    setTimeout(this.processVideo(capture), 0)
  }

  /****************************************************************************/
  processVideo = (capture) => () => {
    let begin = Date.now()
    //////////

    let frame = capture.read() // asyncRead
    // frame = frame.resize(400, 400)
    // frame = frame.cvtColor(cv.COLOR_BGR2RGBA)

    //////////
    this.renderFrame(frame, document.getElementById("camera"))
    let delay = 33 - (Date.now() - begin)
    setTimeout(this.processVideo(capture), delay)
  }

  /****************************************************************************/
  renderFrame = (frame, canvas) => {
    let clamped = new Uint8ClampedArray(frame.getData())
    let imgData = new ImageData(clamped, frame.cols, frame.rows)
    canvas.height = frame.rows
    canvas.width = frame.cols
    let ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, frame.cols, frame.rows)
    ctx.putImageData(imgData, 0, 0)
  }

  /****************************************************************************/
  render() {
    const { classes } = this.props

    // console.log(JSON.stringify(this.state, null, 2))

    /**************************************************************************/
    return <canvas id="camera" className={classes.canvas}/>
  }
}

/******************************************************************************/
export default withStyles(styles)(Camera)
/******************************************************************************/
