import http from 'http';

const PORT = 4000;

describe('test "users" endpoints: ', () => {
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/users',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const userToCreate = {
    username: 'John',
    age: 22,
    hobbies: [],
  };

  const postOptions = {
    ...options,
    method: 'POST',
  };

  test('GET "/api/users" -  should return empty array ', (done) => {
    http.get(`http://localhost:${PORT}/api/users`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data)).toEqual([]);
        done();
      });
    });
  });

  test('POST "/api/users" - should return createdUser with Id', (done) => {
    const req = http.request(postOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseData = JSON.parse(data);

        expect(res.statusCode).toBe(200);
        expect(typeof responseData.id).toBe('string');
        expect(responseData.username).toBe('John');
        expect(responseData.age).toBe(22);
        expect(responseData.hobbies).toStrictEqual([]);
        done();
      });
    });

    req.write(JSON.stringify(userToCreate));
    req.end();

    req.on('error', (err) => {
      done(err);
    });
  });

  test('GET "/api/users/:userId" should return user by Id or message about error', (done) => {
    http.get(`http://localhost:${PORT}/api/users`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const users = JSON.parse(data);
        const userId = users.length && users[0] ? users[0].id : undefined;

        // get created user by id
        http.get(`http://localhost:${PORT}/api/users/${userId}`, (res) => {
          let userData = '';

          res.on('data', (chunk) => {
            userData += chunk;
          });

          res.on('end', () => {
            if (userId) {
              const responseData = JSON.parse(userData);
              expect(res.statusCode).toBe(200);
              expect(typeof responseData.id).toBe('string');
              expect(responseData.username).toBe('John');
              expect(responseData.age).toBe(22);
              expect(responseData.hobbies).toStrictEqual([]);
            } else {
              expect(res.statusCode).toBe(400);
              expect(userData).toBe('Wrong id type');
            }
            done();
          });
        });
      });
    });
  });

  test('delete "/api/users/:userId" - should return error message', (done) => {
    const wrongId = '21aa234c-a7ce-4fdc-95a2-31988317fbbc';

    const deleteOptions = {
      ...options,
      method: 'DELETE',
      path: `/api/users/${wrongId}`,
    };

    const req = http.request(deleteOptions, (res) => {
      let resData = '';

      res.on('data', (chunk) => {
        resData += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(400);
        expect(resData).toBe('There is no user with such id');
        done();
      });
    });

    req.end();
  });
});
