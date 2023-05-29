import {useState} from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
    
  return (
    <header id="nav-header">
      
      <Link to="/">
        <div className="link">Accounts</div>
      </Link>
      <Link to="/settings">
        <div className="link">Bot Settings</div>
      </Link>
      
    </header>
  )
}

export default Header
