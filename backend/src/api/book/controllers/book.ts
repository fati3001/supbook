import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::book.book', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user
    const response = await super.create(ctx)
    if (response?.data?.documentId) {
      await strapi.documents('api::book.book').update({
        documentId: response.data.documentId,
        data: { users_permissions_user: user.id } as any,
      })
    }
    return response
  },

  async update(ctx) {
    const user = ctx.state.user
    const { id } = ctx.params
    const book = await strapi.documents('api::book.book').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    }) as any
    if (!book || book.users_permissions_user?.id !== user.id) {
      return ctx.forbidden()
    }
    return super.update(ctx)
  },

  async delete(ctx) {
    const user = ctx.state.user
    const { id } = ctx.params
    const book = await strapi.documents('api::book.book').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    }) as any
    if (!book || book.users_permissions_user?.id !== user.id) {
      return ctx.forbidden()
    }
    return super.delete(ctx)
  },
}))