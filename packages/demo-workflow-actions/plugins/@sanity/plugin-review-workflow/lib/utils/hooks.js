import {useEffect, useState} from 'react'

export function useObservable(stream, initialState = null, keys = []) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const sub = stream.subscribe(value => {
      console.log('new value', keys, value)
      setState(value)
    })
    return () => sub.unsubscribe()
  }, keys)

  return state
}
