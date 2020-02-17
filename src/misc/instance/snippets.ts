import { IInstance } from './interfaces';
import { Instance } from './implementation';


export function $super<TInstance extends object, TPrototype extends object>(instance: TInstance, superClass: Function = instance.constructor): IInstance<TInstance, TInstance> {
  return new Instance<TInstance, TInstance>(instance, superClass.prototype);
}
