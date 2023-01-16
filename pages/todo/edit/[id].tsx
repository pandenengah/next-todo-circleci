import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import * as yup from "yup";
import Header from '../../../components/Header';
import { Todo } from '../../../models/todo.interface';
import fetchTodo from '../../../services/fetchTodo';
import { getSelectedTodo } from '../../../stores/features/selectedTodoSlice';
import { useAppSelector } from '../../../stores/hook';
import { isObjectEmpty } from '../../../utils/object';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { pipeDateToInputDateTime } from '../../../utils/date';
import Footer from '../../../components/Footer';
import Head from 'next/head';
import { CSSTransition } from "react-transition-group";


const validationSchema = yup.object().shape({
  deadline: yup.date().typeError('This field must be a datetime')
    .min(new Date(), 'This field value must be in the future')
    .required('This field is required'),
  description: yup.string()
    .max(100, 'This field value must be less than 100 characters')
    .required('This field is required'),
  done: yup.boolean()
    .required('This field is required'),
  snapshootImageFile: yup.mixed()
    .test('size', 'This field size must be less than 10KB', (value) => {
      if (!value.length) {
        return true
      }
      return value[0].size <= (10 * 1024)
    })
})

export default function EditPage() {
  const router = useRouter()
  const idFromParams = router.query?.id
  const selectedTodo = useAppSelector(getSelectedTodo)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Todo>({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    if (isObjectEmpty(selectedTodo)) {
      router.replace('/')
    }
  }, [router, selectedTodo])


  const onSubmit = async (data: Todo) => {
    setIsSubmitting(true)

    const res = await fetchTodo.putTodos(idFromParams + '', data)
    if (!res.hasError) {
      router.replace('/')
      return
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Head>
        <title>Edit Todo | NextJS</title>
        <meta name="description" content="This is page for updating new todo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {(!isObjectEmpty(selectedTodo)) && (
        <main className="max-w-[40em] w-full mx-[auto]">
          <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
            <Header withBackButton={'/todo'} />
            <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
              <div className="mt-[1em]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <label className="flex flex-col">
                    <p className="text-[0.875em] text-purple-900">Deadline</p>
                    <input {...register("deadline")}
                      defaultValue={pipeDateToInputDateTime(selectedTodo?.deadline + '')}
                      type="datetime-local"
                      data-testid="deadlineInput"
                      className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200" />
                    {(errors?.deadline?.message) && (
                      <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                        {errors?.deadline?.message}
                      </small>
                    )}
                  </label>

                  <label className="mt-[1em] flex flex-col">
                    <p className="text-[0.875em] text-purple-900">Description</p>
                    <textarea {...register("description")}
                      defaultValue={selectedTodo.description}
                      data-testid="descriptionInput"
                      rows={5}
                      className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200">
                    </textarea>
                    {(errors?.description?.message) && (
                      <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                        {errors?.description?.message}
                      </small>
                    )}
                  </label>

                  <label className="mt-[1em] flex flex-col">
                    <p className="text-[0.875em] text-purple-900">Is Done?</p>
                    <select {...register('done')}
                      defaultValue={selectedTodo.done + ''}
                      data-testid="isDoneInput"
                      className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200 bg-white">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    {(errors?.done?.message) && (
                      <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                        {errors?.done?.message}
                      </small>
                    )}
                  </label>

                  <label className="mt-[1em] flex flex-col">
                    <p className="text-[0.875em] text-purple-900">Snapshoot Image</p>
                    <input {...register("snapshootImageFile")}
                      type="file"
                      className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200" />
                    {(errors?.snapshootImageFile?.message) && (
                      <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                        {errors?.snapshootImageFile?.message}
                      </small>
                    )}
                  </label>

                  <div className="mt-[2em]">
                    <button type={((isSubmitting) ? 'button' : 'submit')}
                      className={(isObjectEmpty(errors) ? 'bg-purple-900' : 'bg-[#d8b4fe]') + ' w-full text-[1em] font-medium text-white px-[1em] py-[0.5em]'}>
                      {(!isSubmitting) && (<> Update </>)}
                      {(isSubmitting) && (<> Updating... </>)}
                    </button>
                  </div>
                </form>
              </div>
            </CSSTransition>
            <Footer />
          </div>
        </main>
      )}
    </>
  )
}


/** this is an example if we need to use redux store on the server side
 * please note that:
 * redux is actually in the client side, but server side can change it
 * there is no redux state in server side
 * 
*/
// export const getServerSideProps: GetServerSideProps<{}> = wrapper.getServerSideProps(
//   (store) =>
//     async ({ query }) => {
//       console.log("State on server", store.getState());
//       store.dispatch(setSelectedTodo({
//         description: 'Makan Nasi'
//       }))
      
//       return {
//         props: {},
//       }
//     }
// )

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
