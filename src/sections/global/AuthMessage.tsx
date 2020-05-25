import React from "react"
import { Image, Message } from "semantic-ui-react"

interface IProps {
  content: string
  header: string
}
const AuthMessage: React.FC<IProps> = ({ content, header }) => {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Image
        style={{ maxWidth: "375px" }}
        centered
        fluid
        src="/images/undraw_authentication_fsn5.svg"
      />
      <Message color="orange" header={header} content={content} />
    </section>
  )
}
export default AuthMessage
