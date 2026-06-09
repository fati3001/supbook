export default async (policyContext, config, { strapi }) => {
  const user = policyContext.state.user
  if (!user) return false

  const { id } = policyContext.params
  if (!id) return true

  const book = await strapi.entityService.findOne('api::book.book', id, {
    populate: ['users_permissions_user'],
  })

  if (!book) return false

  return book.users_permissions_user?.id === user.id
}