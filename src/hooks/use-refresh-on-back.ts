import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export function useRefreshOnBack(queryParam: string) {
  const router = useRouter();
  const query = useRef(router.query[queryParam]);

  /**
   * If for some reason this component has stale props from navigating back by
   * browser history, reload the entire page. This seems to be a bug in next.js
   *
   * /a/1 ---> /a/2 ---> /a/3 ---> /a/4 ---> /a/5 -- Standard navigation in app
   * /a/5 <--- /a/5 <--- /a/5 <--- /a/5 <--- /a/5 -- when using back button ( broken :( )
   * @see {@link https://github.com/vercel/next.js/issues/9992}
   */
  useEffect(() => {
    if (router.query[queryParam] != query.current) {
      router.reload();
    }
  }, [router.query[queryParam]]);
}
