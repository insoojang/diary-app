import React from 'react'

export const DBContext = React.createContext()

export const useDB = () => {
    return React.useContext(DBContext)
}
