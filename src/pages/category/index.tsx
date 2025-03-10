import { get, post, put, remove } from '@api'
import { Button, CheckBox, Icon, Panel, Text, TextInput, Toast, DropDown } from '@base'
import { bemClass } from '@utils'
import React, { useEffect, useState } from 'react'
import './style.scss'

const blk = 'category'

type CategoryType = {
    _id: string
    categoryName: string
    displayName: string
    selected: boolean
}

type ToastCategory = 'success' | 'delete' | 'info' | 'warning'
type GeneralToast = {
    show: boolean
    title?: string
    message: string
    category: ToastCategory
}

const Category: React.FC = () => {
    const [categoryTitle, setCategoryTitle] = useState<string>('')
    const [categoryDisplayName, setCategoryDisplayName] = useState<string>('')

    const [categoryOptions, setCategoryOptions] = useState<CategoryType[]>([])

    const [selectAll, setSelectAll] = useState<boolean>(false)
    const [selectedFilter, setSelectedFilter] = useState<string>('all')
    const [edit, setEdit] = useState<string>('')

    const [deleteToast, setDeleteToast] = useState<{ show: boolean; categoryId?: string; categoryName?: string }>({ show: false })
    const [generalToast, setGeneralToast] = useState<GeneralToast>({ show: false, message: '', category: 'info' })

    useEffect(() => {
        if (generalToast.show) {
            const timer = setTimeout(() => {
                setGeneralToast((prev) => ({ ...prev, show: false }))
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [generalToast])

    const fetchCategories = async () => {
        try {
            const res = await get<any>('/todos/getAllCategory')
            if (res.status === 200) {
                const cats = res.data.categories.map((cat: any) => ({
                    ...cat,
                    selected: false,
                }))
                setCategoryOptions(cats)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to fetch categories.',
                category: 'delete',
            })
        }
    }
    useEffect(() => {
        fetchCategories()
    }, [])

    const onChangeHandler = (e: Record<string, string>): void => {
        if (e.categoryTitle !== undefined) {
            setCategoryTitle(e.categoryTitle)
        }
        if (e.displayName !== undefined) {
            setCategoryDisplayName(e.displayName)
        }
    }

    const addHandler = async () => {
        if (!categoryTitle.trim() || !categoryDisplayName.trim()) {
            return
        }
        try {
            const res = await post<{ category: any }>('/todos/addCategory', {
                categoryName: categoryTitle.trim(),
                displayName: categoryDisplayName.trim(),
            })
            const newCategory: CategoryType = { ...res.data.category, selected: false }
            setCategoryOptions((prev) => [newCategory, ...prev])
            resetHandler()
            setGeneralToast({
                show: true,
                title: 'Success',
                message: 'Category added successfully!',
                category: 'success',
            })
        } catch (error) {
            console.error('Error adding category:', error)
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to add category.',
                category: 'delete',
            })
        }
    }

    const resetHandler = () => {
        setCategoryTitle('');
        setCategoryDisplayName('');
        setEdit('');
    };

    const handleSelectAllChange = (e: Record<string, boolean>): void => {
        const value = e.selectAll
        setSelectAll(value)
        setCategoryOptions((prev) =>
            prev.map((cat) => ({ ...cat, selected: value }))
        )
    }

    const handleCategoryCheckboxChange = (catId: string, e: Record<string, boolean>): void => {
        if (selectAll) {
            setSelectAll(false)
        }
        const value = e[catId]
        setCategoryOptions((prev) =>
            prev.map((cat) => (cat._id === catId ? { ...cat, selected: value } : cat))
        )
    }

    const editHandler = async (catId?: string) => {
        if (!edit) {
            setEdit(catId ?? '')
            const cat = categoryOptions.find((cat) => cat._id === catId)
            if (cat) {
                setCategoryTitle(cat.categoryName)
                setCategoryDisplayName(cat.displayName)
            }
        } else {
            try {
                const res = await put<{ category: any }>(`/todos/editCategoryById/${edit}`, {
                    categoryName: categoryTitle.trim(),
                    displayName: categoryDisplayName.trim(),
                })
                setCategoryOptions((prev) =>
                    prev.map((cat) =>
                        cat._id === edit ? { ...res.data.category, selected: false } : cat
                    )
                )
                setGeneralToast({
                    show: true,
                    title: 'Success',
                    message: 'Category edited successfully!',
                    category: 'success',
                })
            } catch (error) {
                console.error('Error editing category:', error)
                setGeneralToast({
                    show: true,
                    title: 'Error',
                    message: 'Failed to edit category.',
                    category: 'delete',
                })
            }
            setEdit('')
            resetHandler()
        }
    }

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteToast({ show: true, categoryId: id, categoryName: name })
    }

    const confirmDelete = async () => {
        if (!deleteToast.categoryId) return
        try {
            await remove<any>(`/todos/deleteCategoryById/${deleteToast.categoryId}`)
            setCategoryOptions((prev) =>
                prev.filter((cat) => cat._id !== deleteToast.categoryId)
            )
            setGeneralToast({
                show: true,
                title: 'Deleted',
                message: 'Category deleted successfully.',
                category: 'success',
            })
        } catch (error) {
            console.error('Error deleting category:', error)
            setGeneralToast({
                show: true,
                title: 'Error',
                message: 'Failed to delete category.',
                category: 'delete',
            })
        }
        setDeleteToast({ show: false })
    }

    const cancelDelete = () => {
        setDeleteToast({ show: false })
    }

    const deleteSelectedCategories = async () => {
        if (selectAll) {
            try {
                for (const cat of categoryOptions) {
                    await remove<any>(`/todos/deleteCategoryById/${cat._id}`);
                }
                setCategoryOptions([]);
                setGeneralToast({
                    show: true,
                    title: 'Deleted',
                    message: 'All categories deleted successfully.',
                    category: 'success',
                });
            } catch (error) {
                console.error('Error deleting all categories:', error);
                setGeneralToast({
                    show: true,
                    title: 'Error',
                    message: 'Failed to delete all categories.',
                    category: 'delete',
                });
            }
        } else {
            const selectedCats = categoryOptions.filter(cat => cat.selected);
            if (selectedCats.length === 0) {
                setGeneralToast({
                    show: true,
                    title: 'Info',
                    message: 'No category selected for deletion.',
                    category: 'info',
                });
                return;
            }
            try {
                for (const cat of selectedCats) {
                    await remove<any>(`/todos/deleteCategoryById/${cat._id}`);
                }
                setCategoryOptions(prev => prev.filter(cat => !cat.selected));
                setGeneralToast({
                    show: true,
                    title: 'Deleted',
                    message: 'Selected categories deleted successfully.',
                    category: 'success',
                });
            } catch (error) {
                console.error('Error deleting selected categories:', error);
                setGeneralToast({
                    show: true,
                    title: 'Error',
                    message: 'Failed to delete selected categories.',
                    category: 'delete',
                });
            }
        }
    };


    return (
        <>
            <Panel>
                <Text
                    tag="h1"
                    className={bemClass([blk, 'title'])}
                    typography="xxxl"
                    color="gray-dark"
                >
                    Category Master
                </Text>

                <div className={bemClass([blk, 'add-input-container'])}>
                    <div className={bemClass([blk, 'add-inputs'])}>
                        <TextInput
                            className={bemClass([blk, 'add-input'])}
                            label="Category"
                            isRequired
                            type="text"
                            value={categoryTitle}
                            name="categoryTitle"
                            invalid={!!categoryTitle && !categoryTitle.trim()}
                            validationMessage={!!categoryTitle && !categoryTitle.trim() ? 'Category is Required' : ''}
                            changeHandler={onChangeHandler}
                        />
                        <TextInput
                            className={bemClass([blk, 'add-input'])}
                            label="Display Name"
                            isRequired
                            type="text"
                            value={categoryDisplayName}
                            name="displayName"
                            invalid={!!categoryDisplayName && !categoryDisplayName.trim()}
                            validationMessage={!!categoryDisplayName && !categoryDisplayName.trim() ? 'Display Name is Required' : ''}
                            changeHandler={onChangeHandler}
                        />
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
                        <Button
                            category="error"
                            withIcon
                            clickHandler={deleteSelectedCategories}
                            className={bemClass([blk, 'delete-all-button'])}
                        >
                            <Icon name="trash" color="white" size="small" />
                            &nbsp; Delete
                        </Button>
                    </div>
                </div>
                {categoryOptions.map((cat) => (
                    <div key={cat._id} className={bemClass([blk, 'list'])}>
                        <div className={bemClass([blk, 'list-title-div'])}>
                            <CheckBox
                                className={bemClass([blk, 'list-title-checkbox'])}
                                key={cat._id}
                                checked={cat.selected}
                                id={cat._id}
                                name={cat._id}
                                onChangeHandler={(e) => handleCategoryCheckboxChange(cat._id, e)}
                            />
                            {edit && edit === cat._id ? (
                                <TextInput
                                    className={bemClass([blk, 'edit-input'])}
                                    label=""
                                    type="text"
                                    value={categoryDisplayName}
                                    name="displayName"
                                    invalid={!!categoryDisplayName && !categoryDisplayName.trim()}
                                    validationMessage={!!categoryDisplayName && !categoryDisplayName.trim() ? 'Category Display Name is Required' : ''}
                                    changeHandler={onChangeHandler}
                                />
                            ) : (
                                <Text
                                    tag="label"
                                    className={bemClass([blk, 'list-title'])}
                                    typography="xl"
                                    color="gray-dark"
                                >
                                    {cat.displayName}
                                </Text>
                            )}
                        </div>
                        <div className={bemClass([blk, 'list-actions'])}>
                            <Button
                                category="primary"
                                withIcon
                                clickHandler={() => editHandler(cat._id)}
                                className={bemClass([blk, 'add-button'])}
                            >
                                <Icon name="pencil-square-o" color="black" size="small" />
                            </Button>
                            <Button
                                category="primary"
                                withIcon
                                clickHandler={() => handleDeleteClick(cat._id, cat.displayName)}
                                className={bemClass([blk, 'add-button'])}
                            >
                                <Icon name="trash" color="black" size="small" />
                            </Button>
                        </div>
                    </div>
                ))}
                {deleteToast.show && (
                    <Toast
                        title="Delete Category"
                        message={`You are about to delete the category "${deleteToast.categoryName}". If you proceed, it will be permanently removed.`}
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

export default Category
