export class ProfileResponseDto {
  id!: string;
  phoneNumber!: string;
  username!: string;
  birthday!: Date;
  gender!: string;
  tennisLevel!: string;
  deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static fromUser(user: any): ProfileResponseDto {
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      username: user.username,
      birthday: user.birthday,
      gender: user.gender,
      tennisLevel: user.tennisLevel,
      deleted: user.deleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}