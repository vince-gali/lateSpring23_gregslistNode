import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"


class HousesService{
    async editHouse(houseData, houseId, userId) {
        const originalHouse = await this.getHouseById(houseId)
        if(originalHouse.creatorId != userId){
            throw new Forbidden("Unauthorized to edit that house")
        }
        originalHouse.bedrooms = houseData.bedrooms || originalHouse.bedrooms
        originalHouse.bathrooms = houseData.bathrooms || originalHouse.bathrooms
        originalHouse.yearBuild = houseData.yearBuild || originalHouse.yearBuild
        originalHouse.price = houseData.price || originalHouse.price
        originalHouse.description = houseData.description || originalHouse.description

        await originalHouse.save()
        return originalHouse
    }
    async deleteHouse(houseId, userId) {
        const house = await this.getHouseById(houseId)
        if(house.creatorId != userId){
            throw new Forbidden("Unauthorized to edit that car")
        }
        await house.remove()
        return
    }
    async getHouseById(houseId) {
        const house = await dbContext.Houses.findById(houseId)
        if (!house){
            throw new BadRequest("Unable to find house by id")
        }
        return house
    }
    async createHouse(houseData) {
        const newHouse = await dbContext.Houses.create(houseData)
        return newHouse
    }
    async getHouses(query) {
        const houses = await dbContext.Houses.find(query)
        return houses
    }

}

export const housesService = new HousesService()