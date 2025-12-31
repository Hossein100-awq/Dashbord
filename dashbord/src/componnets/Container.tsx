import React from 'react'
interface childrenProp {
    children:React.ReactNode
}
const Container = ({children}:childrenProp) => {
  return (
    <div className='container mx-auto'>
        {children}
    </div>
  )
}

export default Container