import { screen } from '@testing-library/react'

import { TaskPayload } from './tasks-slice'
import { testRender } from '../../testUtils'
import TaskGroup from './TaskGroup'

const group = 'default group'
const tasks: TaskPayload[] = [
  {
    id: 'test-1',
    description: 'Testing',
    completed: false,
  },
  {
    id: 'test-2',
    description: 'Testing',
    completed: false,
  },
]

it('renders the group name', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={false} />
  )

  expect(screen.getByText(group)).toBeVisible()
})

it('renders the number of completed tasks and total tasks', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={false} />
  )

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  expect(screen.getByTestId('task-group-stats')).toHaveTextContent(
    `${completedTasks}/${totalTasks}`
  )
})

it('renders the circular progress bar', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={false} />
  )

  expect(screen.getByTestId('circular-progress-bar')).toBeInTheDocument()
})

it('renders a thematic break element', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={false} />
  )

  expect(screen.getByTestId('task-group-separator')).toBeInTheDocument()
})

it('does not render a thematic break element', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={true} />
  )

  expect(screen.queryByTestId('task-group-separator')).not.toBeInTheDocument()
})

it('renders the element that is used to create a new task', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={false} />
  )

  expect(screen.getByTestId('create-task-input')).toBeInTheDocument()
})

it('renders the element that is used to display the list of tasks', () => {
  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} isLast={false} />
  )

  expect(screen.getByTestId('task-list')).toBeInTheDocument()
})
