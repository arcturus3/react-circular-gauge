import { arc } from '@visx/shape'
import { useSpring, animated as springAnimated, AnimationConfig, SpringValue, Interpolation, InterpolatorArgs, Globals } from '@react-spring/web'
import {getAnimated} from "@react-spring/animated";
import {ReactNode, ComponentPropsWithRef, CSSProperties} from 'react';
import {useMeasure} from 'react-use'

// workaround for https://github.com/pmndrs/react-spring/issues/1660
export class PatchedInterpolation<Input, Output> extends Interpolation<Input, Output> {
  constructor(readonly source: unknown, args: InterpolatorArgs<Input, Output>) {
    super(source, args);
    getAnimated(this)!.setValue(this._get())
  }
}
Globals.assign({to: (source, args) => new PatchedInterpolation(source, args)})

type RenderableStringArgs = {
  value: number
  roundedValue: string
  normalizedValue: number
  rawValue: number
}

type RenderableString = string | ((args: RenderableStringArgs) => string)

type RenderableNodeArgs = {
  value: SpringValue<number>
  roundedValue: Interpolation<number, string>
  normalizedValue: Interpolation<number, number>
  rawValue: number
}

type RenderableNode = ReactNode | ((args: RenderableNodeArgs) => ReactNode)

type GaugeProps = ComponentPropsWithRef<'svg'> & {
  value?: number
  minValue?: number
  maxValue?: number
  startAngle?: number
  endAngle?: number
  direction?: 'cw' | 'ccw'
  renderValue?: RenderableString
  renderTopLabel?: RenderableString
  renderBottomLabel?: RenderableString
  renderContent?: RenderableNode
  roundDigits?: number
  radius?: number
  arcWidth?: number
  trackWidth?: number
  arcCornerRadius?: number
  trackCornerRadius?: number
  arcColor?: RenderableString
  trackColor?: string
  containerStyle?: CSSProperties
  labelStyle?: CSSProperties
  animated?: boolean,
  springConfig?: Partial<AnimationConfig>
}

const clamp = (min: number, max: number, x: number) => Math.min(max, Math.max(min, x))
const round = (digits: number, x: number) => x.toFixed(digits)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inverseLerp = (a: number, b: number, x: number) => (x - a) / (b - a)
const warn = (condition: boolean, message: string) => !condition && console.warn(message)

