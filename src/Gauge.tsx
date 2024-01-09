import { getAnimated } from '@react-spring/animated'
import {
  AnimationConfig,
  Globals,
  Interpolation,
  InterpolatorArgs,
  SpringValue,
  animated as springAnimated,
  useSpring,
} from '@react-spring/web'
import { arc } from '@visx/shape'
import { CSSProperties, ComponentPropsWithRef, ReactNode, forwardRef } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { useMeasure } from 'react-use'

// workaround for https://github.com/pmndrs/react-spring/issues/1660
export class PatchedInterpolation<Input, Output> extends Interpolation<Input, Output> {
  constructor(
    readonly source: unknown,
    args: InterpolatorArgs<Input, Output>,
  ) {
    super(source, args)
    getAnimated(this)!.setValue(this._get())
  }
}
Globals.assign({ to: (source, args) => new PatchedInterpolation(source, args) })

type RenderableStringArgs = {
  value: number
  fmtValue: string
  normValue: number
  rawValue: number
}

type RenderableString = string | ((args: RenderableStringArgs) => string)

type RenderableNodeArgs = {
  value: SpringValue<number>
  fmtValue: Interpolation<number, string>
  normValue: Interpolation<number, number>
  rawValue: number
}

type RenderableNode = ReactNode | ((args: RenderableNodeArgs) => ReactNode)

export type GaugeProps = ComponentPropsWithRef<'svg'> & {
  value?: number
  minValue?: number
  maxValue?: number
  startValue?: number
  startAngle?: number
  endAngle?: number
  direction?: 'cw' | 'ccw'
  renderValue?: RenderableString
  renderTopLabel?: RenderableString
  renderBottomLabel?: RenderableString
  renderContent?: RenderableNode
  roundDigits?: number
  arcWidth?: number
  trackWidth?: number
  arcCornerRadius?: number
  trackCornerRadius?: number
  arcColor?: RenderableString
  trackColor?: string
  valueStyle?: CSSProperties
  topLabelStyle?: CSSProperties
  bottomLabelStyle?: CSSProperties
  animated?: boolean
  springConfig?: Partial<AnimationConfig>
}

const clamp = (min: number, max: number, x: number) => Math.min(max, Math.max(min, x))
const round = (digits: number, x: number) => x.toFixed(digits)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inverseLerp = (a: number, b: number, x: number) => (x - a) / (b - a)
const warn = (condition: boolean, message: string) => !condition && console.warn(message)

