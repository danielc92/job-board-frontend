import React from "react"
import { Segment, Header } from "semantic-ui-react"

const UnavailableJob: React.FC = () => {
  return (
    <Segment stacked color="orange">
      <Header content="Job Unavailable" />
      <p>
        Sorry, the poster of this job has closed it off and is no longer
        accepting applications.
      </p>
    </Segment>
  )
}

export default UnavailableJob
