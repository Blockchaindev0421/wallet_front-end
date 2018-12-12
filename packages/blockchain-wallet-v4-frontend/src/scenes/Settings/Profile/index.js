import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions } from 'data'
import { getData } from './selectors'

import IdentityVerification from './IdentityVerification'
import DataError from 'components/DataError'

import { BlockchainLoader } from 'blockchain-info-components'

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  justify-content: center;
`
const Container = styled.div`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

const Loading = () => (
  <Wrapper>
    <BlockchainLoader />
  </Wrapper>
)

export const Profile = ({ data, fetchUser }) =>
  data.cata({
    Success: ({ userData, userTiers }) => (
      <Wrapper>
        <Container>
          <IdentityVerification userData={userData} userTiers={userTiers} />
        </Container>
      </Wrapper>
    ),
    NotAsked: () => <Loading />,
    Loading: () => <Loading />,
    Failure: () => <DataError onClick={fetchUser} />
  })

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser())
})

export default connect(
  getData,
  mapDispatchToProps
)(Profile)
