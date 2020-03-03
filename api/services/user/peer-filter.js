const mongoose = require('mongoose')
class PeerFilter {
  constructor () {
    this.aggregate = []
  }

  addMatch (userid) {
    const $match = {
      $match: {
        $or: [{
          owner: mongoose.Types.ObjectId(userid)
        },
        {
          moderators: mongoose.Types.ObjectId(userid)
        }, {
          members: mongoose.Types.ObjectId(userid)
        }
        ]
      }
    }
    this.aggregate.push($match)
    return this
  }

  addProjectUsers () {
    const $project = {
      $project: {
        combined: {
          $setUnion: [
            ['$owner'],
            { $ifNull: ['$moderators', []] },
            { $ifNull: ['$members', []] }
          ]
        }
      }
    }
    this.aggregate.push($project)
    const $unwind = {
      $unwind: '$combined'
    }
    this.aggregate.push($unwind)
    const $group = {
      $group: {
        _id: 'null',
        usrs: { $addToSet: '$combined' }
      }
    }
    this.aggregate.push($group)
    const $project2 = {
      $project: { _id: 0, users: '$usrs' }
    }
    this.aggregate.push($project2)
    return this
  }

  addLookup () {
    this.aggregate.push({
      $lookup: {
        from: 'users',
        let: { users: '$users' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$users'] } } },
          {
            $lookup: {
              from: 'connections',
              let: { connections: '$connections' },
              pipeline: [
                { $match: { $expr: { $in: ['$_id', '$$connections'] } } }
              ],
              as: 'connections'
            }
          }
        ],
        as: 'peers'
      }
    })
    return this
  }

  addProjectPeers () {
    const $project = {
      $project: { _id: 0, peers: '$peers' }
    }
    this.aggregate.push($project)
    return this
  }

  getAggregate () {
    return this.aggregate
  }
}

module.exports = PeerFilter
