import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { DebounceInput } from 'react-debounce-input'
import { GiPauseButton, GiPlayButton } from 'react-icons/gi'
import { Loop, Synth, Transport } from 'tone'

class timeSignature {
  str: string
  beats: number // how many beat per measure
  note: number // what kind of note per beat
  constructor(sign: string) {
    this.str = sign
    const ss = sign.split('/')
    if (ss.length != 2) {
      this.beats = 0
      this.note = 0
      return
    }
    this.beats = Number.parseInt(ss[0])
    this.note = Number.parseInt(ss[1])
  }
}

const timeSignatures: timeSignature[] = ['2/2', '2/4', '3/4', '4/4'].map(
  (s) => new timeSignature(s)
)

const TimeSignature = (p: {
  active: boolean
  sign: timeSignature
  onClick: (str: string) => void
}) => {
  let cls =
    'flex border m-6 p-6 flex-col items-center text-center text-3xl font-bold ' +
    'border-4 hover:border-cyan-500'
  if (p.active) {
    cls += ' border-cyan-700'
  }

  return (
    <button className={cls} onClick={() => p.onClick(p.sign.str)}>
      <p>{p.sign.beats}</p>
      <p>{p.sign.note}</p>
    </button>
  )
}

const defaultBMP = 100
const minBMP = 10
const maxBMP = 200
const safeBmp = (pre: number, n: number) => {
  if (Number.isNaN(n)) {
    return pre
  }

  if (n < minBMP) {
    return minBMP
  }

  if (n > maxBMP) {
    return maxBMP
  }

  return n
}

let toneLoop: Loop

function togglePlaying(playing: boolean, bpm: number, sign: string) {
  if (toneLoop) {
    toneLoop.stop(0)
  }

  if (!playing) {
    return
  }

  const timeSign = new timeSignature(sign)

  const synth = new Synth().toDestination()
  let count = 0
  toneLoop = new Loop((time) => {
    if (sign != '' && count % timeSign.beats == 0) {
      synth.triggerAttackRelease('B2', 0.01, time)
    } else {
      synth.triggerAttackRelease('G2', 0.01, time)
    }
    count++
  }).start(0)
  Transport.bpm.rampTo(bpm)
  Transport.start()
}

const Metronome = () => {
  const [bmp, setBmp] = useState(defaultBMP)
  const [playing, setPlaying] = useState(false)
  const [signature, setSignature] = useState('')

  useHotkeys('up', () => setBmp((pre) => safeBmp(pre, pre + 1)))
  useHotkeys('k', () => setBmp((pre) => safeBmp(pre, pre + 1)))
  useHotkeys('down', () => setBmp((pre) => safeBmp(pre, pre - 1)))
  useHotkeys('j', () => setBmp((pre) => safeBmp(pre, pre - 1)))

  useHotkeys('Enter', () => setPlaying((pre) => !pre))
  useHotkeys('Space', () => setPlaying((pre) => !pre))

  togglePlaying(playing, bmp, signature)

  return (
    <div className="m-auto flex flex-col center items-center">
      <DebounceInput
        autoFocus
        type="number"
        debounceTimeout={200}
        value={bmp}
        onChange={(e) =>
          setBmp((pre) => safeBmp(pre, Number.parseInt(e.target.value)))
        }
        className="text-9xl m-auto w-1/2 text-center outline-none appearance-none"
      />
      <p className="text-3xl">BMP</p>

      <button
        id="btn-play"
        className="text-9xl"
        onMouseDown={() => setPlaying(!playing)}
      >
        {playing ? <GiPauseButton /> : <GiPlayButton />}
      </button>

      <div className="flex flex-row">
        {timeSignatures.map((sign) => {
          const active = signature != '' && signature == sign.str
          return (
            <TimeSignature
              active={active}
              key={sign.str}
              sign={sign}
              onClick={setSignature}
            />
          )
        })}
      </div>

      <article className="prose">
        <ul>
          <li>
            <kbd>Up</kbd> or <kbd>j</kbd> to increase the BMP.
          </li>
          <li>
            <kbd>Down</kbd> or <kbd>k</kbd> to increase the BMP.
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle playing.
          </li>
          <li>
            Hit <kbd>Tab</kbd> or click outside of BMP input if can't toggle
            playing using shortcuts
          </li>
        </ul>
      </article>
    </div>
  )
}

export default Metronome
