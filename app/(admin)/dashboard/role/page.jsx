"use client";
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  IconButton,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { defineAbilitiesFor } from "@/lib/ability";
import { useRouter } from "next/navigation";

const Page = () => {
  const [roleLists, setRoleLists] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { data: session, status } = useSession();

  const ability = defineAbilitiesFor(session?.user);

  const router = useRouter();

  // Check for permissions on page load
  useEffect(() => {
    if (!ability.can("manage", "all") && !ability.can("create", "Role")) {
      router.replace("/not-permitted");
    }
  }, [ability, router]);
  // console.log("session data", sessiondata);
  const [permissions] = useState([
    "Update Order Status",
    "See Customers",
    "See Orders",
    "Create Roles",
    "Add Users",
  ]);

  // States for Add Role
  const [addName, setAddName] = useState("");
  const [addSelectedPermissions, setAddSelectedPermissions] = useState([]);

  // States for Edit Role
  const [editRole, setEditRole] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSelectedPermissions, setEditSelectedPermissions] = useState([]);
  const [editActive, setEditActive] = useState(true);

  // Fetch roles from the backend

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/role");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();
      const formattedData = data.map((role) => ({
        ...role,
        active: role.active || true, // Assuming roles have an 'active' field
      }));
      setRoleLists(formattedData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle Add Role Submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/role/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: addName,
        permissions: addSelectedPermissions,
        active: true, // Default to active
      }),
    });

    if (response.ok) {
      await fetchRoles();
      setOpenAddDialog(false);
      setAddName("");
      setAddSelectedPermissions([]);
    } else {
      console.error("Error adding role:", response);
    }
  };

  // Handle Edit Role Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/role/${editRole.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editName,
        permissions: editSelectedPermissions,
        //active: editActive,
      }),
    });

    if (response.ok) {
      await fetchRoles();
      setOpenEditDialog(false);
      setEditRole(null);
      setEditName("");
      setEditSelectedPermissions([]);
      setEditActive(true);
    } else {
      console.error("Error updating role:", response);
    }
  };

  // Handle Delete Role
  const handleDeleteRole = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    const response = await fetch(`/api/role/${roleId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setRoleLists((prev) => prev.filter((role) => role.id !== roleId));
    } else {
      console.error("Error deleting role:", response);
    }
  };

  // Handle Active Switch Toggle
  const handleToggleActive = async (role) => {
    const updatedRole = { ...role, active: !role.active };

    const response = await fetch(`/api/role/${role.id}`, {
      method: "PATCH", // Assuming PATCH for partial updates
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: updatedRole.active }),
    });

    if (response.ok) {
      setRoleLists((prev) =>
        prev.map((r) => (r.id === role.id ? updatedRole : r))
      );
    } else {
      console.error("Error updating role status:", response);
    }
  };

  // Open Edit Dialog with Role Data
  const handleOpenEditDialog = (role) => {
    setEditRole(role);
    setEditName(role.name);
    setEditSelectedPermissions(role.permissions);
    setEditActive(role.active);
    setOpenEditDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditRole(null);
    setEditName("");
    setEditSelectedPermissions([]);
    setEditActive(true);
  };

  // Handle Permission Change for Add
  const handleAddPermissionChange = (permission) => {
    setAddSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  // Handle Permission Change for Edit
  const handleEditPermissionChange = (permission) => {
    setEditSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  // Define Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Role Name",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ row }) => {
          const createdAt = new Date(row.original.createdAt);
          const date = createdAt.toLocaleDateString();

          return (
            <div>
              <p className="font-normal text-gray-500">{date}</p>
            </div>
          );
        },
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box display="flex" alignItems="center">
            {" "}
            <div className="flex justify-center items-center bg-[#ffecda] py-1 px-2 rounded-3xl">
              <p className="text-[#008000] text-base">Active</p>
              <Switch
                // checked={row.original.active}
                // onChange={() => handleToggleActive(row.original)}
                size="small"
                color="#008000"
              />
            </div>
            <IconButton
              color="#000"
              onClick={() => handleOpenEditDialog(row.original)}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              color="#000000"
              onClick={() => handleDeleteRole(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [] // Ensure columns update when roleLists changes
  );

  // Initialize Material React Table
  const table = useMaterialReactTable({
    columns,
    data: roleLists,
    enableColumnActions: false,
    enableSorting: false,
    enablePagination: false,
    enableTableFooter: false,
    enableStickyFooter: false,
    enableBottomToolbar: false,
    enableColumnFilterModes: true,
    manualFiltering: true,
    muiTableContainerProps: { sx: { border: 1, borderColor: "#e0e0e0" } },
    muiTablePaperProps: { sx: { px: 5, pt: 2, pb: 10 } },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        className="text-lg font-normal capitalize py-1.5 px-3 text-white bg-primary"
        onClick={() => setOpenAddDialog(true)}
        size="small"
      >
        Add Role
      </Button>
    ),
    muiTableHeadCellProps: () => ({
      sx: {
        backgroundColor: "#f6f6f6",
      },
    }),
  });

  return (
    <div className="p-8">
      <MaterialReactTable table={table} />

      {/* Dialog for Adding Role */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle
          className="text-center text-xl text-gray-500"
          sx={{ textAlign: "center" }}
        >
          Add Role
        </DialogTitle>

        <DialogContent className="w-[500px] py-5">
          <form
            onSubmit={handleAddSubmit}
            className="w-full flex flex-col items-center justify-center"
          >
            <TextField
              label="Name"
              className="mt-2"
              variant="outlined"
              size="small"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              required
            />
            <div className="w-full mt-4">
              <p className="text-gray-500 font-semibold text-xl mb-2">
                Permissions
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {permissions.map((permission) => (
                  <label key={permission} className="text-lg font-medium">
                    <input
                      type="checkbox"
                      value={permission}
                      checked={addSelectedPermissions.includes(permission)}
                      onChange={() => handleAddPermissionChange(permission)}
                      className="accent-primary w-4 h-4 mr-2 text-white border-primary"
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
            <button
              className="bg-primary text-white text-lg px-4 py-1 rounded-lg mt-5 font-bold"
              type="submit"
            >
              Add Role
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Editing Role */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle
          className="text-center text-xl text-gray-500"
          sx={{ textAlign: "center" }}
        >
          Edit Role
        </DialogTitle>

        <DialogContent className="w-[500px] py-5">
          <form
            onSubmit={handleEditSubmit}
            className="w-full flex flex-col items-center justify-center"
          >
            <TextField
              label="Name"
              className="mt-2"
              variant="outlined"
              size="small"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <div className="w-full mt-4">
              <p className="text-gray-500 font-semibold text-xl mb-2">
                Permissions
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {permissions.map((permission) => (
                  <label key={permission} className="text-lg font-medium">
                    <input
                      type="checkbox"
                      value={permission}
                      checked={editSelectedPermissions.includes(permission)}
                      onChange={() => handleEditPermissionChange(permission)}
                      className="accent-primary w-4 h-4 mr-2 text-white border-primary"
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
            <button
              className="bg-primary text-white text-lg px-4 py-1 rounded-lg mt-5 font-bold"
              type="submit"
            >
              Update
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;

// "use client";
// import { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// const Page = () => {
//   const [roleLists, setRoleLists] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [permissions] = useState([
//     "Update Order Status",
//     "See Customers",
//     "See Orders",
//     "Create Roles",
//     "Add Users",
//   ]);

//   const [name, setName] = useState("");
//   const [selectedPermissions, setSelectedPermissions] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch("/api/role/new", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: name,
//         permissions: permissions,
//       }),
//     });

//     if (response.ok) {
//       console.log("response in role", response);
//     } else {
//       console.log("error in response", response);
//     }
//     // Refresh or update the roles list as needed
//   };

//   const handlePermissionChange = (permission) => {
//     setSelectedPermissions((prev) =>
//       prev.includes(permission)
//         ? prev.filter((p) => p !== permission)
//         : [...prev, permission]
//     );
//   };

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };
//   // Fetch data from the backend
//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         const response = await fetch("/api/role");
//         if (!response.ok) {
//           throw new Error("Failed to fetch menu data");
//         }

//         const data = await response.json();
//         const formattedData = data.map((role) => ({
//           //  ...role,
//           name: role.name,
//           permissions: role.permissions,
//           createdAt: role.createdAt,
//         }));
//         console.log("formatted data in the role", formattedData);
//         setRoleLists(formattedData);
//         // setLoading(false);
//       } catch (error) {
//         console.error("Error fetching pizza data:", error);
//         setLoading(false);
//       }
//     };

//     fetchMenus();
//   }, []);
//   //should be memoized or stable
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name", //access nested data with dot notation
//         header: "Role Name",
//         size: 150,
//       },

//       {
//         accessorKey: "createdAt",
//         header: "Created At",
//         size: 150,
//         Cell: ({ row }) => {
//           const createdAt = new Date(row.original.createdAt);

//           // Extracting time and date
//           const time = createdAt.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }); // "HH:MM" format
//           const date = createdAt.toLocaleDateString(); // "MM/DD/YYYY" or based on locale

//           return (
//             <div>
//               <p className="font-normal text-gray-500"> {date} </p>
//             </div>
//           );
//         },
//       },

//       {
//         accessorKey: "permissions",
//         header: "Actions",
//         size: 150,
//       },
//     ],
//     []
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: roleLists, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//     enableColumnActions: false,
//     enableSorting: false,
//     enablePagination: false,
//     enableTableFooter: false,
//     enableStickyFooter: false,
//     enableBottomToolbar: false,
//     enableColumnFilterModes: true,
//     manualFiltering: true,
//     muiTableContainerProps: { sx: { border: 1, borderColor: "#e0e0e0" } },
//     muiTablePaperProps: { sx: { px: 5, pt: 2, pb: 10 } },
//     renderTopToolbarCustomActions: ({ table }) => (
//       <Button
//         className="text-lg font-normal capitalize py-1.5 px-3  text-white bg-primary "
//         onClick={() => handleOpenDialog()}
//         size="small"
//       >
//         Add Role
//       </Button>
//     ),

//     muiTableHeadCellProps: (table) => ({
//       sx: {
//         backgroundColor: "#f6f6f6",
//       },
//     }),
//   });

//   return (
//     <div className="p-8">
//       <MaterialReactTable table={table} />
//       {/* Dialog for Toppings Details */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle
//           className="relative items-center justify-center text-xl text-gray-500 "
//           sx={{ textAlign: "center", justifyContent: "center" }}
//         >
//           <span>Role</span>
//         </DialogTitle>

//         <DialogContent className="w-[500px]  py-20 ">
//           <form
//             onSubmit={handleSubmit}
//             className="w-full flex flex-col items-center justify-center"
//           >
//             <TextField
//               label="Name"
//               // id="filled-size-small"
//               className="mt-2 "
//               variant="outlined"
//               size="small"
//               onChange={(e) => setName(e.target.value)}
//             />
//             <br />
//             <div className="grid grid-cols-2 gap-x-6 gap-y-2">
//               <p className="text-gray-500 font-semibold text-xl mb-2 ">
//                 Permissions
//               </p>
//               <br />
//               {permissions.map((permission) => (
//                 <label key={permission} className="text-lg font-medium">
//                   <input
//                     type="checkbox"
//                     value={permission}
//                     checked={selectedPermissions.includes(permission)}
//                     onChange={() => handlePermissionChange(permission)}
//                     className=" accent-primary w-4 h-4 mr-2 text-white border-primary"
//                   />
//                   {permission}
//                 </label>
//               ))}
//             </div>
//             <button
//               className="bg-primary  text-white text-lg px-4 py-1 rounded-lg mt-5 font-bold"
//               type="submit"
//             >
//               Add Role
//             </button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Page;
