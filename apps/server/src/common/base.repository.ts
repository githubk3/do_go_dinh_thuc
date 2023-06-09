import { Model, FilterQuery, QueryOptions, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc: any): Promise<any> {
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string | any, option?: QueryOptions): Promise<T | any> {
    return this.model.findById(id, option).lean();
  }

  async findByCondition(
    filter: any,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<any> {
    return this.model.findOne(filter, field, option).populate(populate).lean();
  }

  async getByCondition(
    filter: any,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  // paginate with type StackOverFlow
  async findAllWithPaginate(page: number, pageSize: number): Promise<T[]> {
    return this.model
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  // paginate with type StackOverFlow
  async getItemWithPaginateAndCondition(
    filter: any,
    page: number,
    pageSize: number,
  ): Promise<T[]> {
    return this.model
      .find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  }

  async deleteByCondition(filter: any) {
    return this.model.deleteMany(filter);
  }

  async findByConditionAndUpdate(filter: any, update: any) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, update);
  }

  async updateOne(filter: any, update: any, option?: any | null) {
    return this.model.updateOne(filter, update, option);
  }

  async updateMany(filter: any, update: any, option?: any | null) {
    return this.model.updateMany(filter, update, option);
  }

  async findByIdAndUpdate(id: any, update: any) {
    return this.model.findByIdAndUpdate(id, update);
  }

  async countWithCondition(filter: any) {
    return this.model.count(filter);
  }
}
