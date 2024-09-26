import { Icon } from '@mui/material'
import React from 'react'

export const DocumentRow = ({id, fileName, date}) => {
  return (
    <div>
        <Icon name='article' size='3xl' color='blue'/>
        <p className='flex-grow pl-5 w-10 pr-10 truncate'>{fileName}</p>
        <p className='pr-5 text-sm'>{date?.toDat}</p>

    </div>
  )
}
