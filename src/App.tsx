import { useState } from 'react'
import { animated, config } from '@react-spring/web'
import { TbNeedle } from 'react-icons/tb'
import Chance from 'chance'
import chroma from 'chroma-js'
import { Gauge, GaugeProps } from './Gauge'
import '@fontsource-variable/inter'
import '@fontsource/merriweather'
import '@fontsource/mononoki'

const chance = new Chance()

type ExampleProps = {
  mode: 'light' | 'dark'
  randomize: () => number
  gaugeProps: GaugeProps
}

const Example = (props: ExampleProps) => {
  const [value, setValue] = useState(props.randomize())

  return (
    <div
      onClick={() => setValue(props.randomize())}
      style={{
        maxWidth: 250,
        maxHeight: 250,
        padding: 25,
        borderRadius: 50,
        color: props.mode === 'light'
          ? '#000000'
          : '#ffffff',
        backgroundColor: props.mode === 'light'
          ? '#e6e6e6'
          : '#1a1a1a',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      <Gauge {...props.gaugeProps} value={value} />
    </div>
  )
}

export const App = () => {
  return (
    <>
      <div style={{marginBottom: 50, fontSize: 18, lineHeight: 1.5}}>
        <h1>react-circular-gauge</h1>
        <p>Click on a gauge to randomize it</p>
        <a href='https://github.com/arcturus3/react-circular-gauge'>Check out the source</a>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 50}}>
        <Example
          mode='dark'
          randomize={() => chance.floating({min: 0, max: 100})}
          gaugeProps={{
            trackWidth: 0,
            arcColor: ({normalizedValue}) => chroma.scale(['#0061ff', '#60efff']).correctLightness()(normalizedValue).css(),
          }}
        />
        <Example
          mode='light'
          randomize={() => chance.floating({min: 0, max: 100})}
          gaugeProps={{
            trackColor: '#1b1b1b',
            arcColor: '#dc143c',
            direction: 'ccw',
            startAngle: 0,
            endAngle: 90,
            trackWidth: 0.25,
            arcWidth: 0.05,
            springConfig: config.stiff,
            renderValue: ({roundedValue: formattedValue}) => `${formattedValue}%`,
            valueStyle: {
              color: '#1b1b1b',
              fontFamily: 'Merriweather, sans-serif',
            }
          }}
        />
        <Example
          mode='light'
          randomize={() => chance.integer({min: 0, max: 10})}
          gaugeProps={{
            minValue: 0,
            maxValue: 10,
            trackColor: '#98817b',
            arcColor: '#aa98a9',
            arcWidth: 0.3,
            arcCornerRadius: 0.1,
            trackCornerRadius: 0.1,
            valueStyle: {
              fontSize: '150%',
              fontWeight: 600,
            },
            startAngle: 45,
            endAngle: 315,
          }}
        />
        <Example
          mode='dark'
          randomize={() => chance.floating({min: -100, max: 100})}
          gaugeProps={{
            value: 0,
            minValue: -50,
            maxValue: 50,
            trackColor: '#000000',
            arcColor: ({normalizedValue}) => chroma.scale(['#140b34','#84206b','#e55c30','#f6d746']).correctLightness()(normalizedValue).css(),
            renderTopLabel: ({value}) => value >= 0 ? 'hot' : 'cold',
            renderBottomLabel: '°C',
            renderValue: ({value, roundedValue, rawValue}) => {
              const minValue = -50
              const maxValue = 50
              if (rawValue < minValue && value === minValue)
                return '<' + roundedValue
              if (rawValue > maxValue && value === maxValue)
                return '>' + roundedValue
              return roundedValue
            },
            topLabelStyle: {
              fontSize: '35%',
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '4px 8px',
              borderRadius: 8
            }
          }}
        />
        <Example
          mode='dark'
          randomize={() => chance.floating({min: 0, max: 100})}
          gaugeProps={{
            minValue: 0,
            maxValue: 100,
            arcColor: '#00ff7f',
            trackColor: '#222222',
            renderValue: ({roundedValue}) => `${roundedValue}m`,
            renderBottomLabel: 'altitude',
            bottomLabelStyle: {fontSize: '35%', fontFamily: 'Merriweather, sans-serif'},
            roundDigits: 1,
            startAngle: 0,
            endAngle: 180,
            valueStyle: {fontFamily: 'Mononoki, sans-serif'},
            arcWidth: 0.05,
            trackWidth: 0.05,
            arcCornerRadius: 0,
            trackCornerRadius: 0,
            animated: false,
          }}
        />
        <Example
          mode='dark'
          randomize={() => chance.floating({min: 0, max: 100})}
          gaugeProps={{
            trackWidth: 0,
            arcColor: '#ff8f00',
            renderContent: ({normalizedValue}) => (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <animated.div style={{width: '50%', height: '50%', transform: normalizedValue.to(value => `rotate(${value}turn)`)}}>
                  <TbNeedle size='100%' color='#ffffff' style={{transform: 'rotate(-45deg)'}} />
                </animated.div>
            </div>
            ),
            springConfig: config.wobbly,
          }}
        />
      </div>
    </>
  )
}
