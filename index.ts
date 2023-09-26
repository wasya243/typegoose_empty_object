import {getModelForClass, prop, PropType, Severity, modelOptions, setGlobalOptions} from '@typegoose/typegoose';
import { IGlobalOptions } from '@typegoose/typegoose/lib/types';
import * as mongoose from 'mongoose';

const typegooseGlobalOptions: IGlobalOptions = {
  schemaOptions: {
    strict: 'throw'
  },
  // warn about mixed by default
  options: {
    allowMixed: Severity.WARN
  }
};

setGlobalOptions(typegooseGlobalOptions);

// Define the sub-schema
class EmptySchema {}

// Define the user management sub-schema
class UserManagement {
  @prop({ _id: false })
  permissions_management?: EmptySchema;

  @prop({ _id: false })
  acc_permission?: EmptySchema;

  @prop({ _id: false })
  qaa_permission?: EmptySchema;
}

// Define the main schema
class UsersPermissions {
  @prop({ _id: false })
  superAdmin?: EmptySchema;

  @prop({ _id: false })
  settings?: EmptySchema;

  @prop({ _id: false, type: () => UserManagement })
  user_management?: UserManagement;
}

const UserPermissionsModel = getModelForClass(UsersPermissions, {
  schemaOptions: {
    minimize: false,
  }
});

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/', {dbName: 'test-empty-object'});

    // will fail, 'cause of StrictModeError
    const uP = new UserPermissionsModel({
      superAdmin: {
        a: 1
      },
      settings: {
        b: 2
      },
      user_management: {
        permissions_management: {
          a: 1
        },
        acc_permission: {
          b: 1
        },
        qaa_permission: {
          a: 'v'
        }
      }
    })

    await uP.save();

    process.exit(0);
  } catch (err) {
    console.log('err', err);
    process.exit(1);
  }
}

main();