'use strict'

class HomeController {
  index({ view, auth }) {
    if (auth.user.is_admin) {
      return view.render('home')
    }

    return view.render('homeclient')
  }
}

module.exports = HomeController
