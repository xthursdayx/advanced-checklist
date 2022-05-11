import '@reach/dialog/styles.css'

import React, { KeyboardEvent, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from '@reach/alert-dialog'

import { useAppDispatch } from '../../app/hooks'
import { tasksGroupMerged } from './tasks-slice'
import { TextInput } from '../../common/components'

type RenameTaskGroupsProps = {
  groupName: string
  handleClose: () => void
}

const RenameTaskGroups: React.FC<RenameTaskGroupsProps> = ({
  groupName,
  handleClose,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  const dispatch = useAppDispatch()

  const [renameTo, setRenameTo] = useState<string>('')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value
    setRenameTo(newName)
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value
      rawString.length > 0 && handleRenameGroup()
    }
  }

  function handleRenameGroup() {
    dispatch(tasksGroupMerged({ groupName, mergeWith: renameTo }))
    handleClose()
  }

  return (
    <AlertDialog
      data-testid="rename-task-group-dialog"
      leastDestructiveRef={cancelRef}
    >
      <div className="sk-modal-content">
        <div className="sn-component">
          <div className="sk-panel">
            <div className="sk-panel-content">
              <div className="sk-panel-section">
                <AlertDialogLabel className="sk-h3 sk-panel-section-title">
                  Renaming the group '<strong>{groupName}</strong>':
                </AlertDialogLabel>

                <AlertDialogDescription>
                  <TextInput
                    testId="new-group-name-input"
                    autoFocus
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type the new group name"
                    value={renameTo}
                  />
                </AlertDialogDescription>

                <div className="flex my-1 mt-4">
                  <button
                    className="sn-button small neutral"
                    onClick={handleClose}
                    ref={cancelRef}
                  >
                    {renameTo.length === 0 ? 'Close' : 'Cancel'}
                  </button>
                  <button
                    className="sn-button small ml-2 info"
                    disabled={renameTo.length === 0}
                    onClick={handleRenameGroup}
                  >
                    Rename
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}

export default RenameTaskGroups