// Automated API Verification Script
require('dotenv').config();
const http = require('http');

const PORT = 5001; // Test port to avoid port conflict
process.env.PORT = PORT;

const app = require('./src/app');
const connectDB = require('./src/config/db');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  await connectDB();
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}\n--- STARTING API VERIFICATION ---`);

    try {
      const timestamp = Date.now();
      const testEmail = `sathya_${timestamp}@gmail.com`;

      // 1. Test Register
      console.log('1. Testing POST /api/auth/register...');
      const registerRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          name: 'Sathya',
          email: testEmail,
          password: 'Sathya@01',
        }
      );
      console.log('Register Status:', registerRes.statusCode);
      console.log('Register Response:', JSON.stringify(registerRes.body, null, 2));
      if (registerRes.statusCode !== 201 || !registerRes.body.token) {
        throw new Error('Registration failed');
      }
      const token = registerRes.body.token;

      // 2. Test Login
      console.log('\n2. Testing POST /api/auth/login...');
      const loginRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          email: testEmail,
          password: 'Sathya@01',
        }
      );
      console.log('Login Status:', loginRes.statusCode);
      console.log('Login Response:', JSON.stringify(loginRes.body, null, 2));
      if (loginRes.statusCode !== 200 || !loginRes.body.token) {
        throw new Error('Login failed');
      }

      // 3. Test Get Profile
      console.log('\n3. Testing GET /api/auth/profile...');
      const profileRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/profile',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Profile Status:', profileRes.statusCode);
      console.log('Profile Response:', JSON.stringify(profileRes.body, null, 2));
      if (profileRes.statusCode !== 200 || !profileRes.body.user) {
        throw new Error('Get profile failed');
      }

      // 4. Test Add Workout
      console.log('\n4. Testing POST /api/workouts...');
      const addWorkoutRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/workouts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        {
          workoutName: 'Evening Jog',
          category: 'Running',
          duration: 30,
          caloriesBurned: 350,
          workoutDate: '2026-06-26',
        }
      );
      console.log('Add Workout Status:', addWorkoutRes.statusCode);
      console.log('Add Workout Response:', JSON.stringify(addWorkoutRes.body, null, 2));
      if (addWorkoutRes.statusCode !== 201 || !addWorkoutRes.body.data?._id) {
        throw new Error('Add workout failed');
      }
      const workoutId = addWorkoutRes.body.data._id;

      // 5. Test Get All Workouts
      console.log('\n5. Testing GET /api/workouts...');
      const getAllWorkoutsRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/workouts',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Get All Status:', getAllWorkoutsRes.statusCode);
      console.log('Workouts Count:', getAllWorkoutsRes.body.count);
      if (getAllWorkoutsRes.statusCode !== 200 || getAllWorkoutsRes.body.count < 1) {
        throw new Error('Get all workouts failed');
      }

      // 6. Test Get Workout By ID
      console.log(`\n6. Testing GET /api/workouts/${workoutId}...`);
      const getByIdRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: `/api/workouts/${workoutId}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Get By ID Status:', getByIdRes.statusCode);
      console.log('Workout Name:', getByIdRes.body.data?.workoutName);
      if (getByIdRes.statusCode !== 200) {
        throw new Error('Get workout by ID failed');
      }

      // 7. Test Search Workouts
      console.log('\n7. Testing GET /api/workouts/search?workoutName=Evening Jog...');
      const searchRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/workouts/search?workoutName=Evening%20Jog',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Search Status:', searchRes.statusCode);
      console.log('Search Count:', searchRes.body.count);
      if (searchRes.statusCode !== 200) {
        throw new Error('Search failed');
      }

      // 8. Test Update Workout
      console.log(`\n8. Testing PUT /api/workouts/${workoutId}...`);
      const updateRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: `/api/workouts/${workoutId}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        {
          workoutName: 'Evening Jog',
          category: 'Running',
          duration: 60,
          caloriesBurned: 650,
          workoutDate: '2026-06-26',
        }
      );
      console.log('Update Status:', updateRes.statusCode);
      console.log('Updated Duration:', updateRes.body.data?.duration);
      console.log('Updated Calories:', updateRes.body.data?.caloriesBurned);
      if (updateRes.statusCode !== 200 || updateRes.body.data?.duration !== 60) {
        throw new Error('Update workout failed');
      }

      // 9. Test AI Workout Recommendation
      console.log('\n9. Testing POST /api/ai/workout-recommendation...');
      const aiRecRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/ai/workout-recommendation',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        {
          age: 22,
          fitnessGoal: 'Weight Loss',
          experience: 'Beginner',
        }
      );
      console.log('AI Recommendation Status:', aiRecRes.statusCode);
      console.log('AI Recommendation Response:\n', aiRecRes.body.recommendation);
      if (aiRecRes.statusCode !== 200 || !aiRecRes.body.recommendation) {
        throw new Error('AI recommendation failed');
      }

      // 10. Test AI Fitness Insights
      console.log('\n10. Testing POST /api/ai/fitness-insights...');
      const aiInsightRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/ai/fitness-insights',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        {
          totalWorkouts: 18,
          averageDuration: 45,
          totalCaloriesBurned: 6200,
        }
      );
      console.log('AI Insight Status:', aiInsightRes.statusCode);
      console.log('AI Insight Response:\n', aiInsightRes.body.insight);
      if (aiInsightRes.statusCode !== 200 || !aiInsightRes.body.insight) {
        throw new Error('AI fitness insights failed');
      }

      // 11. Test Delete Workout
      console.log(`\n11. Testing DELETE /api/workouts/${workoutId}...`);
      const deleteRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: `/api/workouts/${workoutId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Delete Status:', deleteRes.statusCode);
      console.log('Delete Response:', JSON.stringify(deleteRes.body, null, 2));
      if (deleteRes.statusCode !== 200 || deleteRes.body.message !== 'workout removed successfully') {
        throw new Error('Delete workout failed');
      }

      console.log('\n========================================');
      console.log(' ALL 11 API ENDPOINTS PASSED SUCCESSFULLY! ');
      console.log('========================================');
    } catch (err) {
      console.error('\n Test Failure:', err.message);
      process.exitCode = 1;
    } finally {
      server.close();
      process.exit(process.exitCode || 0);
    }
  });
}

runTests();