export const Gauge = ({
  value: rawValue = 0,
  minValue = 0,
  maxValue = 100,
  startAngle: startAngleDeg = 0,
  endAngle: endAngleDeg = 0,
  direction = 'cw',
  renderValue = ({roundedValue}) => roundedValue,
  renderTopLabel,
  renderBottomLabel,
  renderContent,
  roundDigits = 0,
  arcWidth: arcWidthFactor = 0.1,
  trackWidth: trackWidthFactor = 0.1,
  arcCornerRadius: arcCornerRadiusFactor = 0.5,
  trackCornerRadius: trackCornerRadiusFactor = 0.5,
  arcColor = 'hsl(0 0% 100%)',
  trackColor = 'hsl(0 0% 20%)',
  containerStyle = {},
  labelStyle = {},
  animated = true,
  springConfig,
  ...rest
}: GaugeProps) => {

  warn(minValue < maxValue, 'minValue should be less than maxValue')
  warn(0 <= startAngleDeg && startAngleDeg < 360, 'startAngle should be at least 0 and less than 360')
  warn(0 <= endAngleDeg && endAngleDeg < 360, 'endAngle should be at least 0 and less than 360')
  warn(roundDigits >= 0, 'roundDigits should be nonnegative')
  warn(0 <= arcWidthFactor && arcWidthFactor <= 2, 'arcWidth should be at least 0 and at most 2')
  warn(0 <= trackWidthFactor && trackWidthFactor <= 2, 'trackWidth should be at least 0 and at most 2')
  warn(0 <= arcCornerRadiusFactor && arcCornerRadiusFactor <= 0.5, 'arcCornerRadius should be at least 0 and at most 0.5')
  warn(0 <= trackCornerRadiusFactor && trackCornerRadiusFactor <= 0.5, 'trackCornerRadius should be at least 0 and at most 0.5')

  /*
  although radius can be arbitrary, it should match the displayed radius in CSS pixels to avoid scaling the content:
  width   = containerRadius * 2
          = max(outerArcRadius, outerTrackRadius) * 2
          = max(radius + radius * arcWidthFactor / 2, radius + radius * trackWidthFactor / 2) * 2
          = radius * (2 + max(arcWidthFactor, trackWidthFactor))
  radius  = width / (2 + max(arcWidthFactor, trackWidthFactor))
  */

  const [ref, {width}] = useMeasure()
 
  const radius = width / (2 + Math.max(arcWidthFactor, trackWidthFactor))
  const innerArcRadius = radius - radius * arcWidthFactor / 2
  const outerArcRadius = radius + radius * arcWidthFactor / 2
  const arcCornerRadius = radius * arcWidthFactor * arcCornerRadiusFactor
  const innerTrackRadius = radius - radius * trackWidthFactor / 2
  const outerTrackRadius = radius + radius * trackWidthFactor / 2
  const trackCornerRadius = radius * trackWidthFactor * trackCornerRadiusFactor
  const containerRadius = Math.max(outerArcRadius, outerTrackRadius)
  const contentRadius = Math.min(innerArcRadius, innerTrackRadius)

  /*
  add 180 deg to angles so that 0 deg is in the positive y direction
  subtract 360 deg from angles in some cases because the arc is drawn from the smaller to the larger angle
  see https://d3js.org/d3-shape/arc
  */

  const startAngleRad = startAngleDeg * Math.PI / 180
  const endAngleRad = endAngleDeg * Math.PI / 180
  const startAngle = startAngleRad + Math.PI
    - ((direction === 'cw' && startAngleRad >= endAngleRad) ? Math.PI * 2 : 0)
  const endAngle = endAngleRad + Math.PI
    - ((direction === 'ccw' && startAngleRad <= endAngleRad) ? Math.PI * 2 : 0)

  const renderArc = ({normalizedValue}: RenderableStringArgs) => arc({
    innerRadius: innerArcRadius,
    outerRadius: outerArcRadius,
    cornerRadius: arcCornerRadius,
    startAngle: startAngle,
    endAngle: lerp(startAngle, endAngle, normalizedValue)
  })(undefined) ?? ''

  const renderTrack = arc({
    innerRadius: innerTrackRadius,
    outerRadius: outerTrackRadius,
    cornerRadius: trackCornerRadius,
    startAngle: startAngle,
    endAngle: endAngle
  })(undefined) ?? ''

  const spring = useSpring({
    value: clamp(minValue, maxValue, rawValue),
    immediate: !animated,
    config: springConfig
  })

  const renderString = (renderable: RenderableString | undefined) => typeof renderable === 'function'
    ? spring.value.to(value => renderable({
      value: value,
      roundedValue: round(roundDigits, value),
      normalizedValue: inverseLerp(minValue, maxValue, value),
      rawValue: rawValue
    }))
    : renderable

  const renderNode = (renderable: RenderableNode) => typeof renderable === 'function'
    ? renderable({
      value: spring.value,
      roundedValue: spring.value.to(value => round(roundDigits, value)),
      normalizedValue: spring.value.to(value => inverseLerp(minValue, maxValue, value)),
      rawValue: rawValue
    })
    : renderable

  const defaultContent = (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        position: 'relative'
      }}>
        <springAnimated.span style={{
          lineHeight: 'normal',
          fontSize: 64
        }}>
          {renderString(renderValue)}
        </springAnimated.span>
        <springAnimated.span style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -100%)',
          lineHeight: 'normal',
          fontSize: 24
        }}>
          {renderString(renderTopLabel)}
        </springAnimated.span>
        <springAnimated.span style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, 100%)',
          lineHeight: 'normal',
          fontSize: 24
        }}>
          {renderString(renderBottomLabel)}
        </springAnimated.span>
      </div>
    </div>
  )

  return (
    <svg
      {...rest}
      width='100%'
      height='100%'
      viewBox={`${-containerRadius} ${-containerRadius} ${containerRadius * 2} ${containerRadius * 2}`}
      ref={ref}
    > 
      <path
        fill={trackColor}
        d={renderTrack}
      />
      <springAnimated.path
        fill={renderString(arcColor)}
        d={renderString(renderArc)}
      />
      <foreignObject x={-contentRadius} y={-contentRadius} width={contentRadius * 2} height={contentRadius * 2}>
        <div style={{width: contentRadius * 2, height: contentRadius * 2}}>
          {renderValue !== undefined || renderTopLabel !== undefined || renderBottomLabel !== undefined
            ? defaultContent
            : renderNode(renderContent)
          }
        </div>
      </foreignObject>
    </svg>
  )
}
