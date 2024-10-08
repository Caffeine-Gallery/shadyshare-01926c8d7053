import Bool "mo:base/Bool";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import List "mo:base/List";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";

actor {
  // Types
  type UmbrellaId = Nat;
  type UserId = Principal;

  type Umbrella = {
    id: UmbrellaId;
    location: Text;
    latitude: Float;
    longitude: Float;
    status: Text;
  };

  type Reservation = {
    userId: UserId;
    umbrellaId: UmbrellaId;
    timestamp: Int;
  };

  type User = {
    id: UserId;
    username: Text;
  };

  // State
  stable var nextUmbrellaId : Nat = 0;
  let umbrellas = HashMap.HashMap<UmbrellaId, Umbrella>(10, Nat.equal, Nat.hash);
  let reservations = HashMap.HashMap<UmbrellaId, Reservation>(10, Nat.equal, Nat.hash);
  let users = HashMap.HashMap<UserId, User>(10, Principal.equal, Principal.hash);

  // Helper functions
  func generateUmbrellaId() : Nat {
    nextUmbrellaId += 1;
    nextUmbrellaId
  };

  // User management
  public shared(msg) func createUser(username: Text) : async Bool {
    let userId = msg.caller;
    if (Option.isSome(users.get(userId))) {
      return false; // User already exists
    };
    let newUser : User = {
      id = userId;
      username = username;
    };
    users.put(userId, newUser);
    true
  };

  public shared(msg) func login() : async ?User {
    users.get(msg.caller)
  };

  // Add a new umbrella
  public shared(msg) func addUmbrella(location: Text, latitude: Float, longitude: Float) : async ?UmbrellaId {
    switch (users.get(msg.caller)) {
      case (null) { null };
      case (?_) {
        let id = generateUmbrellaId();
        let umbrella : Umbrella = {
          id;
          location;
          latitude;
          longitude;
          status = "available";
        };
        umbrellas.put(id, umbrella);
        ?id
      };
    }
  };

  // List all available umbrellas
  public query func listAvailableUmbrellas() : async [Umbrella] {
    let availableUmbrellas = Array.filter<Umbrella>(Iter.toArray(umbrellas.vals()), func (u) { u.status == "available" });
    availableUmbrellas
  };

  // Reserve an umbrella
  public shared(msg) func reserveUmbrella(umbrellaId: UmbrellaId) : async Bool {
    switch (users.get(msg.caller)) {
      case (null) { false };
      case (?_) {
        switch (umbrellas.get(umbrellaId)) {
          case (null) { false };
          case (?umbrella) {
            if (umbrella.status == "available") {
              let updatedUmbrella = {
                id = umbrella.id;
                location = umbrella.location;
                latitude = umbrella.latitude;
                longitude = umbrella.longitude;
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
    }
  };

  // Return an umbrella
  public shared(msg) func returnUmbrella(umbrellaId: UmbrellaId) : async Bool {
    switch (users.get(msg.caller)) {
      case (null) { false };
      case (?_) {
        switch (umbrellas.get(umbrellaId)) {
          case (null) { false };
          case (?umbrella) {
            if (umbrella.status == "reserved") {
              let updatedUmbrella = {
                id = umbrella.id;
                location = umbrella.location;
                latitude = umbrella.latitude;
                longitude = umbrella.longitude;
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
  };
}
