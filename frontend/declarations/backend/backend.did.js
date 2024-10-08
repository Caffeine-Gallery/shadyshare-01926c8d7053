export const idlFactory = ({ IDL }) => {
  const UmbrellaId = IDL.Nat;
  const Umbrella = IDL.Record({
    'id' : UmbrellaId,
    'status' : IDL.Text,
    'location' : IDL.Text,
  });
  return IDL.Service({
    'addUmbrella' : IDL.Func([IDL.Text], [UmbrellaId], []),
    'listAvailableUmbrellas' : IDL.Func([], [IDL.Vec(Umbrella)], ['query']),
    'reserveUmbrella' : IDL.Func([UmbrellaId], [IDL.Bool], []),
    'returnUmbrella' : IDL.Func([UmbrellaId], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
