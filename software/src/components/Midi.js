/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/*                                                                            */
/*                              Component: Midi                               */
/******************************************************************************/

import easymidi from "easymidi"

/******************************************************************************/
/* Midi                                                                       */
/******************************************************************************/
export class Midi {
  output = null
  is_open = false

  /****************************************************************************/
  /* Methods                                                                  */
  /****************************************************************************/
  constructor() {}

  /****************************************************************************/
  connect = () => {
    if (process.platform == "win32") {
      let virtualPort = this.getVirtualPort("LASERHARP")
      if (virtualPort == null) return
      this.output = new easymidi.Output(virtualPort)
    } else {
      this.output = new easymidi.Output("LASERHARP", true)
    }
    this.is_open = true
    console.log("MIDI CONNECTED!")
  }

  /****************************************************************************/
  getVirtualPort = (name) => {
    return easymidi.getOutputs().find(out => out.includes(name))
  }

  /****************************************************************************/
  isOpen = () => {
    if (!this.is_open) {
      this.connect()
    } else if (process.platform == "win32") {
      let virtualPort = this.getVirtualPort("LASERHARP")
      console.log(virtualPort)
      if (virtualPort == null) {
        this.is_open = false
        console.log("MIDI DISCONNECTED!")
      }
    }
    return this.is_open
  }

  /****************************************************************************/
  play = (note, intensity) => {
    console.log("%cPLAY\t" + note.name + note.octave + "\t" + intensity*100 + "%", "background: #000000; color: #ffffff;")
    this.output.send("noteon", {
      note: note.baseMidi + 12*note.octave,
      velocity: Math.min(Math.max(Math.round(127*intensity), 0), 127),
      channel: 0,
    })
  }

  /****************************************************************************/
  release = (note, intensity) => {
    console.log("%cRELEASE\t" + note.name + note.octave + "\t" + intensity*100 + "%", "background: #000000; color: #ffffff;")
    this.output.send("noteoff", {
      note: note.baseMidi + 12*note.octave,
      velocity: Math.min(Math.max(Math.round(127*intensity), 0), 127),
      channel: 0,
    })
  }

  /****************************************************************************/
  beep = (note, intensity) => {
    this.play(note, intensity)
    setTimeout(() => this.release(note, intensity), 100)
  }
}

/******************************************************************************/
