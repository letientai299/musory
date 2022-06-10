import React, { ReactElement } from 'react'
import { Main } from './layouts/Main'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Metronome } from './pages/Metronome'
import { Sight } from './pages/Sight'
import { Pitch } from './pages/Pitch'
import { GiMetronome, GiMusicalNotes, GiMusicalScore } from 'react-icons/gi'
import { Card } from './components/Card'

type tool = {
  route: string
  title: string
  description: string
  icon: ReactElement
  element: ReactElement
}

const tools: tool[] = [
  {
    route: '/sight',
    title: 'Practice Sight Reading',
    description: 'Quickly select the correct names of the notes',
    icon: <GiMusicalScore />,
    element: <Sight />,
  },
  {
    route: '/pitch',
    title: 'Practice Perfect Pitch',
    description: 'Quickly select the correct names of the sound',
    icon: <GiMusicalNotes />,
    element: <Pitch />,
  },
  {
    route: '/metronome',
    title: 'Metronome',
    description: 'Configurable metronome simulator',
    icon: <GiMetronome />,
    element: <Metronome />,
  },
]

function createHome() {
  return (
    <Main>
      <div>
        {tools.map((p) => (
          <Link to={p.route}>
            <Card name={p.title} icon={p.icon} description={p.description} />
          </Link>
        ))}
      </div>
    </Main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={createHome()} />

        {tools.map((p) => (
          <Route
            path={p.route}
            element={<Main title={p.title}>{p.element}</Main>}
          />
        ))}

        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
