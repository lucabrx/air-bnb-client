import { useEffect } from "react"
import { useRouter } from "next/router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { type AxiosError } from "axios"

import { API } from "~/lib/utils"

type User = {
  id: number
  createdAt: string
  name: string
  email: string
  image?: string
}
type UserType = {
  user: User
}

type CustomErrorType = {
  response: {
    data: {
      error: string
    }
  }
} & AxiosError

async function fetchSessionUser() {
  const res = await API.get<UserType>("/v1/user")
  return res.data
}

export function useSession() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading, error, isError } = useQuery<UserType, CustomErrorType>({
    queryKey: ["session"],
    queryFn: fetchSessionUser,
    initialData: queryClient.getQueryData(["session"]),
    retry: false,
  })

  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      void router.push("/")
    }
  }, [isError, error, router])

  return {
    session: data?.user,
    isLoading,
    error,
    isError,
  }
}
