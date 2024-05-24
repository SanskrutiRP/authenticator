import { Role } from './db/models/role';
import { User } from './db/models/user';

class Error {
  type: string;
  message: string;
}

export class Errors {
  errors: Error[];
}

export class ResponseObject {
  data: User | Role | string | User[];
}
