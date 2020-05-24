import React, { Component, Fragment, useState, useEffect } from 'react'
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
} from 'semantic-ui-react'

import { checkTokenIsValid } from 'helpers/auth'
import {
  StringValidator,
  IsEmptyValidator,
  SalaryRangeValidator,
  ListValidator,
  StringCharacterValidator,
} from 'utils/validation'
import { calculateProgress } from 'helpers/progressbar'

import { SESSION_EXPIRED_MESSAGE, ALLOWED_CHARS_JOB } from 'app_constants'
import BannerGroup from 'components/banners/BannerGroup'
import { useDispatch, useSelector } from 'react-redux'
import { getSkills, selectSkills } from 'features/skills'
import { getCategories, selectCategories } from 'features/categories'
import { selectUser, logoutUser} from 'features/account-auth'
import { useHistory } from 'react-router-dom'

interface IState {
    title:string
    category:string
    skills: string[]
    benefits: string[]
    company_summary: string
    job_summary: string
    company_name: string
    contact_summary: string
    salary_range_low: string
    salary_range_high: string
    employment_type: string
    location: any
    searchQuery: string
}
const initialState = {
  title: '',
  category: '',
  skills: [],
  benefits: [],
  company_summary: '',
  job_summary: '',
  company_name: '',
  contact_summary: '',
  salary_range_low: '',
  salary_range_high: '',
  employment_type: '',
  location: {},
  searchQuery: '',
}

const employment_types = [
  'full-time',
  'part-time',
  'casual',
  'fixed-term',
  'shift worker',
  'daily/weekly hire',
  'probation',
  'outworkers',
  'other',
]

const employment_types_transformed = employment_types.map((i) => ({
  text: i,
  key: i,
  value: i,
}))

interface IProps {}

