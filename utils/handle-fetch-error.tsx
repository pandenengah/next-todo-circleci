import { Errors } from "../models/errors.interface";

export const handleFetchError = (errors: any): Errors => {
  if (!errors.isAxiosError) {
    return {
      hasError: false,
      errorMessage: ''
    }
  }

  let errorMessage = ''

  if (errors?.message) {
    errorMessage = errors?.message
  }

  if (errors?.response?.status === 401) {
    errorMessage = 'Your time access is over. Please login again'
  }

  if (errors?.response?.data?.title) {
    errorMessage = errors?.response?.data?.title
  }

  if (errors?.response?.data?.errors) {
    const keys = Object.keys(errors?.response?.data?.errors)
    errorMessage = errors?.response?.data?.errors[keys[0]][0]
  }

  return {
    hasError: true,
    errorMessage: errorMessage,
  }
}
