import React, { Fragment, useState, useEffect, useCallback } from "react"
import {
  Segment,
  Modal,
  Button,
  Container,
  Header,
  Form,
  Message,
  Icon,
  Divider,
  DropdownProps,
  DropdownOnSearchChangeData,
} from "semantic-ui-react"
import { debounce } from "lodash"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

import { checkTokenIsValid } from "utils/auth"
import {
  StringValidator,
  IsEmptyValidator,
  SalaryRangeValidator,
  ListValidator,
  StringCharacterValidator,
  GLOBAL_TEXT_LIMITS,
  CharacterNumberValidator,
} from "utils/validation"

import {
  SESSION_EXPIRED_MESSAGE,
  ALLOWED_CHARS_JOB,
  ROUTES,
  QUILL_SETTINGS,
} from "settings"
// import BannerGroup from 'components/banners/BannerGroup'
import { useDispatch, useSelector } from "react-redux"
import { getSkills, selectSkills } from "features/skills"
import { getCategories, selectCategories } from "features/categories"
import { selectUser, logoutUser } from "features/account-auth"
import {
  selectJobPost,
  reset,
  postJob,
  IPayloadJobPost,
} from "features/job-post"
import { useHistory } from "react-router-dom"
import { getLocations, selectLocations } from "features/locations"
import { getBenefits, selectBenefits } from "features/benefits"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import ProgressBar from "sections/job-post/ProgressBar"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import { properCaseTransform } from "utils/general"
import BannerGroup from "sections/global/BannerGroup"
import AuthMessage from "sections/global/AuthMessage"
import { customRender } from "utils/render"

interface IState {
  title: string
  category: string
  skills: string[]
  benefits: string[]
  company_summary: string
  job_summary: string
  company_name: string
  contact_summary: string
  salary_range_low: string
  salary_range_high: string
  employment_type: string
  searchQuery: string
  location_id: string
  location: {
    coordinates: number[]
    type: string
  }
  location_string: string

  company_summary_chars: number
  job_summary_chars: number
  contact_summary_chars: number
  job_preview_chars: number
  job_preview: string
}
const initialState: IState = {
  location_id: "",
  title: "",
  category: "",
  skills: [],
  benefits: [],
  company_summary: "",
  job_summary: "",
  job_preview: "",
  company_name: "",
  contact_summary: "",
  salary_range_low: "",
  salary_range_high: "",
  employment_type: "",
  location: {
    coordinates: [0, 0],
    type: "Point",
  },
  location_string: "",
  searchQuery: "",

  company_summary_chars: 0,
  job_summary_chars: 0,
  job_preview_chars: 0,
  contact_summary_chars: 0,
}

const employment_types = [
  "full-time",
  "part-time",
  "casual",
  "fixed-term",
  "shift worker",
  "daily/weekly hire",
  "probation",
  "outworkers",
  "other",
]

const employment_types_transformed = employment_types.map((i) => ({
  text: i,
  key: i,
  value: i,
}))

interface IProps {}

