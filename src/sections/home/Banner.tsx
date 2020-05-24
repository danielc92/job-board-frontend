import React from "react"
import {
  Container,
  Header,
  Grid,
  Segment,
  Icon,
  Image,
  Button,
} from "semantic-ui-react"
import BannerSeperator from "./BannerSeperator"
import { Link } from "react-router-dom"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"

interface IProps {
  ctaHeader: string
  buttonText: string
  ctaSubHeader: string
  imageSrc: string
}

const Banner: React.FC<IProps> = ({
  ctaHeader,
  buttonText,
  ctaSubHeader,
  imageSrc,
}) => {
  return (
    <section style={{ position: "relative" }}>
      <Segment basic style={{ margin: 0 }}>
        <Container>
          <VerticallyPaddedContainer size="5">
            <Grid divided="vertically" stackable>
              <Grid.Row columns={2}>
                <Grid.Column verticalAlign="middle">
                  <Header
                    as="h1"
                    style={{ fontSize: "3.5rem" }}
                    content={ctaHeader}
                  />
                  <p style={{ fontSize: "1.4rem" }}>{ctaSubHeader}</p>
                  <Button to="/job-list" as={Link} size="huge" color="violet">
                    <Icon name="paper plane"></Icon>
                    {buttonText}
                  </Button>
                </Grid.Column>
                <Grid.Column>
                  <Image src={imageSrc} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <BannerSeperator fillColor="#f9f9f9" backgroundColor="#fff" />
    </section>
  )
}

export default Banner
