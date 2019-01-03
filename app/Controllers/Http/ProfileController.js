'use strict'

class ProfileController {
  show({ view }) {
    // show the profile page
    return view.render('profile.show')
  }

  edit({ request, view }) {
    // show form for edit profile
    return view.render('profile.edit')
  }

  async update({ request, response }) {
    // save edited profile
    return response.route('')
  }
}

module.exports = ProfileController
