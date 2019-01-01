'use strict'

class UserController {
  async loginPost ({ request, response, auth }) {
    const { email, password } = request.all()

    try {
      await auth.attempt(email, password)
    } catch (e) {
      console.log(e)
      return response.route('login')
    }

    return response.route('home')
  }

  login({ view }) {
    return view.render('login')
  }

  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
    return auth.user
  }

  async logout({ auth }) {
    await auth.logout()
  }
}

module.exports = UserController
