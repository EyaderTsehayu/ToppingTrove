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
  DialogContent,
  Switch,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../../../../components/ui/CustomInput";
import { useSession } from "next-auth/react";
import succes from "/public/images/succes.png";
import Image from "next/image";
import { defineAbilitiesFor } from "@/lib/ability";
import { useRouter } from "next/navigation";

// Zod schema for validation
const registrationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  location: z.string().min(1, { message: "Location is required" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.number().min(1, { message: "Role is required" }),
});

const Page = () => {
  const [userLists, setUserLists] = useState([]);
  const [roleLists, setRoleLists] = useState([]);

  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSuccesDialog, setOpenSuccesDialog] = useState(false);

  const { data: session } = useSession();
  const loginResId = session?.user.restaurantId;
  const ability = defineAbilitiesFor(session?.user);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    if (
      !ability.can("manage", "all") &&
      !ability.can("create", "User") &&
      !ability.can("read", "Customer")
    ) {
      router.replace("/not-permitted");
    }
  }, [ability, router]);

  const fetchUsers = async (query = "") => {
    try {
      const response = await fetch(
        `/api/user/restaurant-users?search=${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUserLists(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
    fetchUsers(searchQuery);
    fetchRoles();
  }, [searchQuery]); // Fetch users on search query change

  const onSubmit = async (data) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        restaurantId: loginResId,
        roles: data.role,
      }),
    });

    if (response.ok) {
      await fetchUsers();
      setOpenAddDialog(false);
      setOpenSuccesDialog(true);
    } else {
      console.log("Registration Failed", response);
    }
  };

  // const handleDeleteRole = async (roleId) => {
  //   if (!confirm("Are you sure you want to delete this role?")) return;

  //   const response = await fetch(`/api/role/${roleId}`, { method: "DELETE" });
  //   if (response.ok) {
  //     setUserLists((prev) => prev.filter((role) => role.id !== roleId));
  //   } else {
  //     console.error("Error deleting role:", response);
  //   }
  // };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", size: 150 },
      { accessorKey: "phoneNumber", header: "Phone Number", size: 150 },
      { accessorKey: "email", header: "Email", size: 150 },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box display="flex" alignItems="center">
            <div className="flex justify-center items-center bg-[#ffecda] py-1 px-2 rounded-3xl">
              <p className="text-[#008000] text-base">Active</p>
              <Switch size="small" color="#008000" />
            </div>
            <IconButton
              color="#000000"
              //  onClick={() => handleDeleteRole(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: userLists,
    enableColumnActions: false,
    enableSorting: false,
    enablePagination: false,
    enableTableFooter: false,
    enableStickyFooter: false,
    enableBottomToolbar: false,
    enableColumnFilterModes: true,
    manualFiltering: true,
    globalFilterFn: "contains",
    onGlobalFilterChange: (filter) => setSearchQuery(filter || ""), // Set search query on filter change
    muiTableContainerProps: { sx: { border: 1, borderColor: "#e0e0e0" } },
    muiTablePaperProps: { sx: { px: 5, pt: 2, pb: 10 } },
    renderTopToolbarCustomActions: () => (
      <Button
        className="text-base font-normal capitalize py-1.5 px-3 text-white bg-primary"
        onClick={() => setOpenAddDialog(true)}
        size="small"
        disabled={!ability.can("create", "User")}
      >
        Add User
      </Button>
    ),
  });

  return (
    <div className="p-8">
      <MaterialReactTable table={table} />
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogContent className="w-[500px] py-10 px-8 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              label="Name"
              {...register("name")}
              error={errors.location}
              helperText={errors.location?.message}
            />

            <CustomInput
              label="Email Address"
              {...register("email")}
              error={errors.email}
              helperText={errors.email?.message}
            />

            <CustomInput
              label="Location"
              {...register("location")}
              error={errors.location}
              helperText={errors.location?.message}
            />

            <CustomInput
              label="Phone Number"
              {...register("phoneNumber")}
              error={errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            <CustomInput
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password}
              helperText={errors.password?.message}
            />

            <div className="flex justify-between items-center ">
              {/* Role Selection Field */}
              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl className="w-36" error={!!errors.role}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      label="Role"
                      size="small"
                      {...field}
                    >
                      {roleLists.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />

              <Button
                type="submit"
                variant="contained"
                className="bg-primary px-12"
              >
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSuccesDialog}
        onClose={() => setOpenSuccesDialog(false)}
      >
        <DialogContent className="w-[600px] py-10 px-8 rounded-3xl">
          <div className="flex flex-col gap-4 justify-center items-center">
            <Image src={succes} alt="Succes" width={300} h3ight={300} />
            <h1 className="text-3xl font-bold text-successtext text-center">
              Your have added the user successfully.
            </h1>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialogs for Add Role and Success */}
    </div>
  );
};

export default Page;
