import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import List "mo:base/List";
import Text "mo:base/Text";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
  // Types
  type UmbrellaId = Nat;
  type UserId = Principal;

  type Umbrella = {
    id: UmbrellaId;
    location: Text;
    status: Text;
  };

  type Reservation = {
    userId: UserId;
    umbrellaId: UmbrellaId;
    timestamp: Int;
  };

  // State
  stable var nextUmbrellaId : Nat = 0;
  let umbrellas = HashMap.HashMap<UmbrellaId, Umbrella>(10, Nat.equal, Nat.hash);
  let reservations = HashMap.HashMap<UmbrellaId, Reservation>(10, Nat.equal, Nat.hash);

  // Helper functions
  func generateUmbrellaId() : Nat {
    nextUmbrellaId += 1;
    nextUmbrellaId
  };

  // Add a new umbrella
  public func addUmbrella(location: Text) : async UmbrellaId {
    let id = generateUmbrellaId();
    let umbrella : Umbrella = {
      id;
      location;
      status = "available";
    };
    umbrellas.put(id, umbrella);
    id
  };

  // List all available umbrellas
  public query func listAvailableUmbrellas() : async [Umbrella] {
    let availableUmbrellas = Array.filter<Umbrella>(Iter.toArray(umbrellas.vals()), func (u) { u.status == "available" });
    availableUmbrellas
  };

  // Reserve an umbrella
  public shared(msg) func reserveUmbrella(umbrellaId: UmbrellaId) : async Bool {
    switch (umbrellas.get(umbrellaId)) {
      case (null) { false };
      case (?umbrella) {
        if (umbrella.status == "available") {
          let updatedUmbrella = {
            id = umbrella.id;
            location = umbrella.location;
            status = "reserved";
          };
          umbrellas.put(umbrellaId, updatedUmbrella);

          let reservation : Reservation = {
            userId = msg.caller;
            umbrellaId = umbrellaId;
            timestamp = Time.now();
          };
          reservations.put(umbrellaId, reservation);
          true
        } else {
          false
        }
      };
    }
  };

  // Return an umbrella
  public func returnUmbrella(umbrellaId: UmbrellaId) : async Bool {
    switch (umbrellas.get(umbrellaId)) {
      case (null) { false };
      case (?umbrella) {
        if (umbrella.status == "reserved") {
          let updatedUmbrella = {
            id = umbrella.id;
            location = umbrella.location;
            status = "available";
          };
          umbrellas.put(umbrellaId, updatedUmbrella);
          reservations.delete(umbrellaId);
          true
        } else {
          false
        }
      };
    }
  };
}
