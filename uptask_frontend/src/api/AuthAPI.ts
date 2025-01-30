import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { UserRegistrationForm } from "../types"

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const url = '/auth/register'
    const {data} = await api.post<string>(url, formData)
    console.log(data)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
  }
}