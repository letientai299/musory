import { useEffect, useRef } from 'react'
import Notes from '../util/notes'

import {
  Accidental,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  Voice,
} from 'vexflow'
import { Note } from '@tonaljs/tonal'

type SingleNoteProps = {
  /** Name of the note, e.g: A2, Bb4, ... */
  name: string // name of the note to be rendered
  /**
   * Preferred clef to put the note on sheet music.
   * If not provided, then it's auto calculated.
   * The result should contain the least ledger lines.
   */
  clef?: string
  readonly scale?: number
}

const defaultScaleFactor = 1
const paddingX = 10

/**
 *  SingleNote renders a single note on the sheet music,
 */
const SingleNote = (p: SingleNoteProps) => {
  const sheet = useRef<HTMLDivElement>(null)
  const detectClef = (p: SingleNoteProps): string => {
    return p.clef
      ? p.clef
      : p.name
      ? Notes.preferredClef(p.name)
      : Notes.ClefTreble
  }
  const scaleFactor = p.scale ? p.scale : defaultScaleFactor

  const renderStave = (div: HTMLDivElement, clef: string): Stave => {
    const divStyle = window.getComputedStyle(div)
    const w = Number.parseInt(divStyle.width)
    const h = 150 * scaleFactor

    const renderer = new Renderer(div, Renderer.Backends.SVG)
    renderer.resize(w, h)
    const ctx = renderer.getContext()

    ctx.scale(scaleFactor, scaleFactor)

    const stave = new Stave(paddingX, 0, w / scaleFactor - 2 * paddingX)
    stave.addClef(clef)
    stave.setContext(ctx).draw()
    return stave
  }

  useEffect(() => {
    if (!sheet || !sheet.current) {
      return
    }

    const clef = detectClef(p)
    const div = sheet.current
    const reset = () => {
      div.childNodes.forEach((n) => div.removeChild(n))
    }
    reset()

    const stave = renderStave(div, clef)

    if (!p.name) {
      return reset // no note to draw
    }

    const voice = new Voice()
    voice.setMode(Voice.Mode.FULL)

    const note = Note.get(p.name)
    const staveNote = new StaveNote({
      keys: [`${note.letter}${note.acc ? note.acc : ''}/${note.oct}`],
      duration: 'q',
      clef: clef,
      auto_stem: true,
      align_center: true,
    })

    // hard-coded the padding value to make the note center,
    // until we know how to calculate exact note and accidental size.
    let notePadding = 70
    if (note.acc) {
      staveNote.addModifier(new Accidental(note.acc))
      notePadding = 50
    }

    voice.addTickable(staveNote)

    const measureWidth = stave.getWidth() - notePadding
    new Formatter().joinVoices([voice]).format([voice], measureWidth)
    voice.draw(stave.getContext(), stave)
    return reset
  }, [sheet, p.name])

  return <div ref={sheet} className={'w-full'} />
}

export default SingleNote
