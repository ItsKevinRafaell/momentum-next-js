import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreetingBasedOnTime(): string {
  const currentHour = new Date().getHours();

  if (currentHour < 4) {
    return 'Selamat Dini Hari';
  } else if (currentHour < 11) {
    return 'Selamat Pagi';
  } else if (currentHour < 15) {
    return 'Selamat Siang';
  } else if (currentHour < 19) {
    return 'Selamat Sore';
  } else {
    return 'Selamat Malam';
  }
}