const JobPostPage: React.FC<IProps> = () => {
  //     this.handleSearchChange = debounce(this.handleSearchChange.bind(this), 500)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSkills())
    dispatch(getCategories())
    dispatch(getLocations(""))
    dispatch(getBenefits())
  }, [dispatch])
  const historySelector = useHistory()
  const [state, setState] = useState<IState>(initialState)
  const [errors, setErrors] = useState<string[]>([])
  const [percent, setPercent] = useState<number>(0)

  const skills = useSelector(selectSkills)
  const jobPost = useSelector(selectJobPost)
  const categories = useSelector(selectCategories)
  const benefits = useSelector(selectBenefits)
  const locations = useSelector(selectLocations)
  const user = useSelector(selectUser)

  useEffect(() => {
    const validateForm = () => {
      const errors = [
        ...CharacterNumberValidator(
          state.contact_summary_chars,
          1,
          GLOBAL_TEXT_LIMITS.POST_CONTACT_SUMMARY,
          "Contact summary"
        ),
        ...CharacterNumberValidator(
          state.job_summary_chars,
          1,
          GLOBAL_TEXT_LIMITS.POST_JOB_SUMMARY,
          "Job summary"
        ),
        ...CharacterNumberValidator(
          state.company_summary_chars,
          1,
          GLOBAL_TEXT_LIMITS.POST_COMPANY_SUMMARY,
          "Company summary"
        ),
        ...StringValidator(state.company_name, 0, 50, "Company name"),
        ...ListValidator(state.skills, 1, 10, "Skills"),
        ...ListValidator(state.benefits, 1, 10, "Benefits"),
        ...StringValidator(state.title, 1, 50, "Job title"),
        ...StringCharacterValidator(
          state.title,
          ALLOWED_CHARS_JOB,
          "Job title"
        ),
        ...CharacterNumberValidator(
          state.job_preview_chars,
          1,
          GLOBAL_TEXT_LIMITS.POST_JOB_PREVIEW,
          "Job preview"
        ),
        ...IsEmptyValidator(state.category, "Job category"),
        ...IsEmptyValidator(state.employment_type, "Employment type"),
        ...IsEmptyValidator(state.salary_range_low, "Salary (minimum)"),
        ...IsEmptyValidator(state.salary_range_high, "Salary (maximum)"),
        ...SalaryRangeValidator(
          state.salary_range_low,
          state.salary_range_high
        ),
      ]
      setErrors(errors)
    }
    validateForm()
  }, [state])

  useEffect(() => {
    const percent = calculateProgress(errors, 10)
    setPercent(percent)
  }, [errors])

  const setTextInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target) {
      setState({ ...state, [event.target.name]: event.target.value })
    }
  }

  // const setTextInputDelayed = useCallback(
  //   debounce((e: React.ChangeEvent<HTMLInputElement>) => setTextInput(e), 200),
  //   []
  // )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(event)
  }

  const setTextArea = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target
      setState({ ...state, [name]: value })
    }
  }

  // const setTextAreaDelayed = useCallback(
  //   debounce((e: any) => setTextArea(e), 500),
  //   []
  // )

  const handleTextAreaChange = (event: any) => {
    setTextArea(event)
    // setTextAreaDelayed(event)
  }

  const limit = 10
  const handleDropdownChangeList = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    const { name, value } = data
    const values = data.value as string[]
    if (values.length <= limit) {
      setState({ ...state, [name]: value })
    }
  }

  const handleDropdownChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => setState({ ...state, [data.name]: data.value })

  const calculateProgress = (errors: string[], maxErrors: number) => {
    let numErrors = errors.length

    if (numErrors === maxErrors) return 0
    if (numErrors === 0) return 100

    return ((maxErrors - numErrors) / maxErrors) * 100
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Initial check to see if token has expired
    if (!checkTokenIsValid()) {
      dispatch(logoutUser())
      historySelector.push({
        pathname: ROUTES.ACCOUNT_SIGNIN,
        state: { redirect_message: SESSION_EXPIRED_MESSAGE },
      })
      return
    }

    let payload = {}
    if (errors.length === 0)
      payload = {
        title: state.title,
        category: state.category,
        skills: state.skills,
        benefits: state.benefits,
        company_name: state.company_name,
        company_summary: state.company_summary,
        job_summary: state.job_summary,
        job_preview: state.job_preview,
        contact_summary: state.contact_summary,
        salary_range_high: state.salary_range_high,
        salary_range_low: state.salary_range_low,
        employment_type: state.employment_type,
        creator_id: user.user?._id,
      }

    const selectedLocation = locations.locations?.find(
      (l) => state.location_id === l._id
    )
    if (selectedLocation) {
      const { location, location_string, state } = selectedLocation
      payload = {
        ...payload,
        location,
        location_string,
        state,
      }
    }

    dispatch(postJob(payload as IPayloadJobPost))
  }

  const closeModal = (): void => {
    dispatch(reset())
  }

  const queryLocations = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownOnSearchChangeData
  ) => {
    const { searchQuery } = data
    const cleanQuery = searchQuery.trim()
    setState({
      ...state,
      searchQuery: cleanQuery,
    })
    if (cleanQuery.length >= 2) {
      dispatch(getLocations(`search=${cleanQuery}`))
    }
  }
  const queryLocationsDelayed = useCallback(
    debounce(
      (
        event: React.SyntheticEvent<HTMLElement, Event>,
        data: DropdownOnSearchChangeData
      ) => queryLocations(event, data),
      600
    ),
    []
  )
  // Handles searching for new location lists on type
  const handleSearchChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownOnSearchChangeData
  ): void => {
    queryLocationsDelayed(event, data)
  }

  return (
    <Fragment>
      <Navbar />
      <Segment basic>
        <Container>
          <VerticallyPaddedContainer size="4">
            <Header as="h1" content="Post a job" />
            <p>Start a new job posting for the world to see.</p>
            <Divider />

            {!user.user?.is_employer ? (
              <AuthMessage
                header="Invalid member type"
                content="You need to be logged in as an employer to post a job."
              />
            ) : (
              <Fragment>
                <ProgressBar percent={percent} />
                <Form onSubmit={handleSubmit}>
                  <Form.Group widths={"equal"}>
                    <Form.Input
                      onChange={handleInputChange}
                      name="title"
                      placeholder="Construction Labourer"
                      label="Job Title"
                      maxLength={50}
                    />
                    <Form.Dropdown
                      onChange={handleDropdownChangeList}
                      value={state.skills}
                      name="skills"
                      label="Skills"
                      placeholder="Add skills"
                      multiple
                      search
                      selection
                      options={skills.skills?.map((c) => ({
                        text: c.name,
                        value: c.name,
                        key: c._id,
                      }))}
                      renderLabel={customRender}
                    ></Form.Dropdown>
                    <Form.Dropdown
                      onChange={handleDropdownChangeList}
                      value={state.benefits}
                      name="benefits"
                      label="Benefits"
                      placeholder="Add benefits"
                      multiple
                      search
                      selection
                      options={benefits.benefits?.results.map((c) => ({
                        text: c.name,
                        value: c.name,
                        key: c._id,
                      }))}
                      renderLabel={customRender}
                    ></Form.Dropdown>
                  </Form.Group>

                  <Form.Group widths="equal">
                    <Form.Dropdown
                      onSearchChange={handleSearchChange}
                      onChange={handleDropdownChange}
                      name="location_id"
                      label="Location"
                      placeholder="Search suburb, postcode, state"
                      fluid
                      selectOnNavigation={false}
                      selection
                      search
                      loading={locations.isFetching}
                      renderLabel={customRender}
                      options={locations.locations?.map((l, index) => ({
                        key: index.toString(),
                        text: properCaseTransform(l.location_string),
                        value: l._id,
                      }))}
                    />
                    <Form.Dropdown
                      onChange={handleDropdownChange}
                      name="category"
                      label="Category"
                      placeholder="Select category"
                      fluid
                      selection
                      search
                      options={categories.categories?.map((c) => ({
                        text: c.name,
                        value: c.name,
                        key: c._id,
                      }))}
                    />

                    <Form.Dropdown
                      onChange={handleDropdownChange}
                      name="employment_type"
                      label="Employment Type"
                      placeholder="Select employment type"
                      fluid
                      selection
                      options={employment_types_transformed}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Input
                      onChange={handleInputChange}
                      name="salary_range_low"
                      type="number"
                      label="Minimum salary ($)"
                      min={0}
                    />

                    <Form.Input
                      onChange={handleInputChange}
                      name="salary_range_high"
                      type="number"
                      label="Maximum salary ($)"
                      min={0}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Input
                      onChange={handleInputChange}
                      name="company_name"
                      type="text"
                      label="Company name"
                      placeholder="XYZ ltd"
                      maxLength={50}
                    />
                  </Form.Group>

                  <Form.Group>
                    <div className="field" style={{ width: "100%" }}>
                      <label style={{ display: "block" }}>
                        About the company ({2000 - state.company_summary_chars}{" "}
                        chars remaining)
                      </label>
                      <ReactQuill
                        value={state.company_summary}
                        modules={QUILL_SETTINGS.MODULES}
                        formats={QUILL_SETTINGS.FORMATS}
                        placeholder="A great company based in..."
                        onChange={(
                          company_summary,
                          delta,
                          sources,
                          methods
                        ) => {
                          const company_summary_chars = methods.getLength()
                          setState({
                            ...state,
                            company_summary,
                            company_summary_chars,
                          })
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <div className="field" style={{ width: "100%" }}>
                      <label style={{ display: "block" }}>
                        Job preview description (
                        {GLOBAL_TEXT_LIMITS.POST_JOB_PREVIEW -
                          state.job_preview_chars}{" "}
                        chars remaining)
                      </label>
                      <ReactQuill
                        value={state.job_preview}
                        modules={QUILL_SETTINGS.MODULES}
                        formats={QUILL_SETTINGS.FORMATS}
                        placeholder="A short job description preview..."
                        onChange={(job_preview, delta, sources, methods) => {
                          const job_preview_chars = methods.getLength()
                          setState({
                            ...state,
                            job_preview,
                            job_preview_chars,
                          })
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <div className="field" style={{ width: "100%" }}>
                      <label style={{ display: "block" }}>
                        About the job (
                        {GLOBAL_TEXT_LIMITS.POST_JOB_SUMMARY -
                          state.job_summary_chars}{" "}
                        chars remaining)
                      </label>
                      <ReactQuill
                        value={state.job_summary}
                        modules={QUILL_SETTINGS.MODULES}
                        formats={QUILL_SETTINGS.FORMATS}
                        placeholder="Job description, requirements, responsibilites, etc..."
                        onChange={(job_summary, delta, sources, methods) => {
                          const job_summary_chars = methods.getLength()
                          setState({
                            ...state,
                            job_summary,
                            job_summary_chars,
                          })
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <div className="field" style={{ width: "100%" }}>
                      <label style={{ display: "block" }}>
                        Contact details ({500 - state.contact_summary_chars}{" "}
                        chars remaining)
                      </label>
                      <ReactQuill
                        value={state.contact_summary}
                        modules={QUILL_SETTINGS.MODULES}
                        formats={QUILL_SETTINGS.FORMATS}
                        placeholder="Email, phone number etc..."
                        onChange={(
                          contact_summary,
                          delta,
                          sources,
                          methods
                        ) => {
                          const contact_summary_chars = methods.getLength()
                          setState({
                            ...state,
                            contact_summary,
                            contact_summary_chars,
                          })
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Button
                    loading={jobPost.isFetching}
                    disabled={!(errors.length === 0)}
                    size="big"
                    color="green"
                  >
                    <Icon name="add square"></Icon>Create job
                  </Form.Button>

                  <Modal
                    open={jobPost.modalHeader.length > 0}
                    dimmer="blurring"
                    onClose={closeModal}
                  >
                    <Modal.Header>{jobPost.modalHeader}</Modal.Header>
                    <Modal.Content>{jobPost.modalContent}</Modal.Content>
                    <Modal.Actions>
                      <Button onClick={closeModal} color="green">
                        Confirm
                      </Button>
                    </Modal.Actions>
                  </Modal>
                </Form>
                {errors.length === 0 ? (
                  <Message
                    success
                    header="Validation successful"
                    content="You may proceed to post this job."
                  ></Message>
                ) : (
                  <Message info list={errors} header="Form requirements" />
                )}
              </Fragment>
            )}
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default JobPostPage
