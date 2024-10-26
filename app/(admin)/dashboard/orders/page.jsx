"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  TextField,
  // debounce,
} from "@mui/material";
import debounce from "lodash.debounce";
import { Visibility } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FaCheck } from "react-icons/fa";
import { defineAbilitiesFor } from "@/lib/ability";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const OrdersPage = () => {
  const [orderLists, setOrderLists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: session, status } = useSession();

  const ability = defineAbilitiesFor(session?.user);

  const router = useRouter();

  // Check for permissions on page load
  // useEffect(() => {
  //   if (
  //     !ability.can("manage", "all") &&
  //     !ability.can("read", "Order") &&
  //     !ability.can("update", "Order")
  //   ) {
  //     router.replace("/not-permitted");
  //   }
  // }, [ability, router]);

  // Fetch data from the backend
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await fetch("/api/order");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch order data");
  //       }

  //       const data = await response.json();
  //       const formattedData = data.map((order) => ({
  //         id: order.id, // Assuming each order has a unique 'id'
  //         name: order.name,
  //         toppings: order.toppings.join(", "),
  //         quantity: order.quantity,
  //         photo: order.photo,
  //         phoneNumber: order.phoneNumber,
  //         createdAt: new Date(order.createdAt).toLocaleString(),
  //         status: order.status,
  //       }));
  //       console.log("Formatted data:", formattedData);
  //       setOrderLists(formattedData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching order data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, []);

  // const fetchOrders = async (searchValue = "") => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `/api/order?search=${encodeURIComponent(searchValue)}`
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch order data");
  //     }

  //     const data = await response.json();
  //     const formattedData = data.map((order) => ({
  //       id: order.id,
  //       name: order.name,
  //       toppings: order.toppings.join(", "),
  //       quantity: order.quantity,
  //       photo: order.photo,
  //       phoneNumber: order.phoneNumber,
  //       createdAt: new Date(order.createdAt).toLocaleString(),
  //       status: order.status,
  //     }));

  //     console.log("Formatted data:", formattedData);
  //     setOrderLists(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching order data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchOrders = useCallback(
    debounce(async (searchValue = "") => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/order?search=${encodeURIComponent(searchValue)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();
        const formattedData = data.map((order) => ({
          id: order.id,
          name: order.name,
          toppings: order.toppings.join(", "),
          quantity: order.quantity,
          photo: order.photo,
          phoneNumber: order.phoneNumber,
          createdAt: new Date(order.createdAt).toLocaleString(),
          status: order.status,
        }));

        console.log("Formatted data:", formattedData);
        setOrderLists(formattedData);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Fetch initial data
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle opening the dialog with selected order details
  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };
  const handleStatusChange = useCallback(async (newStatus, orderId) => {
    try {
      const response = await fetch(`/api/order?id=${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the orderLists state with the new status
      setOrderLists((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }, []); // Add dependencies if any

  // const handleStatusChange = async (newStatus, orderId) => {
  //   try {
  //     const response = await fetch(`/api/order?id=${orderId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ status: newStatus }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update status");
  //     }

  //     // Update the orderLists state with the new status
  //     setOrderLists((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.id === orderId ? { ...order, status: newStatus } : order
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //   }
  // };

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Avatar
              src={row.original.photo}
              alt={row.original.name}
              sx={{ width: 30, height: 30 }}
            />
            <span>{row.original.name}</span>
          </Box>
        ),
      },
      {
        accessorKey: "toppings",
        header: "Toppings",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <span>{row.original.toppings}</span> */}
            <IconButton
              onClick={() => handleOpenDialog(row.original)}
              aria-label="View Toppings"
              size="small"
            >
              {" "}
              <Visibility className="text-primary text-xl" />
              <p className="text-primary text-sm ml-1">Toppings</p>
            </IconButton>
          </Box>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 100,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ row }) => {
          const createdAt = new Date(row.original.createdAt);

          // Extracting time and date
          const time = createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }); // "HH:MM" format
          const date = createdAt.toLocaleDateString(); // "MM/DD/YYYY" or based on locale

          return (
            <div>
              <p className="font-medium text-black ">
                {time} <span className="font-normal text-gray-500">{date}</span>
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ row }) => {
          const currentStatus = row.original.status;
          let bgColor;

          switch (currentStatus) {
            case "PREPARING":
              bgColor = "#ffa500"; // Gold
              break;
            case "READY":
              bgColor = "#008000"; // LightGreen
              break;
            // case "DELIVERED":
            //   bgColor = "#87CEFA"; // LightSkyBlue
            //   break;
            default:
              bgColor = "#ffa500"; // LightGray
          }

          if (currentStatus === "DELIVERED") {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <FaCheck sx={{ color: "#008000" }} color="#008000" size={22} />{" "}
                {/* Green checkmark */}
                <p className="text-base font-medium text-[#008000]">
                  Delivered
                </p>
              </Box>
            );
          }

          return (
            <FormControl
              className="flex  items-center justify-center "
              size="small"
            >
              <Select
                value={currentStatus}
                displayEmpty
                disabled={!ability.can("update", "Order")}
                sx={{
                  padding: "0",
                  backgroundColor: bgColor,
                  border: "none",

                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none",
                    //  borderColor: "none", // Remove the border when focused
                  },

                  svg: { color: "white" },
                }}
                size="small"
                className="rounded-xl capitalize "
                renderValue={() => (
                  <p className="text-xsm  text-white capitalize ">
                    {currentStatus}
                  </p>
                )}
              >
                <MenuItem>
                  <RadioGroup
                    size="small"
                    aria-labelledby="order-status-radio-group"
                    value={currentStatus}
                    onChange={(e) =>
                      handleStatusChange(e.target.value, row.original.id)
                    }
                    // className="flex flex-col justify-start text-left"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "start",
                    }}
                  >
                    <FormControlLabel
                      value="PREPARING"
                      control={<Radio />}
                      labelPlacement="start"
                      label="Preparing"
                    />
                    <FormControlLabel
                      value="READY"
                      control={<Radio />}
                      labelPlacement="start"
                      label="Ready"
                    />
                    <FormControlLabel
                      value="DELIVERED"
                      control={<Radio />}
                      label="Delivered"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </MenuItem>
              </Select>
            </FormControl>
          );
        },
      },
    ],
    [ability, handleStatusChange]
  );

  const handleSearchChange = (searchValue) => {
    fetchOrders(searchValue);
  };
  // Custom Radio Button component inside MenuItem
  const getToppingColor = (topping) => {
    switch (topping.toLowerCase()) {
      case "tomato":
        return "#FF6347";
      case "Pepperoni":
        return "#FFA500";
      case "Mozzarella":
        return "#FFD700";

      default:
        return "#A9A9A9";
    }
  };

  // const table = useMaterialReactTable({
  //   columns,
  //   data: orderLists, // Use fetched data
  //   enableColumnActions: false,
  //   enableSorting: false,
  //   enablePagination: false,
  //   enableTableFooter: false,
  //   enableStickyFooter: false,
  //   enableBottomToolbar: false,
  //   enableColumnFilterModes: true,
  //   manualFiltering: true,
  //   muiTableContainerProps: { sx: { border: 1, borderColor: "#e0e0e0" } },
  //   muiTablePaperProps: { sx: { px: 5, pt: 2, pb: 10 } },
  //   renderTopToolbarCustomActions: ({ table }) => (
  //     <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
  //       <h1 className="text-lg font-normal text-gray-500">Orders</h1>
  //     </Box>
  //   ),
  //   muiTableHeadCellProps: (table) => ({
  //     sx: {
  //       backgroundColor: "#f6f6f6",
  //     },
  //   }),
  // });
  const table = useMaterialReactTable({
    columns,
    data: orderLists,
    state: {
      globalFilter: "", // Tracks the search text
    },
    onGlobalFilterChange: handleSearchChange,
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
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <h1 className="text-lg font-normal text-gray-500">Orders</h1>
      </Box>
    ),
    muiTableHeadCellProps: (table) => ({
      sx: { backgroundColor: "#f6f6f6" },
    }),
  });

  return (
    <div className="p-8">
      <MaterialReactTable table={table} />

      {/* Dialog for Toppings Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          className="relative items-center justify-center text-3xl font-semibold "
          sx={{ textAlign: "center", justifyContent: "center" }}
        >
          <span>Order Details</span>
          <DialogActions className="absolute right-2 top-2">
            <Button onClick={handleCloseDialog}>
              <HighlightOffIcon sx={{ color: "black" }} />
            </Button>
          </DialogActions>
        </DialogTitle>

        <DialogContent className="w-[500px]  py-20 pr-16">
          {selectedOrder && (
            <>
              <DialogContentText className="mb-3">
                <p className="text-gray-500 text-lg">
                  Name:
                  <span className="text-black ml-4">
                    {selectedOrder.name}{" "}
                  </span>{" "}
                </p>
              </DialogContentText>
              <DialogContentText className="flex gap-2 mb-3">
                <p className="text-gray-500 text-lg ">Toppings:</p>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedOrder.toppings.split(",").map((topping, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: getToppingColor(topping.trim()),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {topping.trim()}
                    </Box>
                  ))}
                </Box>
              </DialogContentText>
              <DialogContentText>
                <p className="text-gray-500 text-lg">
                  Quantity:
                  <span className="text-black ml-4">
                    {selectedOrder.quantity}{" "}
                  </span>{" "}
                </p>
              </DialogContentText>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
