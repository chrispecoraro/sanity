import client from 'part:@sanity/base/client'
import {merge, Subject} from 'rxjs'
import {map, scan, share, switchMap} from 'rxjs/operators'
import {getQueryResultObservable, getServerEventObservable} from '../lib/document-store'
import {useObservable} from '../lib/utils/hooks'

function stateReducer(state, event) {
  if (event.type === 'snapshot') return {data: event.snapshot}

  if (event.type === 'move') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === `workflow-metadata.${event.id}`) {
          return {...metadata, state: event.nextState}
        }

        return metadata
      })
    }
  }

  console.log('unhandled event', event)

  return state
}

function getMetadataListObservable() {
  const filter = '_type == $type'
  const params = {type: 'workflow.metadata'}
  const query = `* [_type == $type] {
    _id,
    "ref": coalesce(
      *[_id == "drafts." + ^.documentId]{_id,_type}[0],
      *[_id == ^.documentId]{_id,_type}[0]
    ),
    state,
    assignees
  }`

  return getServerEventObservable({filter, params}).pipe(
    switchMap(() => getQueryResultObservable({query, params}))
  )
}

function getMetadataListContext() {
  const actionEventSubject = new Subject()
  const actionEvent$ = actionEventSubject.asObservable()
  const snapshotEvent$ = getMetadataListObservable().pipe(
    map(snapshot => ({type: 'snapshot', snapshot}))
  )
  const event$ = merge(snapshotEvent$, actionEvent$)
  const state$ = event$.pipe(
    scan(stateReducer, {data: []}),
    map(state => ({...state, move})),
    share()
  )

  return state$

  function move(id, nextState) {
    actionEventSubject.next({type: 'move', id, nextState})

    return client
      .patch(`workflow-metadata.${id}`)
      .set({state: nextState})
      .commit()
  }
}

export function useMetadataList() {
  const stream = getMetadataListContext()
  const initialValue = []
  const keys = []

  return useObservable(stream, initialValue, keys)
}
