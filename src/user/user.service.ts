import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './schemas/user.entity';
import { UserRepository } from './repository/user.repository';
import { QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name); // Initialize logger

  constructor(private readonly userRepository: UserRepository) {}

  // Register a new user
  async registerUser(userData: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.createUser(userData);
      this.logger.log(`User registered successfully with email: ${user.email}`);
      return user;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key value')
      ) {
        this.logger.warn(
          `User registration failed. Email already exists: ${userData.email}`,
        );
        throw new ConflictException('Email already exists');
      }
      this.handleUnexpectedError(error, 'registerUser');
    }
  }

  // Find a user by their email address
  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      this.handleUnexpectedError(error, 'findUserByEmail');
    }
  }

  // Update a user's details
  async updateUser(user: User): Promise<User> {
    try {
      const updatedUser = await this.userRepository.updateUser(user);
      this.logger.log(`User updated successfully with email: ${user.email}`);
      return updatedUser;
    } catch (error) {
      this.handleUnexpectedError(error, 'updateUser');
    }
  }

  async updateProfile(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only update allowed fields, ignoring email and role
    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.hospitalId = updateUserDto.hospitalId ?? user.hospitalId;
    user.phoneNumber = updateUserDto.phoneNumber ?? user.phoneNumber;

    await this.userRepository.updateUser(user);
    const { id, password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Change a user's password
  async changePassword(email: string, newPassword: string): Promise<void> {
    try {
      if (!newPassword || newPassword.length < 6) {
        this.logger.warn(
          `Password change failed for email: ${email}. Invalid password.`,
        );
        throw new BadRequestException(
          'Password must be at least 6 characters long',
        );
      }

      // Find the user by email
      const user = await this.findUserByEmail(email);

      // Hash the new password and update the user record
      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updateUser(user);

      this.logger.log(
        `Password changed successfully for user with email: ${email}`,
      );
    } catch (error) {
      this.handleUnexpectedError(error, 'changePassword');
    }
  }

  // Save a user's search query
  async saveSearch(email: string, searchQuery: string): Promise<void> {
    try {
      const userSearch = await this.userRepository.findByEmailSearch(email);

      if (!userSearch) {
        // Create a new search record if it doesn't exist
        await this.userRepository.saveSearch({
          email,
          searchQueries: [searchQuery],
        });
        this.logger.log(`Search query saved for new user with email: ${email}`);
      } else if (!userSearch.searchQueries.includes(searchQuery)) {
        // Add search query if it's not already saved
        userSearch.searchQueries.push(searchQuery);
        await this.userRepository.saveSearch(userSearch);
        this.logger.log(`Search query updated for user with email: ${email}`);
      }
    } catch (error) {
      this.handleUnexpectedError(error, 'saveSearch');
    }
  }

  // Get the user's past search queries (up to the last 5)
  async getPastSearches(email: string): Promise<string[]> {
    try {
      const userSearch = await this.userRepository.getPastSearches(email);
      if (!userSearch || !userSearch.searchQueries) {
        this.logger.log(
          `No search history found for user with email: ${email}`,
        );
        return []; // Return an empty array if there are no search results
      }

      this.logger.log(`Search history retrieved for user with email: ${email}`);
      return userSearch.searchQueries.slice(-5).reverse();
    } catch (error) {
      this.handleUnexpectedError(error, 'getPastSearches');
    }
  }

  // Handle unexpected errors
  private handleUnexpectedError(error: any, methodName: string): void {
    this.logger.error(`Unexpected error in ${methodName}: ${error.message}`);
    throw new InternalServerErrorException(
      'An unexpected error occurred. Please try again later.',
    );
  }
}
