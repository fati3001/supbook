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
    return super.update(ctx)
  },

  async delete(ctx) {
    return super.delete(ctx)
  },
}))