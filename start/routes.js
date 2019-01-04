'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.get('/room', 'RtcController.index').as('room.list')
// Route.get('/room/:id', 'JoinController.index').as('room.join')
// Route.get('/api/room', 'RtcController.listRoom').as('api.room.list')
// Route.post('/api/room', 'RtcController.addRoom').as('api.room.add')
// Route.delete('/api/room/:id', 'RtcController.deleteRoom').as('api.room.delete')

Route.get('/', 'HomeController.index').middleware('auth').as('home')

Route.get('logout', 'UserController.logout')
  .middleware('auth').as('logout')
Route.get('login', 'UserController.login')
  .middleware('guest').as('login')
Route
  .post('login', 'UserController.loginPost')
  .middleware('guest')

Route.group(() => {
  Route.get('/', 'CandidateController.index').as('candidate.index')
  Route.get('detail/:id', 'CandidateController.detail').as('candidate.detail')
}).prefix('candidate').middleware('auth')

Route.group(() => {
  Route.get('result/:id', 'InterviewController.result').as('interview.result')
  Route.get('/', 'InterviewController.interview').as('interview.index')
  Route.post('result', 'InterviewController.updateResult').as('interview.result.post')
}).prefix('interview').middleware('auth')

Route.group(() => {
  Route.get('/', 'ProfileController.show').as('profile.show')
  Route.get('edit', 'ProfileController.edit').as('profile.edit')
  Route.post('edit', 'ProfileController.update').as('profile.update')
}).prefix('profile').middleware('auth')
