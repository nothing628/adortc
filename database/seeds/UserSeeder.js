'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    let names = [
      'Rizky Ihatrayudha',
      'Faradhia Seviana',
      'Risma Widyasmoro',
      'Caesarani Sinuka',
      'Muthia Firmansyah',
      'Meutia Widian',
      'Firdaus Anugrah Jordy',
      'Anas Tiodimar',
      'Ogie Aruti',
      'Dimas Azalia',
      'Azhar Annisa',
      'Rifqy Arisa',
    ];

    names.forEach(async (name) => {
      let cleanName = name.replace(' ', '');
      let newEmployer = new User;
      newEmployer.username = name;
      newEmployer.password = await Hash.make('test1234');
      newEmployer.email = cleanName + '@gmail.com';
      newEmployer.save();
    });
  }
}

module.exports = UserSeeder