export const Gauge = forwardRef<SVGSVGElement, GaugeProps>(
  (
    {
      value: rawValue = 0,
      minValue = 0,
      startValue = minValue,
      maxValue = 100,
      startAngle: startAngleDeg = 0,
      endAngle: endAngleDeg = 0,
      direction = 'cw',
      renderValue = ({ fmtValue }) => fmtValue,
      renderTopLabel,
      renderBottomLabel,
      renderContent,
      roundDigits = 0,
      arcWidth: arcWidthFactor = 0.1,
      trackWidth: trackWidthFactor = 0.1,
      arcCornerRadius: arcCornerRadiusFactor = 0.5,
      trackCornerRadius: trackCornerRadiusFactor = 0.5,
      arcColor = 'black',
      trackColor = 'transparent',
      valueStyle,
      topLabelStyle,
      bottomLabelStyle,
      animated = true,
      springConfig,
      ...rest
    },
    ref,
  ) => {
    warn(minValue < maxValue, 'minValue should be less than maxValue')
    warn(startValue >= minValue && startValue <= maxValue, 'startValue should be between minValue and maxValue')
    warn(0 <= startAngleDeg && startAngleDeg < 360, 'startAngle should be at least 0 and less than 360')
    warn(0 <= endAngleDeg && endAngleDeg < 360, 'endAngle should be at least 0 and less than 360')
    warn(roundDigits >= 0, 'roundDigits should be nonnegative')
    warn(0 <= arcWidthFactor && arcWidthFactor <= 2, 'arcWidth should be at least 0 and at most 2')
    warn(0 <= trackWidthFactor && trackWidthFactor <= 2, 'trackWidth should be at least 0 and at most 2')
    warn(
      0 <= arcCornerRadiusFactor && arcCornerRadiusFactor <= 0.5,
      'arcCornerRadius should be at least 0 and at most 0.5',
    )
    warn(
      0 <= trackCornerRadiusFactor && trackCornerRadiusFactor <= 0.5,
      'trackCornerRadius should be at least 0 and at most 0.5',
    )

    /*
  although radius can be arbitrary, it should match the displayed radius in CSS pixels to avoid scaling the content:
  min(width, height)
          = containerRadius * 2
          = max(outerArcRadius, outerTrackRadius) * 2
          = max(radius + radius * arcWidthFactor / 2, radius + radius * trackWidthFactor / 2) * 2
          = radius * (2 + max(arcWidthFactor, trackWidthFactor))
  radius  = min(width, height) / (2 + max(arcWidthFactor, trackWidthFactor))
  */

    const [measureRef, { width, height }] = useMeasure()

    // reduce trackWidth by epsilon to avoid rendering artifacts in the common case where arcWidth = trackWidth
    if (arcWidthFactor === trackWidthFactor) trackWidthFactor -= 0.01

    const radius = Math.min(width, height) / (2 + Math.max(arcWidthFactor, trackWidthFactor))
    const innerArcRadius = radius - (radius * arcWidthFactor) / 2
    const outerArcRadius = radius + (radius * arcWidthFactor) / 2
    const arcCornerRadius = radius * arcWidthFactor * arcCornerRadiusFactor
    const innerTrackRadius = radius - (radius * trackWidthFactor) / 2
    const outerTrackRadius = radius + (radius * trackWidthFactor) / 2
    const trackCornerRadius = radius * trackWidthFactor * trackCornerRadiusFactor
    const containerRadius = Math.max(outerArcRadius, outerTrackRadius)
    const contentRadius = Math.min(innerArcRadius, innerTrackRadius)

    /*
  add 180 deg to angles so that 0 deg is in the positive y direction
  subtract 360 deg from angles in some cases because the arc is drawn from the smaller to the larger angle
  see https://d3js.org/d3-shape/arc
  */

    const startAngleRad = (startAngleDeg * Math.PI) / 180
    const endAngleRad = (endAngleDeg * Math.PI) / 180
    const startAngle = startAngleRad + Math.PI - (direction === 'cw' && startAngleRad >= endAngleRad ? Math.PI * 2 : 0)
    const endAngle = endAngleRad + Math.PI - (direction === 'ccw' && startAngleRad <= endAngleRad ? Math.PI * 2 : 0)
    const startNormValue = inverseLerp(minValue, maxValue, startValue)
    const startArcAngle = lerp(startAngle, endAngle, startNormValue)

    const renderArc = ({ normValue }: RenderableStringArgs) => {
      const angleA = startArcAngle
      const angleB = lerp(startAngle, endAngle, normValue)
      return (
        arc({
          innerRadius: innerArcRadius,
          outerRadius: outerArcRadius,
          cornerRadius: arcCornerRadius,
          startAngle: normValue < startNormValue ? angleB : angleA,
          endAngle: normValue < startNormValue ? angleA : angleB,
        })(undefined) ?? ''
      )
    }

    const renderTrack =
      arc({
        innerRadius: innerTrackRadius,
        outerRadius: outerTrackRadius,
        cornerRadius: trackCornerRadius,
        startAngle: startAngle,
        endAngle: endAngle,
      })(undefined) ?? ''

    const spring = useSpring({
      value: clamp(minValue, maxValue, rawValue),
      immediate: !animated,
      config: springConfig,
    })

    const renderString = (renderable: RenderableString | undefined) =>
      typeof renderable === 'function'
        ? spring.value.to((value) =>
            renderable({
              value: value,
              fmtValue: round(roundDigits, value),
              normValue: inverseLerp(minValue, maxValue, value),
              rawValue: rawValue,
            }),
          )
        : renderable

    const renderNode = (renderable: RenderableNode) =>
      typeof renderable === 'function'
        ? renderable({
            value: spring.value,
            fmtValue: spring.value.to((value) => round(roundDigits, value)),
            normValue: spring.value.to((value) => inverseLerp(minValue, maxValue, value)),
            rawValue: rawValue,
          })
        : renderable

    const defaultContent = (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            fontSize: containerRadius / 2,
          }}
        >
          <springAnimated.span
            style={{
              lineHeight: 1.5,
              fontSize: '100%',
              ...valueStyle,
            }}
          >
            {renderString(renderValue)}
          </springAnimated.span>
          <springAnimated.span
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translate(-50%, -100%)',
              lineHeight: 'normal',
              fontSize: '50%',
              ...topLabelStyle,
            }}
          >
            {renderString(renderTopLabel)}
          </springAnimated.span>
          <springAnimated.span
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, 100%)',
              lineHeight: 'normal',
              fontSize: '50%',
              ...bottomLabelStyle,
            }}
          >
            {renderString(renderBottomLabel)}
          </springAnimated.span>
        </div>
      </div>
    )

    return (
      <svg
        ref={mergeRefs([ref, (elem) => elem && measureRef(elem)])}
        {...rest}
        viewBox={`${-containerRadius} ${-containerRadius} ${containerRadius * 2} ${containerRadius * 2}`}
        style={{
          width: '100%',
          height: '100%',
          ...rest.style,
        }}
      >
        <path fill={trackColor} d={renderTrack} />
        <springAnimated.path fill={renderString(arcColor)} d={renderString(renderArc)} />
        <foreignObject x={-contentRadius} y={-contentRadius} width={contentRadius * 2} height={contentRadius * 2}>
          <div style={{ width: contentRadius * 2, height: contentRadius * 2 }}>
            {renderContent === undefined ? defaultContent : renderNode(renderContent)}
          </div>
        </foreignObject>
      </svg>
    )
  },
)
