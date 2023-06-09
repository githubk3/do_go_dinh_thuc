import { RoomCreateDto } from './../dto/room.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RoomRepository } from '../repositories/room.repository';
import { Room } from '../schemas/room.schema';
import { Types } from 'mongoose';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createRoom(roomCreateDto: RoomCreateDto): Promise<any> {
    const checkExist = await this.roomRepository.findByCondition({
      title: {
        $regex: roomCreateDto.title,
        $options: 'i',
      },
    });

    if (checkExist) {
      throw new HttpException('Room already exist!', HttpStatus.NOT_ACCEPTABLE);
    }

    return await this.roomRepository.create(roomCreateDto);
  }

  async getRoomAll(): Promise<Room[]> {
    return await this.roomRepository.findAll();
  }

  async getRoomById(roomId: string): Promise<Room> {
    //check id có hợp lệ với kiểu ObjectId lưu trong db không ?
    if (!Types.ObjectId.isValid(roomId)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new HttpException('Room not exist', HttpStatus.NOT_FOUND);
    }

    return room;
  }

  async updateRoomById(roomId: string, payload: RoomCreateDto): Promise<any> {
    const room = await this.getRoomById(roomId);
    await this.roomRepository.updateOne({ _id: room._id }, payload);

    return {
      status: 'Succesfull',
      message: 'Updated',
    };
  }

  async deleteRoomById(roomId: string): Promise<any> {
    const room = await this.getRoomById(roomId);
    // Đoạn này sẽ cần check thêm liệu room này có đang chứa category nào không?
    // Nếu không thì mới xóa
    const countCategoryInThisRoom =
      await this.categoryRepository.countWithCondition({
        roomId,
      });

    if (countCategoryInThisRoom > 0) {
      throw new HttpException(
        `Can't delete room which exist ${countCategoryInThisRoom} categories!`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.roomRepository.deleteOne(room._id);

    return {
      status: 'Successfully!',
      message: 'Deleted',
    };
  }
}
