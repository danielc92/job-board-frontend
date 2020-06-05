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
  Label,
  Modal,
} from "semantic-ui-react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "features/account-auth"
import ErrorMessage from "sections/global/ErrorMessage"
import NoResults from "sections/global/NoResults"
import { useHistory } from "react-router-dom"
import { selectDetails, getMyDetails } from "features/account-details"
import { ROUTES } from "settings"
import {
  updateMyDetails,
  selectMyDetailsUpdate,
  reset,
} from "features/account-update-details"

interface IProps {}

const SavedSearchesPage: React.FC<IProps> = () => {
  const user = useSelector(selectUser)
  const userDetails = useSelector(selectDetails)
  const userDetailsUpdate = useSelector(selectMyDetailsUpdate)
  const dispatch = useDispatch()
  const historySelector = useHistory()

  useEffect(() => {
    if (user.isAuthenticated) {
      dispatch(getMyDetails())
    }
  }, [dispatch, user.isAuthenticated])

  const deleteSearch = (search: string) => {
    const { myDetails } = userDetails
    if (myDetails) {
      const newSearches = myDetails.results.saved_searches.filter(
        (x) => x !== search
      )
      dispatch(updateMyDetails({ saved_searches: newSearches }))
    }
  }

  return (
    <Fragment>
      <Navbar />
      <Container text>
        <VerticallyPaddedContainer size="4">
          <Header as="h1" content="Saved Searches" />
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
                const tags = querystring.parse(search.substring(1))
                return (
                  <Segment stacked padded key={index.toString()}>
                    <div style={{ marginBottom: "12px" }}>
                      {tags.title && <Label>Keywords: {tags.title}</Label>}
                      {tags.location_string && (
                        <Label>Where: {tags.location_string}</Label>
                      )}
                      {tags.category && (
                        <Label>Category: {tags.category}</Label>
                      )}
                    </div>

                    <Button
                      size="mini"
                      color="green"
                      onClick={() =>
                        historySelector.push({
                          pathname: ROUTES.JOB_LIST,
                          search,
                        })
                      }
                    >
                      View search
                    </Button>
                    <Button
                      size="mini"
                      color="red"
                      onClick={() => deleteSearch(search)}
                    >
                      Remove search
                    </Button>
                  </Segment>
                )
              }
            )
          )}
        </VerticallyPaddedContainer>
      </Container>

      <Modal open={userDetailsUpdate.modal_header.length > 0}>
        <Modal.Header>{userDetailsUpdate.modal_header}</Modal.Header>
        <Modal.Content>{userDetailsUpdate.modal_body}</Modal.Content>

        <Modal.Actions>
          <Button
            loading={userDetailsUpdate.isFetching}
            onClick={() => dispatch(reset())}
            color="green"
          >
            Ok
          </Button>
        </Modal.Actions>
      </Modal>

      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default SavedSearchesPage
