import Link from 'next/link'
import React from 'react'
import authStorage from '../services/authStorage'
import { useRouter } from 'next/router'

type HeaderProps = {
  withBackButton?: string
  withAddButton?: boolean
}

function Header(props: HeaderProps) {
  const router = useRouter()

  const onClickLogout = () => {
    authStorage.removeUser()
    router.replace('/auth/login')
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full shadow-md px-[1em] flex justify-between items-center p-[1em] bg-white">
        <div className="w-[6em] flex">
          {(props.withBackButton) &&
            <Link href={props.withBackButton} replace
              data-testid="backBtn"
              className="text-[0.875em] font-medium text-purple-900 bg-gray-200 px-[1em] py-[0.5em] cursor-pointer">&#11164;&nbsp; Back</Link>
          }
        </div>
        <h1 className="font-bold text-[1.5em] text-purple-900">Todo</h1>
        <div className="w-[6em] flex justify-end">
          {props.withAddButton &&
            <Link href="/todo/add"
              data-testid="addBtn"
              className="text-[0.875em] font-medium text-white bg-purple-900 px-[1em] py-[0.5em] cursor-pointer">Add</Link>
          }
          <button
            onClick={onClickLogout}
            data-testid="logoutBtn"
            className="text-[0.875em] font-medium text-purple-900 bg-gray-200 px-[1em] py-[0.5em] cursor-pointer">Logout</button>
        </div>
      </header>
    </>
  )
}

export default Header
