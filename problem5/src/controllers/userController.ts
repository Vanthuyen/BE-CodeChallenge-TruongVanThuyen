import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ApiResponse, UserFilters } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'User created successfully',
        data: user
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Failed to create user'
      };
      res.status(400).json(response);
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: UserFilters = {
        name: req.query.name as string,
        email: req.query.email as string,
        minAge: req.query.minAge ? parseInt(req.query.minAge as string) : undefined,
        maxAge: req.query.maxAge ? parseInt(req.query.maxAge as string) : undefined,
      };

      const users = await this.userService.getAllUsers(filters);
      const response: ApiResponse = {
        success: true,
        message: 'Users retrieved successfully',
        data: users
      };
      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Internal Server Error'
      };
      res.status(500).json(response);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: user
      };
      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Internal Server Error'
      };
      res.status(400).json(response);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.updateUser(id, req.body);
      
      const response: ApiResponse = {
        success: true,
        message: 'User updated successfully',
        data: user
      };
      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Internal Server Error'
      };
      res.status(400).json(response);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.userService.deleteUser(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully'
      };
      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || 'Internal Server Error'
      };
      res.status(400).json(response);
    }
  };
}