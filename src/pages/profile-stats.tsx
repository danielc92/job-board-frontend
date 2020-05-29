import {
  Button,
  Form,
  Segment,
  Divider,
  Header,
  Container,
  Icon,
  Table,
  Grid,
  Label,
  TextArea,
  DropdownProps,
  Input,
  Message,
} from "semantic-ui-react"
import { uuid } from "uuidv4"
import React, { Fragment, useEffect, useState } from "react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import BannerGroup from "sections/global/BannerGroup"
import { properCaseTransform, dateDiffString } from "utils/date"
import ErrorMessage from "sections/global/ErrorMessage"
import { getProfile, selectProfile } from "features/account-profile"
import { logoutUser } from "features/account-auth"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "sections/global/Navbar"
import { getSkills, selectSkills } from "features/skills"
import ProfilePlaceholder from "sections/global/profile/ProfilePlaceholder"
import { checkTokenIsValid } from "utils/auth"
import { SESSION_EXPIRED_MESSAGE } from "settings"
import { useHistory } from "react-router-dom"
import {
  selectProfileUpdate,
  updateProfile,
} from "features/account-update-profile"
import { DateValidator } from "utils/validation"
import Footer from "sections/global/Footer"
const marginBottom = { marginBottom: "8px" }

interface IState {
  achievements: string[]
  available: boolean
  editAchievements: boolean
  editAvailability: boolean
  editEducation: boolean
  editExperience: boolean
  editPhone: boolean
  editSkills: boolean
  editSummary: boolean
  education: IEducation[]
  experience: IExperience[]
  phone: string
  skills: string[]
  summary: string

  experienceStart: string
  experienceEnd: string
  experienceTitle: string
  experienceDetails: string
  experienceCompany: string

  educationSchool: string
  educationStart: string
  educationEnd: string
  educationGpa: number
  educationCourse: string

  errorsForEducation: string[]
  errorsForExperience: string[]
}
const initialState: IState = {
  achievements: [],
  available: false,

  editAchievements: false,
  editAvailability: false,
  editEducation: false,
  editExperience: false,
  editPhone: false,
  editSkills: false,
  editSummary: false,

  education: [],
  experience: [],
  phone: "",
  skills: [],
  summary: "",

  experienceStart: "",
  experienceEnd: "",
  experienceTitle: "",
  experienceDetails: "",
  experienceCompany: "",

  educationSchool: "",
  educationStart: "",
  educationEnd: "",
  educationGpa: 0,
  educationCourse: "",

  errorsForEducation: [],
  errorsForExperience: [],
}

