import TextInput from 'part:@sanity/components/textinputs/default'
import React from 'react'
import {useProjectUsers} from '../../../lib/user-store'
import {UserCard} from '../../userCard'

import styles from './AssigneeListField.css'

function searchUsers(users, searchString) {
  return users.filter(user => {
    const givenName = (user.givenName || '').toLowerCase()
    const middleName = (user.middleName || '').toLowerCase()
    const familyName = (user.familyName || '').toLowerCase()

    if (givenName.startsWith(searchString)) return true
    if (middleName.startsWith(searchString)) return true
    if (familyName.startsWith(searchString)) return true

    return false
  })
}

export default function AssigneeListField(props) {
  const [searchString, setSearchString] = React.useState('')
  const value = props.assignees || []
  const userList = useProjectUsers() || []

  // const searchResults = userList
  const searchResults = searchUsers(userList || [], searchString)

  const handleSearchChange = event => {
    setSearchString(event.target.value)
  }

  const handleCheckboxUpdate = (event, user) => {
    // console.log('handleCheckboxUpdate', event.target.checked, user)

    if (event.target.checked) {
      props.onAdd(user.id)
    } else {
      props.onRemove(user.id)
    }
  }

  const handleAssignMyselfClick = () => {
    //
  }

  const handleClearAssigneesClick = () => {
    //
  }

  return (
    <div className={styles.root}>
      <div className={styles.search}>
        <TextInput
          onChange={handleSearchChange}
          placeholder="Type to find users"
          value={searchString}
        />
      </div>

      <div className={styles.menu}>
        <button className={styles.menuButton} onClick={handleAssignMyselfClick} type="button">
          <div tabIndex={-1}>Assign myself</div>
        </button>
        <button className={styles.menuButton} onClick={handleClearAssigneesClick} type="button">
          <div tabIndex={-1}>Clear assignees</div>
        </button>

        {searchResults && (
          <>
            {searchResults.length === 0 && <div style={{padding: '0.25em 0.5em'}}>No matches</div>}
            {searchResults.map(user => (
              <label className={styles.menuItem} key={user.id}>
                <div className={styles.userOption} tabIndex={-1}>
                  <div className={styles.userCheckbox}>
                    <input
                      checked={value.indexOf(user.id) > -1}
                      type="checkbox"
                      onChange={event => handleCheckboxUpdate(event, user)}
                    />
                  </div>

                  <div className={styles.userCard}>
                    <UserCard data={user} />
                  </div>
                </div>
              </label>
            ))}
          </>
        )}
      </div>

      {/* <input className={styles.searchInput} placeholder="Type or choose a name" type="text" />

      <ul>
        <li>
          <button type="button">Clear assignees</button>
        </li>

        {userList.map(user => (
          <li key={user.id}>
            <label>
              <input
                checked={value.indexOf(user.id) > -1}
                onChange={event =>
                  event.target.checked ? props.onAdd(user.id) : props.onRemove(user.id)
                }
                type="checkbox"
                value={user.id}
              />
              {user.displayName}
            </label>
          </li>
        ))}
      </ul> */}
    </div>
  )
}
