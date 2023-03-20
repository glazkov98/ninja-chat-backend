import { User } from 'src/db/interfaces/user.interface';
import { Request } from 'express';

export interface RequestUser extends Request {
    user: User;
}