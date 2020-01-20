/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                              Component: Harp                               */
/******************************************************************************/

import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import Konva from "konva"
import {
  Stage, Layer, Group, Line, Shape, Circle, Text
} from "react-konva"

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
/* Harp                                                                       */
/******************************************************************************/
class Harp extends Component {
  state = {
    is_connected: false,
    is_active: false,
    w: 0,
    h: 0,
    ratio: 1,
    lasers_played: [],
  }

  /****************************************************************************/
  /* Lifecycle                                                                */
  /****************************************************************************/
  componentDidMount() {
    this.updateSize()
    window.addEventListener("resize", this.updateSize)
  }

  /****************************************************************************/
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize)
  }

  /****************************************************************************/
  /* Others                                                                   */
  /****************************************************************************/
  updateSize = () => {
    this.setState({
      w: this.refs.container.offsetWidth,
      h: this.refs.container.offsetHeight,
      ratio: Math.max(this.refs.container.offsetWidth/512, 1),
    })
    this.props.home.setState({
      harp_ratio: this.state.ratio
    })
  }

  /****************************************************************************/
  getInitialAngle = () => {
    return -(this.props.n_strings-1)*this.props.angle_strings/2
  }

  /****************************************************************************/
  getAngle = (i) => {
    return -(this.props.n_strings-1)*this.props.angle_strings/2 + i*this.props.angle_strings
  }

  /****************************************************************************/
  toRadians = (angle) => {
    return angle*(Math.PI/180)
  }

  /****************************************************************************/
  getLasers = () => {
    let notes_from_tonic = this.props.notes.slice(this.props.tonic).concat(this.props.notes.slice(0, this.props.tonic))
    let scale_notes = notes_from_tonic.filter((note, i) => this.props.scales[this.props.scale_id].pattern[i])
    let n_notes = scale_notes.length
    let lasers = new Array(this.props.n_strings).fill(null).map((_, i) => ({...scale_notes[i%n_notes]}))
    let first_note_octave = this.props.notes[Math.max(this.props.scales[this.props.scale_id].pattern.slice(12-this.props.tonic).findIndex(i => i==1), 0)].name
    lasers[0].octave = this.props.octave
    lasers.forEach((note, i) => {
      if (i > 0) {
        note.octave = lasers[i-1].octave
        if (note.name == first_note_octave) note.octave++
      }
      note.id = i
    })
    return lasers
  }

  /****************************************************************************/
  getParams = () => {
    return this.getLasers().map((laser) => laser.isSharp?0:1).join("") + " " + this.props.angle_strings
  }

  /****************************************************************************/
  setConnected = (value) => {
    this.refs.base.to({
      y: value? this.state.h : this.state.h/2,
      radius: value? 32*Math.max(this.state.w/512, 1) : 32,
      duration: 0.25,
    })
    this.refs.lasers.to({
      opacity: value? 1 : 0,
      easing: (t, b, c, d) => value? (c * (t /= d) * t * t * t * t + b) : (c * ((t = t / d - 1) * t * t * t * t + 1) + b),
      duration: value? 0.50 : 0.25,
    })
    this.setState({
      is_connected: value,
    })
  }

  /****************************************************************************/
  setActive = (value) => {
    this.setState({
      is_active: value,
    })
  }

  /****************************************************************************/
  mouseOver = (laser_i) => () => {
    document.body.style.cursor = "pointer"
    this.setState({
      laser_hover_i: laser_i,
    })
  }

  /****************************************************************************/
  mouseOut = () => {
    document.body.style.cursor = "default"
    this.setState({
      laser_hover_i: null,
    })
  }

  /****************************************************************************/
  play = (laser) => () => {
    if (this.props.midi.isOpen()) this.props.midi.play(laser, 1)
    if (this.isPlayed(laser)) return
    let lasers_played = [...this.state.lasers_played]
    lasers_played.push(laser)
    this.setState({
      lasers_played: lasers_played,
    })
  }

  /****************************************************************************/
  release = (laser) => () => {
    if (this.props.midi.isOpen()) this.props.midi.release(laser, 1)
    let lasers_played = [...this.state.lasers_played]
    lasers_played = lasers_played.filter((laser_played) => laser_played.id != laser.id)
    this.setState({
      lasers_played: lasers_played,
    })
  }

  /****************************************************************************/
  isPlayed = (laser) => {
    return this.state.lasers_played.find((laser_played) => laser_played.id == laser.id) != null
  }

  /****************************************************************************/
  render() {
    const { classes } = this.props

    let base_radius = 32*this.state.ratio
    let origin_x = this.state.w/2
    let origin_y = this.state.h-base_radius
    let circle_radius = 16*this.state.ratio
    let circle_length = this.state.w/2
    let note_size = 16*this.state.ratio
    let octave_size = 12*this.state.ratio
    let glow_size = 16*this.state.ratio
    let mirror_length = this.state.w/8

    /**************************************************************************/
    return (
      <div className={classes.canvas} ref="container">
        <Stage width={this.state.w} height={this.state.h}>
          <Layer ref="lasers" opacity={this.state.is_connected? 1 : 0}>
            {this.getLasers().map((laser) => (
              <Group key={laser.id}>
                <Line
                  x={origin_x}
                  y={origin_y}
                  points={[0, 0, 0, this.isPlayed(laser)? -this.state.w/2 : -this.state.w]}
                  rotation={this.getAngle(laser.id)}
                  stroke={
                    this.state.is_active?
                      (laser.isSharp? "#3F51B5" : "#4CAF50")
                    :
                      (this.isPlayed(laser)? (laser.isSharp? "#3F51B5" : "#4CAF50") : "#424242")
                  }
                  shadowColor={laser.isSharp? "#3F51B5" : "#4CAF50"}
                  shadowBlur={this.state.is_active || this.isPlayed(laser)? glow_size : 0}
                  shadowOpacity={0.5}
                />
                {this.state.is_connected?
                  <Group>
                    <Shape
                      sceneFunc={(context, shape) => {
                        context.beginPath()
                        context.moveTo(
                          origin_x + Math.sqrt((Math.pow(circle_length, 2)) + Math.pow(circle_radius, 2))*Math.cos(this.toRadians(90 - this.getAngle(laser.id)) + Math.atan(circle_radius/circle_length)),
                          origin_y - Math.sqrt((Math.pow(circle_length, 2)) + Math.pow(circle_radius, 2))*Math.sin(this.toRadians(90 - this.getAngle(laser.id)) + Math.atan(circle_radius/circle_length))
                        )
                        context.lineTo(
                          origin_x + Math.sqrt((Math.pow(circle_length, 2)) + Math.pow(circle_radius, 2))*Math.cos(this.toRadians(90 - this.getAngle(laser.id)) - Math.atan(circle_radius/circle_length)),
                          origin_y - Math.sqrt((Math.pow(circle_length, 2)) + Math.pow(circle_radius, 2))*Math.sin(this.toRadians(90 - this.getAngle(laser.id)) - Math.atan(circle_radius/circle_length))
                        )
                        context.lineTo(
                          origin_x + (circle_length - 2*circle_radius)*Math.cos(this.toRadians(90 - this.getAngle(laser.id))),
                          origin_y - (circle_length - 2*circle_radius)*Math.sin(this.toRadians(90 - this.getAngle(laser.id)))
                        )
                        context.closePath()
                        context.fillStrokeShape(shape)
                      }}
                      fill={laser.isSharp? "#303F9F" : "#388E3C"}
                    />

                    <Circle
                      x={origin_x + circle_length*Math.cos(this.toRadians(90 - this.getAngle(laser.id)))}
                      y={origin_y - circle_length*Math.sin(this.toRadians(90 - this.getAngle(laser.id)))}
                      radius={circle_radius}
                      fill={laser.isSharp? "#303F9F" : "#388E3C"}
                      stroke={laser.isSharp? "#3F51B5" : "#4CAF50"}
                      shadowColor={laser.isSharp? "#3F51B5" : "#4CAF50"}
                      shadowBlur={this.state.is_active || this.isPlayed(laser)? glow_size : 0}
                      shadowOpacity={0.5}
                    />

                    <Text
                      x={laser.isSharp?
                        origin_x - 0.625*note_size + circle_length*Math.cos(this.toRadians(90 - this.getAngle(laser.id)))
                      :
                        origin_x - 0.375*note_size + circle_length*Math.cos(this.toRadians(90 - this.getAngle(laser.id)))
                      }
                      y={origin_y - 0.375*note_size - circle_length*Math.sin(this.toRadians(90 - this.getAngle(laser.id)))}
                      fontSize={note_size}
                      text={laser.name}
                      fill="#ffffff"
                    />

                    <Circle
                      onMouseOver={this.play(laser)} onMouseOut={this.release(laser)}
                      onTouchStart={this.play(laser)} onTouchEnd={this.release(laser)}
                      x={origin_x + circle_length*Math.cos(this.toRadians(90 - this.getAngle(laser.id)))}
                      y={origin_y - circle_length*Math.sin(this.toRadians(90 - this.getAngle(laser.id)))}
                      radius={circle_radius}
                      fill="#00000000"
                    />

                    <Text
                      x={origin_x - 0.250*octave_size + (circle_length - 1.25*circle_radius)*Math.cos(this.toRadians(90 - this.getAngle(laser.id)))}
                      y={origin_y - 0.416*octave_size - (circle_length - 1.25*circle_radius)*Math.sin(this.toRadians(90 - this.getAngle(laser.id)))}
                      fontSize={octave_size}
                      text={laser.octave.toString()}
                      fill="#ffffff"
                    />
                  </Group>
                :null}
              </Group>
            ))}
          </Layer>
          <Layer>
            <Circle
              ref="base"
              x={origin_x}
              y={this.state.is_connected? this.state.h : this.state.h/2}
              radius={this.state.is_connected? base_radius : 32}
              fill="#424242"
            />
            {this.state.lasers_played.map((laser) => (
              <Group key={laser.id}>
                <Line
                  x={laser.isSharp? 0 : origin_x}
                  y={origin_y}
                  points={[0, 0, this.state.w/2, 0]}
                  stroke={laser.isSharp? "#3F51B5" : "#4CAF50"}
                  shadowColor={laser.isSharp? "#3F51B5" : "#4CAF50"}
                  shadowBlur={glow_size}
                  shadowOpacity={0.5}
                />
                <Line
                  x={origin_x}
                  y={origin_y}
                  points={[-mirror_length/2, 0, mirror_length/2, 0]}
                  rotation={laser.isSharp? (-45+this.getAngle(laser.id)/2) : (45+this.getAngle(laser.id)/2)}
                  stroke="#828282"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    )
  }
}

/******************************************************************************/
export default withStyles(styles)(Harp)
/******************************************************************************/
