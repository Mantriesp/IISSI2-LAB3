import * as RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import * as RestaurantValidation from '../controllers/validation/RestaurantValidation.js'
import OrderController from '../controllers/OrderController.js'
import ProductController from '../controllers/ProductController.js'
import RestaurantController from '../controllers/RestaurantController.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(
      RestaurantController.index)
    .post(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.RESTAURANTS_FOLDER),
      RestaurantValidation.create,
      handleValidation,
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(RestaurantController.show)
    .put(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.RESTAURANTS_FOLDER),
      RestaurantValidation.update,
      handleValidation,
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantController.update)
    .delete(
      isLoggedIn,
      hasRole('owner'),
      RestaurantMiddleware.checkRestaurantOwnership,
      RestaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(
      isLoggedIn,
      hasRole('owner'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
      isLoggedIn,
      hasRole('owner'),
      RestaurantMiddleware.checkRestaurantOwnership,
      ProductController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
      isLoggedIn,
      hasRole('owner'),
      RestaurantMiddleware.checkRestaurantOwnership,
      OrderController.analytics)
}
export default loadFileRoutes
