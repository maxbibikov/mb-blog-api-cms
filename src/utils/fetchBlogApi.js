import { getBlogApiUrl } from './getBlogApiUrl';

export function fetchBlogApi(resourcePath, method, body) {
  return fetch(getBlogApiUrl(resourcePath), {
    method,
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Access-Control-Request-Headers': '*',
      'Access-Control-Allow-Headers': 'Accept',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  })
    .then(response => {
      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
          return response
            .json()
            .then(data => {
              if (data.error) {
                return data;
              }

              throw Error('Connection error');
            })
            .catch(err => {
              throw Error(err.message);
            });
        }

        return response
          .text()
          .then(message => ({ error: { message } }))
          .catch(err => {
            throw Error(err.message);
          });
      }
      return response
        .json()
        .then(data => {
          if (data.error) {
            throw Error(data.error.message);
          }

          return data;
        })
        .catch(err => {
          throw Error(err.message);
        });
    })
    .catch(err => Promise.reject(new Error(err.message)));
}
