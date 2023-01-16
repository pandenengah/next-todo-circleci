import { destroyCookie, parseCookies, setCookie } from "nookies"
import { env } from "../environments/env"
import { User } from "../models/user.interface"
import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"


const getUser = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): User => {
  const cookies = parseCookies(context)
  return JSON.parse(cookies[process.env.NEXT_PUBLIC_USER_STORAGE_NAME+''] || '{}')
}

const getUserByReqCookies = (cookies: RequestCookies): User => {
  return JSON.parse(cookies.get(process.env.NEXT_PUBLIC_USER_STORAGE_NAME+'')?.value || '{}')
}

const setUser = (user: User, context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): void => {
  setCookie(context, process.env.NEXT_PUBLIC_USER_STORAGE_NAME+'', JSON.stringify(user), { path: '/' })
}

const isUserHasAccessToken = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): boolean => {
  const user = getUser(context)
  return !!user.accessToken
}

const isUserHasAccessTokenByReqCookies = (cookies: RequestCookies): boolean => {
  const user = getUserByReqCookies(cookies)
  return !!user.accessToken
}

const getUserAccessToken = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): string => {
  const user = getUser(context)
  return user?.accessToken || ''
}

const removeUser = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | null = null): void => {
  destroyCookie(context, process.env.NEXT_PUBLIC_USER_STORAGE_NAME+'')
}

const authStorage = {
  setUser,
  removeUser,
  isUserHasAccessToken,
  getUser,
  getUserAccessToken,
  getUserByReqCookies,
  isUserHasAccessTokenByReqCookies
}

export default authStorage
