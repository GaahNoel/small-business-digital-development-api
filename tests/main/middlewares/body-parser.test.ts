import request from 'supertest';
import { app } from '@/main/config/app';

describe('Body Parser Middleware', () => {
  jest.setTimeout(30000)
  test('Should parse body as json', async (done) => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });

    await request(app).post('/test_body_parser').send({ name: 'Bruno' }).expect({ name: 'Bruno' });
    done();
  });
});
