import React, { useState, ChangeEvent, useEffect } from 'react'
import { Button, TextInput } from '@base'
import { bemClass } from '@utils'
import './style.scss'
import { post } from '@api'
import { schema } from './validation-schema'
import { ICreate } from '@utils/common.models'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Toast from '@base/toast'

interface ILoginAppProps extends ICreate {
  errorMap: {
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

interface LoginApiResponse {
  message: string;
  signature: string;
  email: string;
  userName: string;
  userId: string;
}

const options = {
  schema,
  formModel: {
    email: '',
    password: '',
  },
}

const blk = 'login-app'

const LoginApp: React.FC<ILoginAppProps> = ({ onChangeHandler, errorMap, onSubmitHandler, formData }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [generalToast, setGeneralToast] = useState<GeneralToast>({
    show: false,
    message: '',
    category: 'info',
  })


  const onRememberMeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked)
  }

  useEffect(() => {
    async function loginIfValid() {
      if (!submitted) return
      const emailVal = ((formData?.email as string) || '').trim()
      const passwordVal = ((formData?.password as string) || '').trim()
      if (Object.keys(errorMap).length === 0
        &&
        (emailVal !== '' || passwordVal !== '')) {
        const body = {
          email: formData?.email,
          password: formData?.password,
        }
        try {
          const response = await post<LoginApiResponse>('user/login', body)
          if (response?.status === 200) {
            setGeneralToast({
              show: true,
              title: 'Success',
              message: 'Logged In successfully!',
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
          }else {
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
          console.error('Error during login:', error)
        }
      }
      setSubmitted(false)
    }
    loginIfValid()
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
      <form>
        <div className={bemClass([blk, 'content'])}>
          <h2 className={bemClass([blk, 'title'])}>Login into IDFY</h2>
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
            label="Password"
            type="password"
            name="password"
            isRequired
            value={(formData?.password as string)}
            invalid={!!errorMap.password}
            validationMessage={errorMap.password}
            changeHandler={onChangeHandler}
          />
          <span className={bemClass([blk, 'password-message',
            { 'error': !!errorMap?.password }])}>
            Password must be at least 8 characters, include an uppercase letter, a number, and a special character</span>
          <div className={bemClass([blk, 'remember-me'])}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={onRememberMeChange}
              />
              Remember Me
            </label>
          </div>
          <span
            className={bemClass([blk, 'signup-link'])}
            onClick={() => { window.location.replace('/signup') }}
            style={{ cursor: 'pointer', display: 'block', marginBottom: '1rem' }}
          >
            Don't have an account? Create One
          </span>
          <div className={bemClass([blk, 'footer'])}>
            <Button className={bemClass([blk, 'button'])}
              clickHandler={(e) => {
                setSubmitted(true)
                onSubmitHandler(e)
              }}>
              Login
            </Button>
          </div>
        </div>
      </form>
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

export { LoginApp, options }
