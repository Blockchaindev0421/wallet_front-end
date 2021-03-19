import React, { MouseEvent, TouchEvent, useCallback, useMemo } from 'react'
import useMeasure from 'react-use-measure'
import { localPoint } from '@visx/event'
import { scaleLinear, scaleTime } from '@visx/scale'
import { Bar, Line, LinePath } from '@visx/shape'
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip'
import { bisector, extent, max, min } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import styled, { DefaultTheme } from 'styled-components'

import { Color } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { CoinType, FiatType } from 'core/types'

type Data = [number, number]

const formatDate = timeFormat("%b %d, '%y")

const getYValue = (d: Data) => new Date(d[0])

const getXValue = (d: Data) => d[1]

const bisectDate = bisector<Data, Date>(d => new Date(getYValue(d))).left

const strokeWidth = 2

type TooltipData = Data

const circleSize = 4

const tooltipBorderRadius = 4

const Wrapper = styled.div`
  position: relative;
  height: 300px;
  width: 100%;
`

const Chart = ({ coin, currency, data }: OwnProps) => {
  const [ref, { height, width }] = useMeasure()

  const color = Color(coin.toLowerCase() as keyof DefaultTheme)

  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<TooltipData>()

  const tooltipStyles = useMemo(
    () => ({
      ...defaultStyles,
      borderRadius: tooltipBorderRadius,
      background: color,
      color: 'white',
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif '
    }),
    [color]
  )

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, width],
        domain: extent(data, getYValue) as [Date, Date]
      }),
    [width, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0],
        domain: [min(data, getXValue), max(data, getXValue) || 0],
        nice: true
      }),
    [height, data]
  )

  const handleTooltip = useCallback(
    (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
      let { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      let d = d0
      if (d1 && getYValue(d1)) {
        d =
          x0.valueOf() - getYValue(d0).valueOf() >
          getYValue(d1).valueOf() - x0.valueOf()
            ? d1
            : d0
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(getXValue(d))
      })
    },
    [showTooltip, yScale, xScale, data]
  )

  return (
    <Wrapper ref={ref}>
      <svg width={width} height={height}>
        <LinePath<Data>
          data={data}
          x={d => xScale(getYValue(d)) ?? 0}
          y={d => yScale(getXValue(d)) ?? 0}
          strokeWidth={strokeWidth}
          stroke={color}
        />
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill='transparent'
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />

        {tooltipData ? (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: height + 0 }}
              stroke={color}
              strokeWidth={strokeWidth}
              pointerEvents='none'
              strokeDasharray='5,2'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={circleSize}
              fill={color}
              fillOpacity={0.1}
              stroke={color}
              strokeOpacity={0.1}
              strokeWidth={strokeWidth}
              pointerEvents='none'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={circleSize}
              fill={color}
              stroke='white'
              strokeWidth={strokeWidth}
              pointerEvents='none'
            />
          </g>
        ) : null}
      </svg>

      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          {formatDate(getYValue(tooltipData))}
          <br />
          <br />
          {fiatToString({
            value: getXValue(tooltipData),
            unit: currency
          })}
        </TooltipWithBounds>
      ) : null}
    </Wrapper>
  )
}

type OwnProps = {
  coin: CoinType
  currency: FiatType
  data: Data[]
}

export default Chart
