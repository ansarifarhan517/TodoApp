import React, { lazy, Suspense } from 'react'
import {
  Route, Routes, Navigate,
} from 'react-router-dom'

import './style.scss'

const Todo = lazy(async () => await import(/* webpackChunkName: "Todo" */'../pages/todo/index'))
const Category = lazy(async () => await import(/* webpackChunkName: "Category" */'../pages/category/index'))

const PageContainer = () => (
  <div className="page-container">
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate replace to="todos" />} />
        <Route path="/todos" element={<Todo />} />
        <Route path="/category" element={<Category />} />

      </Routes>
    </Suspense>
  </div>
)

export default PageContainer
