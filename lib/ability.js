import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user?.roles?.includes("superadmin")) {
    can("manage", "all"); // Superadmin can do everything
  } else {
    // Define abilities based on permissions
    if (user?.permissions?.includes("Update Order Status")) {
      can("update", "Order");
    }
    if (user?.permissions?.includes("See Customers")) {
      can("read", "Customer");
    }
    if (user?.permissions?.includes("See Orders")) {
      can("read", "Order");
    }
    if (user?.permissions?.includes("Create Roles")) {
      can("create", "Role");
    }
    if (user?.permissions?.includes("Create Menu")) {
      can("create", "Menu");
    }
    if (user?.permissions?.includes("Add Users")) {
      can("create", "User");
    }
    // Add more permissions as needed
  }

  return build(); // Use the build method instead of returning rules directly
}
