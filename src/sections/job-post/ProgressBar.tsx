import React from "react"
import { Progress } from "semantic-ui-react"

interface IProps {
  percent: number
}

interface IState {}

const RegisterPage: React.FC<IProps> = ({ percent }) => {
  return (
    <Progress
      percent={percent}
      size="small"
      indicating
      label={percent === 100 ? "Completed" : "Progress"}
    />
  )
}

export default RegisterPage
