import { useState, useRef } from "react"
import axios from "axios"
import { signIn } from "next-auth/client"
import { useRouter } from "next/router"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import classes from "./auth-form.module.css"

function AuthForm() {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const [isLogin, setIsLogin] = useState(true)

  const router = useRouter()

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState)
  }

  async function handleSubmit(evt) {
    evt.preventDefault()

    const email = emailInputRef.current.value
    const password = passwordInputRef.current.value

    if (isLogin) {
      // Log User In≤
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (!result.error) {
        return router.replace("/profile")
      }

      toast.error(result.error)
    } else {
      // Create User
      try {
        const result = await createUser(email, password)
        // Loguear usuario
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  async function createUser(email, password) {
    const res = await axios.post(
      "/api/auth/signup",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (res.statusText !== "OK") {
      throw new Error(res.data.message || "Something went wrong!")
    }
  }

  return (
    <section className={classes.auth}>
      <ToastContainer />
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
