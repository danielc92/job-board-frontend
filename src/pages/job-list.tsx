import React, { Fragment, useEffect, useState, useCallback } from "react"
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Label,
  Pagination,
  Segment,
  Placeholder,
  Form,
  PaginationProps,
  DropdownProps,
  FormProps,
  DropdownOnSearchChangeData,
} from "semantic-ui-react"
import querystring from "querystring"
import BannerGroup from "sections/global/BannerGroup"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { dateDiffString, properCaseTransform } from "utils/date"
import ErrorMessage from "sections/global/ErrorMessage"
import { selectJobList, getJobList } from "features/job-list"
import { useSelector, useDispatch } from "react-redux"
import { selectCategories, getCategories } from "features/categories"
import { selectLocations, getLocations } from "features/locations"
import { useHistory, useLocation } from "react-router-dom"
import { debounce } from "lodash"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"

const { Line, Paragraph } = Placeholder

interface IProps {}

interface IState {
  title?: string
  location_string?: string
  category?: string
}

const JobListPage: React.FC<IProps> = () => {
  const [state, setState] = useState<IState>({})
  const dispatch = useDispatch()
  const jobList = useSelector(selectJobList)
  const categories = useSelector(selectCategories)
  const locations = useSelector(selectLocations)
  const historySelector = useHistory()
  const locationSelector = useLocation()
  useEffect(() => {
    if (!categories.categories) {
      dispatch(getCategories())
    }

    const args = querystring.parse(locationSelector.search.substring(1))
    dispatch(getJobList(args))
  }, [categories.categories, dispatch, historySelector, locationSelector])

  const handleJobSearch = (
    event: React.FormEvent<HTMLFormElement>,
    data: FormProps
  ) => {
    event.preventDefault()

    historySelector.push(
      `/job-list?${querystring.stringify({ ...state, page: "1" })}`
    )
  }

  const handlePageChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) => {
    let queryObject = querystring.parse(
      historySelector.location.search.substring(1)
    )
    queryObject.page = data.activePage as string

    let queryString = querystring.stringify(queryObject)
    historySelector.push({
      pathname: "/job-list",
      search: `?${queryString}`,
    })
  }

  const handleViewJob = (slug: string) => {
    historySelector.push({
      pathname: `/job/${slug}`,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setState({ ...state, [event.target.name]: event.target.value })
    }
  }

  const handleDropDownChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setState({ ...state, [data.name]: data.value })
  }

  const queryLocations = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownOnSearchChangeData
  ) => {
    const { searchQuery } = data
    const cleanQuery = searchQuery.trim()

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

  const previousQuery = querystring.parse(
    historySelector.location.search.substring(1)
  )
  console.log("Previous query", previousQuery)

  return (
    <Fragment>
      <Navbar />
      <Segment basic>
        <Container text>
          <VerticallyPaddedContainer size="3">
            <Header as="h1" content="Find your dream job." />
            <Form onSubmit={handleJobSearch}>
              <Form.Group>
                <Form.Input
                  style={{ marginBottom: "12px" }}
                  label="What"
                  autoComplete="off"
                  maxLength={30}
                  name="title"
                  onChange={handleInputChange}
                  placeholder="Enter some keywords..."
                  value={state.title}
                />

                <Form.Dropdown
                  style={{ width: 240 }}
                  onSearchChange={handleSearchChange}
                  onChange={handleDropDownChange}
                  name="location_string"
                  label="Location"
                  placeholder="Search suburb, postcode, state"
                  fluid
                  selectOnNavigation={false}
                  selection
                  clearable
                  search
                  value={state.location_string}
                  loading={locations.isFetching}
                  options={locations.locations?.map((l, index) => ({
                    key: index.toString(),
                    text: properCaseTransform(l.location_string),
                    value: l.location_string,
                  }))}
                />

                <Form.Dropdown
                  style={{ marginBottom: "12px" }}
                  clearable
                  onChange={handleDropDownChange}
                  name="category"
                  label="Category"
                  placeholder="Select category"
                  selection
                  search
                  value={state.category}
                  options={categories.categories?.map((c) => ({
                    text: c.name,
                    value: c.name,
                    key: c._id,
                  }))}
                />
              </Form.Group>

              <Form.Group>
                <Form.Button size="large" color="green">
                  <Icon name="search"></Icon>Search
                </Form.Button>
              </Form.Group>
            </Form>
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <Segment basic>
        <Container text>
          <VerticallyPaddedContainer size="1">
            {jobList.error ? (
              <Fragment>
                <Header as="h1" content="Job listings" />
                <ErrorMessage
                  header="An error occurred"
                  content="Please try again later."
                />
              </Fragment>
            ) : jobList.jobList?.results ? (
              <Fragment>
                <Header as="h1" content="Job listings" />
                <p>
                  We found {jobList.jobList.results.totalDocs} jobs matching
                  your search
                </p>

                <Label.Group>
                  {Object.entries(previousQuery).map((i) => {
                    if (i[0] !== "page" && i[1] && i[1].length > 0) {
                      return <Label size="tiny">{i[1]}</Label>
                    }
                  })}
                </Label.Group>

                <Divider></Divider>
                {jobList.jobList.results.docs.map((item, index) => (
                  <Segment stacked padded key={index.toString()}>
                    <Header as="h3" content={properCaseTransform(item.title)} />

                    <p>{item.job_summary}</p>

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
                      <Label color="green" basic>
                        ${item.salary_range_low} - ${item.salary_range_high}
                      </Label>
                      <Label color="green" basic>
                        {item.category}
                      </Label>
                    </Label.Group>
                  </Segment>
                ))}

                <Pagination
                  activePage={jobList.jobList.results.page}
                  firstItem={{
                    content: <Icon name="angle double left" />,
                    icon: true,
                  }}
                  lastItem={{
                    content: <Icon name="angle double right" />,
                    icon: true,
                  }}
                  prevItem={{
                    content: <Icon name="angle left" />,
                    icon: true,
                  }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  totalPages={jobList.jobList.results.totalPages}
                  onPageChange={handlePageChange}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Header as="h1" content="Job listings" />

                {new Array(6).fill(true).map((item, index) => (
                  <Segment padded stacked key={index.toString()}>
                    <Placeholder>
                      <Paragraph>
                        <Line /> <Line /> <Line /> <Line /> <Line /> <Line />
                      </Paragraph>
                    </Placeholder>
                  </Segment>
                ))}
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

export default JobListPage
