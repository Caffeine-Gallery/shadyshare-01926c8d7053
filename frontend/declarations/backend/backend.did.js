export const idlFactory = ({ IDL }) => {
  const UmbrellaId = IDL.Nat;
  const Umbrella = IDL.Record({
    'id' : UmbrellaId,
    'status' : IDL.Text,
    'latitude' : IDL.Float64,
    'longitude' : IDL.Float64,
    'location' : IDL.Text,
  });
  const UserId = IDL.Principal;
  const User = IDL.Record({ 'id' : UserId, 'username' : IDL.Text });
  return IDL.Service({
    'addUmbrella' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Float64],
        [IDL.Opt(UmbrellaId)],
        [],
      ),
    'createUser' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'listAvailableUmbrellas' : IDL.Func([], [IDL.Vec(Umbrella)], ['query']),
    'login' : IDL.Func([], [IDL.Opt(User)], []),
    'reserveUmbrella' : IDL.Func([UmbrellaId], [IDL.Bool], []),
    'returnUmbrella' : IDL.Func([UmbrellaId], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
