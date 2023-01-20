import Head from 'next/head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { pipeDate } from '../../utils/date'
import Link from 'next/link'
import { Todo } from '../../models/todo.interface'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../stores/hook'
import { useRouter } from 'next/router'
import { setSelectedTodo } from '../../stores/features/selectedTodoSlice'
import fetchTodo from '../../services/fetchTodo'
import { User } from '../../models/user.interface'
import authStorage from '../../services/authStorage'
import { CSSTransition } from "react-transition-group";
import { sleep } from '../../utils/sleep'
import toast from 'react-hot-toast'


export default function TodoPage({ initialErrorMessage, initialTodos, sortType, user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage)
  const [todos, setTodos] = useState(initialTodos)

  useEffect(() => {
    setErrorMessage(initialErrorMessage)
    setTodos(initialTodos)

    if (!!errorMessage) {
      sleep(10).then(() => {
        toast.error(errorMessage)
      })
    }
  }, [initialErrorMessage, initialTodos, errorMessage])

  const updateTodoIsDeletingByIndex = (index: number, isDeletingValue: boolean) => {
    const newTodos = todos.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isDeleting: isDeletingValue,
        }
      }
      return { ...item }
    })
    setTodos(newTodos)
  }

  const updateTodoIsDeleteDoneByIndex = (index: number, isDeleteDoneValue: boolean) => {
    const newTodos = todos.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isDeleting: true,
          isDeleteDone: isDeleteDoneValue,
        }
      }
      return { ...item }
    })
    setTodos(newTodos)
  }

  const updateTodoIsUpdatingByIndex = (index: number, value: boolean) => {
    const newTodos = todos.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isUpdating: value,
        }
      }
      return { ...item }
    })
    setTodos(newTodos)
  }

  const onClickButtonSort = async () => {
    if (sortType === 'desc') {
      router.replace('/todo?sort=asc')
      return
    }
    router.replace('/todo?sort=desc')
  }

  const onChangeCheckBox = async (index: number, todo: Todo) => {
    updateTodoIsUpdatingByIndex(index, true)

    const newTodo = {
      ...todo,
      done: !todo.done,
      snapshootImageFile: undefined,
    }
    const res = await fetchTodo.putTodos(todo.id + '', newTodo)
    if (res.hasError) {
      updateTodoIsUpdatingByIndex(index, false)
      return
    }

    fetchTodo.getTodos(sortType).then((res) => setTodos(res.rawData))
  }

  const onClickEdit = (todo: Todo) => {
    dispatch(setSelectedTodo(todo))
  }

  const onClickDelete = async (index: number, id: string) => {
    updateTodoIsDeletingByIndex(index, true)
    const res = await fetchTodo.deleteTodos(id)
    if (res.hasError) {
      updateTodoIsDeletingByIndex(index, false)
      return
    }
    updateTodoIsDeleteDoneByIndex(index, true)
    await sleep(500)
    fetchTodo.getTodos(sortType).then((res) => setTodos(res.rawData))
  }

  return (
    <>
      <Head>
        <title>Todo | NextJS</title>
        <meta name="description" content="This is page for showing list of todo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="max-w-[40em] w-full mx-[auto]">
        <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
          <Header withAddButton={true} />
          <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
            <div>
              <div className="mt-[1em]">
                <p className="text-[1.25em] text-center">Welcome back, {user.fullName}</p>
              </div>
              <div className="mt-[1em] flex items-center space-x-[0.75em]">
                <p className="text-[0.75em] text-purple-900">Sort by date</p>
                <button onClick={onClickButtonSort} data-testid="sortBtn" className="text-[0.75em] font-medium text-purple-900 bg-gray-200 px-[1em] py-[0.5em]">
                  <span className="uppercase" data-testid="sortText">{sortType}</span>
                </button>
              </div>

              {(todos?.length > 0) ? (
                <ul>
                  {todos.map((item, i) => {
                    return (
                      <CSSTransition key={i}
                        in={!item.isDeleteDone}
                        classNames="fadeOut"
                        appear={true}
                        timeout={500}>
                        <li className="mt-[1em] p-[1em] border border-purple-200 rounded-[0.5em] flex justify-between hover:bg-gray-50">
                          <div className="flex items-center space-x-[1em]">
                            {(item.isUpdating) ? (
                              <span>
                                <svg className="animate-spin h-[1.5em] w-[1.5em] text-purple-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              </span>
                            ) : (
                              <input onChange={() => onChangeCheckBox(i, item)}
                                className="accent-purple-900 h-[1.125em] w-[1.125em] mx-[0.1875em]"
                                data-testid="inputForEdit"
                                type="checkbox"
                                checked={item.done} readOnly />
                            )}
                            <Link href={'/todo/' + item.id} className="flex items-center space-x-[1em]">
                              <figure className="rounded-[0.5em] overflow-hidden">
                                {(!item.snapshootImage) ? (
                                  <span className="block w-[4em] h-[4em] bg-gray-100"></span>
                                ) : (
                                  <picture className="flex">
                                    <img
                                      src={process.env.NEXT_PUBLIC_IMAGE_PATH + item.snapshootImage}
                                      alt="" className="object-cover w-[4em] h-[4em]" />
                                  </picture>
                                )}
                              </figure>
                              <div>
                                <p className="text-[0.75em] text-purple-900">{pipeDate(item.deadline + '')}</p>
                                <p data-testid="descriptionElm" className={(item.done ? 'line-through' : '')}>{item.description}</p>
                              </div>
                            </Link>
                          </div>
                          <div className="flex items-center">
                            <Link onClick={() => { onClickEdit(item) }} href={'/todo/edit/' + item.id}
                              className="block text-[0.75em] font-medium text-white bg-lime-600 px-[1em] py-[0.5em]">
                              Edit
                            </Link>
                            <button onClick={() => onClickDelete(i, item.id + '')} className="text-[0.75em] font-medium text-white bg-red-700 px-[1em] py-[0.5em]">
                              {(!item.isDeleting) && (<> Delete </>)}
                              {(item.isDeleting) && (<> Deleting... </>)}
                            </button>
                          </div>
                        </li>
                      </CSSTransition>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-center mt-[3em] text-gray-600">No data</p>
              )}
            </div>
          </CSSTransition>
          <Footer />
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ initialErrorMessage: string, initialTodos: Todo[], sortType: string, user: User }> = async (context) => {
  const query = context.query
  let sortType = 'asc'
  if (query?.sort === 'desc') {
    sortType = 'desc'
  }

  let errorMessage = ''
  let todos: Todo[] = []
  const res = await fetchTodo.getTodos(sortType, context)

  if (!res.hasError) {
    todos = res.rawData
  } else {
    errorMessage = res?.errorMessage || ''
  }

  return {
    props: {
      initialErrorMessage: errorMessage,
      initialTodos: todos,
      sortType,
      user: authStorage.getUser(context)
    },
  }
}
