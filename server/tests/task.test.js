const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

let mongoServer;
let tokenUserA;
let tokenUserB;
let userAId;
let userBId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  // Register User A
  const resA = await request(app).post('/api/auth/register').send({
    name: 'User A',
    email: 'usera@devsecops.local',
    password: 'password123'
  });
  tokenUserA = resA.body.token;
  userAId = resA.body._id;

  // Register User B
  const resB = await request(app).post('/api/auth/register').send({
    name: 'User B',
    email: 'userb@devsecops.local',
    password: 'password123'
  });
  tokenUserB = resB.body.token;
  userBId = resB.body._id;
});

describe('Task Management API Tests', () => {
  it('should create a new task for authenticated user', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        title: 'Implement Security Gate',
        description: 'Setup Trivy image scan threshold',
        priority: 'HIGH',
        status: 'TODO'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toEqual('Implement Security Gate');
    expect(res.body.priority).toEqual('HIGH');
    expect(res.body.user).toEqual(userAId);
  });

  it('should retrieve tasks owned by authenticated user and filter by status/priority', async () => {
    // Create tasks for User A
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'Task 1', status: 'TODO', priority: 'HIGH' });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'Task 2', status: 'COMPLETED', priority: 'LOW' });

    // Fetch all for User A
    const resAll = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(resAll.statusCode).toEqual(200);
    expect(resAll.body.length).toEqual(2);

    // Filter by status=TODO
    const resFilter = await request(app)
      .get('/api/tasks?status=TODO')
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(resFilter.statusCode).toEqual(200);
    expect(resFilter.body.length).toEqual(1);
    expect(resFilter.body[0].title).toEqual('Task 1');
  });

  it('should update a task owned by user', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'Original Title', status: 'TODO' });

    const taskId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'Updated Title', status: 'IN_PROGRESS' });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.title).toEqual('Updated Title');
    expect(updateRes.body.status).toEqual('IN_PROGRESS');
  });

  it('should patch task status', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'Patch Status Task', status: 'TODO' });

    const taskId = createRes.body._id;

    const patchRes = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ status: 'COMPLETED' });

    expect(patchRes.statusCode).toEqual(200);
    expect(patchRes.body.status).toEqual('COMPLETED');
  });

  it('should delete a task owned by user', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'Task to Delete' });

    const taskId = createRes.body._id;

    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.message).toEqual('Task deleted successfully');

    const getRes = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(getRes.statusCode).toEqual(404);
  });

  it('should prevent User B from accessing or modifying User A task', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({ title: 'User A Private Task' });

    const taskId = createRes.body._id;

    // User B tries to view
    const getRes = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenUserB}`);
    expect(getRes.statusCode).toEqual(403);

    // User B tries to update
    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenUserB}`)
      .send({ title: 'Hacked Title' });
    expect(updateRes.statusCode).toEqual(403);

    // User B tries to delete
    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenUserB}`);
    expect(deleteRes.statusCode).toEqual(403);
  });

  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(401);
  });
});
