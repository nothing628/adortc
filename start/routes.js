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

Route.on('/').render('welcome').as('home')
Route.get('/room', 'RtcController.index').as('room.list')
Route.get('/room/:id', 'JoinController.index').as('room.join')
Route.get('/api/room', 'RtcController.listRoom').as('api.room.list')
Route.post('/api/room', 'RtcController.addRoom').as('api.room.add')
Route.delete('/api/room/:id', 'RtcController.deleteRoom').as('api.room.delete')
