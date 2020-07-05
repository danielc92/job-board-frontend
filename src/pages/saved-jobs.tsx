import React, { Fragment, useEffect } from "react"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import BannerGroup from "sections/global/BannerGroup"
import {
  Container,
  Header,
  Segment,
  Placeholder,
  Label,
  Divider,
  Icon,
  Button,
} from "semantic-ui-react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "features/account-auth"
import { selectSavedJobs, getSavedJobs } from "features/job-list-saved"
import ErrorMessage from "sections/global/ErrorMessage"
import NoResults from "sections/global/NoResults"
import { properCaseTransform, dateDiffString } from "utils/date"
import { useHistory } from "react-router-dom"
import { renderQuillRichText } from "utils/render"

interface IProps {}

const SavedJobsPage: React.FC<IProps> = () => {
  const user = useSelector(selectUser)
  const savedJobs = useSelector(selectSavedJobs)
  const dispatch = useDispatch()
  const historySelector = useHistory()

  useEffect(() => {
    if (user.isAuthenticated) {
      dispatch(getSavedJobs())
    }
  }, [dispatch, user.isAuthenticated])

  const handleViewJob = (slug: string) => {
    historySelector.push({
      pathname: `/job/${slug}`,
    })
  }

  return (
    <Fragment>
      <Navbar />
      <Container text>
        <VerticallyPaddedContainer size="4">
          <Header as="h1" content="Saved Jobs" />
          <p>View all of your saved jobs.</p>
          <Divider />

          {savedJobs.isFetching ? (
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
          ) : savedJobs.error ? (
            <ErrorMessage
              header="An error has occurred"
              content={savedJobs.error}
            />
          ) : savedJobs.savedJobs?.results.length === 0 ? (
            <NoResults
              header="No results"
              content="Jobs can be saved from the job search listing page."
            />
          ) : (
            savedJobs.savedJobs?.results.map((item) => (
              <Segment stacked padded key={item._id}>
                <Header as="h3" content={properCaseTransform(item.title)} />

                <div
                  dangerouslySetInnerHTML={{
                    __html: renderQuillRichText(item.job_preview),
                  }}
                />

                <Button
                  color="green"
                  size="tiny"
                  onClick={() => handleViewJob(item.slug)}
                >
                  <Icon name="eye"></Icon>View this job
                </Button>

                <Divider />
                <Label.Group>
                  <Label
                    icon="clock"
                    size="tiny"
                    content={`Posted ${dateDiffString(item.createdAt)}`}
                  />
                  <Label
                    icon="dollar"
                    size="tiny"
                    content={`${item.salary_range_low
                      .toString()
                      .replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )} - ${item.salary_range_high
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                  />
                  <Label
                    icon="setting"
                    size="tiny"
                    content={properCaseTransform(item.category)}
                  />
                </Label.Group>
              </Segment>
            ))
          )}
        </VerticallyPaddedContainer>
      </Container>
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default SavedJobsPage
