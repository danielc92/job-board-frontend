import React from "react"
import { Button, Icon, Image, Message } from "semantic-ui-react"
import Navbar from "./Navbar"

interface IProps {
  header: string
  content: string
}

const ErrorMessage: React.FC<IProps> = ({ header, content }) => {
  return (
  
    <section
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Image
        style={{ maxWidth: "375px" }}
        centered
        fluid
        src="/images/page_not_found_su7k.svg"
      />
      <Message color="red" header={header} content={content} />
      <Button
        centered
        color="green"
        size="big"
        onClick={() => window.location.reload()}
      >
        <Icon name="refresh" />
        Refresh Page
      </Button>
    </section>
  )
}

export default ErrorMessage
