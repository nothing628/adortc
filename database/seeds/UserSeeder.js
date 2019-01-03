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
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    let names = [
      'Administrator',
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

    for (let i = 0; i<names.length; i++) {
      const name = names[i];
      let cleanName = name.replace(' ', '');
      let newEmployer = new User;
      newEmployer.username = name;
      newEmployer.password = 'test1234';
      newEmployer.email = cleanName + '@gmail.com';
      newEmployer.is_admin = i == 0
      newEmployer.save();
    }
  }
}

module.exports = UserSeeder
