"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["DRIVER"] = "DRIVER";
})(UserRole || (exports.UserRole = UserRole = {}));
var FreightStatus;
(function (FreightStatus) {
    FreightStatus["REQUESTED"] = "REQUESTED";
    FreightStatus["ACCEPTED"] = "ACCEPTED";
    FreightStatus["IN_PROGRESS"] = "IN_PROGRESS";
    FreightStatus["FINISHED"] = "FINISHED";
    FreightStatus["CANCELED"] = "CANCELED";
})(FreightStatus || (exports.FreightStatus = FreightStatus = {}));
