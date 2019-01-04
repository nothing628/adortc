'use strict'

class InterviewController {
  interview({ request, view, auth }) {
    if (auth.user.is_admin) {
      return view.render('interview.adminside')
    }

    return view.render('interview.clientside')
  }

  result({ request, view }) {
    //show the the result
    //ui for give the response after vcall
    return view.render('interview.result')
  }

  async updateResult({ request, response }) {
    // save the result
    return response.route('')
  }
}

module.exports = InterviewController
