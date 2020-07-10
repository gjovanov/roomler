class RoomExploreFilter {
  constructor (search, page, size) {
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const $match = {
      $and: [
        { is_open: true },
        { path: { $regex: /^((?!\.).)*$/ } }
      ]
    }
    let $sort = { size: -1 }
    const $project = {
      owner: 1,
      name: 1,
      path: 1,
      is_open: 1,
      tags: 1,
      description: 1,
      moderators: 1,
      members: 1,
      size: { $add: [{ $size: '$moderators' }, { $size: '$members' }] }
    }
    if (search) {
      $match.$and.push({
        $or: [
          { $text: { $search: search } },
          { name: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ]
      })
      $sort = { score: { $meta: 'textScore' } }
      $project.score = { $meta: 'textScore' }
    }
    this.filter = [
      {
        $match
      },
      {
        $project
      },
      {
        $sort
      },
      {
        $facet: {
          data: [
            { $skip: pageInt * sizeInt },
            { $limit: sizeInt }
          ],
          count: [
            { $group: { _id: null, count: { $sum: 1 } } }
          ]
        }
      }
    ]
  }

  getFilter () {
    return this.filter
  }
}

module.exports = RoomExploreFilter
