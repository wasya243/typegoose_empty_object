import { getModelForClass, modelOptions, prop, setGlobalOptions } from '@typegoose/typegoose'; // @typegoose/typegoose@11.4.0
import * as mongoose from 'mongoose'; // mongoose@7.4.0

setGlobalOptions({
  schemaOptions: {
    strict: 'throw'
  }
})

@modelOptions({ schemaOptions: { _id: false } })
class ObjSchema {}

@modelOptions({ schemaOptions: { _id: false, minimize: false } })
class UserManagement {
  @prop()
  public permissions_management?: ObjSchema;

  @prop()
  public acc_permissions?: ObjSchema;

  @prop()
  public qaa_permissions?: ObjSchema;
}

@modelOptions({ schemaOptions: { minimize: false } })
class UserPermissions {
  @prop()
  public superAdmin?: ObjSchema;

  @prop()
  public settings?: ObjSchema;

  @prop()
  public user_management?: UserManagement;
}

const UserPermissionsModel = getModelForClass(UserPermissions);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/test-from-guy`);

  const doc = await UserPermissionsModel.create({ superAdmin: { a: 'hello' }, settings: { b: 'sdf' }, user_management: { acc_permissions: { b: 'hello' } } });

  console.log('doc', doc);

  const found = await UserPermissionsModel.findById(doc).orFail();

  console.log('found', found);

  found.settings = { c: 'hello' };

  await found.save();

  console.log('found save', found);

  await mongoose.disconnect();
}

main();