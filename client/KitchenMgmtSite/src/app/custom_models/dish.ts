export class Dish {
    constructor(
        public id: number, 
        public title: string,
        public preperationSteps: Array<string>,
        public duration: number,
        public ingerdients: Array<{id: number, quantity: number, title: string, unitTitle: string, existInStock: boolean, belowThreshold: boolean}>,
        public numberOfDines: number,
        public imageUrl: string,
        public categoryId: number,
        public videoGuide: string
    ){}
}
