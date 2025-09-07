import { BadRequestException, ConflictException, NotFoundException } from '../exception/exception';
import { UserRepository } from '../repositories/userRepository';
import { User, UserFilters, UserRespone } from '../types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: Omit<User, 'id'>): Promise<UserRespone> {
    await this.validateUser(userData);
    return await this.userRepository.create(userData);
  }

  async getAllUsers(filters: UserFilters): Promise<UserRespone[]> {
    return await this.userRepository.findAll(filters);
  }

  async getUserById(id: number): Promise<UserRespone | null> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return await this.userRepository.findById(id);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<UserRespone | null> {
    await this.validateUser(userData, id);
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.delete(id);
  }

  async validateUser(userData: Partial<User>, excludeUserId?: number): Promise<void> {
    if (excludeUserId) {
      if (excludeUserId <= 0) {
        throw new BadRequestException('Invalid user ID');
      }
      const existingUser = await this.userRepository.findById(excludeUserId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
    }
    if (!userData.name || !userData.email || !userData.age) {
      throw new BadRequestException('Name, email, and age are required');
    }
    if (userData.email) {
      const emailExists = await this.userRepository.checkExistEmail(userData.email, excludeUserId);
      if (emailExists) {
        throw new ConflictException ('Email already exists');
      }
    }
    if (userData.name) {
      const nameExists = await this.userRepository.checkExistName(userData.name, excludeUserId);
      if (nameExists) {
        throw new ConflictException ('Name already exists');
      }
    }
    if (userData.age !== undefined && (userData.age < 0 || userData.age > 150)) {
      throw new BadRequestException('Age must be between 0 and 150');
    }
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      throw new BadRequestException('Invalid email format');
    }
  }
}
