import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { tasksGroupAdded } from './tasks-slice';

const CreateGroup: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  const [group, setGroup] = useState('');
  const [mode, setMode] = useState<'read' | 'insert'>('read');

  function toggleMode() {
    setMode(mode === 'read' ? 'insert' : 'read');
  }

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    setGroup(event.target.value);
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value;
      if (rawString.length > 0) {
        dispatch(tasksGroupAdded(rawString));
      }

      setMode('read');
      setGroup('');
    }
  }

  return (
    <div className="create-group-container">
      {mode === 'read' && (
        <button className="create-group-button" onClick={toggleMode}>
          +
        </button>
      )}
      {mode === 'insert' && (
        <input
          className="create-group-input"
          type="text"
          value={group}
          onChange={onTextChange}
          onKeyPress={handleKeyPress}
          placeholder="Name your task group and press enter"
        />
      )}
    </div>
  );
};

export default CreateGroup;