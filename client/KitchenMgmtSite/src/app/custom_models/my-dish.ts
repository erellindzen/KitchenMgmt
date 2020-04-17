export class MyDish {
    constructor(
        public id: number,
        public dishId: number,
        public dishTitle: string,
        public established: Date,
        public cookedDate: Date,
        public userId: number,
        public userFullName: string
    ){}
}
