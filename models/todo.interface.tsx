export interface Todo {
  id?: string
  description?: string
  deadline?: string
  done?: boolean
  snapshootImage?: string
  snapshootImageFile?: FileList
  isDeleting?: boolean
  isDeleteDone?: boolean
}