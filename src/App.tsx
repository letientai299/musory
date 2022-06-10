import React from 'react'
import { Card } from './components/Card'
import { GiMetronome, GiMusicalNotes, GiMusicalScore } from 'react-icons/gi'

export default function App() {
  return (
    <div>
      <Card
        name="Practice Sight Reading"
        description="Quickly select the correct names of the notes"
        icon={<GiMusicalScore />}
      />
      <Card
        name="Practice Perfect Pitch"
        description="Quickly select the correct names of the sound"
        icon={<GiMusicalNotes />}
      />
      <Card
        name="Metronome"
        description="Configurable metronome simulator"
        icon={<GiMetronome />}
      />
    </div>
  )
}
