import moment from "moment";
import * as https from "https";
import { FetchResult } from "../models/fetch-result.interface";
import axios from "axios";
import { handleFetchError } from "../utils/handle-fetch-error";
import { Todo } from "../models/todo.interface";
import { isServer } from "../utils/render";
import toast from "react-hot-toast";
import authStorage from "./authStorage";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const getTodos = async (sortType = "", context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): Promise<FetchResult> => {  
  const url = process.env.NEXT_PUBLIC_API_URL + 'todos?sortType=' + sortType

  try {
    const response = await axios.get(url, {
      httpsAgent,
      headers: {
        'Authorization': `Bearer ${authStorage.getUserAccessToken(context)}`
      }
    })

    return {
      rawData: response.data
    }
  }
  catch (e) {
    const errors = handleFetchError(e)
    if (!isServer()) {
      toast.error(errors.errorMessage)
    }
    return errors
  }
}

const getTodo = async (id: string, context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): Promise<FetchResult> => {
  const url = process.env.NEXT_PUBLIC_API_URL + 'todos/' + id

  try {
    const response = await axios.get(url, {
      httpsAgent,
      headers: {
        'Authorization': `Bearer ${authStorage.getUserAccessToken(context)}`
      }
    })
    return {
      rawData: response.data
    }
  }
  catch (e) {
    const errors = handleFetchError(e)
    if (!isServer()) {
      toast.error(errors.errorMessage)
    }
    return errors
  }
}

const putTodos = async (id: string, body: Todo): Promise<FetchResult> => {
  const url = process.env.NEXT_PUBLIC_API_URL + 'todos/' + id
  const formData = new FormData()
  formData.append('description', body.description + '')
  formData.append('deadline', moment(body.deadline).utc().format())
  formData.append('done', body.done + '')
  if (body.snapshootImageFile?.length) {
    formData.append('snapshootImage', body.snapshootImageFile[0])
  }

  try {
    const response = await axios.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
      },
    })
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

const postTodos = async (body: Todo): Promise<FetchResult> => {
  const url = process.env.NEXT_PUBLIC_API_URL + 'todos'
  const formData = new FormData()
  formData.append('description', body.description + '')
  formData.append('deadline', moment(body.deadline).utc().format())
  if (body.snapshootImageFile?.length) {
    formData.append('snapshootImage', body.snapshootImageFile[0])
  }
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
      },
    })
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

const deleteTodos = async (id: string): Promise<FetchResult> => {
  const url = process.env.NEXT_PUBLIC_API_URL + 'todos/' + id
  try {
    const response = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
      }
    })
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

const fetchTodo = {
  getTodos,
  getTodo,
  postTodos,
  putTodos,
  deleteTodos
}
export default fetchTodo
