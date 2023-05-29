import React from 'react'
import users from '../assets/dummyAccount'
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
const Account = () => {

  return (
    <main id="accounts">
     {
      users.map((user)=>{
        return <div className="user" key={user._id}>
         <div className="user-details">
          <div className="detail">
            <span className="detail-heading">Username: </span>{user.name}
          </div>
          <div className="detail">
            <span className="detail-heading">AccountId: </span>{user.chatId}
          </div>
          <div className="detail">
            <span className="detail-heading">City: </span>{user.city}
          </div>
          <div className="detail">
            <span className="detail-heading">Subscription: </span>{user.subscription}
          </div>
         </div>
         <div className="actions">
          <BlockIcon id="blockbtn" className="action" />
          <DeleteIcon id="deletebtn"className="action"/>
         </div>
        </div>
      })
     }
    </main>
  )
}

export default Account
