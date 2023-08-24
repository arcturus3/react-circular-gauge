import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Gauge } from './Gauge'
import { interpolatePlasma } from 'd3-scale-chromatic'
import Chance from 'chance'

import '@fontsource-variable/inter'
import '@fontsource-variable/inter-tight'
import '@fontsource/merriweather'
import '@fontsource/mononoki'

const chance = new Chance()

function App() {
  const minTemperature = -100
  const maxTemperature = 200
  const [temperature, setTemperature] = useState(minTemperature)
  const [count, setCount] = useState(0)

  // let valuePrefix = '' // this should be set when interpolating value
  // if (props.value < clampedValue) valuePrefix = '<'
  // if (props.value > clampedValue) valuePrefix = '>'

  const randomizeTemperature = () => {
    setTemperature(chance.integer({min: minTemperature, max: maxTemperature}))
  }

  return (
    <div
      onClick={randomizeTemperature}
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        width: 200,
        height: 200,
        cursor: 'pointer'
      }}
    >
      <Gauge
        value={temperature}
        minValue={minTemperature}
        maxValue={maxTemperature}
        direction='cw'
        renderBottomLabel='°C'
        arcColor={({normalizedValue}) => interpolatePlasma(normalizedValue)}
        arcWidth={0.1}
        animated={true}
        // arcCornerRadius={0}
      />
    </div>
  )

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
