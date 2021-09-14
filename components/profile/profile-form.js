import { useRef } from "react"

import classes from "./profile-form.module.css"

function ProfileForm({ onChangePassword }) {
  const oldPassword = useRef()
  const newPassword = useRef()

  function handleSubmit(evt) {
    evt.preventDefault()

    onChangePassword({
      oldPassword: oldPassword.current.value,
      newPassword: newPassword.current.value,
    })
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPassword} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
