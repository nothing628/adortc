'use strict'

class HomeController {
  index({ view }) {
    return view.render('home')
  }
}

module.exports = HomeController
