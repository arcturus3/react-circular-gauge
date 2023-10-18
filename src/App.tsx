import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { Gauge, GaugeProps } from './Gauge'
import { interpolatePlasma } from 'd3-scale-chromatic'
import Chance from 'chance'
import chroma from 'chroma-js'
import {useControls} from 'leva'

import '@fontsource-variable/inter'
import '@fontsource-variable/inter-tight'
import '@fontsource/merriweather'
import '@fontsource/mononoki'

/*

  font-family: 'Inter Variable', sans-serif;
  /* font-family: 'Inter Tight Variable', sans-serif; */
  /* font-family: 'Merriweather', sans-serif; */
  /* font-family: 'Mononoki', sans-serif; */
  
const chance = new Chance()

type ExampleProps = {
  gaugeProps: GaugeProps,
  mode: 'light' | 'dark',
}

const Example = (props: ExampleProps) => {
  const [value, setValue] = useState(props.gaugeProps.value)

  const randomize = () => setValue(chance.floating({
    min: props.gaugeProps.minValue ?? 0,
    max: props.gaugeProps.maxValue ?? 100
  }))

  return (
    <div
      onClick={randomize}
      style={{
        maxWidth: 250,
        maxHeight: 250,
        padding: 25,
        borderRadius: 50,
        color: props.mode === 'light'
          ? '#000000'
          : '#ffffff',
        backgroundColor: props.mode === 'light'
          ? 'hsl(0, 0%, 90%)'
          : 'hsl(0, 0%, 10%)',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      <Gauge {...props.gaugeProps} value={value} />
    </div>
  )
}

function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 50}}>
      <Example
        mode='dark'
        gaugeProps={{
          arcColor: ({normalizedValue}) => chroma.scale(['red', 'blue'])(normalizedValue),
        }}
      />
      <Example
        mode='light'
        gaugeProps={{
          trackColor: '#1b1b1b',
          arcColor: '#00b9e8',
          direction: 'ccw',
          startAngle: 0,
          endAngle: 90,
          trackWidth: 0.16,
          arcWidth: 0.04,
          springConfig: undefined,
          renderValue: ({roundedValue: formattedValue}) => `${formattedValue}%`
        }}
      />
      <Example
        mode='light'
        gaugeProps={{
          minValue: 0,
          maxValue: 10,
          trackColor: '#98817B',
          arcColor: '#AA98A9',
          arcWidth: 0.3,
          arcCornerRadius: 0.1,
          trackCornerRadius: 0.1,
          valueStyle: { // doesn't work using style prop???
            fontSize: 100,
            fontWeight: 600,
          },
          startAngle: 45,
          endAngle: 315 // add epsilon to track rendering angles to fix artifact
        }}
      />
      <Example
        mode='dark'
        gaugeProps={{
          value: 50,
          minValue: 0,
          maxValue: 100,
          trackColor: '#98817B',
          arcColor: '#AA98A9',
          renderTopLabel: ({value}) => value >= 50 ? 'hot' : 'cold',
          renderBottomLabel: '°C',
          topLabelStyle: {
            fontSize: 20,
            backgroundColor: 'hsl(0 0% 0%)',
            padding: '4px 8px',
            borderRadius: 8
          }
        }}
      />
      <Example
        mode='dark'
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
          trackCornerRadius: 0.25,
          animated: false,
        }}
      />
      <Example
        mode='dark' // mega arc size, invisible track, needle
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
          trackCornerRadius: 0.25,
          animated: false,
        }}
      />
    </div>
  )
}

export default App
