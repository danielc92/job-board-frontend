import React, { Fragment, useEffect } from "react"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import BannerGroup from "sections/global/BannerGroup"
import querystring from "querystring"
import {
  Container,
  Header,
  Segment,
  Placeholder,
  Divider,
  Button,
} from "semantic-ui-react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "features/account-auth"
import ErrorMessage from "sections/global/ErrorMessage"
import NoResults from "sections/global/NoResults"
import { useHistory } from "react-router-dom"
import { selectDetails, getMyDetails } from "features/account-details"
import { ROUTES } from "settings"

interface IProps {}

const SavedSearchesPage: React.FC<IProps> = () => {
  const user = useSelector(selectUser)
  const userDetails = useSelector(selectDetails)
  const dispatch = useDispatch()
  const historySelector = useHistory()

  useEffect(() => {
    if (user.isAuthenticated) {
      dispatch(getMyDetails())
    }
  }, [dispatch, user.isAuthenticated])

  return (
    <Fragment>
      <Navbar />
      <Container text>
        <VerticallyPaddedContainer size="4">
          <Header as="h1" content="Saved Searches Page" />
          <p>View all of your saved searches.</p>
          <Divider />

          {userDetails.isFetching ? (
            <Fragment>
              {new Array(6).fill(true).map((item, index) => (
                <Segment padded stacked key={index.toString()}>
                  <Placeholder>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Segment>
              ))}
            </Fragment>
          ) : userDetails.error ? (
            <ErrorMessage
              header="An error has occurred"
              content={userDetails.error}
            />
          ) : userDetails.myDetails?.results.saved_searches.length === 0 ? (
            <NoResults
              header="No results"
              content="Jobs can be saved from the job search listing page."
            />
          ) : (
            userDetails.myDetails?.results.saved_searches.map(
              (search, index) => {
                return (
                  <Segment stacked padded key={index.toString()}>
                    <Header as="h2">{search}</Header>
                    <Button
                      onClick={() =>
                        historySelector.push({
                          pathname: ROUTES.JOB_LIST,
                          search,
                        })
                      }
                    >
                      View this search
                    </Button>
                  </Segment>
                )
              }
            )
          )}
        </VerticallyPaddedContainer>
      </Container>
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default SavedSearchesPage
