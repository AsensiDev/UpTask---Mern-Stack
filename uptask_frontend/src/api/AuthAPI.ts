import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { ConfirmToken, UserRegistrationForm } from "../types"

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