const JobPostPage:React.FC<IProps> = () =>  {
//   constructor(props) {
//     super(props)
//     this.handleSearchChange = debounce(this.handleSearchChange.bind(this), 500)
//
const historySelector = useHistory()
const [state, setState ] = useState<IState>(initialState)
   const [errors, setErrors] = useState<string[]>([])
const [percent, setPercent] = useState<number>(0)
   const skills = useSelector(selectSkills)
   const categories = useSelector(selectCategories)
const user = useSelector(selectUser)
   const closeModal = () => {
    // this.props.propsResetJob()
  }

  const customRender = (label: any) => ({
    color: 'green',
    content: label.text,
  })

  const validateForm = () => {

    const errors = [
      ...StringValidator(state.company_summary, 1, 500, 'Company summary'),
      ...StringValidator(state.job_summary, 1, 500, 'Job summary'),
      ...StringValidator(state.contact_summary, 1, 500, 'Contact information'),
      ...StringValidator(state.company_name, 0, 50, 'Company name'),
      ...ListValidator(state.skills, 1, 10, 'Skills'),
      ...ListValidator(state.benefits, 1, 10, 'Benefits'),
      ...StringValidator(state.title, 1, 50, 'Job title'),
      ...StringCharacterValidator(state.title, ALLOWED_CHARS_JOB, 'Job title'),
      ...IsEmptyValidator(state.category, 'Job category'),
      ...IsEmptyValidator(state.employment_type, 'Employment type'),
      ...IsEmptyValidator(state.salary_range_low, 'Salary (minimum)'),
      ...IsEmptyValidator(state.salary_range_high, 'Salary (maximum)'),
      ...SalaryRangeValidator(state.salary_range_low, state.salary_range_high),
    ]

    setErrors(errors)
  }

  useEffect(()=>{
    const percent = calculateProgress(errors)
    setPercent(percent)
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setState({...state, [name]: value })
  }

  const handleDropdownChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const limit = 10
    const { name, value } = data
    if (value && (value.length <= limit)) {
    setState({...state, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()


    // const { errors, location } = this.state
    // Initial check to see if token has expired
    if (!checkTokenIsValid()) {
      dispatch(logoutUser())
      historySelector.push({
        pathname: '/sign-in',
        state: { redirect_message: SESSION_EXPIRED_MESSAGE },
      })
      return
    }

    // Check if there are errors present, before dispatching
    if (errors.length === 0) 

      let payload = {
        title: state.title,
        category: state.category,
        skills: state.skills,
        benefits: state.benefits,
        company_name: state.company_name,
        company_summary: state.company_summary,
        job_summary: state.job_summary,
        contact_summary: state.contact_summary,
        salary_range_high: state.salary_range_high,
        salary_range_low: state.salary_range_low,
        employment_type: state.employment_type,
        creator_id: user.user?._id,
      }

      if (Object.entries(location).length > 0) {
        payload = {
          ...payload,
          location: location.location,
          location_string: location.location_string,
        }
      }

      this.props.propsCreateJob(payload)
    }
  }

//   componentDidMount() {
//     this.validateForm()
//     this.props.propsGetSkills()
//     this.props.propsGetCategories()
//     this.props.propsGetBenefits()
//     this.props.propsGetLocations()
//   }
  const dispatch = useDispatch()
  useEffect(()=>{
      dispatch(getSkills())
      dispatch(getCategories())
  },[])

//   handleSearchChange = (event, data) => {
//     const { searchQuery } = data
//     const { propsGetLocations, locations } = this.props
//     const cleanQuery = searchQuery.trim()
//     this.setState({ searchQuery: cleanQuery })
//     const exists = locations.filter((i) => i.search === cleanQuery)

//     // No duplicate requests
//     if (cleanQuery.length >= 2 && exists.length === 0) {
//       propsGetLocations(searchQuery)
//     }
//   }

//   render() {
//     const {
//       errors,
//       job_summary,
//       company_summary,
//       percent,
//       contact_summary,
//       searchQuery,
//     } = this.state
//     const { auth, benefit, category, job, locations, skill } = this.props

//     const locationOptions = locations.filter(
//       (item) => item.search === searchQuery
//     )

    return (
      <Fragment>
        <Segment basic>
          <Container>
            <VerticallyPaddedContainer size="4">
              <Header as="h1" content="Post a job" />
              <p>Start a new job posting for the world to see.</p>
              <Divider />
              {!auth.user.is_employer ? (
                <CustomAuthMessage
                  header="Invalid member type"
                  content="You need to be logged in as an employer to post a job."
                />
              ) : (
                <Fragment>
                  <ReactProgressContainer percent={percent} />
                  <Form onSubmit={handleSubmit}>
                    <Form.Group widths={'equal'}>
                      <Form.Input
                        onChange={handleInputChange}
                        name="title"
                        placeholder="Construction Labourer"
                        label="Job Title"
                        maxLength={50}
                      />
                      <Form.Dropdown
                        onChange={handleDropdownChange}
                        value={this.state.skills}
                        name="skills"
                        label="Skills"
                        placeholder="Add skills"
                        multiple
                        search
                        selection
                        options={skill.data}
                        renderLabel={this.customRender}
                      ></Form.Dropdown>
                      <Form.Dropdown
                        onChange={handleDropdownChange}
                        value={state.benefits}
                        name="benefits"
                        label="Benefits"
                        placeholder="Add benefits"
                        multiple
                        search
                        selection
                        options={benefit.data}
                        renderLabel={this.customRender}
                      ></Form.Dropdown>
                    </Form.Group>

                    <Form.Group widths="equal">
                      <Form.Dropdown
                        onSearchChange={this.handleSearchChange}
                        onChange={this.handleDropdownChange}
                        name="location"
                        label="Location"

                        placeholder="Search suburb, postcode, state"
                        fluid
                        selectOnNavigation={false}
                        selection
                        search
                        renderLabel={this.customRender}
                        options={
                          locationOptions.length > 0
                            ? locationOptions[0]['data']
                            : null
                        }
                      />
                      <Form.Dropdown
                        onChange={this.handleDropdownChange}
                        name="category"
                        label="Category"
                        placeholder="Select category"
                        fluid
                        selection
                        search
                        options={category.data}
                      />

                      <Form.Dropdown
                        onChange={this.handleDropdownChange}
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
                        onChange={this.handleInputChange}
                        name="salary_range_low"
                        type="number"
                        label="Minimum salary ($)"
                        min={0}
                      />

                      <Form.Input
                        onChange={this.handleInputChange}
                        name="salary_range_high"
                        type="number"
                        label="Maximum salary ($)"
                        min={0}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Input
                        onChange={this.handleInputChange}
                        name="company_name"
                        type="text"
                        label="Company name"
                        placeholder="XYZ ltd"
                        maxLength={50}
                      />
                    </Form.Group>

                    <Form.TextArea
                      width={12}
                      onChange={this.handleInputChange}
                      name="company_summary"
                      maxLength="500"
                      placeholder="A well established construction company based in the heart of Melbourne..."
                      label={`About the company (${
                        500 - company_summary.length
                      } chars remaining)`}
                    />

                    <Form.TextArea
                      width={12}
                      onChange={this.handleInputChange}
                      name="job_summary"
                      maxLength="500"
                      placeholder="A short description about the job"
                      label={`About the job (${
                        500 - job_summary.length
                      } chars remaining)`}
                    />

                    <Form.TextArea
                      width={12}
                      onChange={this.handleInputChange}
                      name="contact_summary"
                      maxLength="500"
                      placeholder="Enter any contact details..."
                      label={`Contact details (${
                        500 - contact_summary.length
                      } chars remaining)`}
                    />

                    <Form.Button
                      loading={job.loading}
                      disabled={!(errors.length === 0)}
                      size="big"
                      color="green"
                    >
                      <Icon name="add square"></Icon>Create job
                    </Form.Button>

                    <Modal
                      open={job.data || job.error ? true : false}
                      dimmer="blurring"
                      onClose={this.closeModal}
                    >
                      <Modal.Header>
                        {job.error ? 'Error' : 'Success'}
                      </Modal.Header>
                      <Modal.Content>
                        {job.error
                          ? job.message
                          : 'Your job has been posted successfully!'}
                      </Modal.Content>
                      <Modal.Actions>
                        <Button onClick={this.closeModal} color="green">
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
      </Fragment>
    )
  }


export default JobPostPage