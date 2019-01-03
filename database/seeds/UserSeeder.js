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
const Candidate = use('App/Models/Candidate')
const File = use('App/Models/File')

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
    let cities = [
      'Boston',
      'Anchorage',
      'Honolulu',
      'Colorado Springs',
      'Toledo',
      'St. Paul',
      'San Francisco',
      'Miami',
      'Laredo',
      'Las Vegas',
      'Baltimore',
      'Austin',
    ]


    for (let i = 0; i<names.length; i++) {
      const name = names[i];
      let cleanName = name.replace(' ', '');
      let newEmployer = new User;
      newEmployer.username = name;
      newEmployer.password = 'test1234';
      newEmployer.email = cleanName + '@gmail.com';
      newEmployer.is_admin = i == 0
      await newEmployer.save();

      if (i > 0) {
        const city = cities[i - 1]
        await this.createCandidate(name, newEmployer.id, city)
        await this.createFile(name, i)
      }
    }
  }

  async createCandidate(username, user_id, city) {
    let candidate = new Candidate
    candidate.fullname = username
    candidate.user_id = user_id
    candidate.address = city
    candidate.gender = Math.random() > 0.5 ? 'L' : 'P'
    candidate.birth_place = city
    candidate.birth_date = new Date;

    await candidate.save()
  }

  async createFile(username, i) {
    let _mod = i % 6

    if (_mod == 0) _mod = 6

    const candidate = await Candidate.findByOrFail('fullname', username)
    let file = new File
    file.filename = _mod + '.pdf'
    file.filetitle = 'CV'
    file.candidate_id = candidate.id
    await file.save()
  }
}

module.exports = UserSeeder
