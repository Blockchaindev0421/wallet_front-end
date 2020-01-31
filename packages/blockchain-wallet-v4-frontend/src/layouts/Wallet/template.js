import { replace } from 'ramda'
import Alerts from 'components/Alerts'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import ExchangeProfileMenu from 'scenes/Settings/Profile/Menu'
import Header from './Header'
import MenuLeft from './MenuLeft'
import Modals from 'modals'
import Page from './Page'
import React from 'react'
import SettingsAddressesMenu from 'scenes/Settings/Addresses/Menu'
import styled from 'styled-components'
import Tooltips from 'components/Tooltips'
import TrayRight from './TrayRight'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: ${props => props.theme.blue900};
`
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 250px);
  background-color: ${props => props.theme.white};
  padding: 8px 30px;

  @media (max-width: 768px) {
    width: 100%;
  }
`

// TODO: @header issue
// change this so that pages control their own scroll
const WalletLayout = props => {
  const { children, location } = props

  return (
    <Wrapper>
      <ErrorBoundary>
        <Alerts />
        <Tooltips />
        <Modals />
        <Nav>
          <Header />
        </Nav>
        <Container>
          <MenuLeft location={location} />
          <TrayRight />
          <Content data-e2e={`page${replace(/\//g, '-', location.pathname)}`}>
            {location.pathname.includes('/settings/addresses') && (
              <SettingsAddressesMenu location={location} />
            )}
            {location.pathname.includes('/settings/profile') && (
              <ExchangeProfileMenu />
            )}
            <Page>{children}</Page>
          </Content>
        </Container>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
