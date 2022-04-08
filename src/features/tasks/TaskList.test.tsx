import { screen, within } from '@testing-library/react'

import { TaskPayload } from './tasks-slice'
import { testRender } from '../../testUtils'
import TaskList from './TaskList'

const group = 'default group'
const tasks: TaskPayload[] = [
  {
    id: 'test-1',
    description: 'Testing #1',
    completed: false,
  },
  {
    id: 'test-2',
    description: 'Testing #2',
    completed: false,
  },
]

it('renders the open tasks container', async () => {
  testRender(<TaskList group={group} tasks={tasks} />)

  const openTasksContainer = screen.getByTestId('open-tasks-container')

  expect(openTasksContainer).toBeInTheDocument()
  expect(openTasksContainer).toHaveTextContent('Open tasks')

  const taskItems = within(openTasksContainer).getAllByTestId('task-item')
  expect(taskItems).toHaveLength(2)

  const completedTasksActions = screen.queryByTestId('completed-tasks-actions')
  expect(completedTasksActions).not.toBeInTheDocument()
})

it('renders the completed tasks container', () => {
  const tasksIncludesCompleted = [
    ...tasks,
    {
      id: 'test-3',
      description: 'Testing #3',
      completed: true,
    },
  ]

  testRender(<TaskList group={group} tasks={tasksIncludesCompleted} />)

  const completedTasksContainer = screen.getByTestId(
    'completed-tasks-container'
  )

  expect(completedTasksContainer).toBeInTheDocument()
  expect(completedTasksContainer).toHaveTextContent('Completed tasks')

  const taskItems = within(completedTasksContainer).getAllByTestId('task-item')
  expect(taskItems).toHaveLength(1)

  const completedTasksActions = screen.getByTestId('completed-tasks-actions')
  expect(completedTasksActions).toBeInTheDocument()
})
