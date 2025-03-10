import React, { useState, useCallback } from 'react'
import Text from '@base/text'
import { bemClass } from '@utils'
import { CheckBox, DropDown, Icon, Button, TextInput } from '@base'
import { get, post, put, remove } from '@api'
import { StarRating } from '@components'

const blk = 'todo'

interface Todo {
    _id: string
    title: string
    status: string
    selected: boolean
    bookMarked: boolean
}

interface TodoListProps {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<any[]>>
    selectAll: boolean
    handleTodoCheckboxChange: (todoId: string, e: Record<string, boolean>) => void
    handleStatusUpdate: (selectedOption: Record<string, string>, todoId: string) => void
    edit: string
    todoTitle: string
    onChangeHandler: (e: Record<string, string>) => void
    editHandler: (todoId?: string) => void
    handleDeleteClick: (id: string, title: string) => void
    handleAddToFav: (todoId: string, currentBookMarked: boolean) => void
    radioButtonOptions: Array<{ label: string; value: string }>
    setGeneralToast: React.Dispatch<
        React.SetStateAction<{
            show: boolean
            title?: string
            message: string
            category: 'success' | 'delete' | 'info' | 'warning'
        }>
    >
    fetchTodos: () => void
}

const TodoList: React.FC<TodoListProps> = (props) => {
    const {
        todos,
        handleTodoCheckboxChange,
        handleStatusUpdate,
        edit,
        todoTitle,
        onChangeHandler,
        editHandler,
        handleDeleteClick,
        handleAddToFav,
        radioButtonOptions,
        setGeneralToast,
        fetchTodos,
        setTodos,
    } = props

    // States for subtasks
    const [activeSubtaskTodo, setActiveSubtaskTodo] = useState<string | null>(null)
    const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('')
    const [editSubtaskTitle, setEditSubtaskTitle] = useState<string>('')
    const [activeSubtaskEdit, setActiveSubtaskEdit] = useState<string>('')
    const [subtasks, setSubtasks] = useState<any[]>([])

    const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)

    const fetchSubtasksByTodoId = useCallback(async (todoId: string) => {
        try {
            const response = await get<any>(`/todos/getSubtasksByTodoId?todoId=${todoId}`)
            setSubtasks(response.data.subtasks)
        } catch (error) {
            console.error('Error fetching subtasks:', error)
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to fetch subtasks.',
                category: 'delete',
            })
        }
    }, [])

    const closeSubtaskDialog = useCallback(() => {
        setActiveSubtaskTodo(null)
        setNewSubtaskTitle('')
        setEditSubtaskTitle('')
        setActiveSubtaskEdit('')
    }, [])

    const onSubtaskChange = useCallback((e: Record<string, string>): void => {
        if (activeSubtaskEdit) {
            if (e.subtaskTitle !== undefined) {
                setEditSubtaskTitle(e.subtaskTitle)
            }
        } else {
            if (e.subtaskTitle !== undefined) {
                setNewSubtaskTitle(e.subtaskTitle)
            }
        }
    }, [activeSubtaskEdit])

    const addSubtaskHandler = useCallback(async () => {
        if (!newSubtaskTitle.trim() || !activeSubtaskTodo) return
        try {
            const payload = {
                todoId: activeSubtaskTodo,
                title: newSubtaskTitle.trim(),
                status: 'in-progress',
            }
            const res = await post<{ subtask: any }>('/todos/addSubtask', payload)
            setSubtasks(prev => [...prev, { ...res.data.subtask }])
            setGeneralToast({
                show: true,
                title: 'Success',
                message: 'Subtask added successfully!',
                category: 'success',
            })
            setNewSubtaskTitle('')
        } catch (error) {
            console.error('Error adding subtask:', error)
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to add subtask.',
                category: 'delete',
            })
        }
    }, [activeSubtaskTodo, newSubtaskTitle])

    const editSubtaskHandler = useCallback(async (subtaskId: string) => {
        if (!activeSubtaskEdit) {
            const subtaskToEdit = subtasks.find((s) => s._id === subtaskId)
            if (subtaskToEdit) {
                setActiveSubtaskEdit(subtaskId)
                setEditSubtaskTitle(subtaskToEdit.title)
            }
        } else {
            try {
                const res = await put<{ subtask: any }>(`/todos/editSubtaskByTodoId/${activeSubtaskEdit}`, {
                    title: editSubtaskTitle.trim(),
                    subtaskId,
                })
                setSubtasks(prev =>
                    prev.map((s) => (s._id === activeSubtaskEdit ? { ...res.data.subtask } : s))
                )
                setGeneralToast({
                    show: true,
                    title: 'Success',
                    message: 'Subtask edited successfully!',
                    category: 'success',
                })
            } catch (error) {
                console.error('Error editing subtask:', error)
                setGeneralToast({
                    show: true,
                    title: 'Error',
                    message: 'Failed to edit subtask.',
                    category: 'delete',
                })
            }
            setActiveSubtaskEdit('')
            setEditSubtaskTitle('')
        }
    }, [activeSubtaskEdit, editSubtaskTitle, subtasks])

    const deleteSubtaskHandler = useCallback(async (subtaskId: string) => {
        try {
            await remove<any>(`/todos/deleteSubtaskById/${subtaskId}`)
            setSubtasks(prev => prev.filter((s) => s._id !== subtaskId))
            setGeneralToast({
                show: true,
                title: 'Deleted',
                message: 'Subtask deleted successfully.',
                category: 'success',
            })
        } catch (error) {
            console.error('Error deleting subtask:', error)
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to delete subtask.',
                category: 'delete',
            })
        }
    }, [])

    const openSubtaskDialog = useCallback((todoId: string) => {
        fetchSubtasksByTodoId(todoId)
        setActiveSubtaskTodo(todoId)
        setNewSubtaskTitle('')
        setEditSubtaskTitle('')
        setActiveSubtaskEdit('')
    }, [fetchSubtasksByTodoId])

    const handleSubtaskStatusUpdate = useCallback(async (selectedOption: Record<string, string>, subtaskId: string = '') => {
        try {
            const res = await post<any>('/todos/subtaskStatusUpdate', { status: selectedOption?.status, subtaskId })
            setSubtasks(prev =>
                prev.map(subtask => subtask._id === subtaskId ? res.data.subtask : subtask)
            )
            fetchTodos()
            setGeneralToast({
                show: true,
                title: 'Success',
                message: 'Status Updated Successfully.',
                category: 'success',
            })
        } catch (error) {
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to Update Subtask status.',
                category: 'delete',
            })
        }
    }, [fetchTodos])

    const renderSubtaskPanel = useCallback(() => {
        return (
            <div className={bemClass([blk, 'subtask-panel'])}>
                <Text tag="h2" className={bemClass([blk, 'subtask-heading'])}>
                    Subtasks
                </Text>
                <div className={bemClass([blk, 'subtask-add'])}>
                    <TextInput
                        className={bemClass([blk, 'subtask-input'])}
                        label="Subtask Title"
                        isRequired
                        type="text"
                        value={newSubtaskTitle}
                        name="subtaskTitle"
                        invalid={!!newSubtaskTitle && !newSubtaskTitle.trim()}
                        validationMessage={!!newSubtaskTitle && !newSubtaskTitle.trim() ? 'Subtask Title is Required' : ''}
                        changeHandler={onSubtaskChange}
                    />
                    <div className={bemClass([blk, 'subtask-add-buttons'])}>
                        <Button
                            category="primary"
                            withIcon
                            clickHandler={addSubtaskHandler}
                            className={bemClass([blk, 'subtask-save-button'])}
                        >
                            <Icon name="check" color="white" size="small" />
                        </Button>
                        <Button
                            category="secondary"
                            withIcon
                            clickHandler={closeSubtaskDialog}
                            className={bemClass([blk, 'subtask-cancel-button'])}
                        >
                            <Icon name="times" color="primary" size="small" />
                        </Button>
                    </div>
                </div>
                {subtasks.map((subtask: any) => (
                    <div key={subtask._id} className={bemClass([blk, 'subtask-item'])}>
                        {activeSubtaskEdit === subtask._id ? (
                            <TextInput
                                className={bemClass([blk, 'subtask-edit-input'])}
                                label=""
                                type="text"
                                value={editSubtaskTitle}
                                name="subtaskTitle"
                                invalid={!!editSubtaskTitle && !editSubtaskTitle.trim()}
                                validationMessage={!!editSubtaskTitle && !editSubtaskTitle.trim() ? 'Subtask Title is Required' : ''}
                                changeHandler={onSubtaskChange}
                            />
                        ) : (
                            <Text
                                tag="label"
                                className={bemClass([blk, 'subtask-title'])}
                                typography="m"
                                color="gray-dark"
                            >
                                {subtask.title}
                            </Text>
                        )}
                        <div className={bemClass([blk, 'subtask-item-buttons'])}>
                            <DropDown
                                className={bemClass([blk, 'list-actions-dropdown'])}
                                options={radioButtonOptions}
                                name="status"
                                value={subtask.status.status}
                                changeHandler={(e) => handleSubtaskStatusUpdate(e, subtask._id)}
                            />
                            <Button
                                category="primary"
                                withIcon
                                clickHandler={() => editSubtaskHandler(subtask._id)}
                                className={bemClass([blk, 'subtask-action-button'])}
                            >
                                <Icon name="pencil-square-o" color="black" size="small" />
                            </Button>
                            <Button
                                category="primary"
                                withIcon
                                clickHandler={() => deleteSubtaskHandler(subtask._id)}
                                className={bemClass([blk, 'subtask-action-button'])}
                            >
                                <Icon name="trash" color="black" size="small" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }, [
        newSubtaskTitle,
        onSubtaskChange,
        addSubtaskHandler,
        closeSubtaskDialog,
        subtasks,
        activeSubtaskEdit,
        editSubtaskTitle,
        handleSubtaskStatusUpdate,
        deleteSubtaskHandler,
        editSubtaskHandler,
        radioButtonOptions,
    ])

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, todo: Todo) => {
        setDraggedTodo(todo)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTodo: Todo) => {
        e.preventDefault()
        if (!draggedTodo || draggedTodo._id === targetTodo._id) return

        const newTodos = [...todos]
        const draggedIndex = newTodos.findIndex(t => t._id === draggedTodo._id)
        const targetIndex = newTodos.findIndex(t => t._id === targetTodo._id)
        if (draggedIndex === -1 || targetIndex === -1) return

        const [removed] = newTodos.splice(draggedIndex, 1)
        newTodos.splice(targetIndex, 0, removed)

        const updatedTodos = newTodos.map((todo, index) => ({ ...todo, sequence: index + 1 }))
        setTodos(updatedTodos)
    
        setGeneralToast({
            show: true,
            title: 'Info',
            message: 'Todo order updated!',
            category: 'info',
        })
    }


    return (
        <>
            {todos.map((todo: any) => (
                <div
                    key={todo._id}
                    className={bemClass([blk, 'list'])}
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, todo)}
                >
                    <div key={todo._id} className={bemClass([blk, 'list'])}>
                        <div className={bemClass([blk, 'list-container'])}>
                            <div className={bemClass([blk, 'list-title-div'])}>
                                <Button
                                    category="secondary"
                                    withIcon
                                    clickHandler={() => { }}
                                    className={bemClass([blk, 'add-subtask-button'])
                                    }
                                >
                                    {todo.sequence}
                                </Button>
                                <Button
                                    category="secondary"
                                    withIcon
                                    clickHandler={() => openSubtaskDialog(todo._id)}
                                    className={bemClass([blk, 'add-subtask-button'])}
                                >
                                    <Icon name="plus" color="black" size="small" />
                                </Button>
                                <CheckBox
                                    className={bemClass([blk, 'list-title-checkbox'])}
                                    key={todo._id}
                                    checked={todo.selected}
                                    id={todo._id}
                                    name={todo._id}
                                    onChangeHandler={(e) => handleTodoCheckboxChange(todo._id, e)}
                                />
                                {edit && edit === todo._id ? (
                                    <TextInput
                                        className={bemClass([blk, 'edit-input'])}
                                        label=""
                                        type="text"
                                        value={todoTitle}
                                        name="todoTitle"
                                        invalid={!!todoTitle && !todoTitle.trim()}
                                        validationMessage={!!todoTitle && !todoTitle.trim() ? 'Todo Title is Required' : ''}
                                        changeHandler={onChangeHandler}
                                    />
                                ) : (
                                    <Text
                                        tag="label"
                                        className={bemClass([blk, 'list-title', { [todo.status.status]: true }])}
                                        typography="xl"
                                        color="gray-dark"
                                    >
                                        {todo.title}
                                    </Text>
                                )}
                            </div>
                            <div className={bemClass([blk, 'list-actions'])}>

                                <StarRating
                                    rating={4}
                                    color="gold"
                                    iconName="star"
                                    size="medium"
                                    iconScale="lg"
                                />
                                <DropDown
                                    className={bemClass([blk, 'list-actions-dropdown'])}
                                    options={radioButtonOptions}
                                    name="status"
                                    value={todo.status.status}
                                    changeHandler={(e) => handleStatusUpdate(e, todo._id)}
                                />
                                <Button
                                    category="primary"
                                    withIcon
                                    clickHandler={() => editHandler(todo._id)}
                                    className={bemClass([blk, 'add-button'])}
                                >
                                    <Icon name="pencil-square-o" color="black" size="small" />
                                </Button>
                                <Button
                                    category="primary"
                                    withIcon
                                    clickHandler={() => handleDeleteClick(todo._id, todo.title)}
                                    className={bemClass([blk, 'add-button'])}
                                >
                                    <Icon name="trash" color="black" size="small" />
                                </Button>
                                <Button
                                    category="secondary"
                                    withIcon
                                    clickHandler={() => handleAddToFav(todo._id, todo.bookMarked)}
                                    className={bemClass([blk, 'add-button-fav', { bookMarked: todo.bookMarked }])}
                                >
                                    <Icon name={todo.bookMarked ? 'heart' : 'heart-o'} size="small" />
                                </Button>
                            </div>
                        </div>
                        {activeSubtaskTodo === todo._id && renderSubtaskPanel()}
                    </div>
                </div>
            ))}
        </>
    )
}

export default TodoList
