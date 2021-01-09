const mongoose = require('mongoose')
const config = require('roomler.config')
const Invite = require('../../models/invite')
const emailService = require('../email/email-service')
const roomService = require('../room/room-service')
const InviteFilter = require('./invite-filter')

class InviteService {
  // base methods - START
  async get (userid, id) {
    const inviteFilter = new InviteFilter({
      id
    })
    const aggregate = inviteFilter
      .addLookup()
      .addMatch(userid)
      .getAggregate()
    const record = await Invite
      .aggregate(aggregate)
      .exec()
      .then((records) => {
        if (!records.length) {
          throw new ReferenceError('Invite was not found.')
        }
        records[0].room = records[0].room[0]
        records[0].inviter = records[0].inviter[0]
        if (records[0].invitee && records[0].invitee.length) {
          records[0].invitee = records[0].invitee[0]
        } else {
          records[0].invitee = undefined
        }
        return records[0]
      })
    return record
  }

  async getAll (userid, page = 0, size = 10, filter = {}, sort = {
    createdAt: -1
  }) {
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const inviteFilter = new InviteFilter({
      filter
    })
    const aggregate = inviteFilter
      .addLookup()
      .addMatch(userid)
      .addSort(sort)
      .addSkip(pageInt * sizeInt)
      .addLimit(sizeInt)
      .getAggregate()

    const records = await Invite
      .aggregate(aggregate)
      .exec()
    records.forEach((record) => {
      record.room = record.room[0]
      record.inviter = record.inviter[0]
      if (record.invitee && record.invitee.length) {
        record.invitee = record.invitee[0]
      } else {
        record.invitee = undefined
      }
    })
    return records
  }

  async create (user, items) {
    items.forEach((item) => {
      item.inviter = mongoose.Types.ObjectId(user._id)
    })
    const records = await Invite
      .insertMany(items)
      .then((rows) => {
        return Promise.all(rows.map(async (row) => {
          const record = await row
            .populate('room')
            .populate('inviter')
            .populate('invitee')
            .populate('invitee.connections')
            .execPopulate()
          const acceptUrl = `${config.appSettings.env.URL}${config.authSettings.inviteAcceptPage}?invite=${row._id}`
          await emailService.send(user._id, {
            to: row.email,
            subject: 'You are invited to join this Room',
            template: 'room-invite.hbs',
            model: {
              name: row.name,
              username: user.username,
              roomname: record.room.name,
              acceptUrl
            }
          })
          return record
        }))
      })
    return records
  }

  async update (userid, id, update) {
    const options = {
      new: true
    }
    const inviteFilter = new InviteFilter({
      id
    })
    const aggregate = inviteFilter
      .addLookup()
      .addMatch(userid)
      .getAggregate()
    const record = await Invite
      .aggregate(aggregate)
      .exec()
      .then((records) => {
        if (!records.length) {
          throw new ReferenceError('Invite was not found.')
        }
        return Invite.findOneAndUpdate(inviteFilter.getFilter(), update, options)
          .populate('room')
          .populate('inviter')
          .populate('invitee')
          .populate('invitee.connections')
      })

    return record
  }

  async delete (userid, id) {
    const inviteFilter = new InviteFilter({
      id
    })
    const aggregate = inviteFilter
      .addLookup()
      .addMatch(userid)
      .getAggregate()
    const result = await Invite
      .aggregate(aggregate)
      .exec()
      .then((records) => {
        if (!records.length) {
          throw new ReferenceError('Invite was not found.')
        }
        return Invite.deleteOne(inviteFilter.getFilter())
          .exec()
      })
    return result
  }

  // base methods - END

  async accept (userid, id) {
    const invite = await this.get(null, id)

    const payload = {
      user: userid
    }
    await roomService.push(null, invite.room._id, `${invite.type}s`, payload)

    const update = {
      $set: {
        status: 'accepted',
        invitee: userid
      }
    }
    const record = await this.update(null, id, update)
    return record
  }

  async reject (userid, id) {
    const invite = await this.get(null, id)

    const payload = {
      user: userid
    }
    await roomService.pull(null, invite.room._id, `${invite.type}s`, payload)

    const update = {
      $set: {
        status: 'rejected'
      }
    }
    const record = await this.update(null, id, update)
    return record
  }
}

module.exports = new InviteService()
