import React from 'react'
import styled from 'styled-components'

const BaseTextAreaInput = styled.textarea`
  display: block;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: #555555;
  background-color: #FFFFFF;
  background-image: none;
  outline-width: 0;
  user-select: text;
  resize: none;
  border: 1px solid ${props => props.borderColor};

  &::-webkit-input-placeholder { color: #A8A8A8; }
`

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return '#CCCCCC'
    case 'invalid': return '#990000'
    case 'valid': return '#006600'
    default: return '#CCCCCC'
  }
}

const TextAreaInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseTextAreaInput borderColor={borderColor} {...rest} />
}

export default TextAreaInput
