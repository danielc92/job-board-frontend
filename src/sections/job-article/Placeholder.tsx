import React, { Fragment } from "react"
import { Placeholder, Segment } from "semantic-ui-react"
const { Line, Header, Paragraph } = Placeholder

const JobArticlePlaceholder: React.FC = () => {
  return (
    <Fragment>
      <Placeholder fluid>
        <Header>
          <Line />
          <Line />
        </Header>
      </Placeholder>
      <Segment padded stacked>
        <Placeholder fluid>
          <Paragraph>
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
          </Paragraph>
        </Placeholder>
      </Segment>
    </Fragment>
  )
}

export default JobArticlePlaceholder
