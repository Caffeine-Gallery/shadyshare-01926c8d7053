import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Umbrella {
  'id' : UmbrellaId,
  'status' : string,
  'location' : string,
}
export type UmbrellaId = bigint;
export interface _SERVICE {
  'addUmbrella' : ActorMethod<[string], UmbrellaId>,
  'listAvailableUmbrellas' : ActorMethod<[], Array<Umbrella>>,
  'reserveUmbrella' : ActorMethod<[UmbrellaId], boolean>,
  'returnUmbrella' : ActorMethod<[UmbrellaId], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
