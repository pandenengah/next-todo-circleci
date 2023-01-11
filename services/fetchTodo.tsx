import moment from "moment";
import * as https from "https";
import { FetchResult } from "../models/fetch-result.interface";
import { env } from "../environments/env";
import axios from "axios";
import { handleFetchError } from "../utils/handle-fetch-error";
import { Todo } from "../models/todo.interface";
import { isServer } from "../utils/render";
import toast from "react-hot-toast";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const getTodos = async (sortType = ""): Promise<FetchResult> => {
  const url = env.apiUrl + 'todos?SortType=' + sortType
  
  try {
    const response = await axios.get(url, { httpsAgent })
    
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

const getTodo = async (id: string): Promise<FetchResult> => {
  const url = env.apiUrl + 'todos/' + id
  
  try {
    const response = await axios.get(url, { httpsAgent })
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
  const url = env.apiUrl + 'todos/' + id
  const formData = new FormData()
  formData.append('Description', body.description + '')
  formData.append('Deadline', moment(body.deadline + '').utc().format())
  formData.append('Done', body.done + '')
  if (body.snapshootImageFile?.length) {
    formData.append('SnapshootImage', body.snapshootImageFile[0])
  }

  try {
    const response = await axios.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
  const url = env.apiUrl + 'todos'
  const formData = new FormData()
  formData.append('Description', body.description + '')
  formData.append('Deadline', moment(body.deadline + '').utc().format())
  if (body.snapshootImageFile?.length) {
    formData.append('SnapshootImage', body.snapshootImageFile[0])
  }
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
  const url = env.apiUrl + 'todos/' + id
  try {
    const response = await axios.delete(url)
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
