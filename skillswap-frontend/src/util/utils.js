import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function toPusherKey(key) {
  return key.replace(/:/g, '__')
}

export function chatHrefConstructor(email1, email2) {
  const sortedEmails = [email1, email2].sort()
  return `${sortedEmails[0]}--${sortedEmails[1]}`
}