import { Model } from 'objection';
import { Role } from './role';

export class User extends Model {
  phoneNumber: string;
  email: string;
  name: string;
  roleId: string;
  profilePhoto: string;
  roleType: string;

  static get tableName() {
    return 'user';
  }

  static get idColumn() {
    return 'public_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        phone_number: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string'},
      },
    };
  }

  static get relationMappings() {
    return {
      role: {
        modelClass: Role,
        relation: Model.HasOneRelation,
        join: {
          from: 'user.roleId',
          to: 'role.publicId',
        }
      }
    };
  }
}
