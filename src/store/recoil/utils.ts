// @ts-nocheck
import { AtomEffect } from 'recoil';
import { parseCookies, setCookie } from 'nookies';

export const localStorageEffect =
  (key: string): AtomEffect<string | undefined> =>
  ({ setSelf, onSet }) => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet(newValue => {
        localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const cookieEffect =
  <T = string | undefined>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    if (typeof window !== 'undefined') {
      const cookies = parseCookies();
      if (key in cookies) {
        const saved = cookies[key];
        setSelf(JSON.parse(saved));
      }

      onSet(newValue => {
        setCookie(null, key, JSON.stringify(newValue), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      });
    }
  };
