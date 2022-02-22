import styled from 'styled-components'

export default styled.div<{ height?: string }>`
  height: 48px;
  border-right: 1px solid ${(props) => props.theme.grey000};
`
