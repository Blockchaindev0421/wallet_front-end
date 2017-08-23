import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, PasswordInput } from 'blockchain-info-components'
import PasswordScore from './PasswordScore'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const PasswordBox = (field) => {
  const errorState = getErrorState(field.meta)
  const scoreVisible = field.score ? field.input.value.length > 0 : false

  return (
    <Container>
      <PasswordInput {...field.input} errorState={errorState} />
      { scoreVisible ? <PasswordScore value={field.input.value} /> : <div /> }
      {field.meta.touched && field.meta.error && <Error size='13px' weight={300} color='mahogany'>{field.meta.error}</Error>}
    </Container>
  )
}

PasswordBox.PropTypes = {
  score: PropTypes.number
}

PasswordBox.defaultProps = {
  score: false
}

export default PasswordBox
