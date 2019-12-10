import {switchMap} from 'rxjs/operators'
import {getQueryResultObservable, getServerEventObservable} from '../../lib/document-store'
import {useObservable} from '../../lib/utils/hooks'

const listFilter = `_type == $type`

const listQuery = `
  *[${listFilter}] {
    _id,
    "ref": coalesce(
      *[_id == "drafts." + ^.documentId]{_id,_type}[0],
      *[_id == ^.documentId]{_id,_type}[0]
    ),
    state,
    assignees
  }
`

const listForAssigneeFilter = `_type == $type && $assigneeId in assignees`

const listForAssigneeQuery = `
  *[${listForAssigneeFilter}] {
    _id,
    "ref": coalesce(
      *[_id == "drafts." + ^.documentId]{_id,_type}[0],
      *[_id == ^.documentId]{_id,_type}[0]
    ),
    state,
    assignees
  }
`

function getWorkflowDocumentListObservable(assigneeId, typeName) {
  const filter = assigneeId ? listForAssigneeFilter : listFilter
  const query = assigneeId ? listForAssigneeQuery : listQuery
  const params = {type: 'workflow.metadata', assigneeId}

  return getServerEventObservable({filter, params}).pipe(
    switchMap(() => getQueryResultObservable({query, params}))
  )
}

export function useWorkflowDocumentList(assigneeId) {
  const stream = getWorkflowDocumentListObservable(assigneeId)
  const initialValue = null
  const keys = [assigneeId]

  return useObservable(stream, initialValue, keys)
}
