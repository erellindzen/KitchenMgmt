export class Ingredient {
    constructor(
        public id: number, 
        public title: string,
        public unitTitle: string,
        public canExpired: boolean,
        public domCardId: string,
        public domCollapseId: string,
        public domShippingId: string
    ){}
}
