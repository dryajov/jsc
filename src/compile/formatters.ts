import { Local } from './locals';
import { Type } from './type';

export function v8String(local: Local | string) {
  if (typeof local === 'string') {
    return `String::NewFromUtf8(isolate, "${local}")`;
  }

  if (local.type === Type.V8String) {
    return local.name;
  }

  return `toString(${local.name})`;
}

export function number(local: Local) {
  if (local.type === Type.V8Number) {
    return `${local.name}->Value()`;
  }

  return `toNumber(${local.name})`;
}

export function v8Number(local: Local | string) {
  if (typeof local === 'string') {
    return `Number::New(isolate, ${local})`;
  }

  if (local.type === Type.V8Number) {
    return local.name;
  }

  return `Number::New(isolate, toNumber(${local.name}))`;
}

export function v8Boolean(local: Local | string | boolean) {
  if (typeof local === 'string') {
    return `${local} ? True(isolate) : False(isolate)`;
  }

  if (typeof local === 'boolean') {
    return local ? 'True(isolate)' : 'False(isolate)';
  }

  if (local.type === Type.V8Boolean) {
    return local.name;
  }

  return `toBoolean(${local.name}) ? True(isolate) : False(isolate)`;
}

export function boolean(local: Local) {
  if (local.type === Type.V8Boolean) {
    return `${local.name}->IsTrue()`;
  }

  return `toBoolean(${local.name})`;
}

export function cast(targetLocal: Local, castingLocal: Local, assign?: boolean) {
  if (targetLocal.type !== castingLocal.type && targetLocal.initialized) {
    const type = targetLocal.type === Type.V8String ? 'String' :
		 targetLocal.type === Type.V8Number ? 'Number' :
		 targetLocal.type === Type.V8Boolean ? 'Boolean' :
		 targetLocal.type === Type.V8Array ? 'Array' :
		 targetLocal.type === Type.V8Object ? 'Object' :
		 targetLocal.type === Type.V8Function ? 'Function' :
		 'Value';
    if (assign) {
      targetLocal.type = castingLocal.type;
    }

    return `Local<${type}>::Cast(${castingLocal.name})`;
  } else if (assign) {
    targetLocal.type = castingLocal.type;
    return castingLocal.name;
  }
}

export function plus(l: Local, r: Local) {
  if (l.type === Type.V8String || r.type === Type.V8String) {
    // If either is a string, it must be a string.
    return `stringPlus(isolate, ${l.name}, ${r.name})`;
  } else if (l.type === Type.V8Number) {
    return `numberPlus(isolate, ${l.name}, ${r.name})`;
  }

  return `genericPlus(isolate, ${l.name}, ${r.name})`;
}