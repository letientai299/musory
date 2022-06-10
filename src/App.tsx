import React, { ReactElement } from 'react'
import { Main } from './layouts/Main'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { GiMetronome, GiMusicalNotes, GiMusicalScore } from 'react-icons/gi'
import { Card } from './components/Card'

const Sight = React.lazy(() => import('./pages/Sight'))
const Pitch = React.lazy(() => import('./pages/Pitch'))
const Metronome = React.lazy(() => import('./pages/Metronome'))

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
          <Link key={p.route} to={p.route}>
            <Card
              key={p.route}
              name={p.title}
              icon={p.icon}
              description={p.description}
            />
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
            key={p.route}
            path={p.route}
            element={
              <Main title={p.title}>
                <React.Suspense fallback={<div>Loading...</div>}>
                  {p.element}
                </React.Suspense>
              </Main>
            }
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
