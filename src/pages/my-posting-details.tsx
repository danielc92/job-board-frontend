import React, { Fragment, useEffect, useState } from "react"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import { useDispatch, useSelector } from "react-redux"
import BannerGroup from "sections/global/BannerGroup"
import {
  Modal,
  Button,
  Placeholder,
  Header,
  Label,
  Segment,
  Table,
  Container,
  Divider,
} from "semantic-ui-react"
import NoResults from "sections/global/NoResults"
import { dateDiffString, properCaseTransform } from "utils/date"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import ErrorMessage from "sections/global/ErrorMessage"
import { useParams } from "react-router-dom"
import {
  getPostingDetails,
  selectMyPostingDetails,
} from "features/my-posting-details"
import WithdrawnMessage from "sections/global/WithdrawnMessage"
import { updateApplication } from "features/job-application-update"
import { getProfile, selectProfile } from "features/account-profile"
import { renderQuillRichText } from "utils/render"

interface IProps {}

const PostingDetailsPage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const postingDetails = useSelector(selectMyPostingDetails)
  const profile = useSelector(selectProfile)
  const paramSelector = useParams<{ job_id: string }>()
  const [modal, setModal] = useState<boolean>(false)
  const [activeApplication, setApplication] = useState<IMyPostingDetail | null>(
    null
  )

  useEffect(() => {
    if (activeApplication) {
      dispatch(
        getProfile({
          user_id: activeApplication.applicant_id._id,
        })
      )
    }
  }, [activeApplication, dispatch])
  useEffect(() => {
    const { job_id } = paramSelector
    if (job_id) {
      dispatch(getPostingDetails({ page: "1", job_id }))
    }
  }, [dispatch, paramSelector, paramSelector.job_id])
  return (
    <Fragment>
      <Navbar />

      <Segment basic>
        <Container>
          <VerticallyPaddedContainer size="4">
            <Header as="h1" content="Application listing" />

            <Divider />
            {postingDetails.error ? (
              <ErrorMessage
                header="An error has occured"
                content={postingDetails.error}
              />
            ) : postingDetails.isFetching ? (
              <Segment stacked padded>
                <Placeholder fluid>
                  <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            ) : postingDetails.myPostingDetails &&
              postingDetails.myPostingDetails.results.totalDocs > 0 ? (
              <Table celled striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell content="Name" />
                    <Table.HeaderCell content="Status" />
                    <Table.HeaderCell content="Applied" />
                    <Table.HeaderCell content="Action" />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {postingDetails.myPostingDetails.results.docs.map((item) => {
                    const { applicant_id, status, createdAt } = item
                    return (
                      <Table.Row key={item._id}>
                        <Table.Cell
                          content={`${properCaseTransform(
                            applicant_id.first_name
                          )} ${properCaseTransform(applicant_id.last_name)}`}
                        />
                        <Table.Cell content={status} />
                        <Table.Cell content={dateDiffString(createdAt)} />
                        <Table.Cell>
                          <Button
                            compact
                            onClick={() => {
                              setApplication(item)
                              setModal(true)
                            }}
                            color="green"
                          >
                            View application
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            ) : postingDetails.myPostingDetails &&
              postingDetails.myPostingDetails.results.totalDocs === 0 ? (
              <NoResults
                header="No results"
                content="There are currently no application submitted for this job, please try again later."
              />
            ) : null}
          </VerticallyPaddedContainer>
        </Container>
      </Segment>

      <Modal open={modal} dimmer="blurring" onClose={() => setModal(false)}>
        {activeApplication ? (
          <Fragment>
            <Modal.Header>
              {`${properCaseTransform(
                activeApplication.applicant_id.first_name
              )} ${properCaseTransform(
                activeApplication.applicant_id.last_name
              )}'s application`}
            </Modal.Header>

            {activeApplication.status === "withdrawn" ? (
              <Modal.Content>
                <WithdrawnMessage
                  header="Application withdrawn"
                  content="This applicant has chosen to withdraw from this job, and is no longer interested."
                />
              </Modal.Content>
            ) : (
              <Modal.Content>
                <Header as="h3" content="Current status" />
                <Label content={activeApplication.status} />
                <Header as="h3" content="Message" />

                {activeApplication.user_message.length > 0 ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderQuillRichText(
                        activeApplication.user_message
                      ),
                    }}
                  />
                ) : (
                  <p>This applicant did not choose to a leave a message.</p>
                )}
              </Modal.Content>
            )}

            <Modal.Content>
              {profile.isFetching ? (
                <Placeholder>
                  <Placeholder.Header></Placeholder.Header>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Header></Placeholder.Header>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                  <Placeholder.Line></Placeholder.Line>
                </Placeholder>
              ) : profile.error ? (
                <p>
                  An error occured while fetching this applicants profilel
                  details.
                </p>
              ) : profile.profile ? (
                <Fragment>
                  <Header as="h2" content="Career Profile" />
                  <Divider />

                  <Header content="Summary" />

                  {profile.profile.results.summary.length > 0 ? (
                    <p>{profile.profile.results.summary}</p>
                  ) : (
                    <p>Applicant has no career summary.</p>
                  )}

                  <Header content="Skills" />
                  {profile.profile.results.skills.length > 0 ? (
                    <Label.Group>
                      {profile.profile.results.skills.map((s) => (
                        <Label color="green" basic size="medium">
                          {s}
                        </Label>
                      ))}
                    </Label.Group>
                  ) : (
                    <p>
                      Applicant does not have any skills added to their profile.
                    </p>
                  )}

                  <Header content="Availability" />
                  {profile.profile.results.available ? (
                    <p>
                      Applicant is currently <strong>available</strong> for jobs
                      and contactable via {profile.profile.results.phone}.
                    </p>
                  ) : (
                    <p>
                      Applicant is currently <strong>unavailable</strong> for
                      jobs.
                    </p>
                  )}

                  <Header content="Experience" />
                  {profile.profile.results.experience.length > 0 ? (
                    <Table striped celled>
                      <Table.Header>
                        <Table.HeaderCell content="Title" />
                        <Table.HeaderCell content="Company" />
                        <Table.HeaderCell content="Started" />
                        <Table.HeaderCell content="Ended" />
                        <Table.HeaderCell content="Details" />
                      </Table.Header>
                      <Table.Body>
                        {profile.profile.results.experience.map((e) => (
                          <Table.Row key={e.key}>
                            <Table.Cell content={e.title} />
                            <Table.Cell content={e.company} />
                            <Table.Cell content={e.start} />
                            <Table.Cell content={e.end} />
                            <Table.Cell content={e.details} />
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <p>
                      Applicant does not have any recorded experience details.
                    </p>
                  )}

                  <Header content="Education" />
                  {profile.profile.results.education.length > 0 ? (
                    <Table striped celled>
                      <Table.Header>
                        <Table.HeaderCell content="School" />
                        <Table.HeaderCell content="Course" />
                        <Table.HeaderCell content="Started" />
                        <Table.HeaderCell content="Ended" />
                        <Table.HeaderCell content="Grade/GPA" />
                      </Table.Header>
                      <Table.Body>
                        {profile.profile.results.education.map((e) => (
                          <Table.Row key={e.key}>
                            <Table.Cell content={e.school} />
                            <Table.Cell content={e.course} />
                            <Table.Cell content={e.start} />
                            <Table.Cell content={e.end} />
                            <Table.Cell content={e.gpa} />
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <p>
                      Applicant does not have any recorded education details.
                    </p>
                  )}
                </Fragment>
              ) : null}
            </Modal.Content>

            <Modal.Actions>
              <Button
                disabled={activeApplication.status === "withdrawn"}
                color="green"
                content="I'm interested"
                onClick={() => {
                  setModal(false)
                  dispatch(
                    updateApplication({
                      applicant_id: activeApplication.applicant_id._id,
                      status: "interested",
                      job_id: activeApplication.job_id._id,
                    })
                  )
                }}
              />
              <Button
                disabled={activeApplication.status === "withdrawn"}
                onClick={() => {
                  setModal(false)
                  dispatch(
                    updateApplication({
                      applicant_id: activeApplication.applicant_id._id,
                      status: "rejected",
                      job_id: activeApplication.job_id._id,
                    })
                  )
                }}
                color="red"
                content="I'm not interested"
              />
              <Button
                secondary
                onClick={() => setModal(false)}
                content="Close"
              />
            </Modal.Actions>
          </Fragment>
        ) : null}
      </Modal>

      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}
export default PostingDetailsPage
