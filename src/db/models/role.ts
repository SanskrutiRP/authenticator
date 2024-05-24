import { Model } from 'objection';

export class Role extends Model {
  displayName: string;
  roleSlug: string;
  roleType: string;
  publicId: string;
  static get tableName() {
    return 'role';
  }

  static get idColumn() {
    return 'public_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        role_type: { type: 'string' },
        role_slug: { type: 'string' },
        display_name: { type: 'string'},
      },
    };
  }
}
