import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { DebounceInput } from 'react-debounce-input'
import { GiPauseButton, GiPlayButton } from 'react-icons/gi'

const minBmp = 10
const maxBPM = 200
const safeBmp = (pre: number, n: number) => {
  if (Number.isNaN(n)) {
    return pre
  }

  if (n < minBmp) {
    return minBmp
  }

  if (n > maxBPM) {
    return maxBPM
  }

  return n
}

const Metronome = () => {
  const [bmp, setBmp] = useState(60)
  const [playing, setPlaying] = useState(false)

  useHotkeys('up', () => setBmp((pre) => safeBmp(pre, pre + 1)))
  useHotkeys('k', () => setBmp((pre) => safeBmp(pre, pre + 1)))
  useHotkeys('down', () => setBmp((pre) => safeBmp(pre, pre - 1)))
  useHotkeys('j', () => setBmp((pre) => safeBmp(pre, pre - 1)))

  useHotkeys('Enter', () => setPlaying((pre) => !pre))
  useHotkeys('Space', () => setPlaying((pre) => !pre))

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

      <button
        id="btn-play"
        className="text-9xl"
        onMouseDown={() => setPlaying(!playing)}
      >
        {playing ? <GiPauseButton /> : <GiPlayButton />}
      </button>

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
