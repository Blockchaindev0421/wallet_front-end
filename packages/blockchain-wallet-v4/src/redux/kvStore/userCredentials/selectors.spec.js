import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore userCredentials selectors', () => {
  const userId = '3d448ad7-0e2c-4b65-91b0-c149892e243c'
  const token = 'd753109e-23jd-42bd-82f1-cc904702asdfkjf'

  const userCredentialsMetadata = {
    value: { userId, token }
  }

  const successState = {
    kvStorePath: {
      userCredentials: Remote.Success(userCredentialsMetadata)
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(userCredentialsMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getUserId should return success of userId', () => {
    const expectedResult = Remote.Success(userId)
    expect(selectors.getUserId(successState)).toEqual(expectedResult)
  })

  it('getUserToken should return success of token', () => {
    const expectedResult = Remote.Success(token)
    expect(selectors.getUserToken(successState)).toEqual(expectedResult)
  })

  const loadingState = {
    kvStorePath: {
      userCredentials: Remote.Loading
    }
  }

  it('getMetadata should return loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  it('getUserId should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getUserId(loadingState)).toEqual(expectedResult)
  })

  it('getUserToken should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getUserToken(loadingState)).toEqual(expectedResult)
  })

  const failureState = {
    kvStorePath: {
      userCredentials: Remote.Failure('Error in userCredentials metadata')
    }
  }

  it('getMetadata should return failure', () => {
    const expectedResult = Remote.Failure('Error in userCredentials metadata')
    expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
  })

  it('getUserId should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in userCredentials metadata')
    expect(selectors.getUserId(failureState)).toEqual(expectedResult)
  })

  it('getUserToken should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in userCredentials metadata')
    expect(selectors.getUserToken(failureState)).toEqual(expectedResult)
  })
})
