import { connection } from '../config/database';
import { User, UserFilters, UserRespone } from '../types';

export class UserRepository {
  async create(user: Omit<User, 'id'>): Promise<UserRespone> {
    const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const [result] = await connection.execute(query, [user.name, user.email, user.age]);

    const insertResult = result as any;
    const newUser = await this.findById(insertResult.insertId);
    return newUser!;
  }

  async findAll(filters: UserFilters = {}): Promise<UserRespone[]> {
    let query = 'SELECT id, name, email, age FROM users WHERE deleted_at IS NULL';
    const params: (string | number)[] = [];

    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }

    if (filters.minAge) {
      query += ' AND age >= ?';
      params.push(filters.minAge);
    }

    if (filters.maxAge) {
      query += ' AND age <= ?';
      params.push(filters.maxAge);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await connection.execute(query, params);
    return rows as UserRespone[];
  }

  async findById(id: number): Promise<UserRespone | null> {
    const query = 'SELECT id, name, email, age FROM users WHERE id = ? AND deleted_at IS NULL';
    const [rows] = await connection.execute(query, [id]);
    const users = rows as UserRespone[];
    return users.length > 0 ? users[0] : null;
  }

  async checkExistEmail(email: string, excludeUserId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM users WHERE email = ? AND deleted_at IS NULL';
    const params: (string | number)[] = [email];

    if (excludeUserId) {
      query += ' AND id != ?';
      params.push(excludeUserId);
    }

    const [rows] = await connection.execute(query, params);
    return (rows as any)[0].count > 0;
  }

  async checkExistName(name: string, excludeUserId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM users WHERE name = ? AND deleted_at IS NULL';
    const params: (string | number)[] = [name];

    if (excludeUserId) {
      query += ' AND id != ?';
      params.push(excludeUserId);
    }

    const [rows] = await connection.execute(query, params);
    return (rows as any)[0].count > 0;
  }

  async update(id: number, user: Partial<User>): Promise<UserRespone | null> {
    const fields: string[] = [];
    const params: (string | number)[] = [];

    if (user.name) {
      fields.push('name = ?');
      params.push(user.name);
    }
    if (user.email) {
      fields.push('email = ?');
      params.push(user.email);
    }
    if (user.age !== undefined) {
      fields.push('age = ?');
      params.push(user.age);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    await connection.execute(query, params);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const query = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL';
    const [result] = await connection.execute(query, [id]);
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }
}
