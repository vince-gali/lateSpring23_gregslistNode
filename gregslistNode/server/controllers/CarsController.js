import { Auth0Provider } from "@bcwdev/auth0provider";
import { carsService } from "../services/CarsService.js";
import BaseController from "../utils/BaseController.js";


export class CarsController extends BaseController {
    constructor() {
        super('api/cars')
        this.router
            .get('', this.getCars)
            .get('/:carId', this.getCarById)
            // ANCHOR this is what we call 'middleware'
            // NOTE this grabs the bearer token and userInfo from Auth0 to authenticate the user who made the request
            // ANCHOR we also refer to this as an 'auth guard' meaning any request beneath this, the user MUST be authenticated in order to call
            .use(Auth0Provider.getAuthorizedUserInfo)
            .post('', this.createCar)
            .put('/:carId', this.editCar)
            .delete('/:carId', this.deleteCar)
    }

    async getCars(request, response, next) {
        try {
            // NOTE think of 'query' like a search....when I send a query(search) it comes in on the request
            const query = request.query
            const cars = await carsService.getCars(query)
            return response.send(cars)
        } catch (error) {
            next(error)
        }
    }

    async getCarById(req, res, next) {
        try {
            const carId = req.params.carId
            const car = await carsService.getCarById(carId)
            // const car = await carsService.getCarById(req.params.carId)
            return res.send(car)
        } catch (error) {
            next(error)
        }
    }

    async createCar(req, res, next) {
        try {
            const carData = req.body
            carData.creatorId = req.userInfo.id //NOTE grab the id from the user making the request and assign it to the car being created
            const newCar = await carsService.createCar(carData)
            res.send(newCar)
        } catch (error) {
            next(error)
        }
    }

    async editCar(req, res, next) {
        try {
            const carData = req.body
            const carId = req.params.carId
            const userId = req.userInfo.id //NOTE grab the id of the user making the request
            const editedCar = await carsService.editCar(carData, carId, userId)
            res.send(editedCar)
        } catch (error) {
            next(error)
        }
    }

    async deleteCar(req, res, next) {
        try {
            const carId = req.params.carId
            const userId = req.userInfo.id
            await carsService.deleteCar(carId, userId)
            return res.send(`Car at ${carId} was deleted!`)
        } catch (error) {
            next(error)
        }
    }


}