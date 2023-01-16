import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import AddPage from '../../../pages/todo/add';
import { pipeDateToInputDateTime } from '../../../utils/date';
import moment from 'moment';


jest.mock("../../../services/fetchTodo")

const dateNow = moment().format('YYYY-MM-DDTHH:mm:ssZ')
const dateTomorrow = moment().add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ')

describe('Header', () => {
  beforeEach(() => {
    render(
      <AddPage />
    )
  })

  it('should able to type on deadline field', () => {
    const elm = screen.getByTestId('deadlineInput') as HTMLInputElement
    const now = pipeDateToInputDateTime(dateNow)
    fireEvent.change(elm, { target: { value: now } })
    expect(elm.value).toBe(now)
  })

  it('should able to type on description field', async () => {
    const elm = screen.getByTestId('descriptionInput') as HTMLInputElement
    const text = 'Do something'
    fireEvent.change(elm, { target: { value: text } })
    expect(elm.value).toBe(text)
  });

  it('should render error message', async () => {
    const btn = screen.getByText(/Save/i)
    fireEvent.click(btn)
    const errors = await screen.findAllByTestId('errorMsgElm')
    expect(errors.length).toBe(2)
  });

  it('should save todo', async () => {
    const deadlineElm = screen.getByTestId('deadlineInput') as HTMLInputElement
    const now = pipeDateToInputDateTime(dateTomorrow)
    fireEvent.change(deadlineElm, { target: { value: now } })

    const descriptionElm = screen.getByTestId('descriptionInput') as HTMLInputElement
    const text = 'Do something'
    fireEvent.change(descriptionElm, { target: { value: text } })


    let btn = screen.getByText(/Save/i)
    fireEvent.click(btn)
    await waitFor(async () => {
      expect(btn.textContent).toContain('Saving...')
    })
  });
})
