import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../../Icons'

const SelectBoxInput = styled.div`
  position: relative;
  display: block;
  width: 100%;
`
const Button = styled.button.attrs({
  type: 'button'
})`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  white-space: nowrap;
  user-select: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme['gray-5']};
  background-color: ${props => props.theme['white']};
  font-family: 'Montserrat', sans-serif !important;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
  border: 1px solid ${props => props.errorState === 'initial' ? '#CCCCCC' : props.errorState === 'invalid' ? '#990000' : '#006600'};
  border-radius: 0;
  
  &:focus {
    outline: none;
  }
`
const Search = styled.input.attrs({
  type: 'text'
})`
  color: ${props => props.theme['gray-3']};
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-2']};
  font-size: 14px;
  font-weight: normal;
  box-shadow: none;
  width: 100%;
  height: 40px;
  box-sizing: border-box;

  &:focus {
    border-radius: none;
    border: 1px solid ${props => props.theme['gray-2']};
    outline: none;
  }
`
const List = styled.div`
  position: absolute;
  display: ${props => props.expanded ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  order: 1;
  width: 100%;
  height: auto;
  max-height: 140px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-2']};
  box-sizing: border-box;
  z-index: 10;
`
const ListItem = styled.div`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 300;
  font-size: 14px;
  color: ${props => props.theme['gray-4']};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme['gray-4']};
    background-color: ${props => props.theme['gray-1']};
  }
`
const Header = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  color: ${props => props.theme['gray-4']};
  background-color: ${props => props.theme['gray-2']};
  cursor: not-allowed;

  &:hover { color: ${props => props.theme['gray-4']}; }
`
const Arrow = styled(Icon)`
  position: absolute;
  top: 15px;
  right: 15px;
`

const SelectInput = (props) => {
  const { items, display, expanded, searchEnabled, handleBlur, handleChange, handleClick, handleFocus } = props

  return (
    <SelectBoxInput onBlur={handleBlur} onFocus={handleFocus}>
      {!expanded || !searchEnabled
        ? (<Button>{display}</Button>)
        : (<Search autoFocus={expanded} onChange={handleChange} />)
      }
      <Arrow name='down-arrow' size='10px' />
      <List expanded={expanded}>
        { items.map((item, index) => item.value == null
          ? (<Header key={index}>{item.text}</Header>)
          : (<ListItem key={index} onMouseDown={() => handleClick(item.value)}>{item.text}</ListItem>))
        }
      </List>
    </SelectBoxInput>
  )
}

SelectInput.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
  })).isRequired,
  display: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  expanded: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func
}

export default SelectInput
