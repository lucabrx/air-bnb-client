import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const BASE_URL = "http://localhost:8080"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
