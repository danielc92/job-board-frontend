import { TOKEN_NAME, SERVER_500_ERROR_MESAGE } from "settings"

export const helpers = {
  handleAxiosError: (error: any) =>
    error.response ? error.response.data.error : SERVER_500_ERROR_MESAGE,
  getConfig: () => {
    return { headers: { "x-access-token": localStorage.getItem(TOKEN_NAME) } }
  },
}
