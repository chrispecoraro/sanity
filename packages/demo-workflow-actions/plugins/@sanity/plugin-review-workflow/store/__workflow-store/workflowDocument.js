import {useDocument} from '../../lib/document-store'

export function useWorkflowDocument(documentId) {
  return useDocument({
    filter: '_type == $type && documentId == $documentId',
    params: {type: 'workflow.metadata', documentId}
  })
}
