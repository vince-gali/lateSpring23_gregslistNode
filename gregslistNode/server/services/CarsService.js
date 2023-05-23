import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class CarsService {

    async getCars(query) {
        // NOTE the mongoose find method requires the argument to be formatted as an object
        const cars = await dbContext.Cars.find(query)
        return cars
    }

    async getCarById(carId) {
        const car = await dbContext.Cars.findById(carId)
        // NOTE we call this null checking....throw an error if there was no car with that id in the database
        if (!car) {
            throw new BadRequest("Unable to find car by id")
        }
        return car
    }

    async createCar(carData) {
        // NOTE this is the database equivalent of pushing a new instance into the AppState
        const newCar = await dbContext.Cars.create(carData)
        return newCar
    }

    async editCar(carData, carId, userId) {
        // NOTE call my findById method to perfom the null check
        const originalCar = await this.getCarById(carId)

        // NOTE check to see if the user sending the request has the right to edit it
        // NOTE is the person logged in the person who created this car?
        if (originalCar.creatorId != userId) {
            throw new Forbidden("Unauthorized to edit that car")
        }

        // NOTE after finding the orig car in the database, we want to assign the edits from the carData

        // NOTE this is called null coalescence.... we do not want to overwrite our data to null or undefined, so we perform a safety and say if the carData is null, default to the original
        originalCar.model = carData.model || originalCar.model
        // originalCar.make = carData.make ? carData.make : originalCar.make //NOTE another way of performing null coalescence
        originalCar.make = carData.make || originalCar.make
        originalCar.engineType = carData.engineType || originalCar.engineType
        originalCar.year = carData.year || originalCar.year
        originalCar.description = carData.description || originalCar.description

        // NOTE with bools...ALWAYS do a ternary
        // NOTE because bools are true/false...we don't want to rely on truthy/falsy, if we do, it may always default to false
        originalCar.leaksOil = carData.leaksOil ? carData.leaksOil : originalCar.leaksOil


        await originalCar.save() //NOTE after overwriting the changes, make sure to save in the database
        return originalCar
    }

    async deleteCar(carId, userId) {

        //    await dbContext.Cars.findByIdAndDelete(carId)
        //     return

        const car = await this.getCarById(carId)

        // NOTE check to see if the person sending the request has the right to delete it
        if (car.creatorId != userId) {
            throw new Forbidden("Unauthorized to edit that car")
        }

        await car.remove()
        return
    }


}

export const carsService = new CarsService()