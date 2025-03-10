import React, { useState, useEffect, useCallback } from 'react'
import Text from '@base/text'
import { bemClass } from '@utils'
import { CheckBox, DropDown, Pagination, Panel, Radio, Toast, TextInput } from '@base'
import Button from '@base/button'
import { get, post, remove } from '@api'
import { useTypedSelector } from '@redux/rootReducer'
import TodoList from './TodoList'
import './style.scss'
import TagInput from '@base/TagInput/TagInput'

const blk = 'todo'

const radioButtonOptions: Array<{ label: string; value: string }> = [
  { label: 'in-progress', value: 'in-progress' },
  { label: 'completed', value: 'completed' },
  { label: 'on-hold', value: 'on-hold' },
]

const Todoer: React.FC = () => {
  const isShowFavTodos = useTypedSelector(state => state.Todo.isFavTodosButton)

  // States for new todo and its category
  const [todoTitle, setTodoTitle] = useState<string>('')
  const [categoryOptions, setCategoryOptions] = useState<Array<any>>([])
  const [selectedCategory, setSelectedCategory] = useState<string>()

  // States for todos and list operations
  const [todos, setTodos] = useState<any[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [edit, setEdit] = useState<string>('')

  const [tags, setTags] = useState<string[]>([]);

  // States for pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [totalCount, setTotalCount] = useState<number>(0)

  // Toast states for delete confirmation and general notifications
  const [deleteToast, setDeleteToast] = useState<{
    show: boolean
    todoId?: string
    todoTitle?: string
  }>({ show: false })
  const [generalToast, setGeneralToast] = useState<{
    show: boolean
    title?: string
    message: string
    category: 'success' | 'delete' | 'info' | 'warning'
  }>({
    show: false,
    message: '',
    category: 'info',
  })

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Cache state (for paginated responses)
  const [cache, setCache] = useState<Record<string, any>>({})

  useEffect(() => {
    if (generalToast.show) {
      const timer = setTimeout(() => {
        setGeneralToast(prev => ({ ...prev, show: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [generalToast])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await get<any>('/todos/getAllCategory')
      if (res.status === 200) {
        setCategoryOptions(res.data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const fetchTodos = useCallback(async (searchTermParam: string = '') => {
    const cacheKey = `${searchTermParam}-${currentPage}`
    if (searchTermParam && cache[cacheKey]) {
      const cachedData = cache[cacheKey]
      setTodos(cachedData.todos)
      setTotalCount(cachedData.totalCount)
      return
    }
    try {
      const response = await get<any>(
        `/todos/getAllTodosPaginated?page=${currentPage}&limit=${pageSize}&search=${encodeURIComponent(searchTermParam)}`
      )
      const { todos: fetchedTodos, totalCount: fetchedTotal } = response.data
      const todosWithSelected = fetchedTodos.map((todo: any, index: any) => ({
        ...todo,
        selected: false,
        sequence: index + 1
      }))
      setTodos(todosWithSelected)
      setTotalCount(fetchedTotal)
      setCache(prev => {
        const keys = Object.keys(prev)
        if (keys.length >= 10) {
          const { [keys[0]]: _, ...rest } = prev
          return { ...rest, [cacheKey]: { todos: todosWithSelected, totalCount: fetchedTotal, page: currentPage, limit: pageSize } }
        }
        return { ...prev, [cacheKey]: { todos: todosWithSelected, totalCount: fetchedTotal, page: currentPage, limit: pageSize } }
      })
    } catch (error) {
      console.error('Error fetching todos:', error)
      setGeneralToast({
        show: true,
        title: 'Error',
        message: 'Failed to fetch todos.',
        category: 'delete',
      })
    }
  }, [currentPage, pageSize, cache])

  useEffect(() => {
    fetchTodos()
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCategoryChange = useCallback((e: Record<string, string>): void => {
    setSelectedCategory(e.category)
  }, [])

  const onChangeHandler = useCallback((e: Record<string, string>): void => {
    setTodoTitle(e.todoTitle)
  }, [])

  const resetHandler = useCallback(() => {
    setTodoTitle('')
    setEdit('')
    setSelectedCategory('')
    setTags([])
  }, [])

  const addHandler = useCallback(async () => {
    if (!todoTitle.trim() || !selectedCategory) {
      setGeneralToast({
        show: true,
        title: 'Error',
        message: 'Please enter a Todo Title and select a Category.',
        category: 'delete',
      })
      return
    }
    const newTodoPayload = {
      title: todoTitle.trim(),
      desc: '',
      status: 'in-progress',
      categoryName: selectedCategory,
      tags,
    }
    try {
      const response = await post<{ todo: any }>('/todos/addTodo', newTodoPayload)
      fetchTodos()
      setTodoTitle('')
      setSelectedCategory('')
      setTags([])
      setGeneralToast({
        show: true,
        title: 'Success',
        message: 'Todo added successfully!',
        category: 'success',
      })
    } catch (error) {
      console.error('Error during adding todo:', error)
      setGeneralToast({
        show: true,
        title: 'Error',
        message: 'Failed to add todo.',
        category: 'delete',
      })
    }
  }, [todoTitle, selectedCategory, tags, fetchTodos])

  const handleSelectAllChange = useCallback((e: Record<string, boolean>): void => {
    const value = e.selectAll
    setSelectAll(value)
    setTodos(prev =>
      prev.map((todo, index) => ({
        ...todo,
        selected: value,
        sequence: index + 1,
      }))
    )
  }, [])

  const handleTodoCheckboxChange = useCallback((todoId: string, e: Record<string, boolean>): void => {
    if (selectAll) {
      setSelectAll(false)
    }
    const value = e[todoId]
    setTodos(prev =>
      prev.map((todo, index) => (todo._id === todoId ? { ...todo, selected: value, sequence: index + 1 } : { ...todo, sequence: index + 1 }))
    )
  }, [selectAll])

  const handleFilterRadioChange = useCallback((e: Record<string, string>): void => {
    const selected = e.filter
    setSelectedFilter(selected)
  }, [])

  const editHandlerCallback = useCallback(async (todoId?: string) => {
    if (!edit) {
      setEdit(todoId ?? '')
    } else {
      try {
        const response = await post<any>('/todos/editTodoById', { todoId, todoTitle })
        const updatedTodo = { ...response.data.todo, selected: false }
        setTodos(prev =>
          prev.map((todo, index) =>
            todo._id === edit
              ? { ...updatedTodo, sequence: index + 1 }
              : { ...todo, sequence: index + 1 }
          )
        );
        setTodoTitle('')
        setGeneralToast({
          show: true,
          title: 'Success',
          message: 'Todo Edited successfully!',
          category: 'success',
        })
      } catch (error) {
        console.error('Error during Editing todo:', error)
        setGeneralToast({
          show: true,
          title: 'Error',
          message: 'Failed to Edit todo.',
          category: 'delete',
        })
      }
      setEdit('')
    }
  }, [edit, todoTitle])

  const handleDeleteClick = useCallback((id: string, title: string) => {
    setDeleteToast({ show: true, todoId: id, todoTitle: title })
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleteToast.todoId) return
    try {
      await remove<any>(`/todos/deleteTodoById/${deleteToast.todoId}`)
      setTodos(prev => {
        const updatedTodos = prev
          .filter(todo => todo._id !== deleteToast.todoId)
          .map((todo, index) => ({ ...todo, sequence: index + 1 }));
        return updatedTodos;
      });

      setGeneralToast({
        show: true,
        title: 'Deleted',
        message: 'Todo deleted successfully.',
        category: 'success',
      })
    } catch (error) {
      console.error('Error deleting todo:', error)
      setGeneralToast({
        show: true,
        title: 'Error',
        message: 'Failed to delete todo.',
        category: 'delete',
      })
    }
    setDeleteToast({ show: false })
  }, [deleteToast.todoId])

  const cancelDelete = useCallback(() => {
    setDeleteToast({ show: false })
  }, [])

  const handleStatusUpdate = useCallback(async (selectedOption: Record<string, string>, todoId: string = '') => {
    if (!todoId && !selectAll) {
      setGeneralToast({
        show: true,
        title: 'Error',
        message: 'Select All Checkbox not Selected',
        category: 'delete',
      })
      return
    }
    try {
      const res = await post<any>('/todos/todoStatusUpdate', { status: selectedOption?.status, todoId })
      if (!todoId && selectAll) {
        setTodos(
          res.data.todo.map((todo: any, index: any) => ({ ...todo, sequence: index + 1 }))
        );
      }
      else {
        setTodos(prev =>
          prev.map((todo, index) =>
            todo._id === todoId
              ? { ...res.data.todo, sequence: index + 1 }
              : { ...todo, sequence: index + 1 }
          )
        );
      }

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
        message: 'Failed to Update todos status.',
        category: 'delete',
      })
    }
  }, [selectAll])

  const handleAddToFav = useCallback(async (todoId: string, currentBookMarked: boolean) => {
    try {
      const res = await post<any>('/todos/updateBookmark', { todoId, bookMarked: !currentBookMarked })
      setTodos(prev =>
        prev.map((todo, index) =>
          todo._id === todoId ? { ...todo, bookMarked: !currentBookMarked, sequence: index + 1 } : { ...todo, sequence: index + 1 }
        )
      )

      setGeneralToast({
        show: true,
        title: 'Success',
        message: `${currentBookMarked ? 'Removed From Fav Successfully' : 'Added To Fav Successfully'}.`,
        category: 'success',
      })
    } catch (error) {
      console.error('Error updating bookmark:', error)
    }
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }, [])

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      fetchTodos(e.currentTarget.value)
    }
  }, [fetchTodos])

  const filteredTodos = todos.filter((todo: any) => {
    const statusMatch = selectedFilter && selectedFilter !== 'all'
      ? todo.status.status === selectedFilter
      : true
    const favMatch = isShowFavTodos ? todo.bookMarked === true : true
    return statusMatch && favMatch
  })

  return (
    <>
      <Panel>
        <Text
          tag="h1"
          className={bemClass([blk, 'title'])}
          typography="xxxl"
          color="gray-dark"
        >
          Todoer
        </Text>
        <Text
          tag="h1"
          className={bemClass([blk, 'heading'])}
          typography="xxxl"
          color="gray-dark"
        >
          What Do You Want To Do Today?
        </Text>
        <div className={bemClass([blk, 'add-input-container'])}>
          <div className={bemClass([blk, 'add-inputs'])}>
            <TextInput
              className={bemClass([blk, 'add-input'])}
              label="Todo Title"
              isRequired
              type="text"
              value={todoTitle}
              name="todoTitle"
              invalid={!!todoTitle && !todoTitle.trim()}
              validationMessage={!!todoTitle && !todoTitle.trim() ? 'Todo Title is Required' : ''}
              changeHandler={(e) => setTodoTitle(e.todoTitle)}
            />
            <DropDown
              label="Category"
              className={bemClass([blk, 'add-inputs-dropdown'])}
              options={categoryOptions}
              labelMap="displayName"
              valueMap="categoryName"
              name="category"
              value={!selectedCategory ? 'Select' : selectedCategory}
              changeHandler={handleCategoryChange}
            />
            <TagInput onTagsChange={setTags} value={tags} />
          </div>
          <div className={bemClass([blk, 'action-buttons'])}>
            <Button
              category="primary"
              withIcon
              clickHandler={addHandler}
              className={bemClass([blk, 'add-button'])}
            >
              Submit
            </Button>
            <Button
              category="secondary"
              withIcon
              clickHandler={resetHandler}
              className={bemClass([blk, 'add-button'])}
            >
              Reset
            </Button>
          </div>
        </div>
      </Panel>
      <Panel>
        <div className={bemClass([blk, 'search-container'])}>
          <TextInput
            className={bemClass([blk, 'search-input'])}
            label="Search Todos"
            isRequired={false}
            type="text"
            value={searchTerm}
            name="searchTerm"
            changeHandler={(e) => setSearchTerm(e.todoTitle)}
            onKeyPress={handleSearchKeyPress}
          />
        </div>
        <div className={bemClass([blk, 'filters'])}>
          <div className={bemClass([blk, 'filters-select-all'])}>
            <CheckBox
              key="selectAll"
              checked={selectAll}
              id="selectAll"
              label="Select All"
              name="selectAll"
              onChangeHandler={handleSelectAllChange}
            />
            <DropDown
              options={radioButtonOptions}
              name="status"
              changeHandler={(e) => handleStatusUpdate(e)}
            />
          </div>
          <div className={bemClass([blk, 'filters-radio'])}>
            <Radio
              key="all"
              id="all"
              name="filter"
              label="All"
              value="all"
              disabled={false}
              checked={selectedFilter === 'all'}
              onChangeHandler={handleFilterRadioChange}
            />
            {radioButtonOptions.map(({ label, value }) => (
              <Radio
                key={value}
                id={label}
                name="filter"
                label={label}
                value={value}
                disabled={false}
                checked={selectedFilter === value}
                onChangeHandler={handleFilterRadioChange}
              />
            ))}
          </div>
        </div>
        <TodoList
          todos={filteredTodos}
          setTodos={setTodos}
          selectAll={selectAll}
          handleTodoCheckboxChange={handleTodoCheckboxChange}
          handleStatusUpdate={handleStatusUpdate}
          edit={edit}
          todoTitle={todoTitle}
          onChangeHandler={onChangeHandler}
          editHandler={editHandlerCallback}
          handleDeleteClick={handleDeleteClick}
          handleAddToFav={handleAddToFav}
          radioButtonOptions={radioButtonOptions}
          setGeneralToast={setGeneralToast}
          fetchTodos={fetchTodos}
        />
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        {deleteToast.show && (
          <Toast
            title="Delete Todo"
            message={`You are about to delete the todo "${deleteToast.todoTitle}". If you proceed, it will be permanently removed.`}
            category="delete"
            isConfirmable
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        {generalToast.show && (
          <Toast
            title={generalToast.title}
            message={generalToast.message}
            category={generalToast.category}
            onCancel={() =>
              setGeneralToast({
                ...generalToast,
                show: false,
                message: '',
                title: '',
                category: 'info',
              })
            }
          />
        )}
      </Panel>
    </>
  )
}

export default Todoer
