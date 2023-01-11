import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { env } from '../environments/env'
import { pipeDate } from '../utils/date'
import Link from 'next/link'
import { Todo } from '../models/todo.interface'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import fetchTodo from '../services/fetchTodo'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../stores/hook'
import { useRouter } from 'next/router'
import { setSelectedTodo } from '../stores/features/selectedTodoSlice'


export default function RootPage({ initialTodos, sortType }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [todos, setTodos] = useState(initialTodos)

  useEffect(() => {
    setTodos(initialTodos)
  }, [initialTodos])

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

  const onClickButtonSort = async () => {
    if (sortType === 'desc') {
      router.replace('./?sort=asc')
      return
    }
    router.replace('./?sort=desc')
  }

  const onChangeCheckBox = async (todo: Todo) => {
    const newTodo = {
      ...todo,
      done: !todo.done,
      snapshootImageFile: undefined,
    }
    await fetchTodo.putTodos(todo.id + '', newTodo)
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
          <div>
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
                    <li key={i} className="mt-[1em] p-[1em] border border-purple-200 rounded-[0.5em] flex justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-[1em]">
                        <input onChange={() => onChangeCheckBox(item)}
                          className="accent-purple-900"
                          data-testid="inputForEdit"
                          type="checkbox"
                          checked={item.done} readOnly />
                        <Link href={'/' + item.id} className="flex items-center space-x-[1em]">
                          <figure className="rounded-[0.5em] overflow-hidden">
                            {(!item.snapshootImage) ? (
                              <span className="block w-[4em] h-[4em] bg-gray-100"></span>
                            ) : (
                              <Image
                                src={env.imagePath + item.snapshootImage}
                                alt="" className="object-cover w-[4em] h-[4em]" />
                            )}
                          </figure>
                          <div>
                            <p className="text-[0.75em] text-purple-900">{pipeDate(item.deadline + '')}</p>
                            <p data-testid="descriptionElm" className={(item.done ? 'line-through' : '')}>{item.description}</p>
                          </div>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <Link onClick={() => { onClickEdit(item) }} href={'/edit/' + item.id}
                          className="block text-[0.75em] font-medium text-white bg-lime-600 px-[1em] py-[0.5em]">
                          Edit
                        </Link>
                        <button onClick={() => onClickDelete(i, item.id + '')} className="text-[0.75em] font-medium text-white bg-red-700 px-[1em] py-[0.5em]">
                          {(!item.isDeleting) && (<> Delete </>)}
                          {(item.isDeleting) && (<> Deleting... </>)}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-center mt-[3em] text-gray-600">No data</p>
            )}
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}

/** this is an example if we need to use redux store on the server side
 * please note that:
 * redux is actually in the client side, but server side can change it
 * there is no redux state in server side
 * 
export const getServerSideProps: GetServerSideProps<{ initialTodos: Todo[] }> = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(query);
      console.log("State on server", store.getState());
      store.dispatch(setTodoSortType('desc'))
      // console.log("State on server", store.getState());
      const res = await fetchTodo.getTodos(store.getState().todoSortType.value)
      const todos = res.rawData

      return {
        props: {
          initialTodos: todos,
        },
      }
    }
)
*/

export const getServerSideProps: GetServerSideProps<{ initialTodos: Todo[], sortType: string }> = async (context) => {
  const query = context.query
  let sortType = 'asc'
  if (query?.sort === 'desc') {
    sortType = 'desc'
  }

  let todos: Todo[] = []
  const res = await fetchTodo.getTodos(sortType)
  if (!res.hasError) {
    todos = res.rawData
  }

  return {
    props: {
      initialTodos: todos,
      sortType,
    },
  }
}
