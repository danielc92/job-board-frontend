import React, { Fragment, useEffect, useState } from "react"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import { useDispatch, useSelector } from "react-redux"
import { selectJobArticle, getJobBySlug } from "features/job-article"
import { useParams } from "react-router-dom"
import {
  Container,
  Form,
  Segment,
  Button,
  Grid,
  Header,
  Label,
  Modal,
} from "semantic-ui-react"
import ErrorMessage from "sections/global/ErrorMessage"
import BannerGroup from "sections/global/BannerGroup"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { properCaseTransform } from "utils/date"
import { selectApplyForJob, applyForJob, reset } from "features/job-application"
import JobArticlePlaceholder from "sections/job-article/Placeholder"
import UnavailableJob from "sections/job-article/UnavailableJob"

interface IProps {}

const marginStyle = { marginBottom: "24px" }
const charLimit = 1000

const JobArticlePage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const [state, setState] = useState<{ user_message: string }>({
    user_message: "",
  })
  const jobApply = useSelector(selectApplyForJob)
  const jobArticle = useSelector(selectJobArticle)
  const paramSelector = useParams<{ slug: string }>()

  useEffect(() => {
    dispatch(getJobBySlug(paramSelector.slug))
  }, [dispatch, paramSelector])

  const handleInputChange = (e: any) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const apply = () => {
    const payload: { user_message: string; job_id: string } = {
      user_message: state.user_message,
      job_id: jobArticle.job?.results._id || "",
    }
    dispatch(applyForJob(payload))
  }
  return (
    <Fragment>
      <Navbar />
      <Segment basic>
        <Container text>
          <VerticallyPaddedContainer size="3">
            {jobArticle.error ? (
              <Fragment>
                <Header as="h2" content="Job detail page" />
                <ErrorMessage
                  header="An error has occurred"
                  content="Sorry, we couldn't find this job."
                />
              </Fragment>
            ) : jobArticle.job ? (
              <Fragment>
                <Header as="h2">
                  {properCaseTransform(jobArticle.job.results.title)}
                </Header>
                <Segment padded stacked>
                  <Header as="h5" content="About the job" />
                  <p style={marginStyle}>
                    {jobArticle.job.results.job_summary}
                  </p>
                  <Grid stackable>
                    <Grid.Row style={marginStyle}>
                      <Grid.Column width={4}>
                        <Header as="h5">
                          {/* <Icon name="money bill alternate outline" /> */}
                          <Header.Content>Salary</Header.Content>
                        </Header>
                        <Label basic color="green">
                          {`$${jobArticle.job.results.salary_range_low} - ${jobArticle.job.results.salary_range_high}`}
                        </Label>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h5">
                          <Header.Content>Category</Header.Content>
                        </Header>
                        <Label basic color="green">
                          {jobArticle.job.results.category}
                        </Label>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h5">
                          <Header.Content>Employment Type</Header.Content>
                        </Header>
                        <Label basic color="green">
                          {jobArticle.job.results.employment_type}
                        </Label>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h5">
                          <Header.Content>Location</Header.Content>
                        </Header>
                        <Label
                          basic
                          color={
                            jobArticle.job.results.location_string
                              ? "green"
                              : undefined
                          }
                        >
                          {jobArticle.job.results.location_string
                            ? jobArticle.job.results.location_string
                            : "No location specified."}
                        </Label>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Grid stackable style={{ marginTop: 0 }}>
                    <Grid.Row style={marginStyle}>
                      <Grid.Column width={8}>
                        <Header as="h5" content="Skills" />
                        <Label.Group>
                          {jobArticle.job.results.skills.map((item) => (
                            <Label basic color="green">
                              {item}
                            </Label>
                          ))}
                        </Label.Group>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Header as="h5" content="Benefits" />
                        <Label.Group>
                          {jobArticle.job.results.benefits.map((item) => (
                            <Label basic color="green">
                              {item}
                            </Label>
                          ))}
                        </Label.Group>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Header as="h5" content="About the company" />
                  <p style={marginStyle}>
                    {jobArticle.job.results.company_summary}
                  </p>
                  <Header as="h5" content="Contact Summary" />
                  <p style={marginStyle}>
                    {jobArticle.job.results.contact_summary}
                  </p>
                </Segment>

                {/* If the job is open allow user to apply */}
                {!jobArticle.job?.results.open ? (
                  <UnavailableJob />
                ) : (
                  <Fragment>
                    <Header content="Start your application." as="h2" />
                    <Segment stacked padded>
                      <Form>
                        <Form.Field>
                          <Form.TextArea
                            rows={8}
                            value={state.user_message}
                            onChange={handleInputChange}
                            name="user_message"
                            placeholder="Some words about why you're suitable for this job."
                            label={`Enter a message for the employer (${
                              charLimit - state.user_message.length
                            } remaining).`}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Button
                            onClick={() => apply()}
                            content="Apply for this job"
                            color="green"
                            icon="paper plane"
                          />
                        </Form.Field>
                      </Form>
                    </Segment>
                  </Fragment>
                )}

                <Modal
                  open={jobApply.modal_body.length > 0}
                  dimmer="blurring"
                  onClose={() => dispatch(reset())}
                >
                  <Modal.Header content={jobApply.modal_header} />
                  <Modal.Content content={jobApply.modal_body} />
                  <Modal.Actions>
                    <Button onClick={() => dispatch(reset())} color="green">
                      Confirm
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Fragment>
            ) : (
              <JobArticlePlaceholder />
            )}
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <BannerGroup showFeedback />

      <Footer />
    </Fragment>
  )
}
export default JobArticlePage
