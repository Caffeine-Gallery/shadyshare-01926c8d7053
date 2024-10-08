import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Umbrella {
  'id' : UmbrellaId,
  'status' : string,
  'latitude' : number,
  'longitude' : number,
  'location' : string,
}
export type UmbrellaId = bigint;
export interface User { 'id' : UserId, 'username' : string }
export type UserId = Principal;
export interface _SERVICE {
  'addUmbrella' : ActorMethod<[string, number, number], [] | [UmbrellaId]>,
  'createUser' : ActorMethod<[string], boolean>,
  'listAvailableUmbrellas' : ActorMethod<[], Array<Umbrella>>,
  'login' : ActorMethod<[], [] | [User]>,
  'reserveUmbrella' : ActorMethod<[UmbrellaId], boolean>,
  'returnUmbrella' : ActorMethod<[UmbrellaId], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
