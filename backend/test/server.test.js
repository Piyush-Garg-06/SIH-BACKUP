import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app, server } from '../server.js'; // Import the app and server from the modified server.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Server', () => {
  after((done) => {
    server.close(done); // Close the server after all tests are done
  });

  it('should return 200 for the root endpoint', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});