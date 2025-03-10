import React from 'react'
import { Header } from '@components'
import PageContainer from '../../page-container'
import './style.scss'
const BrowseApp: React.FC = () => (
  <>
    <Header />
    <div className="wrapper">
      <PageContainer />
    </div>
  </>
)

export default BrowseApp
