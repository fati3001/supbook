import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::library-collection.library-collection', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user
    const response = await super.create(ctx)
    if (response?.data?.documentId) {
      await strapi.documents('api::library-collection.library-collection').update({
        documentId: response.data.documentId,
        data: { users_permissions_user: user.id } as any,
      })
    }
    return response
  },

  async update(ctx) {
    const user = ctx.state.user
    const { id } = ctx.params
    const collection = await strapi.documents('api::library-collection.library-collection').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    }) as any
    if (!collection || collection.users_permissions_user?.id !== user.id) {
      return ctx.forbidden()
    }
    return super.update(ctx)
  },

  async delete(ctx) {
    const user = ctx.state.user
    const { id } = ctx.params
    const collection = await strapi.documents('api::library-collection.library-collection').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    }) as any
    if (!collection || collection.users_permissions_user?.id !== user.id) {
      return ctx.forbidden()
    }
    return super.delete(ctx)
  },
}))