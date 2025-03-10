import React, { useEffect, useState } from 'react'
import { Button, TextInput } from '@base'
import { bemClass } from '@utils'
import './style.scss'
import { post } from '@api'
import { schema } from './validation-schema'
import { ICreate } from '@utils/common.models'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Toast from '@base/toast'


const blk = 'signup-app'

interface ISignupAppProps extends ICreate {
  errorMap: {
    userName: string;
    email: string,
    password: string,
  }
}

type ToastCategory = 'success' | 'delete' | 'info' | 'warning'
type GeneralToast = {
  show: boolean
  title?: string
  message: string
  category: ToastCategory
}

interface SignupApiResponse {
  message: string;
  signature: string;
  email: string;
  userName: string;
  userId: string;
}
const options = {
  schema,
  formModel: {
    userName: '',
    email: '',
    password: '',
  },
}

const SignupApp: React.FC<ISignupAppProps> = ({ onChangeHandler, errorMap, onSubmitHandler, formData }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [submitted, setSubmitted] = useState<boolean>(false)
  const [generalToast, setGeneralToast] = useState<GeneralToast>({
    show: false,
    message: '',
    category: 'info',
  })

  useEffect(() => {
    async function singupIfValid() {

      if (!submitted) return
      const emailVal = ((formData?.email as string) || '').trim()
      const passwordVal = ((formData?.password as string) || '').trim()
      const userNameVal = ((formData?.userName as string) || '').trim()
      if (Object.keys(errorMap).length === 0
        &&
        (emailVal !== '' || passwordVal !== '' || userNameVal !== '')) {
        const body = {
          userName: formData?.userName,
          email: formData?.email,
          password: formData?.password,
        }
        try {
          const response = await post<SignupApiResponse>('user/signup', body)
          if (response?.status === 201) {
            setGeneralToast({
              show: true,
              title: 'Success',
              message: 'SignUp successfully!',
              category: 'success',
            })
            localStorage.setItem('authToken', response?.data?.signature)
            localStorage.setItem('userId', response.data.userId)
            localStorage.setItem('userName', response.data.userName)

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            localStorage.setItem('sessionStarted', `${new Date()}`)

            dispatch({
              type: '@@app/SET_SESSION',
              payload: {
                userId: response.data.userId,
                sessionStarted: new Date(),
              },
            })
            navigate('/')
          } else {
            setGeneralToast({
              show: true,
              title: 'Error',
              message: `Err Code: ${response.status} - ${response.data.message}`,
              category: 'delete',
            });

          }
        } catch (error: any) {
          setGeneralToast({
            show: true,
            title: 'Error',
            message: `Login Failed - ${error.response.data.message}`,
            category: 'delete',
          });
          console.error('Error during signup:', error)
        }
      }
      setSubmitted(false)
    }
    singupIfValid()
  }, [errorMap, formData, submitted])

  useEffect(() => {
    if (generalToast.show) {
      const timer = setTimeout(() => {
        setGeneralToast((prev) => ({ ...prev, show: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [generalToast])

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'content'])}>
        <h2 className={bemClass([blk, 'title'])}>Sign Up for IDFY</h2>
        <TextInput
          type="text"
          label="Username"
          name="userName"
          isRequired
          value={(formData?.userName as string)}
          invalid={!!errorMap.userName}
          validationMessage={errorMap.userName}
          changeHandler={onChangeHandler}
        />
        <TextInput
          type="email"
          label="Email"
          name="email"
          isRequired
          value={(formData?.email as string)}
          invalid={!!errorMap.email}
          validationMessage={errorMap.email}
          changeHandler={onChangeHandler}
        />
        <TextInput
          type="password"
          label="Password"
          name="password"
          isRequired
          value={(formData?.password as string)}
          invalid={!!errorMap.password}
          validationMessage={errorMap.password}
          changeHandler={onChangeHandler}
        />
        <span
          className={bemClass([blk, 'login-link'])}
          onClick={() => { window.location.replace('/login') }}
          style={{ cursor: 'pointer', display: 'block', marginBottom: '1rem' }}
        >
          Already have an account? Sign In
        </span>
        <div className={bemClass([blk, 'footer'])}>
          <Button
            className={bemClass([blk, 'button'])}
            clickHandler={(e) => {
              setSubmitted(true)
              onSubmitHandler(e)
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
      {generalToast.show && (
        <Toast
          title={generalToast.title}
          message={generalToast.message}
          category={generalToast.category}
          onCancel={() =>
            setGeneralToast({
              ...generalToast,
              show: false,
              message: '',
              title: '',
              category: 'info',
            })
          }
        />
      )}
    </div>
  )
}

export { SignupApp, options }
