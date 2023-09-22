https://typescript-eslint.io/linting/typed-linting/
https://github.com/Automattic/wp-calypso/blob/trunk/docs/component-readme-template.md
https://github.com/arcturus3/react-drag-drop

# React Circular Gauge

A React gauge component for visualizing numbers.🌡️

Features:

- Full native support for animation, including the bar, text, and color
- Simple interface/API and sensible defaults
- Highly customizable/flexible
- Uses react-spring for performant animation
- Written in TypeScript
- Small package size?

## Installation

```sh
npm i react-circular-gauge
```

```sh
$ npm i react-circular-gauge
```

## Usage

```jsx
import { Gauge } from 'react-circular-gauge'
import chroma from 'chroma-js'

const Thermometer = () => (
   <Gauge
      value={25}
      minValue={0}
      maxValue={100}
      renderBottomLabel='℃'
      arcColor={({normalizedValue}) => (
         chroma.scale(['red', 'blue'])(normalizedValue)
      )}
   />
)
```

codesandbox link \
image

---

next example

## Reference

add assertion info to descriptions
explain track/arc/etc terminology
roundedValue -> formattedValue
epsilon adjustment for track artifacts flag
explain renderablestring/node usage and diff between them
roundDigits -> roundPlaces
`AnimationConfig/SpringValue/Interpolation<>` is defined by `react-spring`

### `Gauge`

`Gauge` accepts the following props, all of which are optional.

| Name                  | Type                        | Default                              | Description |
| --------------------- | --------------------------- | ------------------------------------ | ----------- |
| `value`               | `number`                    | `0`                                  | Gauge value <clamp behavior?> |
| `minValue`            | `number`                    | `0`                                  | Minimum possible value |
| `maxValue`            | `number`                    | `100`                                | Maximum possible value |
| `startAngle`          | `number`                    | `0`                                  | Angle corresponding to `minValue`, measured in degrees clockwise from the positive y axis |
| `endAngle`            | `number`                    | `0`                                  | Angle corresponding to `maxValue`, measured in degrees clockwise from the positive y axis |
| `direction`           | `'cw' | 'ccw'`              | `'cw'`                               | Direction of the arc from `startAngle` to `endAngle`, `'cw'` for clockwise or `'ccw'` for counterclockwise |
| `renderValue`         | `RenderableString`          | `({roundedValue}) => roundedValue`   | A string or a function from `RenderableStringArgs` to a string for displaying the value |
| `renderTopLabel`      | `RenderableString`          | `undefined`                          | A string or a function from `RenderableStringArgs` to a string for displaying a label above the value |
| `renderBottomLabel`   | `RenderableString`          | `undefined`                          | A string or a function from `RenderableStringArgs` to a string for displaying a label below the value |
| `renderContent`       | `RenderableNode`            | `undefined`                          | `ReactNode` or a function from `RenderableNodeArgs` to `ReactNode` for displaying the gauge content, overrides the render props above |
| `roundDigits`         | `number`                    | `0`                                  | Number of decimal places to round <formatValue> to as provided by `RenderableStringArgs` and `RenderableNodeArgs` |
| `arcWidth`            | `number`                    | `0.1`                                | Arc width as a fraction of the gauge radius |
| `trackWidth`          | `number`                    | `0.09`                               | Track width as a fraction of the gauge radius |
| `arcCornerRadius`     | `number`                    | `0.5`                                | Arc corner radius as a fraction of the arc width |
| `trackCornerRadius`   | `number`                    | `0.5`                                | Track corner radius as a fraction of the track width |
| `arcColor`            | `RenderableString`          | `'black'`                            | A CSS color value or a function from `RenderableStringArgs` to a CSS color value |
| `trackColor`          | `string`                    | `'white'`                            | A CSS color value |
| `valueStyle`          | `CSSProperties`             | `undefined/{}`                       | Styles applied to the value |
| `topLabelStyle`       | `CSSProperties`             | `undefined/{}`                       | Styles applied to the top label |
| `bottomLabelStyle`    | `CSSProperties`             | `undefined/{}`                       | Styles applied to the bottom label |
| `animated`            | `boolean`                   | `true`                               | Whether to animate changes in `value` |
| `springConfig`        | `Partial<AnimationConfig>`  | `undefined/{}`                       | Spring configuration passed to `react-spring` |

### `RenderableString`

`RenderableString` is defined as `string | ((args: RenderableStringArgs) => string)`. The function form should be used for a string that animates based on the gauge value. `RenderableStringArgs` is an object with the following properties.

| Name               | Type      | Description |
| ------------------ | --------- | ----------- |
| `value`            | `number`  | The current value of the animation as interpolated between the previous and current gauge value |
| `roundedValue`     | `string`  | `value` converted to a string and with rounding applied |
| `normalizedValue`  | `number`  | `value` normalized to the range `[0, 1]` |
| `rawValue`         | `number`  | The current value provided to the gauge, not animated |

### `RenderableNode`

`RenderableNode` is defined as `ReactNode | ((args: RenderableNodeArgs) => ReactNode)`. The function form should be used for a `ReactNode` that animates based on the gauge value. `RenderableNodeArgs` is an object with the following properties.

| Name               | Type                              | Description |
| ------------------ | --------------------------------- | ----------- |
| `value`            | `SpringValue<number>`             | The current value of the animation as interpolated between the previous and current gauge value |
| `roundedValue`     | `Interpolation<number, string>`   | `value` converted to a string and with rounding applied |
| `normalizedValue`  | `Interpolation<number, number>`   | `value` normalized to the range `[0, 1]` |
| `rawValue`         | `number`                          | The current value provided to the gauge, not animated |

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
