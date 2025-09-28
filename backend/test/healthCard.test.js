import * as chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import { app, server } from '../server.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Health Card PDF Download', () => {
  let workerToken;
  let workerId;

  before(async () => {
    // Get a worker user and generate a token
    const workerUser = await User.findOne({ email: 'worker@example.com' });
    workerId = workerUser._id;
    workerToken = jwt.sign(
      { user: { id: workerUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: 360000 }
    );
  });

  after((done) => {
    server.close(done);
  });

  it('should download health card as PDF for authenticated worker', (done) => {
    chai.request(app)
      .get(`/api/health-cards/download/${workerId}`)
      .set('x-auth-token', workerToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.have.header('content-type', /^application\/pdf/);
        expect(res.headers['content-disposition']).to.include('attachment;');
        expect(res.headers['content-disposition']).to.include('.pdf');
        done();
      });
  });

  it('should return 401 for unauthenticated request', (done) => {
    chai.request(app)
      .get(`/api/health-cards/download/${workerId}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 404 for non-existent user', (done) => {
    const fakeUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
    chai.request(app)
      .get(`/api/health-cards/download/${fakeUserId}`)
      .set('x-auth-token', workerToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});