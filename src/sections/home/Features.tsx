import React from "react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { Header, Container, Segment, Grid, Icon } from "semantic-ui-react"
import BannerSeperator from "./BannerSeperator"

interface IProps {
  data: Array<IFeatures>
}

const Features: React.FC<IProps> = ({ data }) => {
  return (
    <Segment basic style={{ backgroundColor: "#f9f9f9", margin: 0 }}>
      <Container>
        <VerticallyPaddedContainer size="6">
          <Header
            as="h1"
            textAlign="center"
            content="What we can do for you"
            style={{ marginBottom: "5rem" }}
          />
          <Grid padded columns={3} stackable>
            <Grid.Row>
              {data.slice(0, 3).map((item) => (
                <Grid.Column key={item.key} textAlign="center">
                  <Icon color="violet" name={item.icon} size="big" />
                  <Header as="h3" content={item.title} />
                  <p>{item.content}</p>
                </Grid.Column>
              ))}
            </Grid.Row>
            <Grid.Row>
              {data.slice(3, 7).map((item) => (
                <Grid.Column textAlign="center" key={item.key}>
                  <Icon color="violet" name={item.icon} size="big" />
                  <Header as="h3" content={item.title} />
                  <p>{item.content}</p>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </VerticallyPaddedContainer>
      </Container>

      <BannerSeperator fillColor="#fff" backgroundColor="#f9f9f9" />
    </Segment>
  )
}

export default Features
