import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { env } from '../../environments/env'
import { Todo } from '../../models/todo.interface'
import fetchTodo from '../../services/fetchTodo'
import Image from 'next/image'
import Head from 'next/head'
import { pipeDate } from '../../utils/date'

export default function DetailPage({ todo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Detail Todo | NextJS</title>
        <meta name="description" content={'This is page for showing detail of todo with ID ' + todo.id} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="max-w-[40em] w-full mx-[auto]">
        <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
          <Header withBackButton={'/'} />
          <div className="mt-[1.5em]">
            <div className="flex justify-start items-start space-x-[1em]">
              <figure className="rounded-[0.5em] overflow-hidden">
                {(!todo.snapshootImage) ? (
                  <span className="block w-[9em] h-[9em] bg-gray-100"></span>
                ) : (
                  <Image
                    src={env.imagePath + todo.snapshootImage}
                    alt="" className="object-cover w-[9em] h-[9em]" />
                )}
              </figure>
              <div>
                <h2 className="text-[1em] font-bold text-purple-900">#{todo.id}</h2>
                <p className="text-[0.875em] text-gray-700">{pipeDate(todo.deadline+'')}</p>
                <p className="text-[1.25em] my-[1em]">{todo.description}</p>
                {(todo.done) ? (
                  <div className='bg-lime-600 py-[0.5em] px-[1em] rounded-[2em] text-[0.75em] text-white text-center w-max'>DONE ALREADY</div>
                ) : (
                  <div className='bg-orange-400 py-[0.5em] px-[1em] rounded-[2em] text-[0.75em] text-white text-center w-max'>NOT COMPLETE</div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ todo: Todo }> = async (context) => {
  const id = context?.params?.id

  const res = await fetchTodo.getTodo(id + '')
  if (res.hasError) {
    return {
      notFound: true,
    }
  }
  
  const todo = res.rawData  
  return {
    props: {
      todo,
    },
  }
}
