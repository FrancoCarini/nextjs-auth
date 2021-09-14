import axios from "axios"

import ProfileForm from "./profile-form"
import classes from "./user-profile.module.css"

function UserProfile() {
  async function handleChangePassword(passwordData) {
    const res = await axios.patch("/api/user/change-password", passwordData, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log(res.data)
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={handleChangePassword} />
    </section>
  )
}

export default UserProfile
