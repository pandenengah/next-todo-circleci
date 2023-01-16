import axios from "axios";
import toast from "react-hot-toast";
import { Register } from "../models/register.interface";
import { FetchResult } from "../models/fetch-result.interface";
import { env } from "../environments/env";
import { handleFetchError } from "../utils/handle-fetch-error";
import { isServer } from "../utils/render";
import { Login } from "../models/login.interface";


const postRegister = async (body: Register): Promise<FetchResult> => {
  const url = process.env.NEXT_PUBLIC_API_URL + 'auth/register'
  try {
    const response = await axios.post(url, body)
    return {
      rawData: response.data
    }
  } catch (e) {
    const errors = handleFetchError(e)
    if (!isServer()) {
      toast.error(errors.errorMessage)
    }
    return errors
  }
}

const postLogin = async (body: Login): Promise<FetchResult> => {
  const url = process.env.NEXT_PUBLIC_API_URL + 'auth/login'
  try {
    const response = await axios.post(url, body)
    return {
      rawData: response.data
    }
  } catch (e) {
    const errors = handleFetchError(e)
    if (!isServer()) {
      toast.error(errors.errorMessage)
    }
    return errors
  }
}

const fetchAuth = {
  postLogin,
  postRegister
}

export default fetchAuth
