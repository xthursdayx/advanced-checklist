import reducer, {
  openAllCompleted,
  deleteAllCompleted,
  taskAdded,
  taskDeleted,
  taskModified,
  tasksLoaded,
  taskToggled,
  tasksGroupAdded,
  tasksReordered,
  tasksGroupReordered,
  tasksGroupDeleted,
  tasksGroupMerged,
  tasksGroupCollapsed,
  tasksGroupDraft,
} from './tasks-slice'
import type { TasksState, GroupPayload } from './tasks-slice'

it('should return the initial state', () => {
  return expect(
    reducer(undefined, {
      type: undefined,
    })
  ).toEqual({ groups: [] })
})

it('should handle a task being added', () => {
  const previousState: TasksState = { groups: [] }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'some-id', description: 'A simple task' },
        groupName: 'Test',
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should set completed to false when adding a new task', () => {
  const previousState: TasksState = { groups: [] }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'some-id', description: 'A simple task', completed: true },
        groupName: 'Test',
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should handle a task being added to the existing tasks store', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'another-id', description: 'Another simple task' },
        groupName: 'Test',
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should handle an existing task being modified', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: { id: 'some-id', description: 'Task description changed' },
        groupName: 'Test',
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'Task description changed',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should not modify tasks if an invalid id is provided', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: { id: 'some-invalid-id', description: 'New description' },
        groupName: 'Test',
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should keep completed field as-is, if task is modified', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: {
          id: 'some-id',
          description: 'New description',
          completed: true,
        },
        groupName: 'Test',
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'New description',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should handle an existing task being toggled', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(
    reducer(previousState, taskToggled({ id: 'some-id', groupName: 'Test' }))
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
    ],
  })
})

it('should handle an existing task being deleted', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(
    reducer(previousState, taskDeleted({ id: 'some-id', groupName: 'Test' }))
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should handle opening all tasks that are marked as completed', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(
    reducer(previousState, openAllCompleted({ groupName: 'Test' }))
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should handle clear all completed tasks', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(
    reducer(previousState, deleteAllCompleted({ groupName: 'Test' }))
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
  })
})

it('should handle loading tasks into the tasks store, if an invalid payload is provided', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, tasksLoaded('null'))).toEqual(previousState)
  expect(reducer(previousState, tasksLoaded('undefined'))).toEqual(
    previousState
  )
})

it('should initialize the storage with an empty object', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, tasksLoaded(''))).toEqual({
    initialized: true,
    groups: [],
  })
})

it('should not initialize the storage again with an empty object', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
    initialized: true,
  }

  expect(reducer(previousState, tasksLoaded(''))).toEqual(previousState)
})

it('should handle loading tasks into the tasks store, with a valid payload', () => {
  const previousState: TasksState = {
    groups: [],
  }

  const tasksPayload: GroupPayload[] = [
    {
      name: 'Test',
      tasks: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  ]

  const serializedPayload = JSON.stringify(tasksPayload)
  expect(reducer(previousState, tasksLoaded(serializedPayload))).toEqual({
    initialized: true,
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  })
})

it('should handle adding a new task group', () => {
  const previousState: TasksState = { groups: [] }

  expect(reducer(previousState, tasksGroupAdded('New group'))).toEqual({
    groups: [
      {
        name: 'New group',
        tasks: [],
      },
    ],
  })
})

it('should handle adding an existing task group', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Existing group',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, tasksGroupAdded('Existing group'))).toEqual(
    previousState
  )
})

it('should handle reordering tasks from the same section', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      tasksReordered({
        groupName: 'Test',
        swapTaskIndex: 0,
        withTaskIndex: 1,
        isSameSection: true,
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  })
})

it('should handle reordering tasks from different sections', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      tasksReordered({
        groupName: 'Test',
        swapTaskIndex: 0,
        withTaskIndex: 1,
        isSameSection: false,
      })
    )
  ).toEqual({
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  })
})

it('should handle reordering task groups', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupReordered({
      swapGroupIndex: 0,
      withGroupIndex: 1,
    })
  )

  const expectedState = {
    groups: [
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(JSON.stringify(currentState)).toEqual(JSON.stringify(expectedState))
})

it('should handle deleting groups', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupDeleted({ groupName: 'Testing' })
  )

  const expectedState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})

it('should not merge the same group', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupMerged({ groupName: 'Testing', mergeWith: 'Testing' })
  )

  expect(currentState).toEqual(previousState)
})

it('should handle merging groups', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupMerged({ groupName: 'Testing', mergeWith: 'Tests' })
  )

  const expectedState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})

it('should handle collapsing groups', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupCollapsed({ groupName: 'Testing', collapsed: true })
  )

  const expectedState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        collapsed: true,
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})

it('should handle saving task draft for groups', () => {
  const previousState: TasksState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupDraft({ groupName: 'Tests', draft: 'Remember to ...' })
  )

  const expectedState = {
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
      {
        name: 'Tests',
        draft: 'Remember to ...',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})
