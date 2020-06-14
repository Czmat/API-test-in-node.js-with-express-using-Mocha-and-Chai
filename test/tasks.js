let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const { response } = require('express');

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
  /**
   * Test the Get route
   */
  describe('GET /api/tasks', () => {
    it('It should get all the tasks', (done) => {
      chai
        .request(server)
        .get('/api/tasks')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.be.eq(3);
          done();
        });
    });
    it('It should NOT GET all the tasks', (done) => {
      chai
        .request(server)
        .get('/api/task')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  /**
   * Test the GET (by ID) route
   */
  describe('GET /api/tasks/:id', () => {
    it('It should get a task by ID', (done) => {
      const taskId = 1;
      chai
        .request(server)
        .get('/api/tasks/' + taskId)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('name');
          response.body.should.have.property('completed');
          response.body.should.have.property('id').eq(1);
          done();
        });
    });
    it('It should NOT GET a task by ID', (done) => {
      const taskId = 123;
      chai
        .request(server)
        .get('/api/tasks/' + taskId)
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq('The task does not exist');
          done();
        });
    });
  });

  /**
   * Test the POST route
   */
  describe('POST /api/tasks', () => {
    it('It should POST a new task', (done) => {
      const task = {
        name: 'Task 4',
        completed: false,
      };
      chai
        .request(server)
        .post('/api/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(4);
          res.body.should.have.property('name').eq('Task 4');
          res.body.should.have.property('completed').eq(false);
          done();
        });
    });

    it('It should NOT POST a new task without the name property', (done) => {
      const task = {
        completed: false,
      };
      chai
        .request(server)
        .post('/api/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eq('The name should be at least 3 chars long!');
          done();
        });
    });
  });

  /**
   * Test the PUT route
   */
  describe('PUT /api/tasks', () => {
    it('It should PUT an existing task', (done) => {
      const taskId = 1;
      const task = {
        name: 'Task 1 changed',
        completed: true,
      };
      chai
        .request(server)
        .put('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(1);
          res.body.should.have.property('name').eq('Task 1 changed');
          res.body.should.have.property('completed').eq(true);
          done();
        });
    });

    it('It should NOT PUT a new name with less then 3 chars', (done) => {
      const taskId = 1;
      const task = {
        name: 'ta',
        completed: false,
      };
      chai
        .request(server)
        .put('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eq('The name should be at least 3 chars long.');
          done();
        });
    });
  });

  /**
   * Test the PATCH route
   */
  describe('PATCH /api/tasks/:id', () => {
    it('It should PATCH an existing task', (done) => {
      const taskId = 1;
      const task = {
        name: 'Task 1 patch',
      };
      chai
        .request(server)
        .patch('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(1);
          res.body.should.have.property('name').eq('Task 1 patch');
          res.body.should.have.property('completed').eq(true);
          done();
        });
    });

    it('It should NOT PATCH an existing name with less then 3 chars', (done) => {
      const taskId = 1;
      const task = {
        name: 'ta',
      };
      chai
        .request(server)
        .put('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eq('The name should be at least 3 chars long.');
          done();
        });
    });

    it('It should NOT PATCH an existing task with given ID', (done) => {
      const taskId = 134;
      const task = {
        name: 'ta',
      };
      chai
        .request(server)
        .patch('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq(
            'The task with the provided ID does not exists'
          );
          done();
        });
    });
  });

  /**
   * Test the DELETE route
   */
  describe('DELETE /api/tasks/:id', () => {
    it('It should DELETE an existing task', (done) => {
      const taskId = 1;
      chai
        .request(server)
        .delete('/api/tasks/' + taskId)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('It should NOT DELETE a task that is not in the db', (done) => {
      const taskId = 123;
      chai
        .request(server)
        .delete('/api/tasks/' + taskId)
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq(
            'The task with the provided ID does not exist.'
          );
          done();
        });
    });
  });
});
