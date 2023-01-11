import Head from 'next/head'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { Todo } from '../../models/todo.interface'
import * as yup from "yup";
import { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import fetchTodo from '../../services/fetchTodo'
import { useRouter } from 'next/router'
import { isObjectEmpty } from '../../utils/object'


const validationSchema = yup.object().shape({
  deadline: yup.date().typeError('This field must be a datetime')
    .min(new Date(), 'This field value must be in the future')
    .required('This field is required'),
  description: yup.string()
    .max(100, 'This field value must be less than 100 characters')
    .required('This field is required')
})

export default function AddPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Todo>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: Todo) => {
    setIsSubmitting(true)
    const res = await fetchTodo.postTodos(data)
    if (!res.hasError) {
      router.replace('/')
      return
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Head>
        <title>Add Todo | NextJS</title>
        <meta name="description" content="This is page for creating new todo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="max-w-[40em] w-full mx-[auto]">
        <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
          <Header withBackButton="/" />
          <div className="mt-[1em]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="flex flex-col">
                <p className="text-[0.875em] text-purple-900">Deadline</p>
                <input {...register("deadline")}
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

              <div className="mt-[2em]">
                <button type={((isSubmitting) ? 'button' : 'submit')}
                  className={(isObjectEmpty(errors) ? 'bg-purple-900' : 'bg-[#d8b4fe]') + ' w-full text-[1em] font-medium text-white px-[1em] py-[0.5em]'}>
                  {(!isSubmitting) && (<> Save </>)}
                  {(isSubmitting) && (<> Saving... </>)}
                </button>
              </div>
            </form>
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}
