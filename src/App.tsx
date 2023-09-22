import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Gauge, GaugeProps } from './Gauge'
import { interpolatePlasma } from 'd3-scale-chromatic'
import Chance from 'chance'
import chroma from 'chroma-js'
import {useControls} from 'leva'

import '@fontsource-variable/inter'
import '@fontsource-variable/inter-tight'
import '@fontsource/merriweather'
import '@fontsource/mononoki'

const chance = new Chance()

const Example = ({gaugeProps}: {gaugeProps: GaugeProps}) => {
  const [value, setValue] = useState(gaugeProps.value)

  const randomize = () => setValue(chance.floating({
    min: gaugeProps.minValue ?? 0,
    max: gaugeProps.maxValue ?? 100
  }))

  return (
    <div
      onClick={randomize}
      style={{
        width: 250,
        height: 250,
      }}
    >
      <Gauge {...gaugeProps} value={value} />
    </div>
  )
}

function App() {
  return (
    <>
      <Example
        gaugeProps={{}}
      />
      <Example
        gaugeProps={{
          renderValue: ({roundedValue: formattedValue}) => `${formattedValue}%`
        }}
      />
      <Example
        gaugeProps={{
          value: 50,
          minValue: 0,
          maxValue: 100,
          renderTopLabel: ({value}) => value >= 50 ? 'hot' : 'cold',
          renderBottomLabel: '°C',
          arcColor: ({normalizedValue}) => chroma.scale(['red', 'blue'])(normalizedValue),
          topLabelStyle: {
            fontSize: 20,
            backgroundColor: 'hsl(0 0% 0%)',
            padding: '4px 8px',
            borderRadius: 8
          }
        }}
      />
      <Example
        gaugeProps={{
          value: 50,
          minValue: 0,
          maxValue: 100,
          renderValue: ({roundedValue}) => `${roundedValue}m`,
          renderBottomLabel: 'altitude',
          bottomLabelStyle: {fontSize: 20},
          roundDigits: 1,
          style: {fontFamily: 'Mononoki'},
          startAngle: 45,
          endAngle: 315 // add epsilon to track rendering angles to fix artifact
          // valueStyle: {fontFamily: 'Mononoki'}
        }}
      />
      <Example
        gaugeProps={{
          minValue: 0,
          maxValue: 100,
          renderValue: ({roundedValue}) => `${roundedValue}m`, // greater than/less than when out of bounds
          renderBottomLabel: 'altitude',
          bottomLabelStyle: {fontSize: 20},
          roundDigits: 1,
          style: {fontFamily: 'Mononoki'},
          startAngle: 45,
          endAngle: 315, // add epsilon to track rendering angles to fix artifact
          // valueStyle: {fontFamily: 'Mononoki'}
          arcWidth: 0.25,
          arcCornerRadius: 0.25,
          trackCornerRadius: 0.25
        }}
      />
    </>
  )
}

export default App
