import React from "react"
import { Image, Message } from "semantic-ui-react"

interface IProps {
  header: string
  content: string
}

const WithdrawnMessage: React.FC<IProps> = ({ header, content }) => {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Image
        style={{ maxWidth: "375px" }}
        centered
        fluid
        src="/images/withdrawn.svg"
      />
      <Message color="blue" header={header} content={content} />
    </section>
  )
}

export default WithdrawnMessage