const ProfileStatsPage: React.FC = () => {
  const [state, setState] = useState<IState>(initialState)
  const dispatch = useDispatch()
  const profile = useSelector(selectProfile)
  const profileUpdate = useSelector(selectProfileUpdate)
  const skills = useSelector(selectSkills)
  const historySelector = useHistory()

  useEffect(() => {
    dispatch(getProfile())
    if (!skills.skills) {
      dispatch(getSkills())
    }
  }, [dispatch, skills.skills])

  useEffect(() => {}, [profile])

  const precheckAuthBeforeRequest = (): boolean => {
    if (!checkTokenIsValid()) {
      dispatch(logoutUser())
      historySelector.push({
        pathname: "/sign-in",
        state: {
          redirect_message: SESSION_EXPIRED_MESSAGE,
        },
      })
      return true
    }
    return false
  }

  const handleUpdateSummary = () => {
    precheckAuthBeforeRequest()

    dispatch(updateProfile({ summary: state.summary }))
    setState({ ...state, editSummary: false })
  }

  const handleEditSummary = () => {
    setState({ ...state, editSummary: true })
  }

  const handleUpdatePhone = () => {
    precheckAuthBeforeRequest()

    dispatch(updateProfile({ phone: state.phone }))
    setState({ ...state, editPhone: false })
  }

  const handleEditPhone = () => {
    setState({ ...state, editPhone: true })
  }

  const handleEditAvailability = () => {
    setState({
      ...state,
      editAvailability: true,
    })
  }

  const handleUpdateAvailability = () => {
    precheckAuthBeforeRequest()

    dispatch(updateProfile({ available: state.available }))
    setState({ ...state, editAvailability: false })
  }

  const handleEditExperience = () => {
    setState({
      ...state,
      editExperience: true,
    })
  }

  const handleUpdateExperience = () => {
    precheckAuthBeforeRequest()

    const {
      experienceCompany,
      experienceDetails,
      experienceEnd,
      experienceTitle,
      experienceStart,
    } = state
    const newEntry: IExperience = {
      company: experienceCompany,
      details: experienceDetails,
      start: experienceStart,
      end: experienceEnd,
      title: experienceTitle,
      key: uuid(),
    }

    const startDateErrors = DateValidator("Start date", experienceStart)
    const endDateErrors = DateValidator("End date", experienceEnd)
    const errorsForExperience = [...endDateErrors, ...startDateErrors]

    if (errorsForExperience.length === 0 && profile.profile) {
      dispatch(
        updateProfile({
          experience: [...profile.profile.results.experience, newEntry],
        })
      )
      setState({ ...state, editExperience: false, errorsForExperience: [] })
    } else {
      setState({ ...state, errorsForExperience })
    }
  }

  const handleEditEducation = () => {
    setState({
      ...state,
      editEducation: true,
    })
  }

  const handleUpdateEducation = () => {
    precheckAuthBeforeRequest()

    const {
      educationCourse,
      educationEnd,
      educationGpa,
      educationSchool,
      educationStart,
    } = state
    const newEntry: IEducation = {
      course: educationCourse,
      end: educationEnd,
      start: educationStart,
      school: educationSchool,
      gpa: educationGpa,
      key: uuid(),
    }

    // Validate Dates
    const startDateErrors = DateValidator("Start date", educationStart)
    const endDateErrors = DateValidator("End date", educationEnd)
    const errorsForEducation = [...endDateErrors, ...startDateErrors]

    if (errorsForEducation.length === 0 && profile.profile) {
      dispatch(
        updateProfile({
          education: [...profile.profile.results.education, newEntry],
        })
      )

      setState({ ...state, editEducation: false, errorsForEducation: [] })
    } else {
      setState({ ...state, errorsForEducation })
    }
  }

  const handleEditSkills = () => {
    const s: string[] = profile.profile ? profile.profile.results.skills : []
    setState({
      ...state,
      editSkills: true,
      skills: s,
    })
  }

  const handleUpdateSkills = () => {
    precheckAuthBeforeRequest()
    dispatch(updateProfile({ skills: state.skills }))
    setState({ ...state, editSkills: false })
  }

  const handleChangeSkills = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    const { value } = data
    if ((value as string[]).length <= 15) {
      setState({ ...state, skills: value as string[] })
    }
  }

  const handleDeleteExperience = (id: string) => {
    precheckAuthBeforeRequest()

    if (profile?.profile?.results) {
      const experience = profile.profile.results.experience.filter(
        (item) => item.key !== id
      )

      dispatch(updateProfile({ experience }))
    }
  }

  const handleDeleteEducation = (id: string) => {
    precheckAuthBeforeRequest()

    if (profile?.profile?.results) {
      const education = profile.profile.results.education.filter(
        (item) => item.key !== id
      )

      dispatch(updateProfile({ education }))
    }
  }

  const {
    editAvailability,
    editEducation,
    editExperience,
    editPhone,
    editSkills,
    editSummary,
  } = state
  return (
    <Fragment>
      <Navbar />
      <Segment basic>
        <Container text>
          <VerticallyPaddedContainer size="4">
            <Header as="h1" content="Profile" />
            <p>Customize your profile, career details and more.</p>

            <Divider />

            {profile.error && (
              <ErrorMessage header="An error occured" content={profile.error} />
            )}

            {profile.isFetching && <ProfilePlaceholder />}

            {profile.profile?.results ? (
              <Fragment>
                <Header as="h3" content="Personal Details" />
                <Segment stacked padded>
                  <Grid divided="vertically">
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <Header content="Name" as="h5" />
                        <p>{`${properCaseTransform(
                          profile.profile.results.user_id.first_name
                        )} ${properCaseTransform(
                          profile.profile.results.user_id.last_name
                        )}`}</p>
                        <Header content="Email" as="h5" />
                        <p>{profile.profile.results.user_id.email}</p>
                      </Grid.Column>
                      <Grid.Column>
                        <Header content="Joined" as="h5" />
                        {dateDiffString(
                          profile.profile.results.user_id.createdAt
                        )}
                        <Header content="Member Type" as="h5" />
                        <Label
                          color="violet"
                          basic
                          content={
                            profile.profile.results.user_id.is_employer
                              ? "employer"
                              : "job seeker"
                          }
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>

                {!profile.profile.results.user_id.is_employer ? (
                  <Fragment>
                    <Header as="h3" content="Career Details" />
                    <Segment stacked padded>
                      <Header as="h5" content="Summary" />

                      {editSummary ? (
                        <Fragment>
                          <Form>
                            <TextArea
                              maxLength="300"
                              style={marginBottom}
                              value={state.summary}
                              onChange={(event: any) =>
                                setState({
                                  ...state,
                                  summary: event.target.value,
                                })
                              }
                              placeholder={
                                profile.profile.results.summary.length === 0
                                  ? "You have no summary, you can create one now."
                                  : null
                              }
                            />
                          </Form>
                          <Button
                            size="small"
                            color="violet"
                            onClick={handleUpdateSummary}
                            loading={profileUpdate.isFetching && editSummary}
                          >
                            <Icon name="refresh" />
                            Update
                          </Button>
                          <Button
                            size="small"
                            color="red"
                            onClick={() =>
                              setState({ ...state, editSummary: false })
                            }
                          >
                            <Icon name="cancel" />
                            Cancel
                          </Button>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <p>
                            {profile.profile.results.summary.length > 0
                              ? profile.profile.results.summary
                              : "You have no summary, click edit to begin."}
                          </p>
                          <Button
                            size="small"
                            color="green"
                            onClick={handleEditSummary}
                          >
                            <Icon name="edit outline" />
                            Edit
                          </Button>
                        </Fragment>
                      )}
                    </Segment>

                    <Header as="h3" content="Skills" />
                    <Segment stacked padded>
                      {editSkills ? (
                        <Form>
                          <Form.Dropdown
                            onChange={handleChangeSkills}
                            value={state.skills}
                            name="skills"
                            label="Skills"
                            placeholder="Add skills"
                            multiple
                            search
                            selection
                            options={skills.skills?.map((x) => ({
                              text: x.name,
                              value: x.name,
                              key: x._id,
                            }))}
                            // renderLabel={}
                            defaultValue={state.skills}
                          ></Form.Dropdown>
                          <Form.Field>
                            <Button
                              size="small"
                              color="violet"
                              onClick={handleUpdateSkills}
                              loading={profileUpdate.isFetching && editSkills}
                            >
                              <Icon name="refresh" />
                              Update
                            </Button>
                            <Button
                              size="small"
                              color="red"
                              onClick={() =>
                                setState({ ...state, editSkills: false })
                              }
                            >
                              <Icon name="cancel" />
                              Cancel
                            </Button>
                          </Form.Field>
                        </Form>
                      ) : (
                        <Fragment>
                          {profile.profile.results.skills.length > 0 ? (
                            <Label.Group style={{ marginBottom: "1em" }}>
                              {profile.profile.results.skills.map((x) => (
                                <Label color="green" basic size="medium">
                                  {x}
                                </Label>
                              ))}
                            </Label.Group>
                          ) : (
                            <p>
                              You have no skills added, click edit to begin.
                            </p>
                          )}

                          <Button
                            size="small"
                            color="green"
                            onClick={handleEditSkills}
                          >
                            <Icon name="edit outline" />
                            Edit
                          </Button>
                        </Fragment>
                      )}
                    </Segment>

                    <Header as="h3" content="Contact" />
                    <Segment stacked padded>
                      <Header as="h5" content="Phone" />
                      {editPhone ? (
                        <Fragment>
                          <Form>
                            <Input
                              maxLength={20}
                              style={marginBottom}
                              value={state.phone}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setState({ ...state, phone: e.target.value })
                              }
                              placeholder={
                                state.phone.length === 0
                                  ? "Enter phone number."
                                  : null
                              }
                            />
                          </Form>
                          <Button
                            size="small"
                            color="violet"
                            onClick={handleUpdatePhone}
                            loading={profileUpdate.isFetching && editPhone}
                          >
                            <Icon name="refresh" />
                            Update
                          </Button>
                          <Button
                            size="small"
                            color="red"
                            onClick={() =>
                              setState({ ...state, editPhone: false })
                            }
                          >
                            <Icon name="cancel" />
                            Cancel
                          </Button>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <p>
                            {profile.profile.results.phone.length === 0
                              ? "You have no phone details, press Edit to begin."
                              : profile.profile.results.phone}
                          </p>
                          <Button
                            size="small"
                            color="green"
                            onClick={handleEditPhone}
                          >
                            <Icon name="edit outline" />
                            Edit
                          </Button>
                        </Fragment>
                      )}
                      <Header as="h5" content="Availability" />
                      {editAvailability ? (
                        <Fragment>
                          <Form style={{ marginBottom: "14px" }}>
                            <Form.Radio
                              label={
                                state.available ? "Available" : "Not available"
                              }
                              toggle
                              onChange={() =>
                                setState({
                                  ...state,
                                  available: !state.available,
                                })
                              }
                            />
                          </Form>
                          <Button
                            size="small"
                            color="violet"
                            onClick={handleUpdateAvailability}
                            loading={
                              profileUpdate.isFetching && editAvailability
                            }
                          >
                            <Icon name="refresh" />
                            Update
                          </Button>
                          <Button
                            size="small"
                            color="red"
                            onClick={() =>
                              setState({ ...state, editAvailability: false })
                            }
                          >
                            <Icon name="cancel" />
                            Cancel
                          </Button>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <p>
                            You are currently{" "}
                            <strong>
                              {profile.profile.results.available
                                ? "available"
                                : "not available"}{" "}
                            </strong>
                            for jobs.
                          </p>
                          <Button
                            size="small"
                            color="green"
                            onClick={handleEditAvailability}
                          >
                            <Icon name="edit outline" />
                            Edit
                          </Button>
                        </Fragment>
                      )}
                    </Segment>

                    <Header as="h3" content="Work Experience" />
                    <Segment stacked padded>
                      {editExperience ? (
                        <Fragment>
                          <Form>
                            <Form.Field>
                              <Form.Input
                                maxLength={50}
                                label="Company/Organization"
                                value={state.experienceCompany}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    experienceCompany: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                maxLength={50}
                                label="Job Title"
                                value={state.experienceTitle}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    experienceTitle: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                maxLength={10}
                                label="Start Date"
                                value={state.experienceStart}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    experienceStart: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                maxLength={10}
                                label="End Date"
                                value={state.experienceEnd}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    experienceEnd: e.target.value,
                                  })
                                }
                              />
                              <Form.TextArea
                                label="Additional Details"
                                placeholder="Achievements and/or highlights"
                                value={state.experienceDetails}
                                onChange={(event: any) =>
                                  setState({
                                    ...state,
                                    experienceDetails: event.target.value,
                                  })
                                }
                                maxLength={300}
                              />
                            </Form.Field>
                            <Form.Field>
                              <Button
                                size="small"
                                color="violet"
                                onClick={handleUpdateExperience}
                                loading={
                                  profileUpdate.isFetching && editExperience
                                }
                              >
                                <Icon name="refresh" />
                                Add Experience
                              </Button>
                              <Button
                                size="small"
                                color="red"
                                onClick={() =>
                                  setState({ ...state, editExperience: false })
                                }
                              >
                                <Icon name="cancel" />
                                Cancel
                              </Button>
                            </Form.Field>
                            <Message
                              warning
                              list={state.errorsForExperience}
                              header="Warning"
                              visible={state.errorsForExperience.length > 0}
                            ></Message>
                          </Form>
                        </Fragment>
                      ) : (
                        <Fragment>
                          {profile.profile.results.experience.length > 0 ? (
                            <Table striped celled>
                              <Table.Header>
                                <Table.HeaderCell content="Title" />
                                <Table.HeaderCell content="Company" />
                                <Table.HeaderCell content="Started" />
                                <Table.HeaderCell content="Ended" />
                                <Table.HeaderCell content="Details" />
                                <Table.HeaderCell content="Action" />
                              </Table.Header>
                              <Table.Body>
                                {profile.profile.results.experience.map((e) => (
                                  <Table.Row key={e.key}>
                                    <Table.Cell content={e.title} />
                                    <Table.Cell content={e.company} />
                                    <Table.Cell content={e.start} />
                                    <Table.Cell content={e.end} />
                                    <Table.Cell content={e.details} />
                                    <Table.Cell>
                                      <Button
                                        size="tiny"
                                        compact
                                        onClick={() =>
                                          handleDeleteExperience(e.key)
                                        }
                                        color="red"
                                      >
                                        <Icon name="cancel" />
                                        Remove
                                      </Button>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                              </Table.Body>
                            </Table>
                          ) : (
                            <p>
                              You have no experiences, click below to add some.
                            </p>
                          )}
                          <Button
                            size="small"
                            color="green"
                            onClick={handleEditExperience}
                          >
                            <Icon name="add" />
                            Add experience
                          </Button>
                        </Fragment>
                      )}
                    </Segment>

                    <Header as="h3" content="Education" />
                    <Segment stacked padded>
                      {editEducation ? (
                        <Fragment>
                          <Form>
                            <Form.Field>
                              <Form.Input
                                maxLength={50}
                                label="School/University"
                                value={state.educationSchool}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    educationSchool: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                label="Course"
                                maxLength={50}
                                value={state.educationCourse}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    educationCourse: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                maxLength={10}
                                label="Start Date"
                                value={state.educationStart}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    educationStart: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                maxLength={10}
                                label="End Date"
                                value={state.educationEnd}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    educationEnd: e.target.value,
                                  })
                                }
                              />
                              <Form.Input
                                type="number"
                                label="Grade/GPA"
                                value={state.educationGpa}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    educationGpa: (e.target
                                      .value as unknown) as number,
                                  })
                                }
                              />
                            </Form.Field>
                            <Form.Field>
                              <Button
                                size="small"
                                color="violet"
                                onClick={handleUpdateEducation}
                                loading={
                                  profileUpdate.isFetching && editEducation
                                }
                              >
                                <Icon name="refresh" />
                                Add Education
                              </Button>
                              <Button
                                size="small"
                                color="red"
                                onClick={() =>
                                  setState({ ...state, editEducation: false })
                                }
                              >
                                <Icon name="cancel" />
                                Cancel
                              </Button>
                            </Form.Field>
                            <Message
                              warning
                              list={state.errorsForEducation}
                              header="Warning"
                              visible={state.errorsForEducation.length > 0}
                            ></Message>
                          </Form>
                        </Fragment>
                      ) : (
                        <Fragment>
                          {profile.profile.results.education.length > 0 ? (
                            <Table striped celled>
                              <Table.Header>
                                <Table.HeaderCell content="School" />
                                <Table.HeaderCell content="Course" />
                                <Table.HeaderCell content="Started" />
                                <Table.HeaderCell content="Ended" />
                                <Table.HeaderCell content="Grade/GPA" />
                                <Table.HeaderCell content="Action" />
                              </Table.Header>
                              <Table.Body>
                                {profile.profile.results.education.map((e) => (
                                  <Table.Row key={e.key}>
                                    <Table.Cell content={e.school} />
                                    <Table.Cell content={e.course} />
                                    <Table.Cell content={e.start} />
                                    <Table.Cell content={e.end} />
                                    <Table.Cell content={e.gpa} />
                                    <Table.Cell>
                                      <Button
                                        size="tiny"
                                        compact
                                        onClick={() =>
                                          handleDeleteEducation(e.key)
                                        }
                                        color="red"
                                      >
                                        <Icon name="cancel" />
                                        Remove
                                      </Button>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                              </Table.Body>
                            </Table>
                          ) : (
                            <p>
                              You have no education, click below to add some.
                            </p>
                          )}
                          <Button
                            size="small"
                            color="green"
                            onClick={handleEditEducation}
                          >
                            <Icon name="add" />
                            Add education
                          </Button>
                        </Fragment>
                      )}
                    </Segment>
                  </Fragment>
                ) : null}
              </Fragment>
            ) : null}
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default ProfileStatsPage
