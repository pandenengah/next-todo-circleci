import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { User } from '../../../models/user.interface';
import { FetchResult } from '../../../models/fetch-result.interface';
import TodoPage from '..';
import { renderWithStore } from '../../../utils/render-with-store';
import { AppState } from '../../../stores/store';
import { Todo } from '../../../models/todo.interface';
import fetchTodo from '../../../services/fetchTodo';


jest.mock("../../../services/fetchTodo")

const initalStateStoreMock: AppState = {
  selectedTodo: { value: {} }
}
const userMock: User = {
  fullName: "Pande Nengah Purnawan"
}
const todosMock: Todo[] = [
  {
    id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
    description: "Do Something 1",
    deadline: "2022-12-21T19:56:00Z",
    done: false,
    snapshootImage: ""
  },
  {
    id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
    description: "Do Something 2",
    deadline: "2022-12-22T19:56:00Z",
    done: true,
    snapshootImage: ""
  }
]
const todosDescMock: Todo[] = [
  {
    id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
    description: "Do Something 2",
    deadline: "2022-12-22T19:56:00Z",
    done: false,
    snapshootImage: ""
  },
  {
    id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
    description: "Do Something 1",
    deadline: "2022-12-21T19:56:00Z",
    done: false,
    snapshootImage: ""
  },
]
const resTodosAfterDeleteMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: false,
      snapshootImage: ""
    }
  ]
}
const resTodosAfterUpdateToDoneMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
      description: "Do Something 1",
      deadline: "2022-12-21T19:56:00Z",
      done: true,
      snapshootImage: ""
    },
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: true,
      snapshootImage: ""
    }
  ]
}
const resTodosAfterUpdateToUndoneMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
      description: "Do Something 1",
      deadline: "2022-12-21T19:56:00Z",
      done: false,
      snapshootImage: ""
    },
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: false,
      snapshootImage: ""
    }
  ]
}

describe('TodoPage', () => {
  beforeEach(() => {
  })

  it('should render user full name', async () => {
    renderWithStore(
      <TodoPage initialTodos={[]} sortType='acs' user={userMock} />,
      initalStateStoreMock
    )

    const elm = screen.queryByText(/Pande Nengah Purnawan/i);
    expect(elm).toBeInTheDocument();
  });

  it('should not render list of todo', async () => {
    renderWithStore(
      <TodoPage initialTodos={[]} sortType='acs' user={userMock} />,
      initalStateStoreMock
    )

    const elm = await screen.findByText(/No data/i);
    expect(elm).toBeInTheDocument();
  });

  it('should render list of todo', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosMock} sortType='acs' user={userMock} />,
      initalStateStoreMock
    )

    const elm = await screen.findByText(/Do Something 1/i);
    expect(elm).toBeInTheDocument();
  });

  it('should render more list of todo', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosMock} sortType='acs' user={userMock} />,
      initalStateStoreMock
    )

    const elms = await screen.findAllByText(/Do Something/i);
    expect(elms.length).toBeGreaterThanOrEqual(2);
  });

  it('should render list by asc', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosMock} sortType='asc' user={userMock} />,
      initalStateStoreMock
    )

    let sortText = screen.getByTestId("sortText");
    expect(sortText.textContent).toBe("asc")

    const elms = await screen.findAllByText(/Do Something/i);
    expect(elms[0].textContent).toBe("Do Something 1");
  });

  it('should render list by desc', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosDescMock} sortType='desc' user={userMock} />,
      initalStateStoreMock
    )

    const sortText = screen.getByTestId("sortText");
    expect(sortText.textContent).toBe("desc")

    const elms = await screen.findAllByText(/Do Something/i);
    expect(elms[0].textContent).toBe("Do Something 2");
  });

  it('should delete todo', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosMock} sortType='asc' user={userMock} />,
      initalStateStoreMock
    )

    let deleteBtns = await screen.findAllByText(/Delete/i);
    fetchTodo.getTodos = jest.fn().mockResolvedValue(resTodosAfterDeleteMock)
    fireEvent.click(deleteBtns[0])
    expect(deleteBtns[0].textContent).toContain('Deleting...')

    await waitFor(async () => {
      const elm = await screen.findByText(/Do Something 2/i);
      expect(elm.textContent).toBe('Do Something 2');
    })
  });

  it('should update todo tobe done', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosMock} sortType='asc' user={userMock} />,
      initalStateStoreMock
    )

    let editBtns = await screen.findAllByTestId("inputForEdit") as HTMLInputElement[];

    fetchTodo.getTodos = jest.fn().mockResolvedValue(resTodosAfterUpdateToDoneMock)
    fireEvent.click(editBtns[0])

    await waitFor(async () => {
      editBtns = await screen.findAllByTestId("inputForEdit")
      expect(editBtns[0].checked).toBeTruthy()
    })

    const descElms = screen.getAllByTestId("descriptionElm")
    expect(descElms[0]).toHaveClass('line-through')
  });

  it('should update todo tobe undone', async () => {
    renderWithStore(
      <TodoPage initialTodos={todosMock} sortType='asc' user={userMock} />,
      initalStateStoreMock
    )

    let editBtns = await screen.findAllByTestId("inputForEdit") as HTMLInputElement[];

    fetchTodo.getTodos = jest.fn().mockResolvedValue(resTodosAfterUpdateToUndoneMock)
    fireEvent.click(editBtns[1])

    await waitFor(async () => {
      editBtns = await screen.findAllByTestId("inputForEdit")
      expect(editBtns[0].checked).toBeFalsy()
    })

    const descElms = screen.getAllByTestId("descriptionElm")
    expect(descElms[0]).not.toHaveClass('line-through')
  });
})
