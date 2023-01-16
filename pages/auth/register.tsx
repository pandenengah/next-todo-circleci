import React, { useState } from 'react'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import fetchAuth from '../../services/fetchAuth';
import { isObjectEmpty } from '../../utils/object';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Register } from '../../models/register.interface';
import toast from 'react-hot-toast';
import Head from 'next/head';
import { CSSTransition } from "react-transition-group";


const validationSchema = yup.object().shape({
  email: yup.string()
    .email('This field must be a valid email')
    .required('This field is required'),
  fullName: yup.string()
    .required('This field is required'),
  password: yup.string()
    .min(6, 'This field value must contain minimal 6 characters')
    .required('This field is required'),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Register>({
    resolver: yupResolver(validationSchema)
  });

  async function onSubmit(data: Register) {
    setIsSubmitting(true)
    const res = await fetchAuth.postRegister(data)
    setIsSubmitting(false)
    if (!res.hasError) {
      toast.success('Your account is registered successfully. Now you can login')
      router.replace('/auth/login')
    }
  }

  return (
    <>
      <Head>
        <title>Register | NextJS</title>
        <meta name="description" content="This is page for registering new account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="max-w-[40em] w-full mx-[auto]">
        <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
          <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
            <div className="mt-[1em]">
              <h1 className="text-[1.5em] font-bold text-purple-900">Register New Account</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-[2em]">
                <label className="flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Email</p>
                  <input {...register("email")}
                    type="email"
                    className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200" />
                  {(errors?.email?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600">
                      {errors?.email?.message}
                    </small>
                  )}
                </label>

                <label className="mt-[1em] flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Full Name</p>
                  <input {...register("fullName")}
                    type="text"
                    className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200" />
                  {(errors?.fullName?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600">
                      {errors?.fullName?.message}
                    </small>
                  )}
                </label>

                <label className="mt-[1em] flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Password</p>
                  <input {...register("password")}
                    type="password"
                    className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200" />
                  {(errors?.password?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600">
                      {errors?.password?.message}
                    </small>
                  )}
                </label>

                <div className="mt-[2em]">
                  <button type={((isSubmitting) ? 'button' : 'submit')}
                    className={(isObjectEmpty(errors) ? 'bg-purple-900' : 'bg-[#d8b4fe]') + ' w-full text-[1em] font-medium text-white px-[1em] py-[0.5em]'}>
                    {(!isSubmitting) && (<> Register </>)}
                    {(isSubmitting) && (<> Registering... </>)}
                  </button>
                </div>

                <div className="mt-[2em]">
                  <p className="text-[0.75em] text-gray-600">
                    Already have an account?&nbsp;
                    <Link href="/auth/login" className="underline text-purple-900 font-bold">Login now</Link>
                  </p>
                </div>
              </form>
            </div>
          </CSSTransition>
        </div>
      </main>
    </>
  )
}
