import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, User, UserLoginForm, UserRegistrationForm, userSchema } from "../types"

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const url = '/auth/register'
    const {data} = await api.post<string>(url, formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function confirmAccount(formData: ConfirmToken) {
  try {
    const url = '/auth/confirm-account'
    const {data} = await api.post<string>(url, formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
  try {
    const url = '/auth/request-code'
    const {data} = await api.post<string>(url, formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function autheticateUser(formData: UserLoginForm) {
  try {
    const url = '/auth/login'
    const {data} = await api.post<string>(url, formData)
    localStorage.setItem('AUTH_TOKEN', data)
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    const url = '/auth/forgot-password'
    const {data} = await api.post<string>(url, formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function validateToken(formData: ConfirmToken) {
  try {
    const url = '/auth/validate-token'
    const {data} = await api.post<string>(url, formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function updatePasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken['token']}) {
  try {
    const url = `/auth/update-password/${token}`
    const {data} = await api.post<string>(url, formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}

export async function getUser() {
  try {
    const { data } = await api<User>('/auth/user')
    if(data) {
      return data
    }
    console.log(data)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}