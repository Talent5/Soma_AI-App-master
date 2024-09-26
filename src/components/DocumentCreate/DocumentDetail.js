import React from 'react'
import { db } from '../config/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Icon } from '@mui/material'



export const DocumentDetail = () => {
  const [snapshot, loadingSnapshot] useDocumentOnce(
    db.collection('userDocs').doc(userId).collection('docs').doc(id)
  )
  const {id} = navigate.query

  return (
    <div>
        <header className='flex justify-between items-center p-3 pb-1'>
          <span onClick={() => navigate.path('/doc/:id')}
            className='cursor-pointe'>
            <Icon name ='descrition' size ='5xl' color='blue' />
          </span>

          <div className='flex-grow px-2'>
            <h2>{snapshot?.data()?.fileName}</h2>

            <div className='flex items-center text-sm space-x-1 ml-1 h-8 text-gray-600'>
              <p className='hover:bg-gray-100 transition duration-200'>File</p>
              <p>Edit</p>
              <p>View</p>
              <p>Insert</p>
              <p>Format</p>
              <p>Tools</p>
            </div>
          </div>

          <button
          color='lightBlue'
          buttontype = 'filled'
          size='regular'
          rounded={false}
          block={false}
          iconOnly ={false}
          ripple='light'
          >
            <Icon name='peo'/>
          </button>

        </header>

    </div>
  )
}

