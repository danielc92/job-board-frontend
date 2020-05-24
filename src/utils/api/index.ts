import { TOKEN_NAME, SERVER_500_ERROR_MESAGE } from "settings"

export const handleAxiosError = (error: any) =>
  error.response ? error.response.data.error : SERVER_500_ERROR_MESAGE
export const getConfig = () => {
  return { headers: { "x-access-token": localStorage.getItem(TOKEN_NAME) } }
}
