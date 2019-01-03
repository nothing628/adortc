'use strict'

class CandidateController {
  index({ view }) {
    // list candidate list
    return view.render('candidate.index')
  }

  detail({ request, view }) {
    // show detail of candidate
    return view.render('candidate.detail')
  }
}

module.exports = CandidateController
